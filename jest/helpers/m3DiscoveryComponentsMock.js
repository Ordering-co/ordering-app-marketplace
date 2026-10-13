const React = require('react')

const renderUiController = (defaults = {}) => (props) => {
  const UI = props.UIComponent
  if (!UI) return null
  const { UIComponent, ...rest } = props
  return React.createElement(UI, { ...defaults, ...rest })
}

const renderPassthroughController = (defaults = {}) => (props) => {
  const UI = props.UIComponent
  if (!UI) return null
  const { UIComponent, ...rest } = props
  return React.createElement(UI, { ...defaults, ...rest })
}

module.exports = {
  renderUiController,
  getMock: (overrides = {}) => {
    const base = require('./mockOrdering')
    const m3 = require('./m3DiscoveryDefaults')
    const m2 = require('./m2ShellDefaults')

    const configState = {
      loading: false,
      configs: {
        filter_search_options: { value: 'price_range|brands|max_delivery_fee|max_delivery_time|max_distance|business_categories' },
        location_default_latitude: { value: '40.7128' },
        location_default_longitude: { value: '-74.0060' },
        format_number_currency: { value: '$' },
        distance_unit: { value: 'mi' },
        preorder_status_enabled: { value: '1' },
        max_days_preorder: { value: 6 },
        google_maps_api_key: { value: 'test-google-key' }
      }
    }

    return {
      ...base,
      BusinessList: renderUiController(m3.businessesListingUiDefaults),
      BusinessSearchList: renderUiController(m3.businessListingSearchDefaults),
      BusinessTypeFilter: renderUiController(m3.businessTypeFilterDefaults),
      BusinessController: renderPassthroughController(m3.businessControllerUiDefaults),
      BusinessInformation: renderUiController(m3.businessInformationDefaults),
      PromotionsController: renderUiController(m3.promotionsDefaults),
      FavoriteList: renderUiController(m3.favoriteListDefaults),
      useConfig: jest.fn(() => [configState]),
      useSession: jest.fn(() => [{ auth: true, user: { id: 1 }, token: 'token' }, {}]),
      useEvent: jest.fn(() => [{ emit: jest.fn() }]),
      useUtils: jest.fn(() => [{
        parsePrice: (v) => `$${v}`,
        parseDistance: (v) => `${v} mi`,
        parseNumber: (v) => v,
        parseDate: (v) => v,
        parseTime: (v) => v,
        optimizeImage: (url) => url,
        timeFormat: 'HH:mm',
        is12Hours: false,
        preorderDateFormat: 'MM/DD',
        getMaxPreorderDays: () => 7,
        isWalletEnabled: () => true
      }]),
      useOrder: jest.fn(() => [{
        loading: false,
        options: {
          type: 1,
          address: { location: { lat: 40.7128, lng: -74.006 } },
          city_id: null
        },
        carts: {}
      }, {
        changeCityFilter: jest.fn(),
        handleOrderStateLoading: jest.fn()
      }]),
      useToast: jest.fn(() => [, { showToast: jest.fn() }]),
      PageBanner: renderUiController(m2.pageBannerDefaults),
      ...overrides
    }
  }
}
