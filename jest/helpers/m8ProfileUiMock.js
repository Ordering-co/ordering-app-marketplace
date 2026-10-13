const React = require('react')
const { View, TouchableOpacity, Text } = require('react-native')

module.exports = {
  getUiMock: () => {
    const m7 = require('./m7ReviewsUiMock').getUiMock()
    const OText = require('@/ui/src/components/shared/OText').default
    const OButton = require('@/ui/src/components/shared/OButton').default
    const OInput = require('@/ui/src/components/shared/OInput').default
    const OIcon = require('@/ui/src/components/shared/OIcon').default
    const OModal = require('@/ui/src/components/shared/OModal').default
    const OAlert = require('@/ui/src/components/shared/OAlert').default

    return {
      ...m7,
      OText,
      OButton,
      OInput,
      OIcon,
      OModal,
      OAlertOriginal: OAlert,
      UserFormDetailsUI: (props) => (
        <View testID="user-form-details-ui-stub">
          <Text>{props.isEdit ? 'editing' : 'viewing'}</Text>
        </View>
      ),
      VerifyPhone: () => <View testID="verify-phone-stub" />,
      LogoutButton: () => <View testID="logout-button-stub" />,
      WebsocketStatus: () => <View testID="websocket-status-stub" />,
      DatePickerUI: () => <View testID="date-picker-ui-stub" />,
      SignupForm: () => <View testID="signup-form-stub" />,
      PhoneInputNumber: () => <View testID="phone-input-number-stub" />
    }
  }
}
