/* eslint-env jest */
/**
 * Native / third-party mocks for M4 menu, products & cart UI tests.
 * Import as the first line in each M4 test file.
 */
require('./registerM3NativeMocks')

jest.mock('react-native-vector-icons/Feather', () => {
  const React = require('react')
  const { View } = require('react-native')
  const Feather = (props) => React.createElement(View, { testID: 'feather-icon', ...props })
  return Feather
})

jest.mock('react-native-select-dropdown', () => {
  const React = require('react')
  const { View, TouchableOpacity, Text } = require('react-native')
  return React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      openDropdown: jest.fn(),
      closeDropdown: jest.fn(),
      reset: jest.fn()
    }))
    const data = props.data || []
    return (
      <View testID="select-dropdown">
        <Text testID="select-dropdown-label">
          {props.defaultButtonText || props.defaultValue?.name || 'Select'}
        </Text>
        {data.map((item, index) => (
          <TouchableOpacity
            key={`select-item-${index}`}
            testID={`select-dropdown-item-${index}`}
            onPress={() => props.onSelect?.(item, index)}
          >
            <Text>{item?.name || item?.text || String(item)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  })
})

jest.mock('react-native-calendar-strip', () => {
  const { View } = require('react-native')
  return (props) => <View testID="calendar-strip" {...props} />
})

jest.mock('react-native-picker-select', () => {
  const { View, TouchableOpacity, Text } = require('react-native')
  return (props) => (
    <View testID="rn-picker-select">
      {(props.items || []).map((item, index) => (
        <TouchableOpacity
          key={`picker-${index}`}
          testID={`rn-picker-item-${index}`}
          onPress={() => props.onValueChange?.(item.value, index)}
        >
          <Text>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
})

jest.mock('react-native-intersection-observer', () => {
  const React = require('react')
  const { View } = require('react-native')
  return {
    InView: ({ children }) => React.createElement(View, { testID: 'in-view' }, children)
  }
})

jest.mock('react-native-uuid', () => ({
  v4: () => 'test-uuid-1'
}))

jest.mock('dayjs', () => {
  const actual = jest.requireActual('dayjs')
  return actual
})
