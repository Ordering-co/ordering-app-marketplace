import '../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'
import { act, fireEvent } from '@testing-library/react-native'
import { Keyboard } from 'react-native'

import { BusinessSearchMap } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('../MapBottomSheet', () => {
  const React = require('react')
  const { View } = require('react-native')
  return {
    MapBottomSheet: React.forwardRef((props: any, ref: any) => {
      React.useImperativeHandle(ref, () => ({
        expand: jest.fn(),
        collapse: jest.fn(),
        scrollToBusiness: jest.fn()
      }))
      return <View testID="map-bottom-sheet" {...props} />
    })
  }
})

jest.mock('@components', () => {
  const m3 = require('../../../../../../jest/helpers/m3DiscoveryComponentsMock')
  const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults')
  return m3.getMock({
    BusinessSearchList: m3.renderUiController(defaults.businessSearchMapDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m3DiscoveryUiMock').getUiMock())

describe('BusinessSearchMap', () => {
  it('renders map, filters, and bottom sheet', () => {
    const { getByTestId, getByText } = renderWithProviders(
      <BusinessSearchMap navigation={{ navigate: jest.fn(), goBack: jest.fn() }} />
    )
    expect(getByTestId('google-map-stub')).toBeTruthy()
    expect(getByTestId('map-bottom-sheet')).toBeTruthy()
    expect(getByText('Price')).toBeTruthy()
    expect(getByText('Brands')).toBeTruthy()
  })

  it('clears search input and navigates back', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').businessSearchMapDefaults
    const handleChangeTermValue = jest.fn()
    const goBack = jest.fn()
    const { UNSAFE_getAllByType } = renderWithProviders(
      <BusinessSearchMap
        {...defaults}
        termValue="pizza"
        handleChangeTermValue={handleChangeTermValue}
        navigation={{ navigate: jest.fn(), goBack }}
      />
    )
    const { TouchableOpacity } = require('react-native')
    const buttons = UNSAFE_getAllByType(TouchableOpacity)
    fireEvent.press(buttons[0])
    expect(goBack).toHaveBeenCalled()
    fireEvent.press(buttons[1])
    expect(handleChangeTermValue).toHaveBeenCalledWith('')
  })

  it('opens price filter popup and applies a price level', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').businessSearchMapDefaults
    const handleChangeFilters = jest.fn()
    const { getByText } = renderWithProviders(
      <BusinessSearchMap {...defaults} handleChangeFilters={handleChangeFilters} />
    )
    fireEvent.press(getByText('Price'))
    fireEvent.press(getByText('$$'))
    expect(handleChangeFilters).toHaveBeenCalledWith('price_level', '2')
    fireEvent.press(getByText('View results'))
    expect(handleChangeFilters).toHaveBeenCalledWith('price_level', '2')
  })

  it('shows search-this-area after map region moves far enough', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').businessSearchMapDefaults
    const handleSearchbusinessAndProducts = jest.fn()
    const { getByTestId, getByText } = renderWithProviders(
      <BusinessSearchMap {...defaults} handleSearchbusinessAndProducts={handleSearchbusinessAndProducts} />
    )
    act(() => {
      getByTestId('google-map-stub').props.onRegionChange({ latitude: 41.5, longitude: -75.5 })
    })
    fireEvent.press(getByText('Search this area'))
    expect(handleSearchbusinessAndProducts).toHaveBeenCalledWith(true, {
      location: { lat: 41.5, lng: -75.5 }
    })
  })

  it('hides bottom sheet while keyboard is visible', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').businessSearchMapDefaults
    let keyboardDidShow: (() => void) | undefined
    jest.spyOn(Keyboard, 'addListener').mockImplementation((event, cb) => {
      if (event === 'keyboardDidShow') keyboardDidShow = cb
      return { remove: jest.fn() }
    })
    const { queryByTestId } = renderWithProviders(
      <BusinessSearchMap {...defaults} />
    )
    act(() => {
      keyboardDidShow?.()
    })
    expect(queryByTestId('map-bottom-sheet')).toBeNull()
  })
})
