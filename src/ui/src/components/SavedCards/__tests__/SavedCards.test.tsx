import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'
import { waitFor } from '@testing-library/react-native'

import { SavedCards } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('../useSavedCardsGateway', () => ({
  useSavedCardsGateway: jest.fn(() => ({
    gateway: null,
    paymethodId: null,
    isAvailable: false,
    loading: false
  }))
}))

jest.mock('@components', () => require('../../../../../../jest/helpers/m5CheckoutComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock())

describe('SavedCards', () => {
  it('shows unavailable message when gateway is missing', async () => {
    const { getByText } = renderWithProviders(<SavedCards />)
    await waitFor(() => {
      expect(getByText(/not available|unavailable|No saved/i)).toBeTruthy()
    })
  })

  it('loads braintree cards when gateway is available', async () => {
    const { useSavedCardsGateway } = require('../useSavedCardsGateway')
    useSavedCardsGateway.mockReturnValue({
      gateway: 'braintree',
      paymethodId: 99,
      isAvailable: true,
      loading: false
    })

    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        error: false,
        result: [
          { id: 'c1', external_id: 'tok_1', type_data: { brand: 'visa', last4: '1111' } }
        ]
      })
    }) as any

    const { getAllByText } = renderWithProviders(<SavedCards />)
    await waitFor(() => {
      expect(getAllByText(/1111|visa|Add/i).length).toBeGreaterThan(0)
    })
  })
})
