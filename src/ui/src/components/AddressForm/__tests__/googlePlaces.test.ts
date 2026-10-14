import {
  consumeLegacyFallback,
  fetchLegacyDetails,
  fetchLegacyPredictions,
  getPlacesApiMode,
  isPlacesApiNotEnabledError,
  newDetailsToLegacy,
  setPlacesApiMode,
  switchToLegacyPlacesApi,
} from '../googlePlaces'

const mockFetchJson = (json: any) => {
  const fetchMock = jest.fn().mockResolvedValue({ json: async () => json })
  ;(global as any).fetch = fetchMock
  return fetchMock
}

describe('googlePlaces', () => {
  afterEach(() => {
    setPlacesApiMode(null)
    consumeLegacyFallback()
  })

  it('switches to legacy mode and flags the pending fallback only once', () => {
    expect(consumeLegacyFallback()).toBe(false)
    switchToLegacyPlacesApi()
    expect(getPlacesApiMode()).toBe('legacy')
    expect(consumeLegacyFallback()).toBe(true)
    expect(consumeLegacyFallback()).toBe(false)
  })

  it('ignores repeated switches once legacy mode is active', () => {
    switchToLegacyPlacesApi()
    expect(consumeLegacyFallback()).toBe(true)
    switchToLegacyPlacesApi()
    expect(consumeLegacyFallback()).toBe(false)
  })

  it('detects Places API (New) not enabled errors', () => {
    expect(isPlacesApiNotEnabledError(new Error('Places API (New) has not been used in project 1 before or it is disabled.'))).toBe(true)
    expect(isPlacesApiNotEnabledError(new Error('PERMISSION_DENIED'))).toBe(true)
    expect(isPlacesApiNotEnabledError(new Error('Requests to this API places.googleapis.com method google.maps.places.v1.Places.AutocompletePlaces are blocked.'))).toBe(true)
    expect(isPlacesApiNotEnabledError(new Error('Network request failed'))).toBe(false)
    expect(isPlacesApiNotEnabledError(undefined)).toBe(false)
  })

  it('maps Places API (New) details to the legacy shape used by the form', () => {
    expect(newDetailsToLegacy({
      id: 'place-1',
      formattedAddress: '1 Main Rd, Cape Town, South Africa',
      addressComponents: [
        { longText: 'Cape Town', shortText: 'Cape Town', types: ['locality', 'political'] },
        { longText: 'South Africa', shortText: 'ZA', types: ['country', 'political'] },
      ],
      location: { latitude: -33.92, longitude: 18.42 },
    })).toEqual({
      place_id: 'place-1',
      formatted_address: '1 Main Rd, Cape Town, South Africa',
      address_components: [
        { long_name: 'Cape Town', short_name: 'Cape Town', types: ['locality', 'political'] },
        { long_name: 'South Africa', short_name: 'ZA', types: ['country', 'political'] },
      ],
      geometry: { location: { lat: -33.92, lng: 18.42 } },
    })
    expect(newDetailsToLegacy(undefined)).toBeNull()
  })

  it('requests legacy predictions with country restrictions and session token', async () => {
    const fetchMock = mockFetchJson({
      status: 'OK',
      predictions: [{
        place_id: 'p1',
        description: 'Av. Chapultepec 15, Guadalajara, Mexico',
        structured_formatting: { main_text: 'Av. Chapultepec 15', secondary_text: 'Guadalajara, Mexico' },
      }],
    })

    const predictions = await fetchLegacyPredictions({ text: 'Chapultepec', apiKey: 'key', regionCodes: ['MX'], sessionToken: 'token' })

    const url = fetchMock.mock.calls[0][0]
    expect(url).toContain('https://maps.googleapis.com/maps/api/place/autocomplete/json?')
    expect(url).toContain('input=Chapultepec')
    expect(url).toContain('components=country%3Amx')
    expect(url).toContain('sessiontoken=token')
    expect(predictions).toEqual([{
      placeId: 'p1',
      description: 'Av. Chapultepec 15, Guadalajara, Mexico',
      mainText: 'Av. Chapultepec 15',
      secondaryText: 'Guadalajara, Mexico',
    }])
  })

  it('returns an empty list for legacy ZERO_RESULTS and throws on REQUEST_DENIED', async () => {
    mockFetchJson({ status: 'ZERO_RESULTS', predictions: [] })
    await expect(fetchLegacyPredictions({ text: 'zzzz', apiKey: 'key' })).resolves.toEqual([])

    mockFetchJson({ status: 'REQUEST_DENIED', error_message: 'You are calling a legacy API, which is not enabled for your project.' })
    await expect(fetchLegacyPredictions({ text: 'cape', apiKey: 'key' })).rejects.toThrow('legacy API')
  })

  it('requests legacy details with the same fields the form used before', async () => {
    const fetchMock = mockFetchJson({ status: 'OK', result: { place_id: 'p1', formatted_address: 'Address' } })

    const details = await fetchLegacyDetails({ placeId: 'p1', apiKey: 'key', sessionToken: 'token' })

    const url = fetchMock.mock.calls[0][0]
    expect(url).toContain('https://maps.googleapis.com/maps/api/place/details/json?')
    expect(url).toContain('place_id=p1')
    expect(url).toContain(`fields=${encodeURIComponent('place_id,formatted_address,geometry/location,address_components')}`)
    expect(details).toEqual({ place_id: 'p1', formatted_address: 'Address' })
  })
})
