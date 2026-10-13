import { resolveAppDesign } from '../appDesign'

describe('resolveAppDesign', () => {
  it('returns original when the theme is missing', () => {
    expect(resolveAppDesign(undefined)).toBe('original')
    expect(resolveAppDesign(null)).toBe('original')
  })

  it('returns original when the design key is missing or empty', () => {
    expect(resolveAppDesign({})).toBe('original')
    expect(resolveAppDesign({
      app_design: { components: { layout: { type: '' } } }
    })).toBe('original')
  })

  it('returns maweja only for the exact allowlisted value', () => {
    expect(resolveAppDesign({
      app_design: { components: { layout: { type: 'maweja' } } }
    })).toBe('maweja')
  })

  it('returns original for any value outside the allowlist', () => {
    expect(resolveAppDesign({
      app_design: { components: { layout: { type: 'Maweja' } } }
    })).toBe('original')
    expect(resolveAppDesign({
      app_design: { components: { layout: { type: 'starbucks' } } }
    })).toBe('original')
    expect(resolveAppDesign({
      app_design: { components: { layout: { type: 'maweja ' } } }
    })).toBe('original')
  })

  it('returns original when the saved value is original', () => {
    expect(resolveAppDesign({
      app_design: { components: { layout: { type: 'original' } } }
    })).toBe('original')
  })
})
