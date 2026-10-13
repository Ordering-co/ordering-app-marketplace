import { themeBrandColor } from '../themeBrandColor'

describe('themeBrandColor', () => {
  it('uses colors.primary and ignores the theme primary button color', () => {
    expect(themeBrandColor({
      my_products: { components: { theme_settings: { components: { style: { primary_btn_color: '#2C7BE5' } } } } },
      colors: { primary: '#FE0000' }
    })).toBe('#FE0000')
  })
})
