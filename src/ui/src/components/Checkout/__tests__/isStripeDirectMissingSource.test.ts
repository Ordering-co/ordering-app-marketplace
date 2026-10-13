import { isStripeDirectMissingSource } from '../isStripeDirectMissingSource'

describe('isStripeDirectMissingSource', () => {
  it('does not disable Place for other gateways', () => {
    expect(isStripeDirectMissingSource({
      gateway: 'stripe',
      paymethodData: null,
      cartPaymethodData: null
    })).toBe(false)
    expect(isStripeDirectMissingSource({
      gateway: 'cash',
      paymethodData: null
    })).toBe(false)
  })

  it('disables Place for stripe_direct without a card or source_id', () => {
    expect(isStripeDirectMissingSource({
      gateway: 'stripe_direct',
      paymethodData: null,
      cartPaymethodData: null
    })).toBe(true)
    expect(isStripeDirectMissingSource({
      gateway: 'stripe_direct',
      paymethodData: {},
      cartPaymethodData: {}
    })).toBe(true)
  })

  it('enables Place when stripe_direct has a payment method id', () => {
    expect(isStripeDirectMissingSource({
      gateway: 'stripe_direct',
      paymethodData: { id: 'pm_123' }
    })).toBe(false)
  })

  it('enables Place when stripe_direct has a source_id', () => {
    expect(isStripeDirectMissingSource({
      gateway: 'stripe_direct',
      paymethodData: { source_id: 'pm_456' }
    })).toBe(false)
  })

  it('reads source_id from nested or JSON cart paymethod_data', () => {
    expect(isStripeDirectMissingSource({
      gateway: 'stripe_direct',
      cartPaymethodData: { data: { source_id: 'pm_nested' } }
    })).toBe(false)
    expect(isStripeDirectMissingSource({
      gateway: 'stripe_direct',
      cartPaymethodData: '{"source_id":"pm_json"}'
    })).toBe(false)
  })

  it('treats malformed paymethod_data as missing', () => {
    expect(isStripeDirectMissingSource({
      gateway: 'stripe_direct',
      cartPaymethodData: '{not-json'
    })).toBe(true)
  })
})
