import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'

import { UpsellingProducts } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

const mockControllerProps = jest.fn()

jest.mock('@components', () => {
  const m4 = require('../../../../../../jest/helpers/m4MenuComponentsMock')
  const d = require('../../../../../../jest/helpers/m4MenuDefaults')
  const render = m4.renderUiController({
    ...d.upsellingProductsDefaults,
    isCustomMode: false,
    isPage: true,
    canOpenUpselling: true,
    openUpselling: true
  })
  return m4.getMock({
    UpsellingPage: (props) => {
      mockControllerProps(props)
      return render(props)
    }
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

jest.mock('../UpsellingLayout', () => {
  const { View } = require('react-native')
  return { UpsellingLayout: () => <View testID="upselling-layout" /> }
})

jest.mock('../UpsellingContent', () => {
  const { View, Text } = require('react-native')
  return {
    UpsellingContent: (props) => (
      <View testID="upselling-content">
        <Text>{props.productsList?.[0]?.name || 'none'}</Text>
      </View>
    )
  }
})

describe('UpsellingProducts', () => {
  it('renders page content mode', () => {
    const { getByTestId, getByText } = renderWithProviders(
      <UpsellingProducts businessId={1} />
    )
    expect(getByTestId('upselling-content')).toBeTruthy()
    expect(getByText('Garlic Knots')).toBeTruthy()
  })

  it('renders stable shell', () => {
    const { toJSON } = renderWithProviders(<UpsellingProducts businessId={1} />)
    expect(toJSON()).toBeTruthy()
  })

  it('loads upselling from the cart upselling endpoint when the cart products are known', () => {
    renderWithProviders(<UpsellingProducts businessId={1} cartProducts={[{ id: 7 }]} />)
    expect(mockControllerProps).toHaveBeenLastCalledWith(
      expect.objectContaining({ useSuggestiveUpselling: true })
    )
  })

  it('keeps the business products endpoint without cart products', () => {
    renderWithProviders(<UpsellingProducts businessId={1} />)
    expect(mockControllerProps).toHaveBeenLastCalledWith(
      expect.objectContaining({ useSuggestiveUpselling: false })
    )
  })

  it('keeps the products it already received', () => {
    renderWithProviders(
      <UpsellingProducts
        businessId={1}
        cartProducts={[{ id: 7 }]}
        products={[{ id: 9, name: 'Fries' }]}
        useSuggestiveUpselling
      />
    )
    expect(mockControllerProps).toHaveBeenLastCalledWith(
      expect.objectContaining({ useSuggestiveUpselling: false })
    )
  })
})
