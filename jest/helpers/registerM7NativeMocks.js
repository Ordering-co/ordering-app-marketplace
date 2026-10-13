/* eslint-env jest */
/**
 * Native / third-party mocks for M7 reviews & messages UI tests.
 * Import as the first line in each M7 test file.
 */
require('./registerM6NativeMocks')

jest.mock('react-native-gifted-chat', () => {
  const React = require('react')
  const { View, Text } = require('react-native')

  const GiftedChat = (props) => (
    <View testID="gifted-chat">
      <Text testID="gifted-chat-count">{String(props.messages?.length ?? 0)}</Text>
      {props.renderInputToolbar?.({})}
      {props.renderComposer?.({})}
      {props.renderSend?.({})}
    </View>
  )

  const Day = (props) => <View testID="gifted-day" {...props} />

  return {
    GiftedChat,
    Actions: (props) => <View testID="gifted-actions" {...props} />,
    InputToolbar: ({ children, renderAccessory, ...props }) => (
      <View testID="gifted-input-toolbar" {...props}>
        {renderAccessory?.()}
        {children}
      </View>
    ),
    Composer: (props) => (
      <View testID="gifted-composer">
        <Text>{props.placeholder}</Text>
      </View>
    ),
    Send: (props) => <View testID="gifted-send" {...props} />,
    Bubble: (props) => <View testID="gifted-bubble" {...props} />,
    MessageImage: (props) => <View testID="gifted-message-image" {...props} />,
    Day,
    SystemMessage: (props) => <View testID="gifted-system-message" {...props} />,
    Message: (props) => <View testID="gifted-message" {...props} />,
    Time: (props) => <View testID="gifted-time" {...props} />
  }
})

jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn()
}))

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn()
}))
