/* eslint-env jest */
/**
 * Native / third-party mocks for M6 orders flow UI tests.
 * Import as the first line in each M6 test file.
 */
require('./registerM5NativeMocks')

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    useIsFocused: jest.fn(() => true),
    useFocusEffect: jest.fn((cb) => cb && cb()),
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      canGoBack: jest.fn(() => true),
      goBack: jest.fn()
    }))
  }
})

jest.mock('react-native-haptic-feedback', () => ({
  __esModule: true,
  default: { trigger: jest.fn() },
  HapticFeedbackTypes: { impactLight: 'impactLight' }
}))

jest.mock('react-native-linear-gradient', () => {
  const React = require('react')
  const { View } = require('react-native')
  return (props) => React.createElement(View, { testID: 'linear-gradient', ...props })
})

jest.mock('react-native-fast-image', () => {
  const React = require('react')
  const { View } = require('react-native')
  const FastImage = (props) => React.createElement(View, { testID: 'fast-image', ...props })
  FastImage.resizeMode = { contain: 'contain', cover: 'cover' }
  FastImage.priority = { normal: 'normal' }
  return FastImage
})

jest.mock('react-native-vector-icons/Ionicons', () => {
  const React = require('react')
  const { View } = require('react-native')
  return (props) => React.createElement(View, { testID: 'ionicon', ...props })
})

jest.mock('react-native-vector-icons/FontAwesome', () => {
  const React = require('react')
  const { View } = require('react-native')
  return (props) => React.createElement(View, { testID: 'fa-icon', ...props })
})

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const React = require('react')
  const { View } = require('react-native')
  return (props) => React.createElement(View, { testID: 'mci-icon', ...props })
})

jest.mock('react-native-vector-icons/AntDesign', () => {
  const React = require('react')
  const { View } = require('react-native')
  return (props) => React.createElement(View, { testID: 'ant-icon', ...props })
})

jest.mock('react-native-vector-icons/FontAwesome5', () => {
  const React = require('react')
  const { View } = require('react-native')
  return (props) => React.createElement(View, { testID: 'fa5-icon', ...props })
})
