let storageQueue = Promise.resolve()

// A historical project value is not onboarding consent. Only a source marker
// from configure/manual setup, or the explicit local simulator, opts in.
export const shouldRunProjectSetup = (settings, { isDev = false, localSimulator = false } = {}) =>
  isDev === true && (settings.localProjectConfigured === true || settings.localSimulatorMode === true || localSimulator === true)

// Run before any SDK provider can hydrate a session or send an authenticated request.
export const tenantIdentity = settings => JSON.stringify([
  typeof settings.api?.url === 'string' ? settings.api.url.replace(/\/$/, '') : '', settings.api?.version,
  settings.project, settings.franchiseSlug || null, settings.localSimulatorMode === true
])

export const prepareTenant = async (settings, { storage, fetchImpl = fetch, requireFranchise = false, isCurrent = () => true, isDev = false }) => {
  if (!shouldRunProjectSetup(settings, { isDev })) return { skipped: true, identity: null, franchiseId: null, franchiseSlug: null }
  const project = settings.project
  if (!project || project === 'YOUR_PROJECT' || !/^[a-zA-Z0-9_-]+$/.test(project)) {
    throw new Error('Configure your project: node scripts/onboarding/cli.mjs configure --project YOUR_PROJECT')
  }
  const api = settings.api
  if (!api || !/^https:\/\//.test(api.url) || !/^[a-zA-Z0-9_-]+$/.test(api.version) || !/^[a-zA-Z0-9_-]+$/.test(api.language)) {
    throw new Error('Invalid API URL, version or language. Run onboarding doctor.')
  }
  if (requireFranchise && (!settings.franchiseSlug || settings.franchiseSlug === '0')) {
    throw new Error('Choose a franchise explicitly: configure --project YOUR_PROJECT --franchise-slug YOUR_FRANCHISE')
  }
  const root = `${api.url.replace(/\/$/, '')}/${api.version}/${api.language}/${project}`
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  try {
    const readPublic = async path => {
      const response = await fetchImpl(`${root}/${path}`, { signal: controller.signal })
      if (!response.ok) throw new Error(`Public validation failed (HTTP ${response.status}). Check the API URL and network.`)
      const data = await response.json()
      if (data.error) throw new Error('Public validation failed. Check project and API settings.')
      return data
    }
    const current = await readPublic('current')
    if (current.result?.code !== project) throw new Error('The public API returned a different project. Check your configuration.')
    let franchiseId = null
    let franchiseSlug = null
    if (requireFranchise) {
      // Filtering by the supplied slug never selects the first franchise in the tenant.
      const selected = settings.franchiseSlug
      const numeric = typeof selected === 'number'
      if (numeric && (!Number.isSafeInteger(selected) || selected <= 0)) throw new Error('Invalid franchise ID. Choose an enabled franchise explicitly.')
      const attribute = numeric ? 'id' : 'slug'
      const where = encodeURIComponent(JSON.stringify({ conditions: [{ attribute, value: selected }], conector: 'AND' }))
      const data = await readPublic(`franchises?where=${where}&params=id,slug,enabled&page=1&page_size=2`)
      const matches = (Array.isArray(data.result) ? data.result : []).filter(item => item[attribute] === selected && typeof item.slug === 'string' && [true, 1, '1'].includes(item.enabled) && Number.isSafeInteger(item.id) && item.id > 0)
      if (matches.length !== 1 || (data.pagination?.total !== undefined && data.pagination.total !== 1)) throw new Error('The franchise slug is not available in this project. Choose an exact public slug.')
      franchiseId = matches[0].id
      franchiseSlug = matches[0].slug
    }
    const identity = tenantIdentity(settings)
    const migrate = async () => {
      if (!isCurrent()) throw new Error('Setup was superseded. Retry validation.')
      const previous = await storage.getItem('ordering-onboarding-tenant-v1')
    if (previous !== identity) {
        // Only the SDK's known session and tenant cache keys are retired.
        // Keep unrelated preferences and provider registrations intact. Archive
        // non-authenticated tenant state locally for recovery; never archive tokens.
      const tenantKeys = ['options', 'address_user', 'country-code', 'user-customer', 'ingredients', 'adjust-cart-products', 'already-removed', 'notification_state', 'cookie_consent']
      const recoverable = {}
      for (const key of tenantKeys) {
        const value = await storage.getItem(key)
        if (value !== null && key !== 'user-customer') recoverable[key] = value
      }
      if (Object.keys(recoverable).length) {
        await storage.setItem(`ordering-onboarding-archive-v1:${previous || 'legacy'}`, JSON.stringify(recoverable))
      }
      await storage.multiRemove(['token', 'user', 'device_code', 'project_name', ...tenantKeys])
      await storage.setItem('ordering-onboarding-tenant-v1', identity)
    }
    await storage.removeItem('project_name')
    }
    const transaction = storageQueue.then(migrate, migrate)
    storageQueue = transaction.catch(() => {})
    await transaction
    return { identity, franchiseId, franchiseSlug, skipped: false }
  } catch (error) {
    if (error?.name === 'AbortError') throw new Error('Public project validation timed out. Check your network, then retry.')
    throw error
  } finally {
    clearTimeout(timeout)
  }
}
