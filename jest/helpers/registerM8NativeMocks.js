/* eslint-env jest */
/**
 * Native / third-party mocks for M8 profile & students UI tests.
 * Import as the first line in each M8 test file.
 */
require('./registerM7NativeMocks')

jest.mock('react-native-vector-icons/SimpleLineIcons', () => {
  const React = require('react')
  const { View } = require('react-native')
  return (props) => React.createElement(View, { testID: 'simple-line-icon', ...props })
})
