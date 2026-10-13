import '../../../../../../../jest/helpers/registerM9NativeMocks'

import React from 'react'

jest.mock('../../VerticalGiftCardOrdersLayout', () => ({
  VerticalGiftCardOrdersLayout: ({ title }: { title: string }) => {
    const { View, Text } = require('react-native')
    return (
      <View testID="vertical-gift-card-layout">
        <Text>{title}</Text>
      </View>
    )
  }
}))

jest.mock('@ui', () => require('../../../../../../../jest/helpers/m9IntegrationsUiMock').getUiMock())

import { GiftCardOrdersList } from '..'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'

describe('GiftCardOrdersList', () => {
  it('renders gift card order sections', () => {
    const d = require('../../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getByText } = renderWithProviders(
      <GiftCardOrdersList {...d.giftCardOrdersListDefaults} />
    )
    expect(getByText('Pending')).toBeTruthy()
    expect(getByText('Sent')).toBeTruthy()
    expect(getByText('Redeemed')).toBeTruthy()
  })
})
