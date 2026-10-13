import { resolveCompactLogo, resolveLogoSource, resolveThemeLogo } from '../logoSource'

describe('resolveLogoSource', () => {
  it('keeps a bundled image as a numeric source', () => {
    expect(resolveLogoSource(12)).toBe(12)
  })

  it('wraps a remote logo url', () => {
    expect(resolveLogoSource(' https://cdn.example/logo.png ')).toEqual({
      uri: 'https://cdn.example/logo.png'
    })
  })

  it('returns null when there is no logo', () => {
    expect(resolveLogoSource('')).toBeNull()
    expect(resolveLogoSource(undefined)).toBeNull()
  })
})

describe('resolveCompactLogo', () => {
  const wordmark = 4

  it('prefers the favicon for the small frame', () => {
    expect(resolveCompactLogo({
      general: { components: { favicon: { components: { image: 'https://cdn.example/tenant/favicon.png' } } } },
      images: { logos: { logotype: wordmark } }
    })).toEqual({ uri: 'https://cdn.example/tenant/favicon.png' })
  })

  it('uses the site icon when the favicon is a placeholder', () => {
    expect(resolveCompactLogo({
      general: { components: { favicon: { components: { image: '/default-favicon.png' } } } },
      my_products: { components: { images: { components: { logo: { components: { image: 'https://cdn.example/icon.png' } } } } } },
      images: { logos: { logotype: wordmark } }
    })).toEqual({ uri: 'https://cdn.example/icon.png' })
  })

  it('uses the square icon when the project has no favicon', () => {
    expect(resolveCompactLogo({
      images: { logos: { logotype: wordmark } }
    }, undefined, 9)).toBe(9)
  })
})

describe('resolveThemeLogo', () => {
  const logotype = 'https://cdn.example/logotype.png'
  const logoLong = 'https://cdn.example/logo-long.png'

  it('uses the uploaded logotype ahead of the long logo and the favicon', () => {
    expect(resolveThemeLogo({
      general: { components: { favicon: { components: { image: 'https://cdn.example/favicon.png' } } } },
      images: { logos: { logotype, logotypeInvert: logoLong } }
    })).toEqual({ uri: logotype })
  })

  it('uses the bundled logotype file ahead of the long logo', () => {
    expect(resolveThemeLogo({
      images: { logos: { logotype: 4, logotypeInvert: logoLong } }
    })).toBe(4)
  })

  it('uses the bundled long logo when the logotype file is missing', () => {
    expect(resolveThemeLogo({
      general: { components: { favicon: { components: { image: 'https://cdn.example/favicon.png' } } } },
      images: { logos: { logotype: '', logotypeInvert: 9 } }
    })).toBe(9)
  })

  it('rejects a theme logo that is not an http url', () => {
    expect(resolveThemeLogo({
      images: { logos: { logotype: 'javascript:alert(1)', logotypeInvert: 'file:///tmp/logo.png' } }
    })).toBeNull()
  })
})
