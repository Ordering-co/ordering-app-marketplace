import '../../../../../../../jest/helpers/registerM9NativeMocks'

jest.mock('@ui', () => require('../../../../../../../jest/helpers/m9IntegrationsUiMock').getUiMock())

jest.mock('../../PurchaseGiftCard', () => ({
  PurchaseGiftCard: () => {
    const { View } = require('react-native')
    return <View testID="purchase-gift-card-stub" />
  }
}))

jest.mock('../../RedeemGiftCard', () => ({
  RedeemGiftCard: () => {
    const { View } = require('react-native')
    return <View testID="redeem-gift-card-stub" />
  }
}))

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { GiftCardUI } from '..'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'

describe('GiftCardUI', () => {
  it('renders gift card hero and purchase section', () => {
    const d = require('../../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getByText, getByTestId } = renderWithProviders(
      <GiftCardUI {...d.giftCardUIDefaults} />
    )
    expect(getByText('Gift Card Wallet')).toBeTruthy()
    expect(getByText('Select your gift card')).toBeTruthy()
    expect(getByTestId('purchase-gift-card-stub')).toBeTruthy()
  })

  it('opens redeem popup when redeem is pressed', () => {
    const d = require('../../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getByText, getByTestId } = renderWithProviders(
      <GiftCardUI {...d.giftCardUIDefaults} />
    )
    fireEvent.press(getByText('Redeem'))
    expect(getByTestId('redeem-gift-card-stub')).toBeTruthy()
  })
})
