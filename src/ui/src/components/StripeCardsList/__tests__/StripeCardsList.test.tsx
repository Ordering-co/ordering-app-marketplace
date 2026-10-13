import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { StripeCardsList, StripeCardsListUI } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m5 = require('../../../../../../jest/helpers/m5CheckoutComponentsMock')
  const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
  return m5.getMock({
    PaymentOptionStripe: m5.renderUiController(d.stripeCardsListDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock())

describe('StripeCardsList', () => {
  it('renders wired list', () => {
    const { getByText } = renderWithProviders(<StripeCardsList />)
    expect(getByText(/4242/)).toBeTruthy()
  })

  it('renders StripeCardsListUI with cards and select', () => {
    const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
    const onSelectCard = jest.fn()
    const handleCardClick = jest.fn()
    const { getByText } = renderWithProviders(
      <StripeCardsListUI
        {...d.stripeCardsListDefaults}
        onSelectCard={onSelectCard}
        handleCardClick={handleCardClick}
      />
    )
    expect(getByText(/4242/)).toBeTruthy()
    fireEvent.press(getByText(/4242/))
    expect(handleCardClick).toHaveBeenCalled()
  })
})
