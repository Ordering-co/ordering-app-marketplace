import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { BusinessMenuList } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m4MenuComponentsMock').getMock())

jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())



describe('BusinessMenuList', () => {

  it('renders menu dropdown options', () => {
    const { getByText, getByTestId } = renderWithProviders(<BusinessMenuList businessId={1} />)
    expect(getByTestId('select-dropdown')).toBeTruthy()
    expect(getByText('Lunch Menu')).toBeTruthy()
  })

  it('invokes setMenu when an option is selected', () => {
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults').businessMenuListDefaults
    defaults.setMenu.mockClear()
    const { getByTestId } = renderWithProviders(<BusinessMenuList businessId={1} />)
    fireEvent.press(getByTestId('select-dropdown-item-0'))
    expect(defaults.setMenu).toHaveBeenCalled()
  })

})
