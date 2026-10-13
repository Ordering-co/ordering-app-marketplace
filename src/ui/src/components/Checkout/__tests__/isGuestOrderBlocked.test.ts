import { isGuestOrderBlocked, showContinueAsGuest } from '../isGuestOrderBlocked'

describe('isGuestOrderBlocked', () => {
  it('blocks a maweja guest even when guest checkout is enabled', () => {
    expect(isGuestOrderBlocked({
      guestId: 12,
      isGuestCheckoutEnabled: true,
      isMaweja: true
    })).toBe(true)
    expect(showContinueAsGuest({
      isGuestCheckoutEnabled: true,
      isMaweja: true
    })).toBe(false)
  })

  it('lets an original-design guest place the order when guest checkout is enabled', () => {
    expect(isGuestOrderBlocked({
      guestId: 12,
      isGuestCheckoutEnabled: true,
      isMaweja: false
    })).toBe(false)
    expect(showContinueAsGuest({
      isGuestCheckoutEnabled: true,
      isMaweja: false
    })).toBe(true)
  })

  it('blocks a guest in every design when guest checkout is disabled', () => {
    expect(isGuestOrderBlocked({
      guestId: 'guest-1',
      isGuestCheckoutEnabled: false,
      isMaweja: true
    })).toBe(true)
    expect(isGuestOrderBlocked({
      guestId: 'guest-1',
      isGuestCheckoutEnabled: false,
      isMaweja: false
    })).toBe(true)
    expect(showContinueAsGuest({
      isGuestCheckoutEnabled: false,
      isMaweja: false
    })).toBe(false)
  })

  it('never blocks a signed-in customer', () => {
    for (const guestId of [null, undefined, 0, '']) {
      expect(isGuestOrderBlocked({
        guestId,
        isGuestCheckoutEnabled: true,
        isMaweja: true
      })).toBe(false)
      expect(isGuestOrderBlocked({
        guestId,
        isGuestCheckoutEnabled: false,
        isMaweja: false
      })).toBe(false)
    }
  })
})
