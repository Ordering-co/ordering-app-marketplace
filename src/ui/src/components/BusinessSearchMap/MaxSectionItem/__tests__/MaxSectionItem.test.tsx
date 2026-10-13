import '../../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { MaxSectionItem } from '..'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../../jest/helpers/m3DiscoveryComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../../jest/helpers/m3DiscoveryUiMock').getUiMock())

describe('MaxSectionItem', () => {
  it('renders map filter title and handles option press', () => {
    const handleChangeFilters = jest.fn()
    const { getByText } = renderWithProviders(
      <MaxSectionItem
        title="Delivery fee"
        filter="max_delivery_price"
        options={[500, 1000, 'default']}
        filters={{ max_delivery_price: 500 }}
        handleChangeFilters={handleChangeFilters}
      />
    )
    expect(getByText('Delivery fee')).toBeTruthy()
    fireEvent.press(getByText('$500'))
    expect(handleChangeFilters).toHaveBeenCalledWith('max_delivery_price', 500)
  })
})
