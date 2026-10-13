import '../../../../../../jest/helpers/registerM9NativeMocks'

jest.mock('@components', () => require('../../../../../../jest/helpers/m9IntegrationsComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m9IntegrationsUiMock').getUiMock())
jest.mock('../TagOptions', () => ({
  TagOptions: () => null
}))
jest.mock('react-native-paper', () => {
  const React = require('react')
  const { View, TouchableOpacity } = require('react-native')
  return {
    ActivityIndicator: (props: any) => React.createElement(View, { testID: 'activity-indicator', ...props }),
    TouchableRipple: ({ children, onPress, ...props }: any) => (
      React.createElement(TouchableOpacity, { onPress, ...props }, children)
    )
  }
})
jest.mock('react-native-vector-icons/Ionicons', () => {
  const React = require('react')
  const { View } = require('react-native')
  return {
    __esModule: true,
    default: (props: any) => React.createElement(View, { testID: 'ionicon', ...props })
  }
})
jest.mock('react-native-vector-icons/SimpleLineIcons', () => {
  const React = require('react')
  const { View } = require('react-native')
  return {
    __esModule: true,
    default: (props: any) => React.createElement(View, { testID: 'simple-line-icon', ...props })
  }
})

import React from 'react'
import { act, fireEvent } from '@testing-library/react-native'

import { AddressListUI } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('AddressList', () => {
  it('shows loading placeholders while addresses load', () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getAllByTestId } = renderWithProviders(
      <AddressListUI
        {...d.addressListDefaults}
        addressList={{ loading: true, error: null, addresses: [] }}
      />
    )
    expect(getAllByTestId('placeholder-line').length).toBeGreaterThan(0)
  })

  it('shows empty state when no addresses saved', () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getByText } = renderWithProviders(
      <AddressListUI
        {...d.addressListDefaults}
        addressList={{ loading: false, error: null, addresses: [] }}
      />
    )
    expect(getByText('No addresses saved yet')).toBeTruthy()
  })

  it('navigates to add new address from empty state', () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const onNavigationRedirect = jest.fn()
    const { getByText } = renderWithProviders(
      <AddressListUI
        {...d.addressListDefaults}
        addressList={{ loading: false, error: null, addresses: [] }}
        onNavigationRedirect={onNavigationRedirect}
      />
    )
    fireEvent.press(getByText('Add new Address'))
    expect(onNavigationRedirect).toHaveBeenCalledWith(
      'AddressForm',
      expect.objectContaining({ address: null })
    )
  })

  it('does not navigate until set-default finishes', async () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    let resolveDefault: ((value?: unknown) => void) | undefined
    const handleSetDefault = jest.fn(() => new Promise((resolve) => {
      resolveDefault = resolve
    }))
    const onNavigationRedirect = jest.fn()
    const { getByText } = renderWithProviders(
      <AddressListUI
        {...d.addressListDefaults}
        handleSetDefault={handleSetDefault}
        onNavigationRedirect={onNavigationRedirect}
      />
    )

    fireEvent.press(getByText('456 Oak Ave'))
    expect(handleSetDefault).toHaveBeenCalled()
    expect(onNavigationRedirect).not.toHaveBeenCalled()

    await act(async () => {
      resolveDefault?.()
    })
    expect(onNavigationRedirect).toHaveBeenCalledWith('BottomTab')
  })

  it('stays on AddressList when set-default fails', async () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const onNavigationRedirect = jest.fn()
    const { getByText } = renderWithProviders(
      <AddressListUI
        {...d.addressListDefaults}
        handleSetDefault={jest.fn(async () => {
          throw new Error('failed')
        })}
        onNavigationRedirect={onNavigationRedirect}
      />
    )

    await act(async () => {
      fireEvent.press(getByText('456 Oak Ave'))
    })
    expect(onNavigationRedirect).not.toHaveBeenCalled()
  })
})
