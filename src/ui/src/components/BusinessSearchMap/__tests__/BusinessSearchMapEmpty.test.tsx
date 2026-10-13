import '../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'

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
    BusinessSearchList: m3.renderUiController(defaults.businessSearchMapEmptyDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m3DiscoveryUiMock').getUiMock())

describe('BusinessSearchMap empty results', () => {
  it('shows not found message when there are no businesses', () => {
    const { getByText, queryByTestId } = renderWithProviders(
      <BusinessSearchMap navigation={{ navigate: jest.fn(), goBack: jest.fn() }} />
    )
    expect(getByText(/No businesses to delivery/i)).toBeTruthy()
    expect(queryByTestId('map-bottom-sheet')).toBeNull()
  })
})
