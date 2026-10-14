import { getCardsGateway, isBusinessCardsGateway } from '../stripeCardsGateway'

describe('stripeCardsGateway', () => {
  it('keeps stripe_connect_v2 as its own cards gateway', () => {
    expect(getCardsGateway('stripe_connect_v2')).toBe('stripe_connect_v2')
    expect(isBusinessCardsGateway('stripe_connect_v2')).toBe(true)
  })

  it('falls back to stripe for any other gateway', () => {
    ['stripe', 'stripe_connect', 'stripe_direct', 'braintree', '', null, undefined].forEach((gateway: any) => {
      expect(getCardsGateway(gateway)).toBe('stripe')
      expect(isBusinessCardsGateway(gateway)).toBe(false)
    })
  })
})
