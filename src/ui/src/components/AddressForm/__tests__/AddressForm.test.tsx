import '../../../../../../jest/helpers/registerM9NativeMocks'

import React from 'react'
import { act, fireEvent } from '@testing-library/react-native'
import { useOrder } from '@components'

import { AddressForm } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m9IntegrationsComponentsMock').getMock())
jest.mock('@ui', () => {
  const ReactMock = require('react')
  const { View } = require('react-native')
  const uiMock = require('../../../../../../jest/helpers/m9IntegrationsUiMock').getUiMock()
  return {
    ...uiMock,
    GPSButton: (props: any) => ReactMock.createElement(View, { testID: 'gps-button-stub', ...props })
  }
})

describe('AddressForm', () => {
  const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')

  it('renders address form shell (smoke)', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <AddressForm {...d.addressFormDefaults} />
    )
    expect(getByTestId('google-places-input')).toBeTruthy()
    expect(getByText('Cancel')).toBeTruthy()
  })

  it('lets the GPS button report its errors through the form alert', () => {
    const { getByTestId } = renderWithProviders(
      <AddressForm {...d.addressFormDefaults} />
    )
    expect(getByTestId('gps-button-stub').props.setAlertState).toEqual(expect.any(Function))
  })

  it('returns to the previous screen once the saved address is applied when isGoBack is set', () => {
    const orderMock = useOrder as jest.Mock
    const defaultOrder = orderMock.getMockImplementation()
    orderMock.mockImplementation(() => [
      { loading: true, options: { type: 1, address: d.sampleAddress } },
      { setStateValues: jest.fn() }
    ])
    const goToBack = jest.fn()
    const navigation = { navigate: jest.fn(), canGoBack: () => true, goBack: jest.fn() }

    renderWithProviders(
      <AddressForm
        {...d.addressFormDefaults}
        addressesList={undefined}
        navigation={navigation}
        isGoBack
        goToBack={goToBack}
      />
    )

    expect(goToBack).toHaveBeenCalled()
    expect(navigation.navigate).not.toHaveBeenCalledWith('BottomTab')
    orderMock.mockImplementation(defaultOrder)
  })

  it('returns a guest to the previous screen after saving when isGoBack is set', async () => {
    const m8 = require('../../../../../../jest/helpers/m8ProfileComponentsMock')
    m8.setMockState({ sessionState: { auth: false, user: null, token: null, loading: false } })
    const saveAddress = jest.fn()
    const goToBack = jest.fn()
    const navigation = { navigate: jest.fn(), canGoBack: () => true, goBack: jest.fn() }

    const { getByText } = renderWithProviders(
      <AddressForm
        {...d.addressFormDefaults}
        formState={{
          loading: false,
          result: { error: false },
          changes: { address: '123 Main St', location: { lat: 40.7, lng: -74 } }
        }}
        saveAddress={saveAddress}
        navigation={navigation}
        isGoBack
        goToBack={goToBack}
      />
    )

    await act(async () => {
      fireEvent.press(getByText('Update'))
    })

    expect(saveAddress).toHaveBeenCalled()
    expect(goToBack).toHaveBeenCalled()
    expect(navigation.navigate).not.toHaveBeenCalledWith('Business')
    m8.resetMockState()
  })
})
