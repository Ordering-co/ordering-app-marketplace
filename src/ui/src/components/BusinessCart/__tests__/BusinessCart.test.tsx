import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { BusinessCart } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m4MenuComponentsMock').getMock())

jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

describe('BusinessCart', () => {
  it('renders business name and address', () => {
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults').businessCartDefaults
    const { getByText } = renderWithProviders(<BusinessCart {...defaults} />)
    expect(getByText('Pizza Place')).toBeTruthy()
    expect(getByText('123 Main St')).toBeTruthy()
  })

  it('calls handleCartStoreClick when select is pressed', () => {
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults').businessCartDefaults
    const handleCartStoreClick = jest.fn()
    const { getByText } = renderWithProviders(
      <BusinessCart {...defaults} handleCartStoreClick={handleCartStoreClick} />
    )
    fireEvent.press(getByText('Select'))
    expect(handleCartStoreClick).toHaveBeenCalledWith(defaults.business.id)
  })

  it('renders skeleton placeholders without crashing', () => {
    const { toJSON } = renderWithProviders(
      <BusinessCart business={{}} isSkeleton />
    )
    expect(toJSON()).toBeTruthy()
  })
})
