import '../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { MomentOption } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('../TimeListItem', () => {
  const { TouchableOpacity, Text } = require('react-native')
  return {
    TimeListItem: (props: any) => (
      <TouchableOpacity testID="time-list-item" onPress={() => props.onSelect?.(props.time)}>
        <Text>{props.time?.startTime}</Text>
      </TouchableOpacity>
    )
  }
})

jest.mock('@components', () => {
  const m6 = require('../../../../../../jest/helpers/m6OrdersComponentsMock')
  const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
  return m6.getMock({
    MomentOption: m6.renderUiController(d.momentOptionDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

describe('MomentOption', () => {
  it('renders day tabs and time slots', () => {
    const { getByText, getAllByTestId } = renderWithProviders(
      <MomentOption navigation={{ canGoBack: () => true, goBack: jest.fn() }} />
    )
    expect(getByText('Today')).toBeTruthy()
    expect(getAllByTestId('time-list-item').length).toBeGreaterThan(0)
  })

  it('lists selectable time slots', () => {
    const { getAllByTestId } = renderWithProviders(
      <MomentOption navigation={{ canGoBack: () => true, goBack: jest.fn() }} />
    )
    expect(getAllByTestId('time-list-item').length).toBeGreaterThan(1)
  })
})
