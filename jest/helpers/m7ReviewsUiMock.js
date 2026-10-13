const React = require('react')
const { View, TouchableOpacity, Text } = require('react-native')

module.exports = {
  getUiMock: () => {
    const m6 = require('./m6OrdersUiMock').getUiMock()
    const { ORDER_STATUS } = require('@/ui/src/config/constants')
    const OText = require('@/ui/src/components/shared/OText').default
    const OButton = require('@/ui/src/components/shared/OButton').default
    const OIcon = require('@/ui/src/components/shared/OIcon').default
    const OIconButton = require('@/ui/src/components/shared/OIconButton').default

    return {
      ...m6,
      OText,
      OButton,
      OIcon,
      OIconButton,
      ORDER_STATUS,
      OModal: ({ open, children, onClose }) => (
        open
          ? (
            <View testID="omodal">
              <TouchableOpacity testID="omodal-close" onPress={onClose} />
              {children}
            </View>
            )
          : null
      ),
      Messages: (props) => (
        <View testID="messages-stub">
          <Text>{props.order?.id}</Text>
          <TouchableOpacity testID="messages-close" onPress={props.onClose} />
        </View>
      ),
      SingleProductReview: (props) => (
        <View testID="single-product-review-stub">
          <Text>{props.product?.name}</Text>
        </View>
      ),
      FloatingBottomContainer: ({ children }) => (
        <View testID="floating-bottom-container">{children}</View>
      ),
      NavBar: (props) => (
        <View testID="navbar">
          <Text testID="navbar-title">{props.title}</Text>
        </View>
      )
    }
  }
}
