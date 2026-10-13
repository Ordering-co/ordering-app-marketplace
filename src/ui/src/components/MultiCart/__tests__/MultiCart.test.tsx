import '../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'

import { MultiCart } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m6 = require('../../../../../../jest/helpers/m6OrdersComponentsMock')
  const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
  return m6.getMock({
    MultiCartCreate: m6.renderUiController(d.multiCartDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

describe('MultiCart', () => {
  it('renders loading skeleton placeholders', () => {
    const { getAllByTestId } = renderWithProviders(
      <MultiCart navigation={{ navigate: jest.fn() }} />
    )
    expect(getAllByTestId('placeholder').length).toBeGreaterThan(0)
  })
})
