import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'
import { View } from 'react-native'
import { act, waitFor } from '@testing-library/react-native'

import { StripeElementsForm } from '../naked'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

const mockGetCredentials = jest.fn()
const mockPaymentCards = jest.fn(() => ({ getCredentials: mockGetCredentials }))
const mockApi = {
  root: 'https://api.test',
  appId: 'app',
  appInternalName: 'ordering_app',
  setAccessToken: jest.fn(() => ({ paymentCards: mockPaymentCards }))
}

jest.mock('@components', () => {
  const m5 = require('../../../../../../jest/helpers/m5CheckoutComponentsMock')
  return m5.getMock({
    useApi: jest.fn(() => [mockApi])
  })
})

let uiProps: any = null
const UIComponent = (props: any) => {
  uiProps = props
  return <View testID="stripe-form-ui" />
}

const user = { id: 1 }

describe('StripeElementsForm controller', () => {
  const fetchMock = jest.fn()

  beforeEach(() => {
    uiProps = null
    fetchMock.mockReset()
    fetchMock.mockResolvedValue({ json: async () => ({ error: false, result: 'seti_secret' }) })
    ;(globalThis as any).fetch = fetchMock
    mockPaymentCards.mockClear()
    mockGetCredentials.mockReset()
    mockGetCredentials.mockResolvedValue({ content: { error: false, result: { publishable: 'pk_test' } } })
  })

  it('uses the stripe endpoints by default', async () => {
    renderWithProviders(<StripeElementsForm UIComponent={UIComponent} toSave businessId={41} />)

    await waitFor(() => expect(uiProps?.requirements).toBe('seti_secret'))
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.test/payments/stripe/requirements?type=add_card')
    expect(mockPaymentCards).toHaveBeenCalledWith(undefined, undefined, null, 'stripe')

    fetchMock.mockResolvedValue({ json: async () => ({ error: false, result: { id: 'card_1' } }) })
    await act(async () => {
      await uiProps.stripeTokenHandler('pm_1', user, 41)
    })
    const [url, options] = fetchMock.mock.calls[1]
    expect(url).toBe('https://api.test/payments/stripe/cards')
    expect(JSON.parse(options.body)).toEqual({ business_id: 41, gateway: 'stripe', token_id: 'pm_1', user_id: 1 })
  })

  it('uses the stripe_connect_v2 endpoints with the business id', async () => {
    renderWithProviders(
      <StripeElementsForm UIComponent={UIComponent} toSave businessId={41} cardsGateway="stripe_connect_v2" />
    )

    await waitFor(() => expect(uiProps?.requirements).toBe('seti_secret'))
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.test/payments/stripe_connect_v2/requirements?type=add_card&business_id=41')
    expect(mockPaymentCards).toHaveBeenCalledWith(undefined, undefined, null, 'stripe_connect_v2')

    fetchMock.mockResolvedValue({ json: async () => ({ error: false, result: { id: 'card_2' } }) })
    await act(async () => {
      await uiProps.stripeTokenHandler('pm_2', user, 41)
    })
    const [url, options] = fetchMock.mock.calls[1]
    expect(url).toBe('https://api.test/payments/stripe_connect_v2/cards')
    expect(JSON.parse(options.body)).toEqual({ business_id: 41, gateway: 'stripe_connect_v2', token_id: 'pm_2', user_id: 1 })
  })

  it('waits for the business before asking for stripe_connect_v2 requirements', async () => {
    const view = renderWithProviders(
      <StripeElementsForm UIComponent={UIComponent} toSave cardsGateway="stripe_connect_v2" />
    )
    await act(async () => {})
    expect(fetchMock).not.toHaveBeenCalled()

    view.rerender(
      <StripeElementsForm UIComponent={UIComponent} toSave cardsGateway="stripe_connect_v2" businessId={41} />
    )
    await waitFor(() => expect(uiProps?.requirements).toBe('seti_secret'))
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.test/payments/stripe_connect_v2/requirements?type=add_card&business_id=41')
  })

  it('ignores requirements that arrive for a previous business', async () => {
    let answerPrevious: (value: any) => void = () => {}
    fetchMock.mockReturnValueOnce(new Promise(resolve => { answerPrevious = resolve }))
    const view = renderWithProviders(
      <StripeElementsForm UIComponent={UIComponent} toSave cardsGateway="stripe_connect_v2" businessId={41} />
    )
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

    fetchMock.mockResolvedValueOnce({ json: async () => ({ error: false, result: 'seti_new' }) })
    view.rerender(
      <StripeElementsForm UIComponent={UIComponent} toSave cardsGateway="stripe_connect_v2" businessId={42} />
    )
    await waitFor(() => expect(uiProps?.requirements).toBe('seti_new'))

    await act(async () => {
      answerPrevious({ json: async () => ({ error: false, result: 'seti_old' }) })
    })
    expect(uiProps?.requirements).toBe('seti_new')
    expect(fetchMock.mock.calls[1][0]).toContain('business_id=42')
  })

  it('ignores gateways that keep their cards under stripe', async () => {
    renderWithProviders(
      <StripeElementsForm UIComponent={UIComponent} toSave businessId={41} cardsGateway="stripe_connect" />
    )

    await waitFor(() => expect(uiProps?.requirements).toBe('seti_secret'))
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.test/payments/stripe/requirements?type=add_card')
  })
})
