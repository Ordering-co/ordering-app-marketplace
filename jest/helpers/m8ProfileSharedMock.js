const React = require('react')
const { View, Text, TouchableOpacity, TextInput } = require('react-native')

const OText = (props) => <Text {...props}>{props.children}</Text>

module.exports = {
  ODropDown: ({ placeholder, onSelect, options }) => (
    <View testID="odropdown">
      <Text>{placeholder}</Text>
      {(options || []).map((opt) => (
        <TouchableOpacity
          key={opt.value}
          testID={`odropdown-${opt.value}`}
          onPress={() => onSelect?.(opt.value)}
        >
          <Text>{opt.content}</Text>
        </TouchableOpacity>
      ))}
    </View>
  ),
  OText,
  OModal: ({ open, children, title, onClose }) => (
    open
      ? (
        <View testID="omodal">
          <Text>{title}</Text>
          {onClose ? <TouchableOpacity testID="omodal-close" onPress={onClose} /> : null}
          {children}
        </View>
        )
      : null
  ),
  OInput: (props) => (
    <TextInput
      testID="oinput"
      value={props.value}
      placeholder={props.placeholder}
      onChangeText={props.onChange}
    />
  ),
  OButton: ({ text, onClick, disabled }) => (
    <TouchableOpacity testID="obutton" onPress={onClick} disabled={disabled}>
      <Text>{text}</Text>
    </TouchableOpacity>
  )
}
