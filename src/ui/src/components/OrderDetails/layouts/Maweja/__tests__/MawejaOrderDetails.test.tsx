import '../../../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'

import { mawejaStepIndex, MawejaProgress, MawejaStatusHero } from '..'
import { OrderDetails } from '../../..'
import { renderWithProviders } from '../../../../../../../../jest/helpers/renderWithProviders'

jest.mock('../../../../../hooks/useDriverInterpolation', () => ({
  useDriverInterpolation: jest.fn(() => null)
}))

jest.mock('../../../OrderEta', () => {
  const { Text } = require('react-native')
  return { OrderEta: () => <Text testID="order-eta">ETA</Text> }
})

jest.mock('../../../Bill', () => {
  const { View } = require('react-native')
  return { Bill: () => <View testID="bill-stub" /> }
})

jest.mock('../../../DynamicProgressBar', () => ({
  DynamicProgressBar: () => null
}))

jest.mock('@components', () => {
  const m6 = require('../../../../../../../../jest/helpers/m6OrdersComponentsMock')
  const d = require('../../../../../../../../jest/helpers/m6OrdersDefaults')
  return m6.getMock({
    OrderDetails: m6.renderUiController(d.orderDetailsDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

const mawejaTheme = { app_design: { components: { layout: { type: 'maweja' } } } }

describe('Maweja order tracking', () => {
  it('maps order statuses onto the four tracking steps', () => {
    expect(mawejaStepIndex(0)).toBe(0)
    expect(mawejaStepIndex(7)).toBe(1)
    expect(mawejaStepIndex(9)).toBe(2)
    expect(mawejaStepIndex(11)).toBe(3)
    expect(mawejaStepIndex(2)).toBe(0)
  })

  it('shows the pending hero and the progress caption', () => {
    const { getAllByText, getByText } = renderWithProviders(
      <>
        <MawejaStatusHero tone="brand" kicker="Live order" title="Order waiting for validation" subtitle="Coffee Shop" />
        <MawejaProgress
          title="Progress"
          labels={['Received', 'Confirmed', 'Out for delivery', 'Delivered']}
          caption="Order waiting for validation"
          step={0}
        />
      </>
    )
    expect(getAllByText('Order waiting for validation').length).toBeGreaterThan(0)
    expect(getByText('Coffee Shop')).toBeTruthy()
    expect(getByText('Received')).toBeTruthy()
  })

  it('shows the delivered hero', () => {
    const { getByText } = renderWithProviders(
      <MawejaStatusHero tone="success" kicker="Delivered" title="Order delivered!" subtitle="Thank you" />
    )
    expect(getByText('Order delivered!')).toBeTruthy()
    expect(getByText('Thank you')).toBeTruthy()
  })
})

describe('Maweja delivery PIN', () => {
  const collectText = (node: any): string[] => {
    if (typeof node === 'string') return [node]
    if (Array.isArray(node)) return node.flatMap(collectText)
    return (node?.children || []).flatMap(collectText)
  }

  const renderWithOrder = (overrides: Record<string, unknown>) => {
    const d = require('../../../../../../../../jest/helpers/m6OrdersDefaults')
    return renderWithProviders(
      <OrderDetails
        onNavigationRedirect={jest.fn()}
        order={{ loading: false, error: null, order: { ...d.sampleOrder, ...overrides } }}
      />,
      { themeOverrides: mawejaTheme }
    )
  }

  it('shows the PIN card with its leading zero above the progress tracker', () => {
    const { getByTestId, getByText, toJSON } = renderWithOrder({
      delivery_pin: '0427',
      delivery_pin_status: 'requested'
    })
    expect(getByTestId('delivery-pin')).toBeTruthy()
    expect(getByText('Delivery PIN')).toBeTruthy()
    expect(getByText('0427')).toBeTruthy()
    expect(getByText('Give this code to the driver when you receive your order')).toBeTruthy()
    const texts = collectText(toJSON())
    expect(texts.indexOf('0427')).toBeGreaterThan(-1)
    expect(texts.indexOf('0427')).toBeLessThan(texts.indexOf('Progress'))
  })

  it('hides the PIN card once it has been validated', () => {
    const { queryByTestId, queryByText } = renderWithOrder({
      delivery_pin: '0427',
      delivery_pin_status: 'validated'
    })
    expect(queryByTestId('delivery-pin')).toBeNull()
    expect(queryByText('0427')).toBeNull()
  })

  it('hides the PIN card when the order has none', () => {
    const { queryByTestId } = renderWithOrder({
      delivery_pin: null,
      delivery_pin_status: 'requested'
    })
    expect(queryByTestId('delivery-pin')).toBeNull()
  })

  it('hides the PIN card when the order is completed', () => {
    const { getByText, queryByTestId, queryByText } = renderWithOrder({
      status: 1,
      delivery_pin: '0427',
      delivery_pin_status: 'requested'
    })
    expect(getByText('Order delivered!')).toBeTruthy()
    expect(queryByTestId('delivery-pin')).toBeNull()
    expect(queryByText('0427')).toBeNull()
  })
})
