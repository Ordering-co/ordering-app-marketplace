import uuid from 'react-native-uuid';

export const PLACES_API_NEW = 'new';
export const PLACES_API_LEGACY = 'legacy';

export const NEW_PLACE_DETAILS_FIELDS = [
  'id',
  'formattedAddress',
  'addressComponents',
  'location',
];

const LEGACY_PLACES_URL = 'https://maps.googleapis.com/maps/api/place';

const LEGACY_DETAILS_FIELDS = [
  'place_id',
  'formatted_address',
  'geometry/location',
  'address_components',
].join(',');

const NOT_ENABLED_PATTERNS = [
  /has not been used/i,
  /is disabled/i,
  /not enabled/i,
  /are blocked/i,
  /API_KEY_SERVICE_BLOCKED/i,
  /PERMISSION_DENIED/i,
  /not authorized to use this API/i,
];

let placesApiMode: string | null = null;
let pendingLegacyFallback = false;

export const getPlacesApiMode = () => placesApiMode;

export const setPlacesApiMode = (mode: string | null) => {
  placesApiMode = mode;
};

export const switchToLegacyPlacesApi = () => {
  if (placesApiMode === PLACES_API_LEGACY) return;
  placesApiMode = PLACES_API_LEGACY;
  pendingLegacyFallback = true;
};

export const consumeLegacyFallback = () => {
  const pending = pendingLegacyFallback;
  pendingLegacyFallback = false;
  return pending;
};

export const isPlacesApiNotEnabledError = (error: any) => {
  const message = error?.message || `${error ?? ''}`;
  return NOT_ENABLED_PATTERNS.some(pattern => pattern.test(message));
};

export const createSessionToken = () => `${uuid.v4()}`;

export const newDetailsToLegacy = (details: any) => {
  if (!details) return null;
  return {
    place_id: details.id,
    formatted_address: details.formattedAddress,
    address_components: (details.addressComponents || []).map((component: any) => ({
      long_name: component.longText,
      short_name: component.shortText,
      types: component.types || [],
    })),
    geometry: {
      location: details.location
        ? { lat: details.location.latitude, lng: details.location.longitude }
        : undefined,
    },
  };
};

const toCountryComponents = (regionCodes?: string[]) => (regionCodes || [])
  .map(code => `${code}`.trim().toLowerCase())
  .filter(Boolean)
  .map(code => `country:${code}`)
  .join('|');

const assertLegacyStatus = (json: any) => {
  if (json?.status === 'OK' || json?.status === 'ZERO_RESULTS') return;
  throw new Error(json?.error_message || json?.status || 'Google Places request failed');
};

export const fetchLegacyPredictions = async ({
  text,
  apiKey,
  regionCodes,
  sessionToken,
}: {
  text: string;
  apiKey: string;
  regionCodes?: string[];
  sessionToken?: string;
}) => {
  const params = new URLSearchParams();
  params.append('input', text);
  params.append('key', apiKey);
  if (sessionToken) params.append('sessiontoken', sessionToken);
  const components = toCountryComponents(regionCodes);
  if (components) params.append('components', components);

  const response = await fetch(`${LEGACY_PLACES_URL}/autocomplete/json?${params.toString()}`);
  const json = await response.json();
  assertLegacyStatus(json);

  return (json?.predictions || []).map((prediction: any) => ({
    placeId: prediction.place_id,
    description: prediction.description,
    mainText: prediction.structured_formatting?.main_text ?? prediction.description,
    secondaryText: prediction.structured_formatting?.secondary_text ?? '',
  }));
};

export const fetchLegacyDetails = async ({
  placeId,
  apiKey,
  sessionToken,
}: {
  placeId: string;
  apiKey: string;
  sessionToken?: string;
}) => {
  const params = new URLSearchParams();
  params.append('place_id', placeId);
  params.append('key', apiKey);
  params.append('fields', LEGACY_DETAILS_FIELDS);
  if (sessionToken) params.append('sessiontoken', sessionToken);

  const response = await fetch(`${LEGACY_PLACES_URL}/details/json?${params.toString()}`);
  const json = await response.json();
  assertLegacyStatus(json);
  return json?.result ?? null;
};
