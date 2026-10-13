import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { Text } from 'react-native'
import { fireEvent } from '@testing-library/react-native'

import { ProductOption } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m4 = require('../../../../../../jest/helpers/m4MenuComponentsMock')
  const d = require('../../../../../../jest/helpers/m4MenuDefaults')
  return m4.getMock({
    ProductOption: m4.renderUiController({
      option: { id: 2, name: 'Extras', min: 0, max: 3 },
      error: false
    })
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

describe('ProductOption', () => {
  it('renders option max label and toggles closed by default when min is 0', () => {
    const { getByText, queryByText, getByLabelText } = renderWithProviders(
      <ProductOption>
        <Text>Child option</Text>
      </ProductOption>
    )
    expect(getByText('Extras')).toBeTruthy()
    expect(getByText(/Max/i)).toBeTruthy()
    expect(queryByText('Child option')).toBeNull()
    fireEvent.press(getByLabelText('Toggle Accordion'))
    expect(getByText('Child option')).toBeTruthy()
  })
})
