/* eslint-env jest */
/**
 * Native / third-party mocks for M5 checkout & payments UI tests.
 * Import as the first line in each M5 test file.
 */
require('./registerM4NativeMocks')

jest.mock('react-native-webview', () => {
  const React = require('react')
  const { View } = require('react-native')
  const WebView = (props) => React.createElement(View, { testID: 'webview', ...props })
  return { __esModule: true, default: WebView, WebView }
})

jest.mock('@stripe/stripe-react-native', () => {
  const React = require('react')
  const { View } = require('react-native')
  return {
    initStripe: jest.fn(),
    dismissPlatformPay: jest.fn(),
    createPaymentMethod: jest.fn().mockResolvedValue({ paymentMethod: { id: 'pm_test' }, error: null }),
    useConfirmPayment: jest.fn(() => ({
      confirmPayment: jest.fn().mockResolvedValue({
        paymentIntent: { id: 'pi_test' },
        error: null
      })
    })),
    useConfirmSetupIntent: jest.fn(() => ({
      confirmSetupIntent: jest.fn().mockResolvedValue({ setupIntent: { id: 'seti_test' }, error: null }),
      loading: false
    })),
    usePlatformPay: jest.fn(() => ({
      isPlatformPaySupported: jest.fn().mockResolvedValue(true),
      createPlatformPayPaymentMethod: jest.fn().mockResolvedValue({ paymentMethod: { id: 'pm_platform' }, error: null }),
      confirmPlatformPayPayment: jest.fn().mockResolvedValue({ error: null })
    })),
    PlatformPay: {
      BillingAddressFormat: { Full: 'Full' },
      PaymentType: { Immediate: 'Immediate' }
    },
    StripeProvider: ({ children }) => children,
    CardField: (props) => React.createElement(View, { testID: 'card-field', ...props })
  }
})

jest.mock('react-native-credit-card-input', () => {
  const React = require('react')
  const { View, TouchableOpacity, Text } = require('react-native')
  return {
    CreditCardInput: (props) => (
      React.createElement(
        View,
        { testID: 'credit-card-input' },
        React.createElement(
          TouchableOpacity,
          {
            testID: 'credit-card-input-change',
            onPress: () => props.onChange?.({
              valid: true,
              values: {
                number: '4242424242424242',
                expiry: '12/30',
                cvc: '123',
                name: 'Test User'
              }
            })
          },
          React.createElement(Text, null, 'Card input')
        )
      )
    )
  }
}, { virtual: true })

jest.mock('react-native-credit-card-input-plus', () => {
  const React = require('react')
  const { View } = require('react-native')
  return {
    CreditCardInput: (props) => React.createElement(View, { testID: 'credit-card-input-plus', ...props })
  }
}, { virtual: true })
