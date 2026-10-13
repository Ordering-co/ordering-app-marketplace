import '../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { BusinessFeaturedController } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m3 = require('../../../../../../jest/helpers/m3DiscoveryComponentsMock')
  const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults')
  const React = require('react')
  return m3.getMock({
    BusinessController: (props: any) => {
      const UI = props.UIComponent
      return UI ? React.createElement(UI, { ...defaults.businessFeaturedDefaults, ...props }) : null
    }
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m3DiscoveryUiMock').getUiMock())

describe('BusinessFeaturedController', () => {
  it('renders featured business card', () => {
    const { getByText } = renderWithProviders(
      <BusinessFeaturedController navigation={{ navigate: jest.fn() }} />
    )
    expect(getByText('Pizza Place')).toBeTruthy()
  })

  it('calls handleClick when card is pressed', () => {
    const handleClick = jest.fn()
    const { getByText } = renderWithProviders(
      <BusinessFeaturedController handleClick={handleClick} navigation={{ navigate: jest.fn() }} />
    )
    fireEvent.press(getByText('Pizza Place'))
    expect(handleClick).toHaveBeenCalled()
  })
})
