const sampleProduct = {
  id: 100,
  code: 'prod-1',
  name: 'Cheese Slice',
  price: 5,
  quantity: 1,
  total: 5,
  tax: { id: 1 },
  fee: { id: 1 },
  offers: []
}

const sampleBusiness = {
  id: 1,
  name: 'Pizza Place',
  slug: 'pizza-place',
  logo: null,
  cellphone: '555',
  vertical: null,
  configs: [
    { key: 'wallet_cash_enabled', value: '1' },
    { key: 'wallet_credit_point_enabled', value: '1' }
  ]
}

/** status !== 1 so Checkout shell mounts the controller */
const sampleCart = {
  uuid: 'cart-1',
  status: 0,
  valid: true,
  valid_products: true,
  valid_schedule: true,
  valid_address: true,
  valid_maximum: true,
  valid_minimum: true,
  business_id: 1,
  balance: 12.5,
  total: 12.5,
  subtotal: 10,
  discount: 0,
  comment: 'leave at door',
  driver_tip: 1,
  delivery_price: 2.5,
  delivery_type: 1,
  products: [sampleProduct],
  business: sampleBusiness,
  offers: [],
  payment_events: [],
  taxes: [],
  fees: [],
  student_id: null,
  student: null,
  paymethod_data: null,
  place: null,
  reserved: false,
  reservation: null
}

const sampleCard = {
  id: 'card_1',
  brand: 'visa',
  last4: '4242',
  zipcode: '10001',
  type_data: { brand: 'visa', last4: '4242' }
}

