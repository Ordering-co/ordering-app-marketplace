import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { ActivityIndicator } from 'react-native'

import { DriverTips } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m5 = require('../../../../../../jest/helpers/m5CheckoutComponentsMock')
  const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
  return m5.getMock({
    DriverTips: m5.renderUiController(d.driverTipsDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock())

describe('DriverTips', () => {
  it('renders tip options and message', () => {
    const { getByText } = renderWithProviders(<DriverTips />)
    expect(getByText(/100% of these tips/i)).toBeTruthy()
    expect(getByText('10%')).toBeTruthy()
    expect(getByText('15%')).toBeTruthy()
  })

  it('selects a tip option', () => {
    const handlerChangeOption = jest.fn()
    const m5 = require('../../../../../../jest/helpers/m5CheckoutComponentsMock')
    const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
    // Defaults already include handler — press tip
    const { getByText } = renderWithProviders(<DriverTips />)
    fireEvent.press(getByText('20%'))
    expect(getByText('20%')).toBeTruthy()
  })

  it('shows a loader on the pressed tip until the update finishes', () => {
    const handlerChangeOption = jest.fn()
    const { getByText, rerender, UNSAFE_queryAllByType } = renderWithProviders(
      <DriverTips handlerChangeOption={handlerChangeOption} isLoading={false} />
    )

    fireEvent.press(getByText('20%'))
    expect(handlerChangeOption).toHaveBeenCalledWith(20)

    rerender(<DriverTips handlerChangeOption={handlerChangeOption} isLoading />)
    expect(UNSAFE_queryAllByType(ActivityIndicator)).toHaveLength(1)

    rerender(<DriverTips handlerChangeOption={handlerChangeOption} isLoading={false} driverTip={20} />)
    expect(UNSAFE_queryAllByType(ActivityIndicator)).toHaveLength(0)
  })

  it('ignores a press on the tip that is already selected', () => {
    const handlerChangeOption = jest.fn()
    const { getByText, UNSAFE_queryAllByType } = renderWithProviders(
      <DriverTips handlerChangeOption={handlerChangeOption} />
    )

    fireEvent.press(getByText('10%'))

    expect(handlerChangeOption).not.toHaveBeenCalled()
    expect(UNSAFE_queryAllByType(ActivityIndicator)).toHaveLength(0)
  })
})
