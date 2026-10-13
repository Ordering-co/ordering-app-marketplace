import React, { useState, useEffect, useRef, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react'
import { Dimensions, StyleSheet, View, TouchableOpacity } from 'react-native';
import MapView, { LatLng, PROVIDER_GOOGLE, Marker, Region, Polygon, Circle } from 'react-native-maps'
import Geocoder from 'react-native-geocoding';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import { useTheme } from 'styled-components/native';

import { useLanguage, useConfig } from '@components'
import { Alert } from '@ui';

import { GoogleMapsParams, GoogleMapHandle } from '../../types';
import { RenderMarker } from './RenderMarker';
import { AnimatedDriverMarker } from './AnimatedDriverMarker';
import { GoogleMapUtils } from './utils';

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

const DEFAULT_ZONE_FIT_PADDING = 48
const DEFAULT_MAX_ZOOM_AFTER_ZONE_FIT = 15
const ZONE_TYPES_RENDER = [1, 2, 5]
const LOCATION_COORD_EPSILON = 0.0000001
const FOCUS_LATITUDE_DELTA = 0.02

type BusinessZoneItem = Record<string, any>

const flattenBusinessZones = (zones?: BusinessZoneItem[] | unknown): BusinessZoneItem[] => {
  if (!Array.isArray(zones)) return []

  const result: BusinessZoneItem[] = []

  const walk = (items: unknown[]) => {
    for (const item of items) {
      if (item == null) continue
      if (Array.isArray(item)) {
        walk(item)
      } else {
        result.push(item as BusinessZoneItem)
      }
    }
  }

  walk(zones as unknown[])
  return result
}

const getBusinessZoneDedupeKey = (zone: BusinessZoneItem | null | undefined): string | null => {
  if (!zone || typeof zone !== 'object' || Array.isArray(zone)) return null
  const { type, id, data } = zone
  if (type === 2 && Array.isArray(data) && data.length > 0) {
    return `2:${data.map((p: any) => `${p?.lat ?? ''},${p?.lng ?? ''}`).join('|')}`
  }
  if (type === 1 && data?.center && data?.radio != null) {
    const c = data.center
    return `1:${c?.lat ?? ''},${c?.lng ?? ''}:${data.radio}`
  }
  if (type === 5 && data?.distance != null) {
    const unit = data?.unit || 'km'
    return `5:${data.distance}:${unit}`
  }
  return `${type ?? 'x'}:${id ?? ''}:${JSON.stringify(data)}`
}

const dedupeBusinessZones = (zones: BusinessZoneItem[]) => {
  const seen = new Set<string>()
  const out: BusinessZoneItem[] = []
  for (const z of zones) {
    const key = getBusinessZoneDedupeKey(z)
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(z)
  }
  return out
}

const shouldRenderDeliveryZone = (zone: unknown): zone is BusinessZoneItem => {
  if (!zone || typeof zone !== 'object' || Array.isArray(zone)) return false

  const z = zone as BusinessZoneItem
  const { id, type } = z
  const { data } = z

  if (id != null && id !== '') return true

  if (type === 1 && data?.center && data?.radio != null) return true
  if (type === 5 && data?.distance != null) return true

  return type === 2 && Array.isArray(data) && data.length > 0
}

const coordKey = (coordinate: LatLng) =>
  `${Math.round(coordinate.latitude / LOCATION_COORD_EPSILON)},${Math.round(coordinate.longitude / LOCATION_COORD_EPSILON)}`

const dedupeLatLngs = (coordinates: LatLng[]) => {
  const seen = new Set<string>()
  const out: LatLng[] = []

  for (const c of coordinates) {
    if (c.latitude == null || c.longitude == null || Number.isNaN(c.latitude) || Number.isNaN(c.longitude)) {
      continue
    }

    const k = coordKey(c)
    if (seen.has(k)) continue

    seen.add(k)
    out.push(c)
  }

  return out
}

const offsetLatLngByMeters = (latitude: number, longitude: number, northMeters: number, eastMeters: number): LatLng => {
  const latDelta = northMeters / 111320
  const cosLat = Math.max(Math.cos((latitude * Math.PI) / 180), 0.000001)
  const lngDelta = eastMeters / (111320 * cosLat)

  return { latitude: latitude + latDelta, longitude: longitude + lngDelta }
}

const collectZoneFitCoordinates = (
  zones: BusinessZoneItem[],
  businessCenter: { lat: number, lng: number },
  unitsMap: Record<string, number>
): LatLng[] => {
  const coords: LatLng[] = []

  for (const businessZone of zones) {
    if (!ZONE_TYPES_RENDER.includes(businessZone?.type)) continue

    if (businessZone?.type === 2 && Array.isArray(businessZone?.data)) {
      businessZone.data.forEach((vertex: any) => {
        if (vertex?.lat != null && vertex?.lng != null) {
          coords.push({ latitude: vertex.lat, longitude: vertex.lng })
        }
      })
      continue
    }

    if (businessZone.type === 1 && businessZone?.data?.center && businessZone?.data?.radio != null) {
      const { lat, lng } = businessZone.data.center
      const radiusMeters = businessZone.data.radio * 1000

      coords.push({ latitude: lat, longitude: lng })
      coords.push(offsetLatLngByMeters(lat, lng, radiusMeters, 0))
      coords.push(offsetLatLngByMeters(lat, lng, -radiusMeters, 0))
      coords.push(offsetLatLngByMeters(lat, lng, 0, radiusMeters))
      coords.push(offsetLatLngByMeters(lat, lng, 0, -radiusMeters))
      continue
    }

    if (businessZone.type === 5 && businessZone?.data?.distance != null) {
      const unit = businessZone?.data?.unit || 'km'
      const radiusMeters = businessZone.data.distance * (unitsMap[unit] ?? 1000)
      const { lat, lng } = businessCenter

      coords.push({ latitude: lat, longitude: lng })
      coords.push(offsetLatLngByMeters(lat, lng, radiusMeters, 0))
      coords.push(offsetLatLngByMeters(lat, lng, -radiusMeters, 0))
      coords.push(offsetLatLngByMeters(lat, lng, 0, radiusMeters))
      coords.push(offsetLatLngByMeters(lat, lng, 0, -radiusMeters))
    }
  }

  return coords
}

const getMinLatitudeDeltaForMaxZoom = (mapHeightPx: number, maxZoomLevel: number) =>
  (360 * mapHeightPx) / (256 * Math.pow(2, maxZoomLevel))

const clampRegionToMaxZoom = (
  incomingRegion: Region,
  mapHeightPx: number,
  maxZoomLevel: number,
  latitudeToLongitudeScale: number
): Region => {
  const minLatitudeDelta = getMinLatitudeDeltaForMaxZoom(mapHeightPx, maxZoomLevel)

  if (incomingRegion.latitudeDelta >= minLatitudeDelta) {
    return incomingRegion
  }

  return {
    latitude: incomingRegion.latitude,
    longitude: incomingRegion.longitude,
    latitudeDelta: minLatitudeDelta,
    longitudeDelta: minLatitudeDelta * latitudeToLongitudeScale
  }
}

export const GoogleMap = forwardRef<GoogleMapHandle, GoogleMapsParams>((props, ref) => {
  const {
    location,
    handleChangeAddressMap,
    maxLimitLocation,
    readOnly,
    markerTitle,
    saveLocation,
    setSaveLocation,
    handleToggleMap,
    locations,
    isIntGeoCoder,
    businessZones,
    delta,
    autoCompleteAddress,
    setAutoCompleteAddress,
    manualZoom,
    animateToRegion = true,
    useAllMapHeight,
    zoomCustom,
    handleBusinessClick,
    driverAnimatedCoordinate,
    maxZoomAfterZoneFit,
    zoneFitPadding,
    showsUserLocation,
    selectedBusinessId,
    onMarkerSelect,
    onRegionChange
  } = props

  const { calculateDistance, aproxEqual, units, fillStyles } = GoogleMapUtils();
  const unitsMap = useMemo(() => units as Record<string, number>, [units])

  const theme = useTheme()
  const [, t] = useLanguage()
  const [configState] = useConfig()
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const [markerPosition, setMarkerPosition] = useState({ latitude: locations ? locations[0]?.lat : location.lat, longitude: locations ? locations[0]?.lng : location.lng })
  const [region, setRegion] = useState({
    latitude: location.lat,
    longitude: location.lng,
    latitudeDelta: delta ?? 0.0010,
    longitudeDelta: (delta ?? 0.0010) * ASPECT_RATIO
  })
  const [MARKERS, SETMARKERS] = useState(locations)
  const [markerImageLoaded, setMarkerImageLoaded] = useState(0)
  const [imagesToLoadLength, setImagesToLoadLength] = useState(0)

  const mapRef = useRef<MapView | null>(null)
  const lastRegionRef = useRef<Region | null>(null)
  const userLocationRef = useRef<LatLng | null>(null)
  const clampScheduledTokenRef = useRef(0)
  const [mapReady, setMapReady] = useState(false)

  const googleMapsApiKey = configState?.configs?.google_maps_api_key?.value

  const center = { lat: location?.lat, lng: location?.lng }
  const [alertState, setAlertState] = useState<{ open: boolean, content: Array<string>, key?: string | null }>({ open: false, content: [], key: null })
  const mapErrors: any = {
    ERROR_NOT_FOUND_ADDRESS: 'Sorry, we couldn\'t find an address',
    ERROR_MAX_LIMIT_LOCATION: `Sorry, You can only set the position to ${maxLimitLocation}m`
  }

  const normalizedBusinessZones = useMemo(() => {
    const flattened = flattenBusinessZones(businessZones as BusinessZoneItem[] | unknown)
    const deduped = dedupeBusinessZones(flattened)

    return deduped.filter((z) => ZONE_TYPES_RENDER.includes(z?.type)).filter((z) => shouldRenderDeliveryZone(z))
  }, [businessZones])

  const zoneFitEdgePadding = useMemo(() => {
    const fitPadding = zoneFitPadding ?? DEFAULT_ZONE_FIT_PADDING
    return { top: fitPadding, right: fitPadding, bottom: fitPadding, left: fitPadding }
  }, [zoneFitPadding])

  const zoneMaxZoom = maxZoomAfterZoneFit ?? DEFAULT_MAX_ZOOM_AFTER_ZONE_FIT

  const scheduleClampAfterFit = useCallback(() => {
    clampScheduledTokenRef.current += 1
    const token = clampScheduledTokenRef.current

    setTimeout(() => {
      if (clampScheduledTokenRef.current !== token || !lastRegionRef.current || !mapRef.current) return

      const clamped = clampRegionToMaxZoom(
        lastRegionRef.current,
        height,
        zoneMaxZoom,
        ASPECT_RATIO
      )

      const previous = lastRegionRef.current

      const needsAnimate =
        Math.abs(clamped.latitudeDelta - previous.latitudeDelta) > 1e-8 ||
        Math.abs(clamped.longitudeDelta - previous.longitudeDelta) > 1e-8

      if (!needsAnimate) return

      mapRef.current.animateToRegion(clamped, 320)
      lastRegionRef.current = clamped
    }, 460)
  }, [height, ASPECT_RATIO, zoneMaxZoom])

  const buildMergedFitCoordinates = useCallback((): LatLng[] => {
    const coords: LatLng[] = []

    if (center.lat != null && center.lng != null && Number.isFinite(center.lat) && Number.isFinite(center.lng)) {
      coords.push({ latitude: center.lat, longitude: center.lng })
    }

    if (normalizedBusinessZones.length > 0) {
      coords.push(...collectZoneFitCoordinates(normalizedBusinessZones, center, unitsMap))
    }

    const markerSource = MARKERS ?? locations

    if (Array.isArray(markerSource) && markerSource.length > 0) {
      markerSource.forEach((marker: any) => {
        if (marker?.lat != null && marker?.lng != null && Number.isFinite(marker.lat) && Number.isFinite(marker.lng)) {
          coords.push({ latitude: marker.lat, longitude: marker.lng })
        }
      })
    }

    return dedupeLatLngs(coords)
  }, [normalizedBusinessZones, MARKERS, locations, center.lat, center.lng, unitsMap])

  const fitMapCameraToMergedContent = useCallback(() => {
    if (!mapReady || manualZoom || !mapRef.current) return

    const merged = buildMergedFitCoordinates()

    const hasRenderableZonesOrMarkers =
      normalizedBusinessZones.length > 0 ||
      !!(MARKERS ?? locations)?.length

    if (!hasRenderableZonesOrMarkers) return

    if (merged.length === 0) return

    if (merged.length === 1) return

    mapRef.current.fitToCoordinates(merged, {
      edgePadding: zoneFitEdgePadding,
      animated: true,
    })

    scheduleClampAfterFit()
  }, [
    manualZoom,
    mapReady,
    buildMergedFitCoordinates,
    normalizedBusinessZones.length,
    MARKERS,
    locations,
    scheduleClampAfterFit,
    zoneFitEdgePadding
  ])

  const styles = StyleSheet.create({
    map: {
      ...StyleSheet.absoluteFillObject,
      ...(useAllMapHeight && { height: deviceHeight }),
    },
    zoomControls: {
      top: deviceHeight - 150,
      left: deviceWidth / 2 - 40,
      flexDirection: 'column',
      alignItems: 'center',
    },
    zoomButton: {
      backgroundColor: 'white',
      width: 40,
      height: 40,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 2,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  })

  const geocodePosition = (pos: { latitude: number, longitude: number }, isMovingRegion?: boolean) => {
    Geocoder.from({
      latitude: pos.latitude,
      longitude: pos.longitude
    }).then(({ results }) => {
      let zipcode = null
      if (results && results.length > 0) {
        for (const component of results[0].address_components) {
          const addressType = component.types[0]
          if (addressType === 'postal_code') {
            zipcode = component.short_name
            break
          }
        }
        const address = {
          address: results[0]?.formatted_address,
          location: results[0]?.geometry?.location,
          zipcode,
          place_id: results[0]?.place_id,
        }
        const details = {
          geometry: { location: { lat: pos.latitude, lng: pos.longitude } },
          address_components: results[0]?.address_components,
        }
        handleChangeAddressMap && handleChangeAddressMap(address, details)
        setSaveLocation && setSaveLocation(false)
        if (!isMovingRegion) {
          handleToggleMap && handleToggleMap()
        }
      } else {
        setMapErrors && setMapErrors('ERROR_NOT_FOUND_ADDRESS')
      }
    }).catch(err => {
      setMapErrors && setMapErrors(err.message)
    })
  }

  const validateResult = (curPos: any) => {
    const loc1 = center
    const loc2 = curPos
    const distance = calculateDistance(loc1, loc2)

    if (!maxLimitLocation) {
      geocodePosition(curPos)
      setMarkerPosition(curPos)
      if (!autoCompleteAddress) {
        setRegion({ longitude: curPos?.longitude || 0, latitude: curPos?.latitude || 0, latitudeDelta: curPos?.latitudeDelta || 0.0010, longitudeDelta: curPos?.longitudeDelta || (delta ?? 0.0010) * ASPECT_RATIO })
      } else {
        setRegion({ longitude: curPos?.longitude, latitude: curPos?.latitude, latitudeDelta: delta ?? 0.0010, longitudeDelta: (delta ?? 0.0010) * ASPECT_RATIO })
      }
      return
    }

    const _maxLimitLocation = typeof maxLimitLocation === 'string' ? parseInt(maxLimitLocation, 10) : maxLimitLocation

    if (distance <= _maxLimitLocation) {
      if (!aproxEqual(curPos?.latitude, center.lat) || !aproxEqual(curPos?.longitude, center.lng)) {
        geocodePosition(curPos, true)
      }
      setMarkerPosition(curPos)
      if (!autoCompleteAddress) {
        setRegion({ longitude: curPos?.longitude || 0, latitude: curPos?.latitude || 0, latitudeDelta: curPos?.latitudeDelta || 0.0010, longitudeDelta: curPos?.longitudeDelta || (delta ?? 0.0010) * ASPECT_RATIO })
      } else {
        setRegion({ longitude: curPos?.longitude, latitude: curPos?.latitude, latitudeDelta: delta ?? 0.0010, longitudeDelta: (delta ?? 0.0010) * ASPECT_RATIO })
      }
    } else {
      setMapErrors && setMapErrors('ERROR_MAX_LIMIT_LOCATION')
      setMarkerPosition({ latitude: center.lat, longitude: center.lng })
    }
  }

  const handleChangeRegion = (coordinates: Region) => {
    validateResult(coordinates)
  }

  const handleTrackRegionComplete = (coordinates: Region) => {
    lastRegionRef.current = coordinates
    onRegionChange?.({ latitude: coordinates.latitude, longitude: coordinates.longitude })

    if (readOnly) return

    handleChangeRegion(coordinates)
  }

  const closeAlert = () => {
    setAlertState({
      open: false,
      content: []
    })
  }

  const setMapErrors = (errKey: string) => {
    setAlertState({
      open: true,
      content: !(errKey === 'ERROR_MAX_LIMIT_LOCATION')
        ? [t(errKey, mapErrors[errKey])]
        : [`${t(errKey, mapErrors[errKey])} ${maxLimitLocation} ${t('METTERS', 'meters')}`],
      key: errKey
    })
  }

  const handleZoomIn = () => {
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta * 0.5,
      longitudeDelta: region.longitudeDelta * 0.5,
    }
    setRegion(newRegion)
    mapRef.current?.animateToRegion(newRegion, 300)
  }

  const handleZoomOut = () => {
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    }
    setRegion(newRegion)
    mapRef.current?.animateToRegion(newRegion, 300)
  }

  useEffect(() => {
    if (isIntGeoCoder) return
    Geocoder.init(googleMapsApiKey as string)
  }, [googleMapsApiKey, isIntGeoCoder])

  useEffect(() => {
    if (!animateToRegion || !mapRef.current) return

    const regionConfig = {
      latitude: location?.lat,
      longitude: location?.lng,
      latitudeDelta: region?.latitudeDelta ?? delta ?? 0.0010,
      longitudeDelta: region?.longitudeDelta ?? (delta ?? 0.0010) * ASPECT_RATIO
    }

    const shouldDeferCenterOnlyAnimation = readOnly && normalizedBusinessZones.length > 0

    if (!shouldDeferCenterOnlyAnimation) {
      mapRef.current.animateToRegion(
        autoCompleteAddress ? regionConfig : { ...region, ...regionConfig }
      )
    }

    if (autoCompleteAddress) {
      setAutoCompleteAddress && setAutoCompleteAddress(false)
    }
  }, [location])

  useEffect(() => {
    if (saveLocation) {
      geocodePosition(markerPosition)
    }
  }, [saveLocation])

  useEffect(() => {
    if (locations) {
      SETMARKERS(locations)
    }
  }, [locations])

  useEffect(() => {
    const intervalMs = setInterval(() => {
      const hasLocations = !!(MARKERS ?? locations)?.length

      if (mapReady && mapRef.current && !manualZoom && hasLocations) {
        fitMapCameraToMergedContent()
      }
    }, 1000)

    if ((locations?.length ?? 0) > 0 && mapReady && !manualZoom) {
      fitMapCameraToMergedContent()
    }

    return () => clearInterval(intervalMs)
  }, [locations, MARKERS, mapReady, manualZoom, normalizedBusinessZones, fitMapCameraToMergedContent])

  useEffect(() => {
    const hasLocationMarkers = !!(locations?.length)

    if (!mapReady || manualZoom || !normalizedBusinessZones.length || hasLocationMarkers) return

    fitMapCameraToMergedContent()

    requestAnimationFrame(() => {
      fitMapCameraToMergedContent()
    })

  }, [
    normalizedBusinessZones,
    manualZoom,
    mapReady,
    locations?.length,
    center.lat,
    center.lng,
    fitMapCameraToMergedContent
  ])

  useEffect(() => {
    if (markerImageLoaded !== imagesToLoadLength) return
    if (!mapReady || manualZoom) return
    fitMapCameraToMergedContent()
  }, [markerImageLoaded, imagesToLoadLength, mapReady, manualZoom, fitMapCameraToMergedContent])

  useEffect(() => {
    const count = Array.isArray(MARKERS) ? MARKERS.filter(marker => marker?.icon).length : 0;
    setImagesToLoadLength(count);
  }, [MARKERS]);

  const getMarkerSource = useCallback((icon: string | number) => {
    return typeof icon === 'number'
      ? icon
      : { uri: icon, priority: FastImage.priority.low }
  }, [])

  const handleMarkerImageLoad = useCallback(() => {
    setMarkerImageLoaded(prev => prev + 1)
  }, [])

  const handleMarkerPress = useCallback((marker: any) => {
    handleBusinessClick && handleBusinessClick(marker)
  }, [handleBusinessClick])

  const handleMarkerSelect = useCallback((marker: any) => {
    onMarkerSelect && onMarkerSelect(marker)
  }, [onMarkerSelect])

  const handleUserLocationChange = useCallback((event: any) => {
    const coordinate = event?.nativeEvent?.coordinate
    if (coordinate?.latitude != null && coordinate?.longitude != null) {
      userLocationRef.current = { latitude: coordinate.latitude, longitude: coordinate.longitude }
    }
  }, [])

  useImperativeHandle(ref, () => ({
    recenterToUserLocation: () => {
      const target = userLocationRef.current ?? { latitude: location.lat, longitude: location.lng }
      const latitudeDelta = lastRegionRef.current?.latitudeDelta ?? delta ?? FOCUS_LATITUDE_DELTA
      mapRef.current?.animateToRegion({
        latitude: target.latitude,
        longitude: target.longitude,
        latitudeDelta,
        longitudeDelta: latitudeDelta * ASPECT_RATIO
      }, 500)
    },
    focusOnCoordinate: (lat: number, lng: number) => {
      mapRef.current?.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: FOCUS_LATITUDE_DELTA,
        longitudeDelta: FOCUS_LATITUDE_DELTA * ASPECT_RATIO
      }, 500)
    }
  }), [location.lat, location.lng, delta, ASPECT_RATIO])

  return (
    <>
      <MapView
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        style={styles.map}
        onRegionChangeComplete={handleTrackRegionComplete}
        zoomTapEnabled
        zoomEnabled
        zoomControlEnabled={!zoomCustom}
        moveOnMarkerPress
        showsUserLocation={showsUserLocation}
        showsMyLocationButton={false}
        onUserLocationChange={showsUserLocation ? handleUserLocationChange : undefined}
        ref={mapRef}
        onMapReady={() => {
          setMapReady(true)
          requestAnimationFrame(() => fitMapCameraToMergedContent())
        }}
      >
        {locations ? (
          <>
            {driverAnimatedCoordinate && MARKERS && MARKERS[0] && (
              <AnimatedDriverMarker
                coordinate={driverAnimatedCoordinate}
                icon={MARKERS[0].icon}
                title={MARKERS[0].title}
                onImageLoad={handleMarkerImageLoad}
                tracksViewChanges={markerImageLoaded < imagesToLoadLength}
              />
            )}
            {MARKERS && (driverAnimatedCoordinate ? MARKERS.slice(1) : MARKERS).map((marker: { id?: number | string, lat: number, lng: number, title: string, icon: string, markerPopup: any }, i: number) => (
              <RenderMarker
                key={`marker-${marker.lat}-${marker.lng}-${marker.title || i}`}
                marker={marker}
                i={driverAnimatedCoordinate ? i + 1 : i}
                markerImageLoaded={markerImageLoaded}
                visibleMarkersLength={MARKERS.length}
                selected={selectedBusinessId != null && marker.id === selectedBusinessId}
                getMarkerSource={getMarkerSource}
                handleMarkerImageLoad={handleMarkerImageLoad}
                handleMarkerPress={handleMarkerPress}
                handleMarkerSelect={handleMarkerSelect}
              />
            ))}
          </>
        ) : (
          <Marker
            coordinate={markerPosition}
            title={markerTitle || t('YOUR_LOCATION', 'Your Location')}
            pinColor={theme.colors.active}
          />
        )}
        {normalizedBusinessZones.length > 0 && normalizedBusinessZones.map((businessZone, zoneIndex: number) => (
          <React.Fragment key={`${getBusinessZoneDedupeKey(businessZone) ?? zoneIndex}`}>
            {businessZone?.type === 2 && Array.isArray(businessZone?.data) && (
              <Polygon
                zIndex={zoneIndex}
                coordinates={businessZone?.data.map((item: any) => ({ latitude: item.lat, longitude: item.lng }))}
                fillColor={fillStyles.fillColor}
                strokeColor={fillStyles.strokeColor}
                strokeWidth={fillStyles.strokeWidth}
              />
            )}
            {(businessZone.type === 1 && businessZone?.data?.center && businessZone?.data?.radio != null) && (
              <Circle
                zIndex={zoneIndex + 300}
                center={{ latitude: businessZone?.data?.center.lat, longitude: businessZone?.data?.center.lng }}
                radius={businessZone?.data.radio * 1000}
                fillColor={fillStyles.fillColor}
                strokeColor={fillStyles.strokeColor}
                strokeWidth={fillStyles.strokeWidth}
              />
            )}
            {(businessZone.type === 5 && businessZone?.data?.distance) && (
              <Circle
                zIndex={zoneIndex + 500}
                center={{ latitude: center.lat, longitude: center.lng }}
                radius={businessZone.data.distance * (units[businessZone?.data?.unit ?? 'km'] ?? units.km)}
                fillColor={fillStyles.fillColor}
                strokeColor={fillStyles.strokeColor}
                strokeWidth={fillStyles.strokeWidth}
              />
            )}
          </React.Fragment>
        ))}
      </MapView >

      {zoomCustom && (
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
            <Icon name="plus" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
            <Icon name="minus" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      )}

      <Alert
        open={alertState.open}
        onAccept={closeAlert}
        onClose={closeAlert}
        content={alertState.content}
        title={t('ERROR', 'Error')}
      />
    </>
  )
})

GoogleMap.displayName = 'GoogleMap'
