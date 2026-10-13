import '../../../../../../../jest/helpers/registerM9NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { SingleGiftCard } from '..'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../../jest/helpers/m9IntegrationsComponentsMock').getMock())
jest.mock('../../../shared', () => require('../../../../../../../jest/helpers/m9IntegrationsSharedMock'))

describe('SingleGiftCard', () => {
  it('renders gift card details', () => {
    const d = require('../../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getByText } = renderWithProviders(
      <SingleGiftCard {...d.singleGiftCardDefaults} />
    )
    expect(getByText('$25 Gift Card')).toBeTruthy()
    expect(getByText('$25')).toBeTruthy()
    expect(getByText('Pending')).toBeTruthy()
  })

  it('navigates to order details when card is pressed', () => {
    const d = require('../../../../../../../jest/helpers/m9IntegrationsDefaults')
    const onNavigationRedirect = jest.fn()
    const { getByText } = renderWithProviders(
      <SingleGiftCard
        {...d.singleGiftCardDefaults}
        onNavigationRedirect={onNavigationRedirect}
      />
    )
    fireEvent.press(getByText('$25 Gift Card'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('OrderDetails', { orderId: 10 })
  })

  it('renders skeleton placeholder when loading', () => {
    const { getAllByTestId } = renderWithProviders(
      <SingleGiftCard isSkeleton />
    )
    expect(getAllByTestId('placeholder-line').length).toBeGreaterThan(0)
  })
})
