import { isGuestCheckoutAllowed, isGuestCheckoutEnabled, isGuestOrderTypeAllowed } from '../guestCheckout'

describe('guest checkout policy', () => {
  const config = (enabled: any, allowed: any) => ({
    guest_checkout_enabled: { value: enabled },
    allowed_order_types_guest_checkout: { value: allowed }
  })

  it.each(['1', 1, true])('accepts enabled flag %s', (enabled) => {
    expect(isGuestCheckoutEnabled(config(enabled, ['delivery']))).toBe(true)
  })

  it('accepts arrays and comma or pipe separated exact type tokens', () => {
    expect(isGuestCheckoutAllowed(config('1', ['delivery', 'catering_delivery']), 1)).toBe(true)
    expect(isGuestCheckoutAllowed(config('1', 'delivery,pickup'), 2)).toBe(true)
    expect(isGuestCheckoutAllowed(config('1', 'delivery|catering_pickup'), 8)).toBe(true)
    expect(isGuestCheckoutAllowed(config('1', 'non_delivery'), 1)).toBe(false)
  })

  it('fails closed for disabled flags, unknown types, or missing type', () => {
    expect(isGuestCheckoutAllowed(config('0', ['delivery']), 1)).toBe(false)
    expect(isGuestCheckoutAllowed(config('1', ['delivery']), 99)).toBe(false)
    expect(isGuestOrderTypeAllowed(config('1', ['delivery']), undefined)).toBe(false)
  })
})
