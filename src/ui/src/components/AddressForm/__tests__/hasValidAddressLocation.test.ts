import {
  getAddressLocationSubmitAction,
  hasValidAddressLocation
} from '../hasValidAddressLocation'

describe('hasValidAddressLocation', () => {
  it('accepts numeric lat and lng', () => {
    expect(hasValidAddressLocation({ lat: 40.71, lng: -74.0 })).toBe(true)
  })

  it('rejects missing or non-numeric coordinates', () => {
    expect(hasValidAddressLocation(undefined)).toBe(false)
    expect(hasValidAddressLocation(null)).toBe(false)
    expect(hasValidAddressLocation({ lat: undefined, lng: undefined })).toBe(false)
    expect(hasValidAddressLocation({ lat: 40.71 })).toBe(false)
    expect(hasValidAddressLocation({ lat: 'x', lng: -74 })).toBe(false)
    expect(hasValidAddressLocation({ lat: NaN, lng: 0 })).toBe(false)
    expect(hasValidAddressLocation({ lat: '', lng: '' })).toBe(false)
    expect(hasValidAddressLocation({ lat: null, lng: 0 })).toBe(false)
  })

  it('accepts the equator/prime-meridian origin', () => {
    expect(hasValidAddressLocation({ lat: 0, lng: 0 })).toBe(true)
  })
})

describe('getAddressLocationSubmitAction', () => {
  it('saves when coordinates are numeric', () => {
    expect(getAddressLocationSubmitAction({
      address: '123 Main St',
      location: { lat: 40.71, lng: -74 },
      isLocationRequired: false,
      useAlternativeMap: true
    })).toBe('ok')
  })

  it('blocks Mapbox when retrieve left undefined coordinates', () => {
    expect(getAddressLocationSubmitAction({
      address: '123 Main St',
      location: { lat: undefined, lng: undefined },
      isLocationRequired: false,
      useAlternativeMap: true
    })).toBe('requireLocation')
  })

  it('geocodes Google autocomplete when location is missing', () => {
    expect(getAddressLocationSubmitAction({
      address: '123 Main St',
      location: undefined,
      isLocationRequired: false,
      useAlternativeMap: false
    })).toBe('geocode')
  })

  it('blocks Google when a location is required and missing', () => {
    expect(getAddressLocationSubmitAction({
      address: '123 Main St',
      location: undefined,
      isLocationRequired: true,
      useAlternativeMap: false
    })).toBe('requireLocation')
  })

  it('skips the location gate when address was not changed', () => {
    expect(getAddressLocationSubmitAction({
      address: undefined,
      location: { lat: undefined, lng: undefined },
      isLocationRequired: false,
      useAlternativeMap: false
    })).toBeNull()
  })
})
