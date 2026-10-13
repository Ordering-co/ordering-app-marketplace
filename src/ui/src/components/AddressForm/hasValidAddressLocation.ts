function asRecord (value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null
}

function isFiniteCoordinate (value: unknown) {
  if (value === null || value === undefined || value === '') return false
  if (typeof value === 'boolean') return false
  return Number.isFinite(Number(value))
}

export function hasValidAddressLocation (location: unknown) {
  const record = asRecord(location)
  if (!record) return false
  return isFiniteCoordinate(record.lat) && isFiniteCoordinate(record.lng)
}

export function getAddressLocationSubmitAction ({
  address,
  location,
  isLocationRequired,
  useAlternativeMap
}: {
  address?: unknown
  location?: unknown
  isLocationRequired: boolean
  useAlternativeMap: boolean
}) {
  if (!address) return null
  if (hasValidAddressLocation(location)) return 'ok'
  if (asRecord(location) || useAlternativeMap || isLocationRequired) {
    return 'requireLocation'
  }
  return 'geocode'
}
