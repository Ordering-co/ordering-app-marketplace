const React = require('react')

const renderUiController = (defaults = {}) => (props) => {
  const UI = props.UIComponent
  if (!UI) return null
  const { UIComponent, ...rest } = props
  return React.createElement(UI, { ...defaults, ...rest })
}

module.exports = {
  renderUiController,
  getMock: (overrides = {}) => {
    const base = require('./mockOrdering')
    const m4 = require('./m4MenuComponentsMock')
    const d = require('./m5CheckoutDefaults')

    const configState = {
      loading: false,
      configs: {
        format_number_currency: { value: '$' },
        currency_position: { value: 'left' },
        stripe_currency: { value: 'USD' },
        cash_wallet: { value: '1' },
        wallet_enabled: { value: '1' },
        wallet_cash_enabled: { value: '1' },
        wallet_credit_point_enabled: { value: '1' },
        driver_tip_options: { value: '[10,15,20]' },
        driver_tip_type: { value: '2' },
        driver_tip_use_custom: { value: '1' },
        driver_tip_allowed_at_pickup: { value: '0' },
        guest_checkout_enabled: { value: '0' },
        distance_unit: { value: 'mi' },
        general_hour_format: { value: 'HH:mm' }
      }
    }

    const orderState = {
      loading: false,
      options: {
        type: 1,
        moment: null,
        address_id: 1,
        address: { id: 1, location: { lat: 40.7128, lng: -74.006 } }
      },
      carts: {
        'businessId:1': d.sampleCart
      }
    }

    const orderActions = {
      changeQuantity: jest.fn(),
      removeProduct: jest.fn().mockResolvedValue(),
      clearCart: jest.fn().mockResolvedValue(),
      addProduct: jest.fn().mockResolvedValue(),
      updateProduct: jest.fn().mockResolvedValue(),
      confirmCart: jest.fn().mockResolvedValue({ error: false, result: {} }),
      changePaymethod: jest.fn().mockResolvedValue({ error: false }),
      changeType: jest.fn(),
      setStateValues: jest.fn()
    }

    const sessionState = {
      auth: true,
      user: { id: 1, name: 'Test', email: 'test@example.com', cellphone: '555', guest_id: null },
      token: 'token',
      loading: false
    }

    const utils = {
      parsePrice: (v) => `$${v}`,
      parseDistance: (v) => `${v} mi`,
      parseNumber: (v) => v,
      parseDate: (v) => v || '',
      parseTime: (v) => v || '',
      optimizeImage: (url) => url,
      timeFormat: 'HH:mm',
      is12Hours: false,
      preorderDateFormat: 'MM/DD',
      getMaxPreorderDays: () => 7,
      isWalletEnabled: () => true
    }

    const api = {
      root: 'https://api.test',
      project: 'test-project',
      appId: 'app',
      appInternalName: 'ordering_app',
      language: 'en',
      setAccessToken: jest.fn(() => ({
        paymentCards: jest.fn(() => ({
          getCredentials: jest.fn().mockResolvedValue({
            content: { error: false, result: { publishable: 'pk_test' } }
          }),
          get: jest.fn().mockResolvedValue({ content: { error: false, result: [] } }),
          delete: jest.fn().mockResolvedValue({ content: { error: false } })
        }))
      })),
      paymentCards: jest.fn(() => ({
        delete: jest.fn().mockResolvedValue({ content: { error: false } })
      }))
    }

    const schoolStudents = {
      students: [{
        id: 7,
        name: 'Ada',
        lastname: 'Lovelace',
        school_id: 1,
        allergies: [],
        dietary_tags: []
      }],
      loading: false,
      loaded: true,
      refresh: jest.fn()
    }

    const toastFns = { showToast: jest.fn() }
    const eventBus = { emit: jest.fn(), on: jest.fn(), off: jest.fn() }
    const validationFields = {
      loading: false,
      fields: {
        checkout: { coupon: { enabled: true } },
        card: { zipcode: { enabled: false, required: false } }
      }
    }

    return {
      ...m4.getMock(),
      Checkout: renderUiController(d.checkoutDefaults),
      PaymentOptions: renderUiController(d.paymentOptionsDefaults),
      PaymentOptionStripe: renderUiController(d.paymentOptionStripeDefaults),
      PaymentOptionWallet: renderUiController(d.paymentOptionWalletDefaults),
      DriverTips: renderUiController(d.driverTipsDefaults),
      WalletList: renderUiController(d.walletsDefaults),
      StripeRedirectForm: renderUiController(d.stripeRedirectDefaults),
      useConfig: jest.fn(() => [configState]),
      useSession: jest.fn(() => [sessionState, { login: jest.fn() }]),
      useEvent: jest.fn(() => [eventBus]),
      useUtils: jest.fn(() => [utils]),
      useOrder: jest.fn(() => [orderState, orderActions]),
      useApi: jest.fn(() => [api]),
      useValidationFields: jest.fn(() => [validationFields, {}]),
      useToast: jest.fn(() => [, toastFns]),
      useSchoolStudents: jest.fn(() => schoolStudents),
      useSelectedStudent: jest.fn(() => ({ studentId: 7, setStudentId: jest.fn() })),
      useCartStudent: jest.fn(() => ({ assignStudent: jest.fn() })),
      useWebsocket: jest.fn(() => ({ getId: jest.fn(() => 'socket-1') })),
      ToastType: { Info: 'info', Success: 'success', Warning: 'warning', Error: 'error' },
      ...overrides
    }
  }
}
