import '../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { Vibration } from 'react-native'
import { useConfig, useEvent, useOrder } from '@components'

import { BusinessItemAccordion } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m3DiscoveryComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m3DiscoveryUiMock').getUiMock())

describe('BusinessItemAccordion', () => {
  beforeEach(() => {
    jest.spyOn(Vibration, 'vibrate').mockImplementation(() => {})
    ;(useOrder as jest.Mock).mockReturnValue([{
      options: { type: 1 },
      carts: {}
    }, {}])
    ;(useConfig as jest.Mock).mockReturnValue([{
      configs: { cart_change_business_validation: { value: '0' }, dates_general_format: { value: 'YYYY-MM-DD HH:mm' } }
    }])
    ;(useEvent as jest.Mock).mockReturnValue([{ emit: jest.fn() }])
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders cart business name when active', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').businessItemAccordionDefaults
    const { getByText } = renderWithProviders(
      <BusinessItemAccordion {...defaults} />
    )
    expect(getByText('Pizza Place')).toBeTruthy()
  })

  it('emits cart_viewed when accordion is active', () => {
    const emit = jest.fn()
    ;(useEvent as jest.Mock).mockReturnValue([{ emit }])
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').businessItemAccordionDefaults
    renderWithProviders(<BusinessItemAccordion {...defaults} isActive />)
    expect(emit).toHaveBeenCalledWith('cart_viewed', defaults.cart)
  })

  it('shows closed label for invalid schedule carts', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').businessItemAccordionDefaults
    const cart = { ...defaults.cart, valid_schedule: false }
    const { getByText } = renderWithProviders(
      <BusinessItemAccordion {...defaults} cart={cart} isActive={false} />
    )
    expect(getByText(/Closed/i)).toBeTruthy()
  })

  it('navigates to store when go-to-store is pressed', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').businessItemAccordionDefaults
    const onNavigationRedirect = jest.fn()
    const { getByText } = renderWithProviders(
      <BusinessItemAccordion {...defaults} onNavigationRedirect={onNavigationRedirect} />
    )
    fireEvent.press(getByText('Go to store'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('Business', { store: 'pizza-place' })
    expect(Vibration.vibrate).not.toHaveBeenCalled()
  })

  it('renders gift cart copy and checkout action', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').businessItemAccordionDefaults
    const handleClickCheckout = jest.fn()
    const { getByText } = renderWithProviders(
      <BusinessItemAccordion
        {...defaults}
        isActive={false}
        isGiftCart
        hasCartReservation
        cartReservation={{
          reserve_date: '2099-12-31 12:00:00',
          guests_reservation: 2
        }}
        cart={{ ...defaults.cart, valid_products: true, total: 25 }}
        handleClickCheckout={handleClickCheckout}
      />
    )
    expect(getByText('Gift card checkout')).toBeTruthy()
    fireEvent.press(getByText('Checkout'))
    expect(handleClickCheckout).toHaveBeenCalled()
  })

  it('shows change store action when business change validation is enabled', () => {
    ;(useConfig as jest.Mock).mockReturnValue([{
      configs: { cart_change_business_validation: { value: '1' }, dates_general_format: { value: 'YYYY-MM-DD HH:mm' } }
    }])
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').businessItemAccordionDefaults
    const handleChangeStore = jest.fn()
    const { getByText } = renderWithProviders(
      <BusinessItemAccordion {...defaults} handleChangeStore={handleChangeStore} />
    )
    fireEvent.press(getByText('Change store'))
    expect(handleChangeStore).toHaveBeenCalled()
  })
})
