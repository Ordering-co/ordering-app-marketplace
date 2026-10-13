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
  address: '123 Main St',
  timezone: 'America/New_York',
  schedule: Array.from({ length: 7 }, () => ({
    enabled: true,
    lapses: [{ open: { hour: 9, minute: 0 }, close: { hour: 22, minute: 0 } }]
  })),
  categories: [
    {
      id: 10,
      name: 'Pizzas',
      rank: 1,
      description: 'Fresh pizzas',
      image: 'https://cdn.test/cat.jpg',
      subcategories: [{ id: 11, name: 'Classic', parent_category_id: 10 }],
      products: []
    }
  ],
  professionals: [],
  vertical: null,
  enabled: true
}

const sampleProduct = {
  id: 100,
  name: 'Cheese Slice',
  price: 5,
  description: 'A tasty slice',
  images: 'https://cdn.test/slice.jpg',
  favorite: false,
  enabled: true,
  inventoried: false,
  quantity: 10,
  ingredients: [],
  extras: [],
  tags: [],
  category_id: 10,
  category: { id: 10, name: 'Pizzas' }
}

const sampleCartProduct = {
  id: 100,
  code: 'prod-1',
  name: 'Cheese Slice',
  price: 5,
  quantity: 1,
  total: 5,
  balance: 5,
  ingredients: [],
  options: [],
  comment: '',
  category_id: 10,
  valid: true,
  allergens: ['dairy'],
  dietary_tags: ['vegetarian']
}

const sampleCart = {
  uuid: 'cart-1',
  status: 1,
  valid: true,
  valid_products: true,
  valid_schedule: true,
  valid_address: true,
  business_id: 1,
  business: sampleBusiness,
  products: [sampleCartProduct],
  subtotal: 5,
  total: 7.5,
  discount: 0,
  delivery_price: 2.5,
  delivery_price_with_discount: 2.5,
  minimum: 0,
  coupon: null,
  offers: [],
  taxes: [],
  fees: [],
  driver_tip: 0,
  delivery_type: 1,
  reserved: false,
  reservation: null,
  student_id: null,
  student: null
}

