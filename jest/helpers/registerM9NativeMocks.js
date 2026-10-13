/* eslint-env jest */
/**
 * Native / third-party mocks for M9 address, gift & integrations UI tests.
 * Import as the first line in each M9 test file.
 */
require('./registerM8NativeMocks')

jest.mock('react-native-paper', () => {
  const React = require('react')
  const { View, TouchableOpacity } = require('react-native')
  return {
    ActivityIndicator: (props) => React.createElement(View, { testID: 'activity-indicator', ...props }),
    TouchableRipple: ({ children, onPress, ...props }) => (
      React.createElement(TouchableOpacity, { onPress, ...props }, children)
    )
  }
})

jest.mock('react-native-phone-number-input', () => {
  const React = require('react')
  const { TextInput } = require('react-native')
  return React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      getCallingCode: () => '1',
      isValidNumber: () => true,
      getNumberAfterPossiblyEliminatingZero: () => ({ number: '5551234567' }),
      setState: jest.fn(),
      state: { number: '', countryCode: 'US', code: '1' }
    }))
    return React.createElement(TextInput, {
      testID: 'phone-input',
      placeholder: props.placeholder,
      onChangeText: props.onChangeFormattedText
    })
  })
})

jest.mock('react-native-country-flag', () => {
  const React = require('react')
  const { View } = require('react-native')
  return (props) => React.createElement(View, { testID: 'country-flag', ...props })
})

jest.mock('react-native-country-picker-modal', () => ({
  Flag: (props) => {
    const React = require('react')
    const { View } = require('react-native')
    return React.createElement(View, { testID: 'country-picker-flag', ...props })
  }
}))

jest.mock('@segment/analytics-react-native', () => ({
  createClient: jest.fn(() => ({
    track: jest.fn(),
    identify: jest.fn(),
    config: { writeKey: 'test-segment-key' }
  })),
  AnalyticsProvider: ({ children }) => children
}))

jest.mock('react-native-fbsdk-next', () => ({
  AppEventsLogger: {
    logEvent: jest.fn(),
    logPurchase: jest.fn(),
    AppEvents: {
      CompletedRegistration: 'CompletedRegistration',
      AddedToCart: 'AddedToCart',
      CustomizeProduct: 'CustomizeProduct',
      AddedPaymentInfo: 'AddedPaymentInfo'
    },
    AppEventParams: {
      RegistrationMethod: 'RegistrationMethod',
      Description: 'Description',
      Currency: 'Currency',
      ContentID: 'ContentID',
      ContentType: 'ContentType'
    }
  }
}))

jest.mock('react-native-date-picker', () => {
  const React = require('react')
  const { View } = require('react-native')
  return (props) => React.createElement(View, { testID: 'date-picker', ...props })
})

jest.mock('react-native-calendar-picker', () => {
  const React = require('react')
  const { View } = require('react-native')
  return (props) => React.createElement(View, { testID: 'calendar-picker', ...props })
})

jest.mock('react-native-select-dropdown', () => {
  const React = require('react')
  const { View } = require('react-native')
  return React.forwardRef((props, ref) => (
    React.createElement(View, { testID: 'select-dropdown', ...props })
  ))
})

jest.mock('react-native-google-places-textinput', () => {
  const React = require('react')
  const { View } = require('react-native')
  return (props) => React.createElement(View, { testID: 'google-places-input', ...props })
})
