const moment = require('moment')

const { sampleBusiness, sampleCart, sampleProduct } = require('./m5CheckoutDefaults')

const today = moment().format('YYYY-MM-DD')
const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD')

const sampleOrder = {
  id: 42,
  uuid: 'order-uuid-42',
  status: 9,
  delivery_type: 1,
  total: 15.5,
  summary: { total: 15.5 },
  created_at: '2026-07-01T12:00:00Z',
  delivery_datetime: '2026-07-01T13:00:00Z',
  delivery_datetime_utc: '2026-07-01T17:00:00Z',
  comment: 'Ring doorbell',
  favorite: false,
  review: null,
  cart: true,
  business_id: 1,
  business: sampleBusiness,
  products: [sampleProduct],
  driver: null,
  customer: { address: '123 Main St', location: { lat: 40.71, lng: -74.0 } },
  student_id: 7,
  student: { id: 7, name: 'Ada', lastname: 'Lovelace', school_id: 1 },
  reporting_data: { at: { 'status:9': '2026-07-01T12:30:00Z' } }
}

const pastOrder = {
  ...sampleOrder,
  id: 41,
  uuid: 'order-uuid-41',
  status: 1,
  delivery_datetime_utc: '2026-06-28T17:00:00Z'
}

const activeOrder = {
  ...sampleOrder,
  id: 43,
  uuid: 'order-uuid-43',
  status: 9
}

const sampleProductReorder = {
  id: 100,
  name: 'Cheese Slice',
  price: 5,
  inventoried: false,
  quantity: 10,
  last_ordered_date: '2026-07-10T12:00:00Z',
  business: { id: 1, available: true, slug: 'pizza-place', header: 'https://cdn.test/header.jpg', logo: 'https://cdn.test/logo.jpg' },
  category_id: 10,
  product_id: 100
}

