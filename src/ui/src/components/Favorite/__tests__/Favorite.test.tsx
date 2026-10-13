import '../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { Favorite } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@/ui/src/Forms/Tabs', () => {
  const { View, TouchableOpacity, Text } = require('react-native')
  return {
    Tabs: ({ handleChangeTab, defaultTabs }: any) => (
      <View testID="favorite-tabs">
        {defaultTabs.map((tab: any) => (
          <TouchableOpacity
            key={tab.tab}
            testID={`tab-${tab.tab}`}
            onPress={() => handleChangeTab(tab.tab)}
          >
            <Text>{tab.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }
})

jest.mock('@components', () => require('../../../../../../jest/helpers/m3DiscoveryComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m3DiscoveryUiMock').getUiMock())

describe('Favorite', () => {
  it('renders businesses tab by default', () => {
    const { getByTestId } = renderWithProviders(
      <Favorite navigation={{ navigate: jest.fn() }} onRedirect={jest.fn()} />
    )
    expect(getByTestId('favorite-list-business')).toBeTruthy()
  })

  it('switches to products tab', () => {
    const { getByTestId } = renderWithProviders(
      <Favorite navigation={{ navigate: jest.fn() }} onRedirect={jest.fn()} />
    )
    fireEvent.press(getByTestId('tab-products'))
    expect(getByTestId('favorite-list-product')).toBeTruthy()
  })
})
