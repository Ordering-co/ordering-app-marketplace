import '../../../../../../jest/helpers/registerM9NativeMocks'

jest.mock('../../shared', () => require('../../../../../../jest/helpers/m9IntegrationsSharedMock'))

import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { useOrder } from '@components'

import { ServiceForm } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m9IntegrationsComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m9IntegrationsUiMock').getUiMock())

describe('ServiceForm', () => {
  it('renders service form with product name (smoke)', () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getByText } = renderWithProviders(
      <ServiceForm {...d.serviceFormDefaults} />
    )
    expect(getByText('Haircut')).toBeTruthy()
    expect(getByText('Schedule')).toBeTruthy()
  })

  it('opens the address list and returns to the service when none is saved', () => {
    const order = useOrder as jest.Mock
    const previous = order.getMockImplementation()
    const [state, actions] = order()
    order.mockReturnValue([
      { ...state, options: { ...state.options, address_id: null } },
      actions
    ])
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const navigation = { navigate: jest.fn() }
    const { getByTestId } = renderWithProviders(
      <ServiceForm {...d.serviceFormDefaults} navigation={navigation} />
    )
    fireEvent.press(getByTestId('service-address-redirect'))
    expect(navigation.navigate).toHaveBeenCalledWith('AddressList', { isGoBack: true })
    if (previous) order.mockImplementation(previous)
  })
})
