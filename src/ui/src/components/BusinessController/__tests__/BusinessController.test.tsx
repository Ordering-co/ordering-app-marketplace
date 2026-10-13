import '../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'
import { fireEvent, within } from '@testing-library/react-native'
import { useToast, useSession, useConfig } from '@components'

import { BusinessController, BusinessControllerUI } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m3 = require('../../../../../../jest/helpers/m3DiscoveryComponentsMock')
  const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults')
  const React = require('react')
  return m3.getMock({
    BusinessController: (props: any) => {
      const UI = props.UIComponent
      return UI ? React.createElement(UI, { ...defaults.businessControllerUiDefaults, ...props }) : null
    }
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m3DiscoveryUiMock').getUiMock())

describe('BusinessController', () => {
  it('renders business name in full card view', () => {
    const { getByText } = renderWithProviders(
      <BusinessController navigation={{ navigate: jest.fn() }} businessSlug="pizza-place" />
    )
    expect(getByText('Pizza Place')).toBeTruthy()
  })

  it('handles simple view layout', () => {
    const handleClick = jest.fn()
    const { getByText } = renderWithProviders(
      <BusinessController
        navigation={{ navigate: jest.fn() }}
        businessSlug="pizza-place"
        simpleView
        handleClick={handleClick}
      />
    )
    fireEvent.press(getByText('Pizza Place'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('renders favorite view and toggles favorite when authenticated', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').businessControllerUiDefaults
    const handleFavoriteBusiness = jest.fn()
    const { UNSAFE_getAllByType } = renderWithProviders(
      <BusinessControllerUI
        {...defaults}
        favoriteView
        handleFavoriteBusiness={handleFavoriteBusiness}
      />
    )
    const { TouchableOpacity } = require('react-native')
    fireEvent.press(UNSAFE_getAllByType(TouchableOpacity)[1])
    expect(handleFavoriteBusiness).toHaveBeenCalled()
  })

  it('redirects to login when favorite is tapped while logged out', () => {
    ;(useSession as jest.Mock).mockReturnValueOnce([{ auth: false, user: null, token: null }, {}])
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').businessControllerUiDefaults
    const navigation = { navigate: jest.fn() }
    const { UNSAFE_getAllByType } = renderWithProviders(
      <BusinessControllerUI
        {...defaults}
        favoriteView
        navigation={navigation}
      />
    )
    const { TouchableOpacity } = require('react-native')
    fireEvent.press(UNSAFE_getAllByType(TouchableOpacity)[1])
    expect(navigation.navigate).toHaveBeenCalledWith('Login')
  })

  it('shows closed toast when tapping a closed business without preorder', () => {
    ;(useConfig as jest.Mock).mockReturnValueOnce([{
      loading: false,
      configs: { preorder_status_enabled: { value: '0' } }
    }])
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults')
    const business = { ...defaults.sampleBusiness, open: false }
    const showToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue([, { showToast }])
    const { getByTestId } = renderWithProviders(
      <BusinessControllerUI
        {...defaults.businessControllerUiDefaults}
        business={business}
        isBusinessOpen={false}
      />
    )
    fireEvent.press(getByTestId('card-animation'))
    expect(showToast).toHaveBeenCalled()
  })

  it('navigates to preorder flow for closed businesses when enabled', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults')
    const business = { ...defaults.sampleBusiness, open: false }
    const navigation = { navigate: jest.fn() }
    const { getByTestId } = renderWithProviders(
      <BusinessControllerUI
        {...defaults.businessControllerUiDefaults}
        business={business}
        isBusinessOpen={false}
        navigation={navigation}
      />
    )
    fireEvent.press(getByTestId('card-animation'))
    expect(navigation.navigate).toHaveBeenCalledWith('MomentOption', expect.any(Object))
  })

  it('renders the Maweja card with the business name and rating on the image', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').businessControllerUiDefaults
    const { getByTestId, getByText } = renderWithProviders(
      <BusinessControllerUI {...defaults} layout="maweja" />
    )
    expect(getByTestId('maweja-business-card')).toBeTruthy()
    expect(getByText('Pizza Place')).toBeTruthy()
    expect(getByText('4.5')).toBeTruthy()
  })

  it('shows the Maweja card delivery fee as a price even when it is zero', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').businessControllerUiDefaults
    const { getByText, queryByText } = renderWithProviders(
      <BusinessControllerUI {...defaults} layout="maweja" businessDeliveryPrice={0} />
    )
    expect(getByText(/\$0$/)).toBeTruthy()
    expect(queryByText('Free delivery')).toBeNull()
  })

  it('keeps the Maweja store facts under the name, beside the logo', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').businessControllerUiDefaults
    const { getByTestId } = renderWithProviders(
      <BusinessControllerUI {...defaults} layout="maweja" />
    )
    const copy = within(getByTestId('maweja-business-copy'))
    expect(copy.getByText('Pizza Place')).toBeTruthy()
    expect(copy.getByText(/\$2\.5$/)).toBeTruthy()
    expect(copy.getByText(/1\.2 mi$/)).toBeTruthy()
  })

  it('uses search card layout when businessListingSearchview is enabled', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').businessControllerUiDefaults
    const { getByText } = renderWithProviders(
      <BusinessControllerUI {...defaults} businessListingSearchview />
    )
    expect(getByText('Pizza Place')).toBeTruthy()
  })
})
