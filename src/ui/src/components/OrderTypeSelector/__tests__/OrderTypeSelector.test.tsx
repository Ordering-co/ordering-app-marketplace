import '../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { OrderTypeSelector } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m6 = require('../../../../../../jest/helpers/m6OrdersComponentsMock')
  const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
  return m6.getMock({
    OrderTypeControl: m6.renderUiController({
      ...d.orderTypeSelectorDefaults,
      configTypes: [1, 2, 3],
      orderTypes: [
        { value: 1, content: 'DELIVERY' },
        { value: 2, content: 'PICKUP' },
        { value: 3, content: 'EAT_IN' }
      ]
    })
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

describe('OrderTypeSelector', () => {
  it('renders available order types', () => {
    const { getByText } = renderWithProviders(
      <OrderTypeSelector goToBack={jest.fn()} configTypes={[1, 2, 3]} />
    )
    expect(getByText('DELIVERY')).toBeTruthy()
    expect(getByText('PICKUP')).toBeTruthy()
    expect(getByText('EAT_IN')).toBeTruthy()
  })

  it('continues with selected order type', () => {
    const handleChangeOrderType = jest.fn()
    const goToBack = jest.fn()
    const { getByText } = renderWithProviders(
      <OrderTypeSelector
        handleChangeOrderType={handleChangeOrderType}
        goToBack={goToBack}
        configTypes={[1, 2, 3]}
        typeSelected={1}
      />
    )
    fireEvent.press(getByText('PICKUP'))
    fireEvent.press(getByText('Continue'))
    expect(handleChangeOrderType).toHaveBeenCalledWith(2)
    expect(goToBack).toHaveBeenCalled()
  })
})
