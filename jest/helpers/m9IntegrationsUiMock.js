const React = require('react')
const { View, TouchableOpacity, Text, TextInput } = require('react-native')

module.exports = {
  getUiMock: () => {
    const m8 = require('./m8ProfileUiMock').getUiMock()

    const OText = (props) => <Text {...props}>{props.children}</Text>
    const OButton = ({ text, onClick, disabled, loading, testID }) => (
      <TouchableOpacity testID={testID || 'obutton'} onPress={onClick} disabled={disabled}>
        <Text>{loading ? 'Loading' : text}</Text>
      </TouchableOpacity>
    )
    const OInput = (props) => (
      <TextInput
        testID="oinput"
        value={props.value}
        placeholder={props.placeholder}
        onChangeText={props.onChange}
      />
    )
    const OIcon = (props) => <View testID="oicon" {...props} />
    const OModal = ({ open, children, title, onClose }) => (
      open
        ? (
          <View testID="omodal">
            {!!title && <Text>{title}</Text>}
            {onClose ? <TouchableOpacity testID="omodal-close" onPress={onClose} /> : null}
            {children}
          </View>
          )
        : null
    )
    const OAlert = ({ children, onAccept }) => (
      <View testID="oalert">
        {children}
        <TouchableOpacity testID="oalert-trigger" onPress={onAccept} />
      </View>
    )

    return {
      ...m8,
      OText,
      OButton,
      OInput,
      OIcon,
      OModal,
      OAlertOriginal: OAlert,
      OAlert,
      NotFoundSource: ({ content, iconName }) => (
        <View testID="not-found-source">
          {!!iconName && <Text testID="not-found-icon">{iconName}</Text>}
          <Text>{content}</Text>
        </View>
      ),
      OBottomPopup: ({ open, children, title, onClose }) => (
        open
          ? (
            <View testID="obottom-popup">
              <Text>{title}</Text>
              <TouchableOpacity testID="obottom-popup-close" onPress={onClose} />
              {children}
            </View>
            )
          : null
      ),
      GPSButton: () => <View testID="gps-button-stub" />,
      GoogleMap: () => <View testID="google-map-stub" />,
      PurchaseGiftCard: () => <View testID="purchase-gift-card-stub" />,
      RedeemGiftCard: () => <View testID="redeem-gift-card-stub" />,
      VerticalGiftCardOrdersLayout: ({ title }) => (
        <View testID="vertical-gift-card-layout-stub">
          <OText>{title}</OText>
        </View>
      ),
      ProfessionalProfile: ({ professional, onClose }) => (
        <View testID="professional-profile-stub">
          <OText>{professional?.name}</OText>
          <TouchableOpacity testID="professional-profile-close" onPress={onClose} />
        </View>
      ),
      PhoneInputNumber: () => <View testID="phone-input-number-stub" />
    }
  }
}
