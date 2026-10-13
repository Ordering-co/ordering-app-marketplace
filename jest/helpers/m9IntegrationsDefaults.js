const sampleAddress = {
  id: 1,
  address: '123 Main St',
  address_notes: 'Apt 4',
  zipcode: '10001',
  internal_number: '4B',
  default: true,
  tag: 'home',
  location: { lat: 40.7128, lng: -74.006 }
}

const secondAddress = {
  id: 2,
  address: '456 Oak Ave',
  address_notes: '',
  zipcode: '10002',
  internal_number: '',
  default: false,
  tag: 'office',
  location: { lat: 40.72, lng: -74.01 }
}

const buildSchedule = () => {
  const schedule = []
  for (let i = 0; i < 7; i++) {
    schedule.push({
      enabled: true,
      lapses: [{ open: { hour: 9, minute: 0 }, close: { hour: 17, minute: 0 } }]
    })
  }
  return schedule
}

const sampleProfessional = {
  id: 1,
  name: 'Alice',
  lastname: 'Smith',
  photo: 'https://cdn.test/alice.jpg',
  favorite: false,
  schedule: buildSchedule(),
  busy_times: []
}

const sampleGiftCard = {
  id: 1,
  status: 'pending',
  created_at: '2026-07-01T12:00:00Z',
  order_product: {
    name: '$25 Gift Card',
    price: 25,
    order_id: 10,
    images: 'https://cdn.test/gift.jpg'
  }
}

const sampleGiftProduct = {
  id: 1,
  name: '$25 Gift Card',
  price: 25
}

const mapBoxSuggest = {
  mapbox_id: 'mb-1',
  full_address: '123 Main St, New York, NY',
  name: '123 Main St'
}

module.exports = {
  sampleAddress,
  secondAddress,
  sampleProfessional,
  sampleGiftCard,
  sampleGiftProduct,
  mapBoxSuggest,

  addressDetailsDefaults: {
    navigation: { navigate: jest.fn() },
    businessCellphone: '555-0100',
    addressToShow: '123 Main St',
    isCartPending: false,
    googleMapsUrl: 'https://maps.test/static.png',
    apiKey: 'test-maps-key',
    uuid: 'cart-1'
  },

  addressListDefaults: {
    route: { params: {} },
    addressList: { loading: false, error: null, addresses: [sampleAddress, secondAddress] },
    isFromProfile: false,
    handleSetDefault: jest.fn(),
    handleDelete: jest.fn(),
    setAddressList: jest.fn(),
    isGoBack: false,
    isFromBusinesses: false,
    isFromProductsList: false,
    afterSignup: false,
    loadAddresses: jest.fn(),
    goToBack: jest.fn(),
    onNavigationRedirect: jest.fn()
  },

  addressFormDefaults: {
    navigation: { navigate: jest.fn() },
    updateChanges: jest.fn(),
    address: null,
    formState: { loading: false, changes: {}, result: { error: false } },
    isEditing: false,
    handleChangeInput: jest.fn(),
    addressState: { address: {}, loading: false },
    addressesList: [],
    saveAddress: jest.fn(),
    isGuestUser: false,
    isRequiredField: jest.fn(() => false),
    showField: jest.fn(() => true),
    isFromProductsList: false,
    hasAddressDefault: false,
    afterSignup: false,
    isFromCheckout: false,
    onNavigationRedirect: jest.fn(),
    getSuggestedResult: jest.fn(),
    mapBoxSuggests: [],
    retrieveSuggestResult: jest.fn()
  },

  addressMapBoxListDefaults: {
    mapBoxSuggests: [mapBoxSuggest],
    retrieveSuggestResult: jest.fn(),
    handleChangeAddressMapbox: jest.fn(),
    onBlurInput: jest.fn(),
    handleChangeInputAddress: jest.fn()
  },

  giftCardOrdersListDefaults: {
    onNavigationRedirect: jest.fn(),
    refreshOrders: false,
    setRefreshOrders: jest.fn()
  },

  giftCardUIDefaults: {
    navigation: { navigate: jest.fn() }
  },

  purchaseGiftCardDefaults: {
    productsListState: { loading: false, products: [sampleGiftProduct] },
    handleAccept: jest.fn()
  },

  redeemGiftCardDefaults: {
    actionState: { loading: false, error: null },
    redeemedGiftCard: null,
    handleApply: jest.fn(),
    onClose: jest.fn(),
    setRedeemedGiftCard: jest.fn()
  },

  sendGiftCardDefaults: {
    actionState: { loading: false, error: null },
    handleSendGiftCard: jest.fn()
  },

  singleGiftCardDefaults: {
    card: sampleGiftCard,
    isSkeleton: false,
    onNavigationRedirect: jest.fn()
  },

  verticalGiftCardOrdersLayoutDefaults: {
    giftCards: { loading: false, list: [sampleGiftCard] },
    paginationProps: { totalPages: 1, currentPage: 1 },
    loadMoreOrders: jest.fn(),
    title: 'Pending',
    setIsEmpty: jest.fn(),
    onNavigationRedirect: jest.fn(),
    defaultStatus: 'pending'
  },

  phoneInputNumberDefaults: {
    data: { error: '' },
    handleData: jest.fn(),
    defaultValue: '',
    defaultCode: 'US',
    isDisabled: false,
    isStartValidation: false
  },

  professionalFilterDefaults: {
    professionals: [sampleProfessional],
    professionalSelected: null,
    handleChangeProfessionalSelected: jest.fn(),
    handleUpdateProfessionals: jest.fn()
  },

  singleProfessionalCardDefaults: {
    professional: sampleProfessional,
    active: false,
    handleProfessionalClick: jest.fn(),
    handleFavoriteProfessional: jest.fn()
  },

  professionalProfileDefaults: {
    professional: sampleProfessional,
    handleChangeProfessionalSelected: jest.fn(),
    onClose: jest.fn()
  },

  serviceFormDefaults: {
    professionalSelected: sampleProfessional,
    productObject: {
      product: {
        id: 1,
        name: 'Haircut',
        price: 30,
        duration: 30,
        description: 'Standard haircut service',
        images: 'https://cdn.test/service.jpg'
      },
      loading: false,
      error: null
    },
    handleSave: jest.fn(),
    productCart: null,
    navigation: { navigate: jest.fn() },
    isSoldOut: false,
    maxProductQuantity: 10,
    onClose: jest.fn(),
    professionalListState: { professionals: [sampleProfessional], loading: false },
    isCartProduct: false,
    actionStatus: { loading: false, error: null },
    handleCreateGuestUser: jest.fn()
  },

  searchBarDefaults: {
    searchValue: '',
    placeholder: 'Search',
    onSearch: jest.fn(),
    onCancel: jest.fn(),
    lazyLoad: false,
    isCancelButtonShow: false,
    isCancelXButtonShow: false
  },

  citiesControlDefaults: {
    cities: [
      { id: 1, name: 'New York', enabled: true },
      { id: 2, name: 'Los Angeles', enabled: true }
    ],
    onClose: jest.fn(),
    handleChangeCity: jest.fn()
  },

  datePickerDefaults: {
    birthdate: '1990-01-15',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
    open: true
  }
}
