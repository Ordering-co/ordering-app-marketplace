import '../../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { PreviousBusinessOrdered } from '..'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'

jest.mock('../../../BusinessController', () => {
  const { TouchableOpacity, Text } = require('react-native')
  return {
    BusinessController: (props: any) => (
      <TouchableOpacity testID="business-controller-stub" onPress={() => props.handleCustomClick?.()}>
        <Text>{props.business?.name}</Text>
      </TouchableOpacity>
    )
  }
})

jest.mock('@components', () => require('../../../../../../../jest/helpers/m6OrdersComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

describe('PreviousBusinessOrdered', () => {
  it('renders business cards from previous orders', () => {
    const d = require('../../../../../../../jest/helpers/m6OrdersDefaults')
    const { getByText, getByTestId } = renderWithProviders(
      <PreviousBusinessOrdered {...d.previousBusinessOrderedDefaults} />
    )
    expect(getByText('Pizza Place')).toBeTruthy()
    expect(getByTestId('business-controller-stub')).toBeTruthy()
  })

  it('navigates to business on click', () => {
    const d = require('../../../../../../../jest/helpers/m6OrdersDefaults')
    const onNavigationRedirect = jest.fn()
    const { getByTestId } = renderWithProviders(
      <PreviousBusinessOrdered {...d.previousBusinessOrderedDefaults} onNavigationRedirect={onNavigationRedirect} />
    )
    fireEvent.press(getByTestId('business-controller-stub'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('Business', expect.objectContaining({ store: 'pizza-place' }))
  })
})
