import '../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { PreviousOrders } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m6OrdersComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

describe('PreviousOrders', () => {
  it('renders past order cards', () => {
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const { getByText, getByTestId } = renderWithProviders(
      <PreviousOrders {...d.previousOrdersDefaults} />
    )
    expect(getByTestId('single-order-card-stub')).toBeTruthy()
    expect(getByText('Pizza Place')).toBeTruthy()
  })

  it('loads more orders when pagination allows', () => {
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const loadMoreOrders = jest.fn()
    const { getByText } = renderWithProviders(
      <PreviousOrders {...d.previousOrdersDefaults} loadMoreOrders={loadMoreOrders} />
    )
    fireEvent.press(getByText('Load more orders'))
    expect(loadMoreOrders).toHaveBeenCalled()
  })
})
