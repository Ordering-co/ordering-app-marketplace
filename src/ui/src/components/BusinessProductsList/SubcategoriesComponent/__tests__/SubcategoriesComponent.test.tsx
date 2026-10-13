import '../../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { SubcategoriesComponentMemoized } from '..'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../../jest/helpers/m4MenuComponentsMock').getMock())

jest.mock('@ui', () => require('../../../../../../../jest/helpers/m4MenuUiMock').getUiMock())



describe('SubcategoriesComponent', () => {

  it('renders All and subcategory buttons', () => {
    const defaults = require('../../../../../../../jest/helpers/m4MenuDefaults').subcategoriesDefaults
    const { getByText } = renderWithProviders(
      <SubcategoriesComponentMemoized {...defaults} />
    )
    expect(getByText('All')).toBeTruthy()
    expect(getByText('Classic')).toBeTruthy()
  })

  it('calls onClickSubcategory for All', () => {
    const defaults = require('../../../../../../../jest/helpers/m4MenuDefaults').subcategoriesDefaults
    const onClickSubcategory = jest.fn()
    const { getByText } = renderWithProviders(
      <SubcategoriesComponentMemoized {...defaults} onClickSubcategory={onClickSubcategory} />
    )
    fireEvent.press(getByText('All'))
    expect(onClickSubcategory).toHaveBeenCalledWith(null, defaults.category)
  })

})
