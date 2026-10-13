import { getPlaceOrderPaymentFollowUp } from '../getPlaceOrderPaymentFollowUp'

const stripePaymentOptions = ['stripe', 'stripe_direct', 'stripe_connect']

describe('getPlaceOrderPaymentFollowUp', () => {
  it('sends an already placed order to order details', () => {
    expect(getPlaceOrderPaymentFollowUp({
      hasPlacedOrder: true,
      isPaymentPending: true,
      gateway: 'epayco',
      redirectUrl: 'https://pay.test',
      stripePaymentOptions
    })).toEqual({ type: 'order' })
  })

  it('runs Stripe when payment is pending on a Stripe gateway', () => {
    expect(getPlaceOrderPaymentFollowUp({
      hasPlacedOrder: false,
      isPaymentPending: true,
      gateway: 'stripe',
      redirectUrl: null,
      stripePaymentOptions
    })).toEqual({ type: 'stripe' })
  })

  it('opens a redirect URL even when gateway is missing', () => {
    expect(getPlaceOrderPaymentFollowUp({
      hasPlacedOrder: false,
      isPaymentPending: true,
      gateway: null,
      redirectUrl: 'https://pay.test/checkout',
      stripePaymentOptions
    })).toEqual({
      type: 'redirect',
      url: 'https://pay.test/checkout'
    })
  })

  it('opens a redirect URL when the place payload has a URL without pending status', () => {
    expect(getPlaceOrderPaymentFollowUp({
      hasPlacedOrder: false,
      isPaymentPending: false,
      gateway: 'epayco',
      redirectUrl: 'https://epayco.test/pay',
      stripePaymentOptions
    })).toEqual({
      type: 'redirect',
      url: 'https://epayco.test/pay'
    })
  })

  it('does nothing when there is no order, Stripe pending, or redirect URL', () => {
    expect(getPlaceOrderPaymentFollowUp({
      hasPlacedOrder: false,
      isPaymentPending: false,
      gateway: null,
      redirectUrl: null,
      stripePaymentOptions
    })).toEqual({ type: 'none' })
  })
})
