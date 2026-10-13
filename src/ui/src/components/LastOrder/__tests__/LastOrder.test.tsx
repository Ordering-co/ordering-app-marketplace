import '../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'

import { LastOrder } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m6 = require('../../../../../../jest/helpers/m6OrdersComponentsMock')
  const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
  return m6.getMock({
    OrderList: m6.renderUiController(d.lastOrderDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

describe('LastOrder', () => {
  it('renders past order business name', () => {
    const { getByText } = renderWithProviders(
      <LastOrder onNavigationRedirect={jest.fn()} />
    )
    expect(getByText('Pizza Place')).toBeTruthy()
  })
})
