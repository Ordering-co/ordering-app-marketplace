import '../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { SingleOrderCard } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m6 = require('../../../../../../jest/helpers/m6OrdersComponentsMock')
  const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
  return m6.getMock({
    SingleOrderCard: m6.renderUiController(d.singleOrderCardDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

describe('SingleOrderCard', () => {
  it('renders past order business name and status', () => {
    const { getByText } = renderWithProviders(
      <SingleOrderCard onNavigationRedirect={jest.fn()} />
    )
    expect(getByText('Pizza Place')).toBeTruthy()
    expect(getByText(/Status 1/)).toBeTruthy()
  })

  it('shows reorder button for past orders', () => {
    const { getByText } = renderWithProviders(
      <SingleOrderCard onNavigationRedirect={jest.fn()} />
    )
    expect(getByText('Reorder')).toBeTruthy()
  })

  it('navigates to order details when card pressed', () => {
    const onNavigationRedirect = jest.fn()
    const { getByTestId } = renderWithProviders(
      <SingleOrderCard onNavigationRedirect={onNavigationRedirect} />
    )
    fireEvent.press(getByTestId('card-animation'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('OrderDetails', expect.objectContaining({ orderId: 'order-uuid-41' }))
  })
})