module.exports = {
  sampleBusiness,
  sampleProduct,
  sampleCartProduct,
  sampleCart,

  businessMenuListDefaults: {
    businessMenuList: {
      loading: false,
      menus: [{ id: 1, name: 'Lunch Menu' }, { id: 2, name: 'Dinner Menu' }]
    },
    setMenu: jest.fn()
  },

  businessProductsListDefaults: {
    errors: null,
    businessId: 1,
    category: { id: null, name: 'All' },
    categories: sampleBusiness.categories,
    categoryState: {
      loading: false,
      error: null,
      pagination: { currentPage: 1, totalPages: 1 },
      products: [sampleProduct]
    },
    onProductClick: jest.fn(),
    featured: true,
    searchValue: '',
    isBusinessLoading: false,
    handleSearchRedirect: jest.fn(),
    handleClearSearch: jest.fn(),
    errorQuantityProducts: false,
    handleCancelSearch: jest.fn(),
    categoriesLayout: {},
    setCategoriesLayout: jest.fn(),
    currentCart: sampleCart,
    setSubcategoriesSelected: jest.fn(),
    subcategoriesSelected: [],
    onClickCategory: jest.fn(),
    lazyLoadProductsRecommended: false,
    handleUpdateProducts: jest.fn(),
    previouslyProducts: [],
    isFiltMode: false,
    navigation: { navigate: jest.fn() },
    businessSingleId: null
  },

  subcategoriesDefaults: {
    subcategoriesSelected: [],
    category: sampleBusiness.categories[0],
    onClickSubcategory: jest.fn()
  },

  businessProductsListingDefaults: {
    navigation: { navigate: jest.fn(), goBack: jest.fn(), canGoBack: jest.fn(() => true) },
    errors: null,
    businessState: {
      loading: false,
      error: null,
      business: sampleBusiness
    },
    categoryState: {
      loading: false,
      error: null,
      pagination: { currentPage: 1, totalPages: 1 },
      products: [sampleProduct]
    },
    handleChangeSearch: jest.fn(),
    categorySelected: { id: null, name: 'All' },
    searchValue: '',
    handleChangeCategory: jest.fn(),
    handleSearchRedirect: jest.fn(),
    featuredProducts: true,
    errorQuantityProducts: false,
    header: sampleBusiness.header,
    logo: sampleBusiness.logo,
    alertState: { open: false, content: [] },
    setAlertState: jest.fn(),
    multiRemoveProducts: jest.fn(),
    getNextProducts: jest.fn(),
    handleUpdateProducts: jest.fn(),
    professionalSelected: null,
    handleUpdateProfessionals: jest.fn(),
    handleChangeProfessionalSelected: jest.fn(),
    onBusinessClick: jest.fn(),
    businessSingleId: null,
    productModal: { open: false, product: null }
  },

  businessProductsCategoriesDefaults: {
    categories: [
      { id: null, name: 'All' },
      ...sampleBusiness.categories
    ],
    loading: false,
    scrollViewRef: { current: { scrollTo: jest.fn() } },
    productListLayout: { y: 100 },
    categoriesLayout: { cat_10: { y: 200 } },
    selectedCategoryId: 'cat_null',
    handlerClickCategory: jest.fn(),
    lazyLoadProductsRecommended: false,
    setCategoryClicked: jest.fn(),
    setSelectedCategoryId: jest.fn()
  },

  businessCartDefaults: {
    business: sampleBusiness,
    isLoading: false,
    isDisabled: false,
    isSkeleton: false,
    handleCartStoreClick: jest.fn()
  },

  businessPreorderDefaults: {
    goToBack: jest.fn(),
    business: sampleBusiness,
    datesList: ['2026-07-15', '2026-07-16', '2026-07-17'],
    hoursList: [
      { enabled: true, time: '12:00' },
      { enabled: true, time: '13:00' }
    ],
    dateSelected: '2026-07-15',
    timeSelected: '12:00',
    handleBusinessClick: jest.fn(),
    handleChangeDate: jest.fn(),
    handleChangeTime: jest.fn(),
    handleAsap: jest.fn(),
    getActualSchedule: jest.fn(() => ({
      enabled: true,
      lapses: [{ open: { hour: 9, minute: 0 }, close: { hour: 22, minute: 0 } }]
    })),
    isAsap: true,
    cateringPreorder: false,
    preorderLeadTime: 0,
    preorderMaximumDays: 7
  },

  businessReservationDefaults: {
    navigation: { navigate: jest.fn() },
    cart: sampleCart,
    checkoutFieldsState: {
      loading: false,
      fields: [
        {
          name: 'name',
          enabled: true,
          required: true,
          order_type_id: 9,
          validation_field: { code: 'name' }
        },
        {
          name: 'email',
          enabled: true,
          required: true,
          order_type_id: 9,
          validation_field: { code: 'email' }
        }
      ]
    },
    orderingMethod: 0,
    setOrderingMethod: jest.fn(),
    handleAddReservation: jest.fn(),
    reservationSetting: {
      allow_preorder_reservation: true,
      max_guests_reservation: 8,
      min_guests_reservation: 1
    },
    reservationState: {
      loading: false,
      changes: {
        guests_reservation: 2,
        reserve_date: '2026-07-20 18:00:00'
      }
    },
    setReservationState: jest.fn(),
    hoursList: [{ value: '18:00', text: '18:00' }],
    reserveDate: '2026-07-20',
    setReserveDate: jest.fn(),
    datesList: ['2026-07-20', '2026-07-21'],
    setOpenReservations: jest.fn(),
    isCheckout: false
  },

  businessReviewsDefaults: {
    reviewsList: {
      loading: false,
      error: null,
      reviews: [
        { id: 1, total: 4.5, comment: 'Great pizza', created_at: '2026-01-01T12:00:00Z' }
      ]
    },
    businessState: { loading: false, business: sampleBusiness }
  },

  categoryDescriptionDefaults: {
    openDescription: {
      name: 'Pizzas',
      image: 'https://cdn.test/cat.jpg',
      description: 'Fresh oven pizzas'
    },
    setOpenDescription: jest.fn()
  },

  productFormDefaults: {
    navigation: { navigate: jest.fn(), goBack: jest.fn(), canGoBack: jest.fn(() => true) },
    editMode: false,
    isSoldOut: false,
    productCart: {
      id: 100,
      name: 'Cheese Slice',
      quantity: 1,
      price: 5,
      total: 5,
      ingredients: {},
      options: {},
      comment: ''
    },
    increment: jest.fn(),
    decrement: jest.fn(),
    handleChangeProductCartQuantity: jest.fn(),
    showOption: jest.fn(() => true),
    maxProductQuantity: 10,
    errors: {},
    handleSave: jest.fn(),
    handleChangeIngredientState: jest.fn(),
    handleChangeSuboptionState: jest.fn(),
    handleChangeCommentState: jest.fn(),
    productObject: {
      loading: false,
      error: null,
      product: {
        ...sampleProduct,
        images: 'https://cdn.test/slice.jpg',
        gallery: [],
        ingredients: [{ id: 1, name: 'Cheese', selected: true }],
        extras: [{
          id: 1,
          name: 'Toppings',
          options: [{
            id: 1,
            name: 'Size',
            min: 1,
            max: 1,
            suboptions: [{ id: 1, name: 'Regular', price: 0 }]
          }]
        }]
      }
    },
    productAddedToCartLength: 0,
    actionStatus: { loading: false, error: null },
    setProductLogin: jest.fn(),
    handleCreateGuestUser: jest.fn(),
    callbackAfterUpdateCart: jest.fn(),
    handleFavoriteProduct: jest.fn()
  },

  productIngredientDefaults: {
    state: { selected: true },
    ingredient: { id: 1, name: 'Mozzarella' },
    toggleSelect: jest.fn(),
    isSoldOut: false
  },

  productItemAccordionDefaults: {
    isDisabledEdit: false,
    isCartPending: false,
    isCartProduct: true,
    product: {
      ...sampleCartProduct,
      images: 'https://cdn.test/slice.jpg',
      ingredients: [{ id: 1, name: 'Cheese', selected: true }],
      options: [{
        id: 1,
        name: 'Size',
        suboptions: [{ id: 1, name: 'Regular', price: 0, quantity: 1 }]
      }]
    },
    changeQuantity: jest.fn(),
    getProductMax: jest.fn(() => 10),
    onDeleteProduct: jest.fn(),
    onEditProduct: jest.fn(),
    isFromCheckout: false,
    productInfo: {
      ingredients: [{ id: 1, name: 'Cheese' }],
      options: [{
        id: 1,
        name: 'Size',
        suboptions: [{ id: 1, name: 'Regular', price: 0, quantity: 1, position: '' }]
      }]
    },
    hideProductImage: false,
    hidePriceDropdown: false,
    toppingsRemoved: null,
    isCartProductView: true
  },

  productOptionDefaults: {
    option: { id: 1, name: 'Size', min: 1, max: 1 },
    error: false,
    children: null
  },

  productOptionSubOptionDefaults: {
    state: { selected: false, quantity: 0, position: 'whole' },
    increment: jest.fn(),
    decrement: jest.fn(),
    balance: 0,
    option: {
      id: 1,
      name: 'Size',
      min: 0,
      max: 2,
      with_half_option: false,
      allow_suboption_quantity: true,
      limit_suboptions_by_max: false,
      suboptions: [{ id: 1, name: 'Large', price: 2, max: 2 }]
    },
    suboption: { id: 1, name: 'Large', price: 2, max: 2 },
    toggleSelect: jest.fn(),
    changePosition: jest.fn(),
    disabled: false,
    setIsScrollAvailable: jest.fn(),
    image: null,
    enableIntersection: false,
    usePizzaValidation: false,
    pizzaState: {}
  },

  cartDefaults: {
    cart: sampleCart,
    clearCart: jest.fn().mockResolvedValue(),
    changeQuantity: jest.fn(),
    getProductMax: jest.fn(() => 10),
    offsetDisabled: 0,
    removeProduct: jest.fn().mockResolvedValue(),
    handleCartOpen: jest.fn(),
    setIsCartsLoading: jest.fn(),
    onNavigationRedirect: jest.fn(),
    handleRemoveOfferClick: jest.fn(),
    isMultiCheckout: false,
    hideCouponInput: false,
    cateringTypes: [],
    cartsOpened: ['cart-1'],
    setCartsOpened: jest.fn(),
    changeActiveState: jest.fn(),
    isActive: true,
    hasCartReservation: false,
    callbackAfterUpdateCart: jest.fn(),
    cartuuid: 'cart-1'
  },

  cartContentDefaults: {
    onNavigationRedirect: jest.fn(),
    singleBusiness: false,
    businessSlug: null,
    navigation: { navigate: jest.fn() },
    isFranchiseApp: false
  },

  cartStoresListingDefaults: {
    businessIdSelect: null,
    storesState: {
      loading: false,
      error: null,
      result: [sampleBusiness]
    },
    changeStoreState: { loading: false, result: null },
    handleCartStoreChange: jest.fn(),
    cartuuid: 'cart-1',
    onClose: jest.fn()
  },

  cartStudentAlertDefaults: {
    cart: {
      ...sampleCart,
      student_id: 7,
      student: {
        id: 7,
        name: 'Ada',
        lastname: 'Lovelace',
        allergies: ['dairy'],
        dietary_tags: ['vegan']
      },
      products: [{
        ...sampleCartProduct,
        allergens: ['dairy'],
        dietary_tags: ['vegetarian']
      }]
    }
  },

  couponControlDefaults: {
    couponDefault: null,
    couponInput: '',
    handleButtonApplyClick: jest.fn(),
    handleLoadOffers: jest.fn(),
    handleOfferApplyClick: jest.fn(),
    handleOfferRemoveClick: jest.fn(),
    handleRemoveCouponClick: jest.fn(),
    onChangeInputCoupon: jest.fn(),
    offersState: { offers: [], loading: false, error: null },
    applyingOfferId: null,
    removingOfferId: null,
    canLoadOffers: true,
    confirm: { open: false, content: null, error: false },
    setConfirm: jest.fn(),
    cart: sampleCart
  },

  placeSpotDefaults: {
    cart: {
      ...sampleCart,
      delivery_type: 4,
      place_id: 10,
      place: { id: 10, name: 'Spot 1', place_group_id: 1 }
    },
    orderTypes: {
      1: 'Delivery',
      2: 'Pickup',
      3: 'Eat in',
      4: 'Curbside',
      5: 'Drive thru'
    },
    placesState: {
      loading: false,
      error: null,
      places: [
        { id: 10, name: 'Spot 1', enabled: true, place_group_id: 1 }
      ],
      placeGroups: [{ id: 1, name: 'Lot A', enabled: true }]
    },
    handleChangePlace: jest.fn(),
    spotNumber: '1',
    spotState: { loading: false, error: null },
    isCheckout: true,
    vehicle: { type: 'car', model: 'Sedan', car_registration: 'ABC123', color: 'red' },
    isInputMode: true,
    setSpotNumber: jest.fn(),
    setVehicle: jest.fn(),
    handleChangeSpot: jest.fn(),
    setPlaceSpotNumber: jest.fn()
  },

  scheduleAccordionDefaults: {
    timeFormated: (lapse) => `${lapse.hour}:${String(lapse.minute).padStart(2, '0')}`,
    schedule: {
      enabled: true,
      lapses: [
        { open: { hour: 9, minute: 0 }, close: { hour: 22, minute: 0 } }
      ]
    },
    weekIndex: 1
  },

  singleProductCardDefaults: {
    product: sampleProduct,
    isSoldOut: false,
    onProductClick: jest.fn(),
    productAddedToCartLength: 0,
    handleFavoriteProduct: jest.fn(),
    navigation: { navigate: jest.fn() },
    isPreviously: false,
    isFeatured: false
  },

  singleProductReviewDefaults: {
    product: {
      ...sampleProduct,
      images: 'https://cdn.test/slice.jpg'
    },
    formState: { changes: [], loading: false },
    handleChangeFormState: jest.fn(),
    order: { id: 55 }
  },

  upsellingProductsDefaults: {
    businessId: 1,
    isCustomMode: true,
    upsellingProducts: {
      loading: false,
      error: null,
      products: [{ ...sampleProduct, id: 200, name: 'Garlic Knots' }]
    },
    handleUpsellingPage: jest.fn(),
    openUpselling: true,
    canOpenUpselling: true,
    setCanOpenUpselling: jest.fn(),
    isFromCart: false,
    products: null,
    isPage: false,
    onProductClick: jest.fn()
  }
}
