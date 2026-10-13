import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { ProductOptionSubOption } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m4MenuComponentsMock').getMock())

jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

describe('ProductOptionSubOption', () => {
  it('renders suboption name and price', () => {
    const { getByText } = renderWithProviders(<ProductOptionSubOption />)
    expect(getByText('Large')).toBeTruthy()
  })

  it('toggles selection when pressed', () => {
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults').productOptionSubOptionDefaults
    defaults.toggleSelect.mockClear()
    const { getByText } = renderWithProviders(<ProductOptionSubOption />)
    fireEvent.press(getByText('Large'))
    expect(defaults.toggleSelect).toHaveBeenCalled()
  })
})
