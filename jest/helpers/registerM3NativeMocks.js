/* eslint-env jest */
/**
 * Native / third-party mocks for M3 discovery UI tests.
 * Import as the first line in each M3 test file.
 */
jest.mock('react-native-fast-image', () => {
  const React = require('react')
  const { View } = require('react-native')
  function FastImage (props) {
    return React.createElement(View, { testID: 'fast-image', ...props })
  }
  FastImage.resizeMode = { contain: 'contain', cover: 'cover' }
  FastImage.priority = { normal: 'normal', high: 'high' }
  FastImage.cacheControl = { web: 'web' }
  return { __esModule: true, default: FastImage, resizeMode: FastImage.resizeMode }
})

jest.mock('react-native-maps', () => {
  const React = require('react')
  const { View } = require('react-native')
  const MapView = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      animateToRegion: jest.fn(),
      fitToCoordinates: jest.fn()
    }))
    return React.createElement(View, { testID: 'map-view', ...props })
  })
  MapView.Marker = (props) => React.createElement(View, { testID: 'map-marker', ...props })
  MapView.Polygon = (props) => React.createElement(View, { testID: 'map-polygon', ...props })
  MapView.Circle = (props) => React.createElement(View, { testID: 'map-circle', ...props })
  return {
    __esModule: true,
    default: MapView,
    Marker: MapView.Marker,
    Polygon: MapView.Polygon,
    Circle: MapView.Circle,
    PROVIDER_GOOGLE: 'google',
    Callout: View,
    MarkerAnimated: View,
    AnimatedRegion: jest.fn()
  }
})

jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn((success) =>
    success({ coords: { latitude: 40.7128, longitude: -74.006 } })
  )
}))

jest.mock('react-native-geocoding', () => ({
  init: jest.fn(),
  from: jest.fn(() =>
    Promise.resolve({
      results: [{
        formatted_address: '123 Main St',
        geometry: { location: { lat: 40.7128, lng: -74.006 } },
        address_components: [{ types: ['postal_code'], short_name: '10001' }],
        place_id: 'place-1'
      }]
    })
  )
}))

jest.mock('react-native-haptic-feedback', () => ({ trigger: jest.fn() }))
jest.mock('lottie-react-native', () => 'Lottie')

jest.mock('react-native-webview', () => {
  const React = require('react')
  const { View } = require('react-native')
  const WebView = (props) => React.createElement(View, { testID: 'webview', ...props })
  return { __esModule: true, default: WebView, WebView }
})

jest.mock('rn-placeholder', () => {
  const { View } = require('react-native')
  return {
    Placeholder: ({ children }) => <View testID="placeholder">{children}</View>,
    PlaceholderLine: (props) => <View testID="placeholder-line" {...props} />,
    PlaceholderMedia: (props) => <View testID="placeholder-media" {...props} />,
    Fade: {}
  }
})

jest.mock('react-native-loading-spinner-overlay', () => {
  const { View } = require('react-native')
  return (props) => <View testID="spinner-overlay" {...props} />
})

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

jest.mock('react-native-vector-icons/SimpleLineIcons', () => {
  const { View } = require('react-native')
  return (props) => <View testID="simple-line-icon" {...props} />
})

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    useFocusEffect: jest.fn((cb) => cb && cb()),
    useIsFocused: jest.fn(() => true)
  }
})
