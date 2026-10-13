import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { useOrder, useToast } from '@components'

import { PlaceSpot, PlaceSpotUI } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m4MenuComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

const defaults = () => require('../../../../../../jest/helpers/m4MenuDefaults').placeSpotDefaults

describe('PlaceSpot', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useOrder as jest.Mock).mockReturnValue([{
      loading: false,
      options: { type: 4 },
      carts: {}
    }, {}])
  })

  it('renders spot number input for checkout', () => {
    const { getByPlaceholderText, toJSON } = renderWithProviders(
      <PlaceSpot cartuuid="cart-1" />
    )
    expect(toJSON()).toBeTruthy()
    expect(getByPlaceholderText('Spot number')).toBeTruthy()
  })

  it('updates vehicle fields when in drive-thru mode', () => {
    ;(useOrder as jest.Mock).mockReturnValue([{
      loading: false,
      options: { type: 5 },
      carts: {}
    }, {}])
    const { getByPlaceholderText, getByTestId } = renderWithProviders(
      <PlaceSpot cartuuid="cart-1" />
    )
    expect(getByPlaceholderText('Drive thru lane')).toBeTruthy()
    fireEvent.press(getByTestId('select-dropdown-item-0'))
  })

  it('updates spot and vehicle from UI props', () => {
    const props = {
      ...defaults(),
      setSpotNumber: jest.fn(),
      setPlaceSpotNumber: jest.fn(),
      setVehicle: jest.fn(),
      handleChangeSpot: jest.fn()
    }
    const { getByPlaceholderText, getByText, getByTestId } = renderWithProviders(
      <PlaceSpotUI {...props} />
    )
    fireEvent.changeText(getByPlaceholderText('Spot number'), '12')
    expect(props.setSpotNumber).toHaveBeenCalledWith('12')
    expect(props.setPlaceSpotNumber).toHaveBeenCalledWith('12')

    fireEvent.press(getByTestId('select-dropdown-item-1'))
    expect(props.setVehicle).toHaveBeenCalled()

    fireEvent.changeText(getByPlaceholderText('Model'), 'Civic')
    expect(props.setVehicle).toHaveBeenCalled()

    fireEvent.press(getByText('Update'))
    expect(props.handleChangeSpot).toHaveBeenCalled()
  })

  it('toasts when spot number is not an integer', () => {
    const showToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue([, { showToast }])
    const props = {
      ...defaults(),
      spotNumber: 'abc',
      vehicle: { type: '', model: '', car_registration: '', color: '' },
      handleChangeSpot: jest.fn()
    }
    const { getByText } = renderWithProviders(<PlaceSpotUI {...props} />)
    fireEvent.press(getByText('Update'))
    expect(showToast).toHaveBeenCalled()
    expect(props.handleChangeSpot).not.toHaveBeenCalled()
  })

  it('toasts when spot number is negative', () => {
    const showToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue([, { showToast }])
    const props = {
      ...defaults(),
      spotNumber: '-1',
      vehicle: { type: '', model: '', car_registration: '', color: '' },
      handleChangeSpot: jest.fn()
    }
    const { getByText } = renderWithProviders(<PlaceSpotUI {...props} />)
    fireEvent.press(getByText('Update'))
    expect(showToast).toHaveBeenCalled()
  })

  it('shows eat-in placeholder', () => {
    ;(useOrder as jest.Mock).mockReturnValue([{
      loading: false,
      options: { type: 3 },
      carts: {}
    }, {}])
    const props = { ...defaults(), isCheckout: true }
    const { getByPlaceholderText } = renderWithProviders(<PlaceSpotUI {...props} />)
    expect(getByPlaceholderText('Table number')).toBeTruthy()
  })

  it('renders place group dropdowns when not input mode', () => {
    const props = {
      ...defaults(),
      isInputMode: false,
      handleChangePlace: jest.fn(),
      placesState: {
        loading: false,
        error: null,
        places: [{ id: 10, name: 'Spot 1', enabled: true, place_group_id: 1 }],
        placeGroups: [{ id: 1, name: 'Lot A', enabled: true }]
      },
      cart: {
        ...defaults().cart,
        place: { id: 10, name: 'Spot 1', place_group_id: 1 },
        place_id: 10
      }
    }
    const { getAllByTestId, getAllByText } = renderWithProviders(<PlaceSpotUI {...props} />)
    expect(getAllByText('Place group').length).toBeGreaterThan(0)
    fireEvent.press(getAllByTestId('odropdown-option-0')[0])
    expect(getAllByText('Select your spot').length).toBeGreaterThan(0)
    fireEvent.press(getAllByTestId('odropdown-option-0')[1])
    expect(props.handleChangePlace).toHaveBeenCalled()
  })

  it('renders loading and empty place states', () => {
    const loading = renderWithProviders(
      <PlaceSpotUI
        {...defaults()}
        isInputMode={false}
        placesState={{ loading: true, error: null, places: [], placeGroups: [] }}
      />
    )
    expect(loading.getAllByTestId('placeholder').length).toBeGreaterThan(0)

    const empty = renderWithProviders(
      <PlaceSpotUI
        {...defaults()}
        isInputMode={false}
        placesState={{ loading: false, error: true, places: [], placeGroups: [] }}
      />
    )
    expect(empty.getByText(/There are not places/i)).toBeTruthy()
  })

  it('toasts spotState errors', () => {
    const showToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue([, { showToast }])
    renderWithProviders(
      <PlaceSpotUI
        {...defaults()}
        spotState={{ loading: false, error: [{ message: 'Spot taken' }] }}
      />
    )
    expect(showToast).toHaveBeenCalled()
  })
})
