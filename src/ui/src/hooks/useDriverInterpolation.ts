import { useEffect, useRef } from 'react'
import { AnimatedRegion } from 'react-native-maps'
import { getDistance } from '../utils'

interface DriverPoint {
  lat: number
  lng: number
}

const NORMAL_DURATION = 15000
const TELEPORT_DURATION = 20000
const TELEPORT_THRESHOLD_METERS = 100
const SNAP_THRESHOLD_KM = 2.0

const isValidPoint = (loc: any): loc is DriverPoint =>
  loc != null && typeof loc.lat === 'number' && typeof loc.lng === 'number' && loc.lat !== 0 && loc.lng !== 0

export function useDriverInterpolation(
  rawLocation: DriverPoint | null,
  initialLocation?: DriverPoint | null,
): AnimatedRegion {
  const initial = isValidPoint(rawLocation) ? rawLocation : initialLocation
  const animatedCoordinate = useRef(
    new AnimatedRegion({
      latitude: initial?.lat ?? 0,
      longitude: initial?.lng ?? 0,
      latitudeDelta: 0,
      longitudeDelta: 0,
    })
  ).current

  const lastLocation = useRef<DriverPoint | null>(isValidPoint(initial) ? initial : null)
  const initialized = useRef(isValidPoint(initial))

  // Handle initialLocation becoming available after mount
  useEffect(() => {
    if (initialized.current) return
    if (!isValidPoint(initialLocation)) return

    initialized.current = true
    lastLocation.current = { lat: initialLocation.lat, lng: initialLocation.lng }
    animatedCoordinate.setValue({
      latitude: initialLocation.lat,
      longitude: initialLocation.lng,
      latitudeDelta: 0,
      longitudeDelta: 0,
    })
  }, [initialLocation?.lat, initialLocation?.lng])

  // Handle new rawLocation from socket
  useEffect(() => {
    if (!isValidPoint(rawLocation)) return

    // First valid location: snap immediately (no animation from 0,0)
    if (!initialized.current) {
      initialized.current = true
      lastLocation.current = { lat: rawLocation.lat, lng: rawLocation.lng }
      animatedCoordinate.setValue({
        latitude: rawLocation.lat,
        longitude: rawLocation.lng,
        latitudeDelta: 0,
        longitudeDelta: 0,
      })
      return
    }

    const current = lastLocation.current ?? rawLocation
    const distKm = getDistance(current.lat, current.lng, rawLocation.lat, rawLocation.lng)
    const distMeters = distKm * 1000

    lastLocation.current = { lat: rawLocation.lat, lng: rawLocation.lng }

    if (distKm > SNAP_THRESHOLD_KM) {
      animatedCoordinate.setValue({
        latitude: rawLocation.lat,
        longitude: rawLocation.lng,
        latitudeDelta: 0,
        longitudeDelta: 0,
      })
      return
    }

    const duration = distMeters > TELEPORT_THRESHOLD_METERS
      ? TELEPORT_DURATION
      : NORMAL_DURATION

    animatedCoordinate.timing({
      latitude: rawLocation.lat,
      longitude: rawLocation.lng,
      latitudeDelta: 0,
      longitudeDelta: 0,
      duration,
      toValue: 0,
      useNativeDriver: false,
    }).start()
  }, [rawLocation?.lat, rawLocation?.lng])

  return animatedCoordinate
}