module.exports = {
  sampleProduct,
  sampleBusiness,
  sampleCart,
  sampleCard,

  checkoutDefaults: {
    navigation: { navigate: jest.fn(), canGoBack: jest.fn(() => true), goBack: jest.fn() },
    cart: sampleCart,
    cartUuid: 'cart-1',
    cartState: { loading: false, cart: sampleCart, error: null },
    placing: false,
    errors: null,
    clearErrors: jest.fn(),
    businessDetails: {
      loading: false,
      error: null,
      business: sampleBusiness
    },
    paymethodSelected: { id: 1, gateway: 'cash', name: 'Cash' },
    handlePaymethodChange: jest.fn(),
    handlerClickPlaceOrder: jest.fn(),
    onNavigationRedirect: jest.fn(),
    deliveryOptionSelected: null,
    instructionsOptions: { result: [] },
    handleChangeDeliveryOption: jest.fn(),
    currency: 'USD',
    merchantId: 'merchant.test',
    setPlaceSpotNumber: jest.fn(),
    maxDate: null,
    androidAppId: 'com.test.app',
    urlscheme: 'orderingapp',
    checkoutFieldsState: { loading: false, fields: [] },
    loyaltyPlansState: { result: [] },
    showGateway: { open: false, closedByUser: false },
    setShowGateway: jest.fn(),
    globalPayIFrameUrl: 'https://example.test/gp',
    braintreeIFrameUrl: 'https://example.test/bt',
    cybersourceIFrameUrl: 'https://example.test/cs',
    createBusinessUserPaymethod: jest.fn(),
    stripePaymentOptions: ['stripe', 'stripe_connect']
  },

  checkoutStudentDetailsDefaults: {
    cart: {
      ...sampleCart,
      business: { ...sampleBusiness, vertical: 'school', id: 1 },
      business_id: 1,
      student_id: 7,
      student: { id: 7, name: 'Ada', lastname: 'Lovelace', school_id: 1 }
    }
  },

  paymentOptionsDefaults: {
    cart: sampleCart,
    errorCash: false,
    setErrorCash: jest.fn(),
    isLoading: false,
    isDisabled: false,
    paymethodData: {},
    setPaymethodData: jest.fn(),
    paymethodsList: {
      loading: false,
      error: null,
      paymethods: [
        { id: 1, gateway: 'cash', name: 'Cash', enabled: true },
        {
          id: 2,
          gateway: 'stripe',
          name: 'Credit Card',
          enabled: true,
          credentials: { publishable: 'pk_test' }
        }
      ]
    },
    paymethodSelected: { id: 1, gateway: 'cash', name: 'Cash' },
    paySelected: null,
    isOpenMethod: null,
    onNavigationRedirect: jest.fn(),
    handlePaymethodClick: jest.fn(),
    handlePaymethodDataChange: jest.fn(),
    handlePaymentMethodClickCustom: jest.fn(),
    handlePlaceOrder: jest.fn(),
    handleOpenGuestSignup: jest.fn(),
    merchantId: 'merchant.test',
    urlscheme: 'orderingapp',
    setMethodPaySupported: jest.fn(),
    placeByMethodPay: false,
    methodPaySupported: { enabled: true, loading: false, message: null },
    setPlaceByMethodPay: jest.fn(),
    setCardList: jest.fn(),
    onPaymentChange: jest.fn(),
    requiredFields: [],
    openUserModal: jest.fn(),
    paymethodClicked: null,
    setPaymethodClicked: jest.fn(),
    androidAppId: 'com.test.app',
    setUserHasCards: jest.fn(),
    guestDisabledError: false,
    paymethodV2Featured: [],
    showGateway: { open: false },
    setShowGateway: jest.fn(),
    globalPayIFrameUrl: '',
    braintreeIFrameUrl: '',
    cybersourceIFrameUrl: '',
    createBusinessUserPaymethod: jest.fn(),
    businessId: 1
  },

  paymentOptionCashDefaults: {
    orderTotal: 12.5,
    onChangeData: jest.fn(),
    setErrorCash: jest.fn(),
    defaultValue: ''
  },

  paymentOptionStripeDefaults: {
    businessId: 1,
    publicKey: 'pk_test_xxx',
    clientSecret: 'seti_xxx',
    cardsList: {
      loading: false,
      error: null,
      cards: [sampleCard]
    },
    cardSelected: sampleCard,
    deleteCard: jest.fn(),
    handleCardClick: jest.fn(),
    handleNewCard: jest.fn(),
    onSelectCard: jest.fn(),
    onCancel: jest.fn()
  },

  paymentOptionWalletDefaults: {
    businessId: 1,
    businessConfigs: [
      { key: 'wallet_cash_enabled', value: '1' },
      { key: 'wallet_credit_point_enabled', value: '1' }
    ],
    walletsState: {
      loading: false,
      error: null,
      result: [
        { id: '10', type: 'cash', balance: 20, redemption_rate: 1, valid: true },
        { id: '11', type: 'credit_point', balance: 50, redemption_rate: 10, valid: true }
      ]
    },
    selectWallet: jest.fn(),
    deletetWalletSelected: jest.fn(),
    loading: false
  },

  paymentOptionsWebViewDefaults: {
    uri: 'https://example.test/pay',
    cart: sampleCart,
    user: { id: 1, name: 'Test', email: 'test@example.com' },
    token: 'tok',
    webviewPaymethod: { id: 5, gateway: 'paypal', name: 'PayPal' },
    setShowGateway: jest.fn(),
    currency: 'USD',
    onNavigationRedirect: jest.fn(),
    createBusinessUserPaymethod: jest.fn(),
    businessId: 1,
    hideHeader: false,
    isInsideModal: false,
    title: 'Pay'
  },

  paymentOptionCardDefaults: {
    businessId: 1,
    cardsList: {
      loading: false,
      error: null,
      cards: [sampleCard]
    },
    cardSelected: sampleCard,
    gateway: 'stripe',
    addCardOpen: { stripe: false, stripeConnect: false, card: false },
    setAddCardOpen: jest.fn(),
    paymethodsWithoutSaveCards: [],
    showGateway: { open: false },
    setShowGateway: jest.fn(),
    handleCardClick: jest.fn(),
    deleteCard: jest.fn(),
    handleNewCard: jest.fn(),
    onSelectCard: jest.fn(),
    publicKey: 'pk_test',
    clientSecret: 'seti_test',
    braintreeIFrameUrl: '',
    globalPayIFrameUrl: '',
    cybersourceIFrameUrl: '',
    createBusinessUserPaymethod: jest.fn()
  },

  stripeElementsDefaults: {
    publicKeyState: { key: 'pk_test_xxx', loading: false, error: null },
    values: { loading: false, loadingAdd: false, error: null, requirements: null },
    toSave: false,
    requirements: null,
    handleSource: jest.fn(),
    stripeTokenHandler: jest.fn(),
    onCancel: jest.fn(),
    methodsPay: [],
    paymethod: null,
    cart: sampleCart,
    merchantId: 'merchant.test',
    businessId: 1,
    businessIds: [1],
    setMethodPaySupported: jest.fn(),
    placeByMethodPay: false,
    methodPaySupported: { enabled: true, loading: false, message: null },
    setPlaceByMethodPay: jest.fn(),
    cartTotal: 12.5,
    publicKeyAddCard: null,
    urlscheme: 'orderingapp',
    androidAppId: 'com.test.app',
    businessNames: ['Pizza Place'],
    stripeAccountId: null,
    gateway: 'stripe',
    setCardsList: jest.fn(),
    handleCardClick: jest.fn()
  },

  stripeMethodFormDefaults: {
    paymethod: 'apple_pay',
    cart: sampleCart,
    cartTotal: 12.5,
    setMethodPaySupported: jest.fn(),
    methodPaySupported: { enabled: false, loading: true, message: null },
    setPlaceByMethodPay: jest.fn(),
    placeByMethodPay: false,
    handleSource: jest.fn(),
    setErrors: jest.fn(),
    devMode: true,
    androidAppId: 'com.test.app',
    merchantId: 'merchant.test',
    currency: 'USD'
  },

  stripeRedirectDefaults: {
    paymethods: [
      { name: 'iDEAL', value: 'ideal' },
      { name: 'Bancontact', value: 'bancontact' }
    ],
    publicKey: 'pk_test',
    handleSubmitPaymentMethod: jest.fn()
  },

  stripeCardFormDefaults: {
    stateCardForm: { error: null, loading: false },
    handleCancel: jest.fn(),
    handleSubmit: jest.fn(),
    publicKey: 'pk_test'
  },

  stripeCardsListDefaults: {
    cardsList: {
      loading: false,
      error: null,
      cards: [sampleCard]
    },
    cardSelected: sampleCard,
    paySelected: sampleCard,
    handleCardClick: jest.fn(),
    onSelectCard: jest.fn(),
    deleteCard: jest.fn(),
    gateway: 'stripe',
    onOpen: jest.fn(),
    handleDeleteNewCard: jest.fn(),
    onCancel: jest.fn()
  },

  walletsDefaults: {
    navigation: { navigate: jest.fn(), canGoBack: jest.fn(() => true), goBack: jest.fn() },
    walletList: {
      loading: false,
      error: null,
      wallets: [
        { id: 10, type: 'cash', balance: 25 },
        { id: 11, type: 'credit_point', balance: 100 }
      ]
    },
    userLoyaltyLevel: {
      loading: false,
      loyaltyLevel: { name: 'Gold', image: 'https://cdn.test/level.png' }
    },
    transactionsList: {
      loading: false,
      error: null,
      list: {
        'wallet:10': [{ id: 1, amount: 5, created_at: '2026-01-01T12:00:00Z', description: 'Top up' }],
        'wallet:11': [{ id: 2, amount: -10, created_at: '2026-01-02T12:00:00Z', description: 'Redeem' }]
      }
    },
    setWalletSelected: jest.fn(),
    isWalletCashEnabled: true,
    isWalletPointsEnabled: true,
    getWallets: jest.fn(),
    refreshWallets: false,
    setRefreshWallets: jest.fn()
  },

  cashWalletDefaults: {
    navigation: { navigate: jest.fn(), canGoBack: jest.fn(() => true), goBack: jest.fn() },
    walletList: {
      loading: false,
      error: null,
      wallets: [{ id: 10, type: 'cash', balance: 25 }]
    },
    userLoyaltyLevel: { loading: false, loyaltyLevel: {} },
    transactionsList: {
      loading: false,
      error: null,
      list: {
        'wallet:10': [{ id: 1, amount: 5, created_at: '2026-01-01T12:00:00Z', description: 'Top up' }]
      }
    },
    isWalletCashEnabled: true,
    isWalletPointsEnabled: false,
    getWallets: jest.fn(),
    refreshWallets: false,
    setRefreshWallets: jest.fn()
  },

  loyaltyPointsDefaults: {
    navigation: { navigate: jest.fn(), canGoBack: jest.fn(() => true), goBack: jest.fn() },
    walletList: {
      loading: false,
      error: null,
      wallets: [{ id: 11, type: 'credit_point', balance: 100 }]
    },
    userLoyaltyLevel: {
      loading: false,
      loyaltyLevel: { name: 'Gold', image: 'https://cdn.test/level.png' }
    },
    transactionsList: {
      loading: false,
      error: null,
      list: {
        'wallet:11': [{ id: 2, amount: -10, created_at: '2026-01-02T12:00:00Z', description: 'Redeem' }]
      }
    },
    isWalletCashEnabled: false,
    isWalletPointsEnabled: true,
    getWallets: jest.fn(),
    refreshWallets: false,
    setRefreshWallets: jest.fn()
  },

  walletTransactionsDefaults: {
    transactionsList: {
      loading: false,
      error: null,
      list: {
        'wallet:10': [
          { id: 1, amount: 5, created_at: '2026-01-01T12:00:00Z', description: 'Top up' },
          { id: 2, amount: -2, created_at: '2026-01-03T12:00:00Z', description: 'Spend' }
        ]
      }
    },
    currentWalletSelected: { id: 10, type: 'cash' }
  },

  walletTransactionItemDefaults: {
    item: { id: 1, amount: 5, created_at: '2026-01-01T12:00:00Z', description: 'Top up' },
    withFormatPrice: true,
    isLast: false
  },

  taxInformationDefaults: {
    type: 'tax',
    data: {
      id: 1,
      name: 'Sales Tax',
      rate: 8,
      type: 1,
      description: 'State tax'
    },
    products: [sampleProduct]
  },

  driverTipsDefaults: {
    driverTip: 10,
    driverTipsOptions: [0, 10, 15, 20],
    isMulti: false,
    isLoading: false,
    cart: sampleCart,
    carts: null,
    isDriverTipUseCustom: true,
    handlerChangeOption: jest.fn(),
    isFixedPrice: false
  }
}
