const React = require('react')
const { View, TouchableOpacity, Text } = require('react-native')

const eventFns = {
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn()
}

const renderUiController = (defaults = {}) => (props) => {
  const UI = props.UIComponent
  if (!UI) return null
  const { UIComponent, ...rest } = props
  return React.createElement(UI, { ...defaults, ...rest })
}

module.exports = {
  eventFns,
  renderUiController,
  getMock: (overrides = {}) => {
    const m8 = require('./m8ProfileComponentsMock')
    const d = require('./m9IntegrationsDefaults')

    const configState = {
      loading: false,
      configs: {
        use_alternative_to_google_maps: { value: '0' },
        segment_track_id: { value: 'test-segment-key' },
        stripe_currency: { value: 'USD' },
        default_country_code: { value: 'US' },
        validation_phone_number_lib: { value: '0' },
        format_time: { value: '12' },
        guest_checkout_enabled: { value: '1' },
        allowed_order_types_guest_checkout: { value: 'delivery,pickup' },
        google_maps_api_key: { value: 'test-google-key' },
        country_autocomplete: { value: '*' }
      }
    }

    const orderState = {
      loading: false,
      options: {
        type: 1,
        address_id: 1,
        city_id: 1,
        address: d.sampleAddress
      },
      carts: {}
    }

    return {
      ...m8.getMock(),
      AddressDetails: renderUiController(d.addressDetailsDefaults),
      AddressList: renderUiController(d.addressListDefaults),
      AddressForm: renderUiController(d.addressFormDefaults),
      RedeemGiftCard: renderUiController(d.redeemGiftCardDefaults),
      PurchaseGiftCard: renderUiController(d.purchaseGiftCardDefaults),
      SendGiftCard: renderUiController(d.sendGiftCardDefaults),
      GiftCardOrdersList: renderUiController(d.verticalGiftCardOrdersLayoutDefaults),
      SingleProfessionalCard: renderUiController(d.singleProfessionalCardDefaults),
      ProductForm: renderUiController(d.serviceFormDefaults),
      useConfig: jest.fn(() => [configState]),
      useEvent: jest.fn(() => [eventFns]),
      useOrder: jest.fn(() => [orderState, { setStateValues: jest.fn() }]),
      useUtils: jest.fn(() => [{
        parsePrice: (v) => `$${v}`,
        parseDate: (v) => v || '',
        optimizeImage: (url) => url,
        timeFormat: 'HH:mm',
        is12Hours: false,
        preorderDateFormat: 'MM/DD',
        getMaxPreorderDays: () => 7,
        isWalletEnabled: () => true
      }]),
      CODES: [
        { countryCode: 'US', phoneCode: '1' }
      ],
      ...overrides
    }
  }
}
