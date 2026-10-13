const {
  sampleOrder,
  pastOrder,
  activeOrder,
  sampleBusiness
} = require('./m6OrdersDefaults')
const { sampleProduct } = require('./m5CheckoutDefaults')

const reviewOrder = {
  ...pastOrder,
  review: null,
  user_review: null,
  business: sampleBusiness,
  driver: { id: 2, name: 'Driver', lastname: 'One', photo: 'https://cdn.test/driver.jpg' },
  products: [sampleProduct]
}

const endedOrder = {
  ...activeOrder,
  status: 1,
  created_at: '2026-07-01T12:00:00Z',
  app_id: 'orderingapp'
}

module.exports = {
  reviewOrder,
  endedOrder,

  reviewTriggerDefaults: {
    order: {
      logo: 'https://cdn.test/logo.jpg',
      business_name: 'Pizza Place'
    },
    handleOpenOrderReview: jest.fn()
  },

  messagesDefaults: {
    type: 2,
    order: activeOrder,
    messages: {
      loading: false,
      messages: [
        { id: 1, type: 0 },
        {
          id: 2,
          type: 2,
          comment: 'Hello there',
          created_at: '2026-07-01T12:05:00Z',
          author: { id: 2, name: 'Store' },
          can_see: ['2'],
          source: null
        }
      ]
    },
    image: null,
    message: '',
    sendMessage: { loading: false },
    setCanRead: jest.fn(),
    setMessage: jest.fn(),
    handleSend: jest.fn(),
    setImage: jest.fn(),
    readMessages: jest.fn(),
    business: true,
    driver: false,
    setMessages: jest.fn()
  },

  messagesEndedDefaults: {
    type: 2,
    order: endedOrder,
    messages: { loading: false, messages: [{ id: 1, type: 0 }] },
    image: null,
    message: '',
    sendMessage: { loading: false },
    setCanRead: jest.fn(),
    setMessage: jest.fn(),
    handleSend: jest.fn(),
    setImage: jest.fn(),
    readMessages: jest.fn(),
    business: true,
    driver: false,
    setMessages: jest.fn()
  },

  messageListingDefaults: {
    navigation: { navigate: jest.fn() },
    activeOrders: true,
    orderList: { loading: false, error: null, orders: [activeOrder] },
    pagination: { currentPage: 1, totalPages: 1 },
    customArray: null,
    onNavigationRedirect: jest.fn(),
    orderStatus: [9],
    loadMoreOrders: jest.fn(),
    loadOrders: jest.fn(),
    setOrderListState: jest.fn(),
    setRefreshOrders: jest.fn(),
    refreshOrders: false,
    onClickOrder: jest.fn()
  },

  messageListingEmptyDefaults: {
    navigation: { navigate: jest.fn() },
    activeOrders: true,
    orderList: { loading: false, error: null, orders: [] },
    pagination: { currentPage: 1, totalPages: 1 },
    loadMoreOrders: jest.fn(),
    loadOrders: jest.fn(),
    setOrderListState: jest.fn(),
    setRefreshOrders: jest.fn(),
    refreshOrders: false,
    onClickOrder: jest.fn()
  },

  reviewDriverDefaults: {
    order: reviewOrder,
    formState: { loading: false, result: { error: false } },
    dirverReviews: { qualification: 5, comment: '' },
    setDriverReviews: jest.fn(),
    handleSendDriverReview: jest.fn(),
    onNavigationRedirect: jest.fn()
  },

  reviewOrderDefaults: {
    stars: { quality: 5, comments: '' },
    handleSendReview: jest.fn().mockResolvedValue(true),
    formState: { loading: false, error: false, result: null, changes: [] },
    navigation: { navigate: jest.fn(), canGoBack: jest.fn(() => true), goBack: jest.fn() },
    setStars: jest.fn(),
    onNavigationRedirect: jest.fn(),
    handleReviewState: jest.fn(),
    setIsReviewed: jest.fn(),
    handleChangeFormState: jest.fn(),
    order: reviewOrder
  },

  reviewProductsDefaults: {
    order: { ...reviewOrder, products: [sampleProduct] },
    onNavigationRedirect: jest.fn(),
    formState: { loading: false, result: { error: false }, changes: [{ product_id: 100, qualification: 5 }] },
    handleChangeFormState: jest.fn(),
    handleSendProductReview: jest.fn()
  }
}
