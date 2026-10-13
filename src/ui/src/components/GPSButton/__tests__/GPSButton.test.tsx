jest.mock('@/ui/src/components/shared', () => ({
  OText: require('@/ui/src/components/shared/OText').default
}))

import '../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'
import { fireEvent, act } from '@testing-library/react-native'
import Geolocation from '@react-native-community/geolocation'

import { GPSButton } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m3DiscoveryComponentsMock').getMock())

describe('GPSButton', () => {
  it('calls handleGPS after geolocation and geocoding', async () => {
    const handleGPS = jest.fn()
    const { getByText } = renderWithProviders(
      <GPSButton handleGPS={handleGPS} apiKey="key" isIntGeoCoder />
    )
    await act(async () => {
      fireEvent.press(getByText('GPS'))
    })
    expect(Geolocation.getCurrentPosition).toHaveBeenCalled()
    expect(handleGPS).toHaveBeenCalledWith(
      expect.objectContaining({ address: '123 Main St', zipcode: '10001' }),
      expect.any(Object)
    )
  })

  it('shows alert when permission is denied', async () => {
    const setAlertState = jest.fn()
    ;(Geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce((_ok, err) => {
      err({ code: 1, message: 'denied' })
    })
    const { getByText } = renderWithProviders(
      <GPSButton handleGPS={jest.fn()} setAlertState={setAlertState} isIntGeoCoder />
    )
    await act(async () => {
      fireEvent.press(getByText('GPS'))
    })
    expect(setAlertState).toHaveBeenCalledWith(
      expect.objectContaining({ open: true })
    )
  })
})

describe('GPSButton geocoding failures', () => {
  const Geocoder = require('react-native-geocoding')

  it('shows the geocoding error and its reason when the geocoder rejects', async () => {
    const setAlertState = jest.fn()
    Geocoder.from.mockImplementationOnce(() =>
      Promise.reject({
        code: 4,
        message: 'Error from the server while geocoding.',
        origin: {
          status: 'REQUEST_DENIED',
          error_message: 'API keys with referer restrictions cannot be used with this API.'
        }
      })
    )
    const { getByText } = renderWithProviders(
      <GPSButton handleGPS={jest.fn()} setAlertState={setAlertState} isIntGeoCoder />
    )
    await act(async () => {
      fireEvent.press(getByText('GPS'))
    })
    expect(setAlertState).toHaveBeenCalledWith({
      open: true,
      content: [
        'Error to get result with gps button',
        'API keys with referer restrictions cannot be used with this API.'
      ]
    })
  })

  it('shows the not-found error when the geocoder returns no results', async () => {
    const setAlertState = jest.fn()
    const handleGPS = jest.fn()
    Geocoder.from.mockImplementationOnce(() => Promise.resolve({ results: [] }))
    const { getByText } = renderWithProviders(
      <GPSButton handleGPS={handleGPS} setAlertState={setAlertState} isIntGeoCoder />
    )
    await act(async () => {
      fireEvent.press(getByText('GPS'))
    })
    expect(handleGPS).not.toHaveBeenCalled()
    expect(setAlertState).toHaveBeenCalledWith({
      open: true,
      content: ['Error, address not found']
    })
  })
})
