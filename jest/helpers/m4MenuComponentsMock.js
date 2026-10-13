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
    const m4 = require('./m4MenuDefaults')
    const m3 = require('./m3DiscoveryComponentsMock')

    const configState = {
      loading: false,
      configs: {
        format_number_currency: { value: '$' },
        distance_unit: { value: 'mi' },
        preorder_status_enabled: { value: '1' },
        general_hour_format: { value: 'HH:mm' },
        use_parent_category: { value: '0' },
        add_product_with_one_click: { value: '0' },
        max_product_amount: { value: '100' },
        checkout_multi_business_enabled: { value: '0' },
        multi_business_checkout_coupon_input_style: { value: 'individual' },
        multi_business_checkout_show_combined_delivery_fee: { value: '0' },
        multi_business_checkout_show_combined_driver_tip: { value: '0' }
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
        'businessId:1': m4.sampleCart
      }
    }

    const orderActions = {
      changeQuantity: jest.fn(),
      removeProduct: jest.fn().mockResolvedValue(),
      clearCart: jest.fn().mockResolvedValue(),
      addProduct: jest.fn().mockResolvedValue(),
      updateProduct: jest.fn().mockResolvedValue(),
      confirmCart: jest.fn().mockResolvedValue({ error: false }),
      changeType: jest.fn(),
      setStateValues: jest.fn()
    }

    const sessionState = {
      auth: true,
      user: { id: 1, name: 'Test', email: 'test@example.com', cellphone: '555' },
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

    const customerState = { user: null, loading: false }
    const validationFields = {
      loading: false,
      fields: {
        checkout: {
          coupon: { enabled: true }
        }
      }
    }
    const schoolStudents = {
      students: [{
        id: 7,
        name: 'Ada',
        lastname: 'Lovelace',
        allergies: ['dairy'],
        dietary_tags: ['vegan']
      }],
      refresh: jest.fn()
    }
    const selectedStudent = { studentId: 7 }
    const toastFns = { showToast: jest.fn() }
    const eventBus = { emit: jest.fn() }

    return {
      ...base,
      ...m3.getMock(),
      BusinessMenuListing: renderUiController(m4.businessMenuListDefaults),
      ProductsList: renderUiController(m4.businessProductsListDefaults),
      BusinessAndProductList: renderUiController(m4.businessProductsListingDefaults),
      BusinessProductsCategories: renderUiController(m4.businessProductsCategoriesDefaults),
      MomentOption: renderUiController(m4.businessPreorderDefaults),
      BusinessReservation: renderUiController(m4.businessReservationDefaults),
      BusinessReviews: renderUiController(m4.businessReviewsDefaults),
      ProductForm: (props) => {
        const UI = props.UIComponent
        if (!UI) return null
        const { UIComponent, ...rest } = props
        return React.createElement(UI, {
          ...m4.productFormDefaults,
          ...rest,
          productCart: {
            ...m4.productFormDefaults.productCart,
            ...(rest.productCart || {})
          },
          productObject: {
            ...m4.productFormDefaults.productObject,
            ...(rest.productObject || {}),
            product: {
              ...m4.productFormDefaults.productObject.product,
              ...(rest.productObject?.product || rest.product || {})
            }
          },
          navigation: rest.navigation || m4.productFormDefaults.navigation
        })
      },
      ProductIngredient: renderUiController(m4.productIngredientDefaults),
      ProductItemAccordion: renderUiController(m4.productItemAccordionDefaults),
      ProductOption: renderUiController(m4.productOptionDefaults),
      ProductOptionSuboption: renderUiController(m4.productOptionSubOptionDefaults),
      Cart: renderUiController(m4.cartDefaults),
      CartStoresListing: renderUiController(m4.cartStoresListingDefaults),
      CouponControl: renderUiController(m4.couponControlDefaults),
      PlaceSpot: renderUiController(m4.placeSpotDefaults),
      SingleProductCard: renderUiController(m4.singleProductCardDefaults),
      UpsellingPage: renderUiController(m4.upsellingProductsDefaults),
      useConfig: jest.fn(() => [configState]),
      useSession: jest.fn(() => [sessionState, {}]),
      useEvent: jest.fn(() => [eventBus]),
      useUtils: jest.fn(() => [utils]),
      useOrder: jest.fn(() => [orderState, orderActions]),
      useValidationFields: jest.fn(() => [validationFields, {}]),
      useToast: jest.fn(() => [, toastFns]),
      useSchoolStudents: jest.fn(() => schoolStudents),
      useFreeDeliveryProgress: jest.fn(() => ({ status: 'hidden' })),
      useSelectedStudent: jest.fn(() => selectedStudent),
      useCustomer: jest.fn(() => [customerState, {}]),
      ToastType: { Info: 'info', Success: 'success', Warning: 'warning', Error: 'error' },
      ...overrides
    }
  }
}
