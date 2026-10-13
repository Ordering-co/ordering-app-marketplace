import '../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { ActiveOrders } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m6OrdersComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

describe('ActiveOrders', () => {
  it('renders order cards for active orders', () => {
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const { getByText } = renderWithProviders(
      <ActiveOrders {...d.activeOrdersDefaults} />
    )
    expect(getByText('Pizza Place')).toBeTruthy()
  })

  it('shows load more when more pages exist', () => {
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const loadMoreOrders = jest.fn()
    const { getByText } = renderWithProviders(
      <ActiveOrders {...d.activeOrdersDefaults} loadMoreOrders={loadMoreOrders} />
    )
    fireEvent.press(getByText('Load more orders'))
    expect(loadMoreOrders).toHaveBeenCalled()
  })
})
