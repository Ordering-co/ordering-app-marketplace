import { prepareTenant, tenantIdentity, shouldRunProjectSetup } from '../tenant'

const settings = { project: 'project_a', api: { url: 'https://api.example.test', version: 'v400', language: 'en' }, franchiseSlug: null }
const makeStorage = (initial = {}) => {
  const values = new Map(Object.entries(initial))
  return {
    values,
    getItem: jest.fn(async key => values.get(key) || null),
    getAllKeys: jest.fn(async () => [...values.keys()]),
    multiRemove: jest.fn(async keys => keys.forEach(key => values.delete(key))),
    setItem: jest.fn(async (key, value) => values.set(key, value)),
    removeItem: jest.fn(async key => values.delete(key))
  }
}
const publicFetch = result => jest.fn(async () => ({ ok: true, json: async () => ({ error: false, result }) }))

describe('native project bootstrap', () => {
  it('rejects placeholders before touching the network or storage', async () => {
    const storage = makeStorage({ token: 'legacy' })
    const fetchImpl = publicFetch({ code: 'project_a' })
    await expect(prepareTenant({ ...settings, project: 'YOUR_PROJECT' }, { isDev: true, storage, fetchImpl })).rejects.toThrow('Configure')
    expect(fetchImpl).not.toHaveBeenCalled()
    expect(storage.getItem).not.toHaveBeenCalled()
  })
  it('validates exact public code before discarding any legacy session', async () => {
    const storage = makeStorage({ token: 'legacy', user: '{}', project_name: 'old', options: '{}' })
    const fetchImpl = publicFetch({ code: 'another_project' })
    await expect(prepareTenant(settings, { isDev: true, storage, fetchImpl })).rejects.toThrow('different project')
    expect(storage.values.get('token')).toBe('legacy')
    expect(fetchImpl.mock.calls[0][1]).not.toHaveProperty('headers')
  })
  it('discards unmarked legacy tokens and tenant cache before SDK mounting', async () => {
    const storage = makeStorage({ token: 'legacy', project_name: 'old', options: '{}' })
    await prepareTenant(settings, { isDev: true, storage, fetchImpl: publicFetch({ code: 'project_a' }) })
    expect(storage.values.has('token')).toBe(false)
    expect(storage.values.has('options')).toBe(false)
    expect(JSON.parse(storage.values.get('ordering-onboarding-archive-v1:legacy'))).toEqual({ options: '{}' })
    expect(storage.values.has('ordering-onboarding-tenant-v1')).toBe(true)
  })
  it('preserves unrelated preferences and archives recoverable tenant data without credentials', async () => {
    const storage = makeStorage({ token: 'secret', user: '{"id": 7}', device_code: 'secret-device', custom_theme: 'dark', options: '{"type": 1}' })
    await prepareTenant(settings, { isDev: true, storage, fetchImpl: publicFetch({ code: 'project_a' }) })
    expect(storage.values.get('custom_theme')).toBe('dark')
    const archived = JSON.parse(storage.values.get('ordering-onboarding-archive-v1:legacy'))
    expect(archived).toEqual({ options: '{"type": 1}' })
    expect(JSON.stringify(archived)).not.toContain('secret')
  })
  it('preserves same-project consumer login and never honors stored project_name', async () => {
    const storage = makeStorage({ 'ordering-onboarding-tenant-v1': tenantIdentity(settings), token: 'consumer', project_name: 'other_project' })
    await prepareTenant(settings, { isDev: true, storage, fetchImpl: publicFetch({ code: 'project_a' }) })
    expect(storage.values.get('token')).toBe('consumer')
    expect(storage.values.has('project_name')).toBe(false)
  })
  it.each([
    { ...settings, project: 'project_b' },
    { ...settings, localSimulatorMode: true },
    { ...settings, api: { ...settings.api, url: 'https://another.example.test' } },
    { ...settings, franchiseSlug: 'other_franchise' }
  ])('discards session when destination changes', async next => {
    const storage = makeStorage({ 'ordering-onboarding-tenant-v1': tenantIdentity(settings), token: 'old', address_user: '{}' })
    await prepareTenant(next, { isDev: true, storage, fetchImpl: publicFetch({ code: next.project }) })
    expect(storage.values.has('token')).toBe(false)
    expect(storage.values.has('address_user')).toBe(false)
  })
  it('requires a chosen franchise and never defaults to the first public record', async () => {
    const storage = makeStorage()
    const fetchImpl = publicFetch({ code: 'project_a' })
    await expect(prepareTenant(settings, { isDev: true, storage, fetchImpl, requireFranchise: true })).rejects.toThrow('Choose a franchise')
    expect(fetchImpl).not.toHaveBeenCalled()
  })
  it('rejects absent or disabled franchise slugs without touching a session', async () => {
    const storage = makeStorage({ token: 'old' })
    const fetchImpl = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ error: false, result: { code: 'project_a' } }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ error: false, result: [{ slug: 'chosen', enabled: false }, { slug: 'first', enabled: true }] }) })
    await expect(prepareTenant({ ...settings, franchiseSlug: 'chosen' }, { isDev: true, storage, fetchImpl, requireFranchise: true })).rejects.toThrow('not available')
    expect(storage.values.get('token')).toBe('old')
  })
  it('resolves only the selected enabled slug to a native franchise ID', async () => {
    const storage = makeStorage()
    const fetchImpl = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ error: false, result: { code: 'project_a' } }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ error: false, result: [{ id: 1, slug: 'first', enabled: true }, { id: 34, slug: 'chosen', enabled: true }] }) })
    const result = await prepareTenant({ ...settings, franchiseSlug: 'chosen' }, { isDev: true, storage, fetchImpl, requireFranchise: true })
    expect(result.franchiseId).toBe(34)
    const url = new URL(fetchImpl.mock.calls[1][0])
    expect(JSON.parse(url.searchParams.get('where')).conditions).toEqual([{ attribute: 'slug', value: 'chosen' }])
  })
  it('does not mutate storage for an obsolete validation after the destination changed', async () => {
    const storage = makeStorage({ token: 'consumer', custom_theme: 'dark' })
    await expect(prepareTenant(settings, { isDev: true, storage, fetchImpl: publicFetch({ code: 'project_a' }), isCurrent: () => false })).rejects.toThrow('superseded')
    expect(storage.multiRemove).not.toHaveBeenCalled()
    expect(storage.values.get('token')).toBe('consumer')
  })
  it('reports a network failure and keeps providers blocked', async () => {
    const storage = makeStorage({ token: 'old' })
    await expect(prepareTenant(settings, { isDev: true, storage, fetchImpl: jest.fn().mockRejectedValue(new Error('offline')) })).rejects.toThrow('offline')
    expect(storage.multiRemove).not.toHaveBeenCalled()
  })
})


