const noop = () => {}

const sampleBusiness = {
  id: 1,
  name: 'Pizza Place',
  slug: 'pizza-place',
  open: true,
  header: 'https://cdn.test/header.jpg',
  logo: 'https://cdn.test/logo.jpg',
  location: { lat: 40.7128, lng: -74.006 },
  distance: 1.2,
  delivery_price: 2.5,
  delivery_time: '30-40',
  pickup_time: '15-20',
  reviews: { total: 4.5, quality: 4.5 },
  favorite: false,
  featured: true,
  offers: [{ rate: 10, rate_type: 1 }],
  categories: [{ id: 10, name: 'Food', products: [{ id: 100, name: 'Slice', price: 5 }] }],
  address: '123 Main St',
  timezone: 'America/New_York',
  schedule: [],
  today: { enabled: false, lapses: [] },
  enabled: true
}

module.exports = {
  sampleBusiness,

  businessesListingShellDefaults: {
    navigation: { navigate: jest.fn() },
    isLogin: true
  },

  businessesListingUiDefaults: {
    navigation: { navigate: jest.fn() },
    businessesList: {
      loading: false,
      error: null,
      businesses: [sampleBusiness]
    },
    getBusinesses: jest.fn(),
    paginationProps: { currentPage: 1, totalPages: 2, nextPageItems: 3 },
    citiesState: { cities: [{ id: 1, name: 'NYC', enabled: true }] },
    logosLayout: false,
    handleBusinessClick: jest.fn(),
    handleUpdateBusinessList: jest.fn(),
    businessTypeSelected: null,
    handleChangeBusinessType: jest.fn(),
    isGuestUser: false,
    isOrderStateReady: true
  },

  businessListingSearchDefaults: {
    navigation: { navigate: jest.fn() },
    businessesSearchList: {
      loading: false,
      error: null,
      businesses: [sampleBusiness],
      products: []
    },
    onBusinessClick: jest.fn(),
    handleChangeTermValue: jest.fn(),
    termValue: 'pizza',
    handleSearchbusinessAndProducts: jest.fn(),
    handleChangeFilters: jest.fn(),
    filters: { business_types: [], orderBy: 'distance', franchise_ids: [], price_level: null },
    businessTypes: [],
    setFilters: jest.fn(),
    paginationProps: { currentPage: 1, totalPages: 1 },
    handleUpdateProducts: jest.fn(),
    shouldClearSearchTerm: false,
    setShouldClearSearchTerm: jest.fn()
  },

  businessSearchMapDefaults: {
    navigation: { navigate: jest.fn(), goBack: jest.fn() },
    businessesSearchList: {
      loading: false,
      error: null,
      businesses: [sampleBusiness]
    },
    onBusinessClick: jest.fn(),
    handleChangeTermValue: jest.fn(),
    termValue: '',
    handleSearchbusinessAndProducts: jest.fn(),
    handleChangeFilters: jest.fn(),
    filters: {
      business_types: [],
      orderBy: 'distance',
      franchise_ids: [],
      price_level: null,
      max_delivery_price: null,
      max_eta: null,
      max_distance: null
    },
    brandList: {
      loading: false,
      brands: [{ id: 1, name: 'Brand A', enabled: true }]
    },
    handleUpdateBusinessList: jest.fn(),
    paginationProps: { currentPage: 1, totalPages: 1 }
  },

  businessTypeFilterDefaults: {
    typesState: {
      loading: false,
      types: [
        { id: null, name: 'All' },
        { id: 1, name: 'Food' }
      ]
    },
    currentTypeSelected: null,
    handleChangeBusinessType: jest.fn(),
    setBusinessTypes: jest.fn(),
    isSearchMode: false,
    filters: { business_types: [] },
    handleChangeFilters: jest.fn(),
    businessTypes: [],
    defaultBusinessType: null
  },

  businessControllerUiDefaults: {
    business: sampleBusiness,
    isBusinessOpen: true,
    handleClick: jest.fn(),
    navigation: { navigate: jest.fn() },
    businessHeader: sampleBusiness.header,
    businessLogo: sampleBusiness.logo,
    businessReviews: sampleBusiness.reviews,
    businessDeliveryPrice: 2.5,
    businessDeliveryTime: '30-40',
    businessPickupTime: '15-20',
    businessDistance: 1.2,
    handleFavoriteBusiness: jest.fn(),
    getBusinessOffer: jest.fn(() => null),
    favoriteIds: [],
    setFavoriteIds: jest.fn(),
    handleUpdateBusinessList: jest.fn()
  },

  businessFeaturedDefaults: {
    business: sampleBusiness,
    isBusinessOpen: true,
    handleClick: jest.fn()
  },

  businessInformationDefaults: {
    businessState: { loading: false, business: sampleBusiness },
    businessSchedule: [{ day: 'Monday', open: '09:00', close: '22:00' }],
    businessLocation: sampleBusiness.location,
    business: sampleBusiness
  },

  businessBasicInformationDefaults: {
    navigation: { navigate: jest.fn() },
    businessState: { loading: false, business: sampleBusiness },
    isBusinessInfoShow: false,
    header: sampleBusiness.header,
    logo: sampleBusiness.logo,
    isPreOrder: false,
    currentCart: null,
    categoryState: { loading: false, categories: [] }
  },

  businessItemAccordionDefaults: {
    cart: {
      uuid: 'cart-1',
      status: 1,
      valid_schedule: true,
      products: [{ id: 1, name: 'Slice', price: 5, quantity: 1 }],
      subtotal: 5,
      minimum: 0,
      valid_address: true,
      business: sampleBusiness
    },
    moment: 'ASAP',
    handleClearProducts: jest.fn(),
    handleClickCheckout: jest.fn(),
    checkoutButtonDisabled: false,
    isMultiCheckout: false,
    changeActiveState: jest.fn(),
    isActive: true,
    isGiftCart: false,
    onNavigationRedirect: jest.fn(),
    handleChangeStore: jest.fn()
  },

  highestRatedDefaults: {
    navigation: { navigate: jest.fn() },
    businessesList: {
      loading: false,
      businesses: [sampleBusiness]
    },
    onBusinessClick: jest.fn(),
    isLoading: false,
    getBusinesses: jest.fn(),
    favoriteIds: [],
    setFavoriteIds: jest.fn(),
    handleUpdateBusinessList: jest.fn()
  },

  promotionsDefaults: {
    navigation: { navigate: jest.fn() },
    offersState: {
      loading: false,
      error: null,
      offers: [{
        id: 1,
        name: 'Summer Deal',
        rate: 10,
        rate_type: 1,
        end: '2026-12-31',
        businesses: [sampleBusiness]
      }]
    },
    handleSearchValue: jest.fn(),
    searchValue: '',
    loadOffers: jest.fn(),
    offerSelected: null,
    setOfferSelected: jest.fn(),
    refreshPromotions: false,
    setRefreshPromotions: jest.fn()
  },

  favoriteListDefaults: {
    navigation: { navigate: jest.fn() },
    favoriteList: {
      loading: false,
      favorites: [sampleBusiness],
      error: null
    },
    handleUpdateFavoriteList: jest.fn(),
    pagination: { currentPage: 1, totalPages: 1 },
    getFavoriteList: jest.fn(),
    onNavigationRedirect: jest.fn(),
    reorderState: { loading: false, error: null, result: null },
    handleReorder: jest.fn(),
    isBusiness: true,
    favoriteURL: 'favorite_businesses',
    originalURL: 'business',
    location: '40.7128,-74.006'
  },

  favoriteListProductDefaults: {
    navigation: { navigate: jest.fn() },
    favoriteList: {
      loading: false,
      favorites: [{
        id: 100,
        name: 'Slice',
        category: {
          id: 10,
          business: { id: 1, slug: 'pizza-place', header: 'header.jpg' }
        }
      }]
    },
    handleUpdateFavoriteList: jest.fn(),
    pagination: { currentPage: 1, totalPages: 1 },
    getFavoriteList: jest.fn(),
    onNavigationRedirect: jest.fn(),
    reorderState: { loading: false },
    handleReorder: jest.fn(),
    isProduct: true
  },

  favoriteListOrderDefaults: {
    navigation: { navigate: jest.fn() },
    favoriteList: {
      loading: false,
      favorites: [{
        id: 50,
        status: 1,
        business: sampleBusiness,
        products: [{ id: 1, name: 'Slice', valid: true }]
      }]
    },
    handleUpdateFavoriteList: jest.fn(),
    pagination: { currentPage: 1, totalPages: 1 },
    getFavoriteList: jest.fn(),
    onNavigationRedirect: jest.fn(),
    reorderState: { loading: false },
    handleReorder: jest.fn(),
    isOrder: true
  },

  businessSearchMapEmptyDefaults: {
    navigation: { navigate: jest.fn() },
    businessesSearchList: {
      loading: false,
      error: null,
      businesses: []
    },
    onBusinessClick: jest.fn(),
    handleChangeTermValue: jest.fn(),
    termValue: '',
    handleSearchbusinessAndProducts: jest.fn(),
    handleChangeFilters: jest.fn(),
    filters: { business_types: [], orderBy: 'distance' },
    handleUpdateBusinessList: jest.fn(),
    paginationProps: { currentPage: 1, totalPages: 1 }
  },

  googleMapDefaults: {
    location: { lat: 40.7128, lng: -74.006 },
    delta: { latitudeDelta: 0.02, longitudeDelta: 0.02 },
    locations: [sampleBusiness],
    readOnly: true,
    showsUserLocation: false
  },

  gpsButtonDefaults: {
    handleGPS: jest.fn(),
    apiKey: 'test-key',
    setAlertState: jest.fn(),
    isIntGeoCoder: true
  },

  maxSectionItemDefaults: {
    filters: { max_distance: 3000 },
    handleChangeFilters: jest.fn(),
    filter: 'max_distance',
    options: [1000, 3000, 5000, 'default'],
    title: 'Max distance'
  },

  businessControllerSkeletonsDefaults: {
    paginationProps: { nextPageItems: 2 }
  },

  businessHeaderPlaceholderDefaults: {
    name: 'Pizza Place',
    height: 200,
    optimizeImage: (url) => url
  }
}
