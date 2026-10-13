import React, { useEffect, useState } from 'react'
import Geocoder from 'react-native-geocoding'
import { ActivityIndicator } from 'react-native-paper'
import Geolocation from '@react-native-community/geolocation'

import { OText } from '../shared'
import { GpsButtonStyle } from './styles'

import { useLanguage } from '@components'

export const GPSButton = (props: any) => {
  const {
    handleGPS,
    apiKey,
    IconButton,
    IconLoadingButton,
    isIntGeoCoder,
    setAlertState
  } = props

  const [, t] = useLanguage()
  const [isLoading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const geoCodePosition = (pos: { latitude: number, longitude: number }) => {
    Geocoder.from({
      latitude: pos.latitude,
      longitude: pos.longitude
    }).then(({ results }: any) => {
      let zipcode = null
      if (results && results.length > 0) {
        for (const component of results[0].address_components) {
          const addressType = component.types[0]
          if (addressType === 'postal_code') {
            zipcode = component.short_name
            break
          }
        }
        let data: any
        const details = {
          geometry: { location: { lat: pos.latitude, lng: pos.longitude } },
          address_components: results[0]?.address_components
        }
        // if (isSetInputs) {
        data = {
          address: results[0]?.formatted_address,
          location: results[0]?.geometry?.location,
          zipcode,
          place_id: results[0]?.place_id,
        }
        // }
        handleGPS && handleGPS(data, details)
      } else {
        setAlertState && setAlertState({
          open: true,
          content: [t('ERROR_NOT_FOUND_ADDRESS', 'Error, address not found')],
        })
      }
      setLoading(() => false);
    }).catch((err: any) => {
      const reason = err?.origin?.error_message || err?.origin?.status || err?.message
      setAlertState && setAlertState({
        open: true,
        content: [
          t('ERROR_GPS_BUTTON', 'Error to get result with gps button'),
          ...(reason ? [reason] : []),
        ],
      })
      setLoading(() => false);
    })
  }

  const getCurrentPosition = async () => {
    try {
      if (disabled) {
        setAlertState && setAlertState({
          open: true,
          content: [t('LOCATION_NOT_GRANTED', 'Location permission was not granted.')],
        })
        return
      }
      setLoading(() => true)
      Geolocation.getCurrentPosition((pos) => {
        geoCodePosition(pos.coords)
      }, (err) => {
        if (err.code === 1) {
          setDisabled(() => true)
        }
        setLoading(() => false);
        setAlertState && setAlertState({
          open: true,
          content: err.code === 1 ? [t('LOCATION_NOT_GRANTED', 'Location permission was not granted.')] : [err.message],
        })
      }, {
        enableHighAccuracy: false, timeout: 15000, maximumAge: 1000
      })
    } catch (error: any) {
      setLoading(() => false);
      setAlertState && setAlertState({
        open: true,
        content: [error.message],
      })
    }
  }

  useEffect(() => {
    if (isIntGeoCoder) return
    Geocoder.init(apiKey);
  }, [isIntGeoCoder])

  return (
    <GpsButtonStyle
      disabled={isLoading}
      onPress={getCurrentPosition}
    >
      {isLoading ? (
        IconLoadingButton ? IconLoadingButton : <ActivityIndicator size={'small'} />
      ) : (
        IconButton ? IconButton : <OText>{'GPS'}</OText>
      )}
    </GpsButtonStyle>
  )
}