module.exports = {
  sampleOrder,
  pastOrder,
  activeOrder,
  sampleProductReorder,

  myOrdersDefaults: {
    onNavigationRedirect: jest.fn(),
    businessesSearchList: { loading: false, result: [] },
    refreshOrders: false,
    setRefreshOrders: jest.fn()
  },

  activeOrdersDefaults: {
    onNavigationRedirect: jest.fn(),
    orders: [activeOrder],
    pagination: { currentPage: 1, totalPages: 2 },
    loadMoreOrders: jest.fn(),
    loading: false,
    getOrderStatus: jest.fn((status) => ({ value: `Status ${status}`, percentage: 0.5 })),
    isMessageView: false,
    handleClickOrder: jest.fn(),
    handleUpdateOrderList: jest.fn()
  },

  orderDetailsDefaults: {
    order: { loading: false, error: null, order: sampleOrder },
    messages: [],
    setMessages: jest.fn(),
    readMessages: jest.fn(),
    reorderState: { loading: false, error: null, result: null },
    driverLocation: null,
    getOrder: jest.fn(),
    onGoBack: jest.fn(),
    handleReorder: jest.fn().mockResolvedValue({ uuid: 'cart-1' }),
    onNavigationRedirect: jest.fn(),
    isFromCheckout: false
  },

  orderSummaryDefaults: {
    cart: sampleCart,
    changeQuantity: jest.fn(),
    getProductMax: jest.fn(() => 99),
    offsetDisabled: false,
    removeProduct: jest.fn().mockResolvedValue(),
    isCartPending: false,
    isFromCheckout: true,
    commentState: { loading: false },
    handleChangeComment: jest.fn(),
    onNavigationRedirect: jest.fn(),
    handleRemoveOfferClick: jest.fn(),
    preorderSlotInterval: 30,
    preorderLeadTime: 60,
    preorderTimeRange: 30,
    preorderMaximumDays: 7,
    preorderMinimumDays: 0,
    cateringTypes: [7],
    hideDeliveryFee: false,
    loyaltyRewardRate: 0.1,
    maxDate: '2026-07-20',
    hideTotal: false,
    clearCart: jest.fn().mockResolvedValue(),
    hideProducts: false,
    showOnlyProducts: false,
    hideCommentsByValidationCheckout: false,
    hideCouponByValidationCheckout: false,
    onCommentFocus: jest.fn()
  },

  orderProgressDefaults: {
    navigation: { navigate: jest.fn() },
    orderList: {
      loading: false,
      orders: [activeOrder],
      error: null
    },
    loadOrders: jest.fn(),
    isFocused: true
  },

  orderItAgainDefaults: {
    onProductClick: jest.fn(),
    productList: [sampleProductReorder],
    businessId: 1,
    categoryState: { loading: false },
    currentCart: sampleCart,
    handleUpdateProducts: jest.fn(),
    navigation: { navigate: jest.fn() },
    searchValue: '',
    businessSingleId: 1
  },

  lastOrderDefaults: {
    navigation: { navigate: jest.fn() },
    orderList: { loading: false, error: null, orders: [pastOrder] },
    pagination: { currentPage: 1, totalPages: 1 },
    titleContent: 'Last Order',
    onNavigationRedirect: jest.fn(),
    loadMoreOrders: jest.fn(),
    loadOrders: jest.fn()
  },

  lastOrdersDefaults: {
    orderList: { loading: false, orders: [pastOrder], error: null },
    onRedirect: jest.fn(),
    loadOrders: jest.fn(),
    refresh: false,
    setRefresh: jest.fn()
  },

  previousOrdersDefaults: {
    orders: [pastOrder],
    pagination: { currentPage: 1, totalPages: 2 },
    onNavigationRedirect: jest.fn(),
    loadMoreOrders: jest.fn(),
    getOrderStatus: jest.fn((status) => ({ value: `Status ${status}` })),
    handleReorder: jest.fn(),
    reorderLoading: false,
    orderID: null,
    handleUpdateOrderList: jest.fn(),
    loading: false
  },

  ordersOptionDefaults: {
    navigation: { navigate: jest.fn() },
    activeOrders: false,
    preOrders: false,
    orderList: { loading: false, error: null, orders: [pastOrder, activeOrder] },
    pagination: { currentPage: 1, totalPages: 1 },
    titleContent: 'Past',
    onNavigationRedirect: jest.fn(),
    orderStatus: [1, 9],
    loadMoreStatus: false,
    loadMoreOrders: jest.fn(),
    loadOrders: jest.fn(),
    setOrdersLength: jest.fn(),
    ordersLength: { activeOrdersLength: 1, previousOrdersLength: 1, preordersLength: 0 },
    refreshOrders: false,
    setRefreshOrders: jest.fn(),
    reorderState: { loading: false, error: null, result: null },
    handleReorder: jest.fn(),
    handleUpdateOrderList: jest.fn(),
    isBusiness: false,
    isProducts: false,
    businessOrderIds: [],
    products: [],
    businessesSearchList: { loading: false, result: [] },
    hideOrders: false,
    businesses: { loading: false, result: [] },
    businessPaginationProps: {},
    handleUpdateProducts: jest.fn(),
    handleUpdateBusinesses: jest.fn(),
    businessId: 1
  },

  singleOrderCardDefaults: {
    order: pastOrder,
    reorderLoading: false,
    handleReorder: jest.fn(),
    getOrderStatus: jest.fn((status) => ({ value: `Status ${status}` })),
    handleFavoriteOrder: jest.fn(),
    onNavigationRedirect: jest.fn(),
    pastOrders: true,
    isMessageView: false,
    handleClickOrder: jest.fn(),
    handleRemoveCart: jest.fn(),
    cartState: { loading: false }
  },

  multiOrdersDetailsDefaults: {
    navigation: { canGoBack: jest.fn(() => true), goBack: jest.fn(), navigate: jest.fn() },
    customer: { name: 'Test', address: '123 Main St' },
    paymentEvents: [],
    ordersSummary: { subtotal: 20, total: 22 },
    isFromMultiCheckout: false,
    ordersList: {
      loading: false,
      error: null,
      orders: [sampleOrder, { ...sampleOrder, id: 44, business: { ...sampleBusiness, name: 'Burger Joint' } }]
    }
  },

  multiCheckoutDefaults: {
    navigation: { navigate: jest.fn(), canGoBack: jest.fn(() => true), goBack: jest.fn() },
    placing: false,
    openCarts: [{ ...sampleCart, uuid: 'cart-1' }, { ...sampleCart, uuid: 'cart-2', business_id: 2, business: { ...sampleBusiness, id: 2, name: 'Burger Joint' } }],
    handleGroupPlaceOrder: jest.fn(),
    paymethodSelected: { id: 1, gateway: 'cash', name: 'Cash' },
    handleSelectPaymethod: jest.fn(),
    handleSelectWallet: jest.fn(),
    handlePaymethodDataChange: jest.fn(),
    cartUuid: null,
    loyaltyPlansState: { result: [] },
    totalCartsFee: 2.5,
    cartGroup: { uuid: 'group-1', result: { balance: 25, status: 'open' } },
    walletState: { loading: false, wallets: [] },
    onNavigationRedirect: jest.fn(),
    onNavigationRedirectReplace: jest.fn(),
    errors: null,
    clearErrors: jest.fn(),
    merchantId: 'merchant.test',
    cartsInvalid: [],
    checkoutFieldsState: { fields: [] },
    showGateway: { open: false },
    getMultiCart: jest.fn()
  },

  multiCartDefaults: {},

  multiCartsPaymethodsDefaults: {
    businessIds: [1, 2],
    paymethodsAndWallets: {
      loading: false,
      paymethods: [
        { id: 1, gateway: 'cash', name: 'Cash', enabled: true },
        { id: 2, gateway: 'stripe', name: 'Card', enabled: true, credentials: { publishable: 'pk_test' } }
      ],
      wallets: [
        { type: 'cash' },
        { type: 'credit_point' }
      ]
    },
    walletsState: {
      loading: false,
      result: [{ id: 10, type: 'cash', balance: 20, redemption_rate: 1, valid: true }]
    },
    walletsPaymethod: [],
    paymethodSelected: { id: 1, gateway: 'cash', name: 'Cash' },
    handleSelectPaymethod: jest.fn(),
    handleSelectWallet: jest.fn(),
    handlePaymethodDataChange: jest.fn(),
    setMethodPaySupported: jest.fn(),
    placeByMethodPay: false,
    methodPaySupported: { enabled: true, loading: false, message: null },
    setPlaceByMethodPay: jest.fn(),
    openCarts: [{ uuid: 'cart-1' }],
    cartTotal: 25,
    handlePlaceOrder: jest.fn(),
    merchantId: 'merchant.test',
    cartGroup: { uuid: 'group-1' }
  },

  momentOptionDefaults: {
    navigation: { canGoBack: jest.fn(() => true), goBack: jest.fn() },
    datesList: [today, tomorrow],
    hoursList: [{ startTime: '12:00', endTime: '12:30' }, { startTime: '13:00', endTime: '13:30' }],
    dateSelected: today,
    timeSelected: '12:00',
    cateringPreorder: false,
    isCart: false,
    preorderLeadTime: 60,
    business: sampleBusiness,
    handleBusinessClick: jest.fn(),
    getActualSchedule: jest.fn(() => ({
      lapses: [{ open: { hour: 0, minute: 0 }, close: { hour: 23, minute: 59 } }]
    })),
    preorderMaximumDays: 7,
    preorderMinimumDays: 0,
    handleAsap: jest.fn(),
    handleChangeDate: jest.fn(),
    handleChangeTime: jest.fn()
  },

  momentSelectorDefaults: {
    datesList: [today, tomorrow],
    hoursList: [{ startTime: '12:00', endTime: '12:30' }],
    dateSelected: today,
    timeSelected: '12:00',
    handleChangeDate: jest.fn(),
    handleChangeTime: jest.fn()
  },

  orderTypeSelectorDefaults: {
    handleChangeOrderType: jest.fn(),
    handleChangeType: jest.fn(),
    typeSelected: 1,
    configTypes: [1, 2, 3],
    orderTypes: [
      { value: 1, content: 'Delivery' },
      { value: 2, content: 'Pickup' },
      { value: 3, content: 'Curbside' }
    ],
    goToBack: jest.fn(),
    setOrderTypeValue: jest.fn()
  },

  orderStudentInfoDefaults: {
    order: sampleOrder
  },

  previousBusinessOrderedDefaults: {
    navigation: { navigate: jest.fn() },
    businesses: {
      loading: false,
      result: [{ ...sampleBusiness, open: true, header: 'https://cdn.test/header.jpg', featured: false, reviews: { total: 10, rating: 4.5 }, delivery_price: 2, delivery_time: 30, pickup_time: 15, distance: 1.2 }]
    },
    onNavigationRedirect: jest.fn(),
    isBusinessesSearchList: false,
    handleUpdateBusinesses: jest.fn()
  },

  previousProductsOrderedDefaults: {
    products: [sampleProductReorder],
    fullWidth: false,
    onProductClick: jest.fn(),
    handleUpdateProducts: jest.fn(),
    isBusinessesSearchList: false
  }
}
