const React = require('react')
const { View, Text, TouchableOpacity, TextInput } = require('react-native')
const m8 = require('./m8ProfileSharedMock')

module.exports = {
  ...m8,
  OIcon: (props) => <View testID="oicon" {...props} />
}