describe('development-only project policy', () => {
  it('bypasses Release before any public request or storage read', async () => {
    const storage = makeStorage({ token: 'release-consumer' })
    const fetchImpl = publicFetch({ code: 'wrong' })
    expect(shouldRunProjectSetup(settings, { isDev: false, localSimulator: true })).toBe(false)
    const result = await prepareTenant(settings, { isDev: false, storage, fetchImpl })
    expect(result.skipped).toBe(true)
    expect(fetchImpl).not.toHaveBeenCalled()
    expect(storage.getItem).not.toHaveBeenCalled()
    expect(storage.values.get('token')).toBe('release-consumer')
  })
  it('requires a configured development project or the explicit local opt-in', () => {
    expect(shouldRunProjectSetup(settings, { isDev: true })).toBe(true)
    expect(shouldRunProjectSetup({ ...settings, project: 'YOUR_PROJECT' }, { isDev: true })).toBe(false)
    expect(shouldRunProjectSetup({ ...settings, project: 'YOUR_PROJECT' }, { isDev: true, localSimulator: true })).toBe(true)
  })
  it('accepts a legacy numeric franchise ID and returns its public slug for the banner', async () => {
    const storage = makeStorage()
    const fetchImpl = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ error: false, result: { code: 'project_a' } }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ error: false, result: [{ id: 34, slug: 'chosen', enabled: true }], pagination: { total: 1 } }) })
    const result = await prepareTenant({ ...settings, franchiseSlug: 34 }, { isDev: true, storage, fetchImpl, requireFranchise: true })
    expect(result.franchiseId).toBe(34)
    expect(result.franchiseSlug).toBe('chosen')
    const url = new URL(fetchImpl.mock.calls[1][0])
    expect(JSON.parse(url.searchParams.get('where')).conditions).toEqual([{ attribute: 'id', value: 34 }])
  })
})
