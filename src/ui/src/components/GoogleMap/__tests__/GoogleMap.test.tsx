import '../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'
import { act, fireEvent } from '@testing-library/react-native'
import Geocoder from 'react-native-geocoding'

import { GoogleMap } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m3DiscoveryComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m3DiscoveryUiMock').getUiMock())

describe('GoogleMap', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  it('renders map view with location', () => {
    const { getByTestId } = renderWithProviders(
      <GoogleMap
        location={{ lat: 40.7128, lng: -74.006 }}
        delta={{ latitudeDelta: 0.02, longitudeDelta: 0.02 }}
        locations={[{ id: 1, lat: 40.72, lng: -74.01 }]}
        readOnly
      />
    )
    expect(getByTestId('map-view')).toBeTruthy()
  })

  it('exposes ref methods for focus and recenter', () => {
    const ref = React.createRef<any>()
    renderWithProviders(
      <GoogleMap
        ref={ref}
        location={{ lat: 40.7128, lng: -74.006 }}
        delta={{ latitudeDelta: 0.02, longitudeDelta: 0.02 }}
        readOnly
      />
    )
    act(() => {
      ref.current?.focusOnCoordinate(40.72, -74.01)
      ref.current?.recenterToUserLocation()
    })
    expect(ref.current?.focusOnCoordinate).toBeDefined()
  })

  it('calls onMarkerSelect when marker is pressed', () => {
    const onMarkerSelect = jest.fn()
    const { getAllByTestId } = renderWithProviders(
      <GoogleMap
        location={{ lat: 40.7128, lng: -74.006 }}
        locations={[{ id: 1, lat: 40.72, lng: -74.01, name: 'Store', icon: 'logo.png' }]}
        onMarkerSelect={onMarkerSelect}
        readOnly={false}
      />
    )
    fireEvent(getAllByTestId('map-marker')[0], 'press')
    expect(onMarkerSelect).toHaveBeenCalled()
  })

  it('renders polygon, circle, and distance zone overlays', () => {
    const { getAllByTestId } = renderWithProviders(
      <GoogleMap
        location={{ lat: 40.7128, lng: -74.006 }}
        businessZones={[
          {
            type: 2,
            id: 1,
            data: [{ lat: 40.71, lng: -74.01 }, { lat: 40.72, lng: -74.02 }]
          },
          {
            type: 1,
            id: 2,
            data: { center: { lat: 40.7128, lng: -74.006 }, radio: 2 }
          },
          {
            type: 5,
            id: 3,
            data: { distance: 3, unit: 'km' }
          }
        ]}
        readOnly
      />
    )
    expect(getAllByTestId('map-polygon').length).toBeGreaterThan(0)
    expect(getAllByTestId('map-circle').length).toBeGreaterThan(0)
  })

  it('handles region change callback', () => {
    const onRegionChange = jest.fn()
    const { getByTestId } = renderWithProviders(
      <GoogleMap
        location={{ lat: 40.7128, lng: -74.006 }}
        onRegionChange={onRegionChange}
        readOnly
      />
    )
    fireEvent(getByTestId('map-view'), 'regionChangeComplete', {
      latitude: 40.72,
      longitude: -74.01,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02
    })
    expect(onRegionChange).toHaveBeenCalled()
  })

  it('geocodes moved region when map is editable', async () => {
    const handleChangeAddressMap = jest.fn()
    const { getByTestId } = renderWithProviders(
      <GoogleMap
        location={{ lat: 40.7128, lng: -74.006 }}
        handleChangeAddressMap={handleChangeAddressMap}
        readOnly={false}
      />
    )
    fireEvent(getByTestId('map-view'), 'regionChangeComplete', {
      latitude: 40.73,
      longitude: -74.02,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02
    })
    await act(async () => {
      await Promise.resolve()
    })
    expect(handleChangeAddressMap).toHaveBeenCalled()
  })

  it('shows max distance alert when region exceeds limit', () => {
    const { getByTestId } = renderWithProviders(
      <GoogleMap
        location={{ lat: 40.7128, lng: -74.006 }}
        maxLimitLocation={100}
        readOnly={false}
      />
    )
    fireEvent(getByTestId('map-view'), 'regionChangeComplete', {
      latitude: 41.2,
      longitude: -75.2,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02
    })
    expect(getByTestId('alert-content')).toBeTruthy()
  })

  it('supports custom zoom controls', () => {
    const { UNSAFE_getAllByType } = renderWithProviders(
      <GoogleMap
        location={{ lat: 40.7128, lng: -74.006 }}
        zoomCustom
        readOnly
      />
    )
    const { TouchableOpacity } = require('react-native')
    const buttons = UNSAFE_getAllByType(TouchableOpacity)
    fireEvent.press(buttons[0])
    fireEvent.press(buttons[1])
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it('fits camera after map ready when multiple markers exist', () => {
    const { getByTestId } = renderWithProviders(
      <GoogleMap
        location={{ lat: 40.7128, lng: -74.006 }}
        locations={[
          { id: 1, lat: 40.72, lng: -74.01, icon: 'a.png' },
          { id: 2, lat: 40.73, lng: -74.02, icon: 'b.png' }
        ]}
        readOnly
      />
    )
    act(() => {
      getByTestId('map-view').props.onMapReady?.()
      jest.advanceTimersByTime(1100)
    })
    expect(getByTestId('map-view')).toBeTruthy()
  })

  it('handles geocoder failures gracefully', async () => {
    ;(Geocoder.from as jest.Mock).mockRejectedValueOnce(new Error('Geocoder failed'))
    const { getByTestId } = renderWithProviders(
      <GoogleMap
        location={{ lat: 40.7128, lng: -74.006 }}
        readOnly={false}
      />
    )
    fireEvent(getByTestId('map-view'), 'regionChangeComplete', {
      latitude: 40.73,
      longitude: -74.02,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02
    })
    await act(async () => {
      await Promise.resolve()
    })
    expect(getByTestId('alert-content')).toBeTruthy()
  })
})
