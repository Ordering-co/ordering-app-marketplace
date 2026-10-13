import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { BusinessProductsCategories } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m4MenuComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

describe('BusinessProductsCategories', () => {
  it('renders category tabs', () => {
    const { getByText } = renderWithProviders(<BusinessProductsCategories />)
    expect(getByText('All')).toBeTruthy()
    expect(getByText('Pizzas')).toBeTruthy()
  })

  it('updates selected category when a tab is pressed', () => {
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults').businessProductsCategoriesDefaults
    defaults.setSelectedCategoryId.mockClear()
    defaults.setCategoryClicked.mockClear()
    const { getByText } = renderWithProviders(<BusinessProductsCategories />)
    fireEvent.press(getByText('Pizzas'))
    expect(defaults.setCategoryClicked).toHaveBeenCalledWith(true)
    expect(defaults.setSelectedCategoryId).toHaveBeenCalled()
  })
})
