import '../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'

import { MultiOrdersDetails } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('../SingleOrderCard', () => {
  const { View, Text } = require('react-native')
  return {
    SingleOrderCard: (props: any) => (
      <View testID="multi-order-card-stub">
        <Text>{props.order?.business?.name}</Text>
      </View>
    )
  }
})

jest.mock('@components', () => {
  const m6 = require('../../../../../../jest/helpers/m6OrdersComponentsMock')
  const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
  return m6.getMock({
    MultiOrdersDetails: m6.renderUiController(d.multiOrdersDetailsDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

describe('MultiOrdersDetails', () => {
  it('renders group order summary and order rows', () => {
    const { getByText, getAllByTestId } = renderWithProviders(
      <MultiOrdersDetails navigation={{ navigate: jest.fn(), canGoBack: () => true, goBack: jest.fn() }} />
    )
    expect(getByText(/Payment total/i)).toBeTruthy()
    expect(getByText(/Order #42/)).toBeTruthy()
    expect(getAllByTestId('multi-order-card-stub').length).toBe(2)
  })
})
