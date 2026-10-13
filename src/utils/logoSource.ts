const PLACEHOLDER_MARKS = ['/default-favicon.png', '/favicon.png', '/default-logo.png']

const imagePath = (value: string) => {
  const withoutQuery = value.trim().split('?')[0]
  const scheme = withoutQuery.indexOf('://')
  if (scheme === -1) return withoutQuery
  const pathStart = withoutQuery.indexOf('/', scheme + 3)
  return pathStart === -1 ? '/' : withoutQuery.slice(pathStart)
}

export const isCompactMark = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) return false
  const path = imagePath(value)
  return !PLACEHOLDER_MARKS.includes(path)
}

export const resolveLogoSource = (logo: unknown) => {
  if (typeof logo === 'number') return logo
  if (typeof logo === 'string' && logo.trim()) return { uri: logo.trim() }
  return null
}

const buildLogo = (value: unknown) => {
  if (typeof value === 'number') return value
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!/^https?:\/\//i.test(trimmed)) return null
  return { uri: trimmed }
}

export const resolveThemeLogo = (theme: any) => {
  const logos = theme?.images?.logos
  return buildLogo(logos?.logotype) || buildLogo(logos?.logotypeInvert)
}

export const resolveCompactLogo = (theme: any, siteLogo?: unknown, fallback?: unknown) => {
  const favicon = theme?.general?.components?.favicon?.components?.image
  const icon = theme?.my_products?.components?.images?.components?.logo?.components?.image
  const mark = [favicon, icon, siteLogo].find(isCompactMark) || fallback || theme?.images?.logos?.logotype
  return resolveLogoSource(mark)
}
