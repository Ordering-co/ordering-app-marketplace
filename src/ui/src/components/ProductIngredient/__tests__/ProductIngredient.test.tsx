import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { ProductIngredient } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m4MenuComponentsMock').getMock())

jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

describe('ProductIngredient', () => {
  it('renders ingredient name', () => {
    const { getByText } = renderWithProviders(<ProductIngredient />)
    expect(getByText('Mozzarella')).toBeTruthy()
  })

  it('toggles selection when pressed', () => {
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults').productIngredientDefaults
    defaults.toggleSelect.mockClear()
    const { getByText } = renderWithProviders(<ProductIngredient />)
    fireEvent.press(getByText('Mozzarella'))
    expect(defaults.toggleSelect).toHaveBeenCalled()
  })
})
