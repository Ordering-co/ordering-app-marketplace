import '../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { MomentSelector } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m6 = require('../../../../../../jest/helpers/m6OrdersComponentsMock')
  const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
  return m6.getMock({
    MomentOption: m6.renderUiController(d.momentSelectorDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

describe('MomentSelector', () => {
  it('renders date and time dropdowns', () => {
    const { getAllByTestId } = renderWithProviders(<MomentSelector />)
    expect(getAllByTestId('select-dropdown').length).toBe(2)
  })

  it('changes date selection', () => {
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const handleChangeDate = jest.fn()
    const { getAllByTestId } = renderWithProviders(
      <MomentSelector {...d.momentSelectorDefaults} handleChangeDate={handleChangeDate} />
    )
    fireEvent.press(getAllByTestId('select-dropdown-item-1')[0])
    expect(handleChangeDate).toHaveBeenCalled()
  })
})
