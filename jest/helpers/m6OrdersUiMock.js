const React = require('react')
const { View, TouchableOpacity, Text } = require('react-native')

module.exports = {
  getUiMock: () => {
    const m5 = require('./m5CheckoutUiMock').getUiMock()
    const OText = require('@/ui/src/components/shared/OText').default
    const OButton = require('@/ui/src/components/shared/OButton').default
    const OIcon = require('@/ui/src/components/shared/OIcon').default
    const { REVIEW_STATUS, REORDER_STATUS } = require('@/ui/src/config/constants')

    return {
      ...m5,
      OText,
      OButton,
      OIcon,
      REVIEW_STATUS,
      REORDER_STATUS,
      OrdersOption: (props) => (
        <View testID="orders-option-stub">
          <Text>{props.titleContent || (props.activeOrders ? 'Active' : 'Past')}</Text>
          <TouchableOpacity
            testID="orders-option-load"
            onPress={() => props.loadOrders?.(false, false, false, true)}
          />
        </View>
      ),
      ActiveOrders: (props) => (
        <View testID="active-orders-stub">
          <Text>{String(props.orders?.length ?? 0)}</Text>
          {props.orders?.length > 0 && (
            <TouchableOpacity
              testID="active-orders-load-more"
              onPress={() => props.loadMoreOrders?.()}
            />
          )}
        </View>
      ),
      PreviousOrders: (props) => (
        <View testID="previous-orders-stub">
          <Text>{String(props.orders?.length ?? 0)}</Text>
          <TouchableOpacity
            testID="previous-orders-load-more"
            onPress={() => props.loadMoreOrders?.()}
          />
        </View>
      ),
      SingleOrderCard: (props) => (
        <TouchableOpacity
          testID="single-order-card-stub"
          onPress={() => props.onNavigationRedirect?.('OrderDetails', { orderId: props.order?.uuid })}
        >
          <Text>{props.order?.business?.name || 'Order'}</Text>
        </TouchableOpacity>
      ),
      OrderStudentInfo: (props) => (
        <View testID="order-student-info-stub">
          <Text>{props.order?.student?.name || 'Student'}</Text>
        </View>
      ),
      MomentOption: () => <View testID="moment-option-stub" />,
      ProductItemAccordion: (props) => (
        <View testID="product-item-accordion-stub">
          <Text>{props.product?.name}</Text>
          <TouchableOpacity
            testID="product-delete"
            onPress={() => props.onDeleteProduct?.(props.product)}
          />
        </View>
      ),
      CouponControl: () => <View testID="coupon-control-stub" />,
      TaxInformation: () => <View testID="tax-information-stub" />,
      GiftCardOrdersList: (props) => (
        <View testID="gift-card-orders-list-stub">
          <TouchableOpacity
            testID="gift-card-orders-refresh"
            onPress={() => props.setRefreshOrders?.(true)}
          />
        </View>
      ),
      SendGiftCard: () => <View testID="send-gift-card-stub" />,
      PoweredBy: (props) => <View testID="powered-by-stub" {...props} />,
      GoogleMap: () => <View testID="google-map-stub" />,
      PlaceSpot: () => <View testID="place-spot-stub" />,
      CardAnimation: ({ children, onClick, style }) => (
        <TouchableOpacity testID="card-animation" onPress={onClick} style={style}>
          {children}
        </TouchableOpacity>
      ),
      LottieAnimation: (props) => (
        <TouchableOpacity testID="lottie-animation" onPress={props.onClick} />
      ),
      OAlertOriginal: ({ children, open, onAccept }) => (
        open ? (
          <View testID="oalert-open">
            <TouchableOpacity testID="oalert-accept" onPress={onAccept} />
          </View>
        ) : children || null
      ),
      OAlert: ({ children, onAccept }) => (
        <View testID="oalert">
          {children}
          <TouchableOpacity testID="oalert-trigger" onPress={onAccept} />
        </View>
      ),
      _setStoreData: jest.fn(),
      BusinessController: (props) => (
        <TouchableOpacity
          testID="business-controller-stub"
          onPress={() => props.handleCustomClick?.()}
        >
          <Text>{props.business?.name}</Text>
        </TouchableOpacity>
      ),
      SingleProductCard: (props) => (
        <TouchableOpacity
          testID="single-product-card-stub"
          onPress={() => props.onProductClick?.()}
        >
          <Text>{props.product?.name}</Text>
        </TouchableOpacity>
      ),
      UserDetails: () => <View testID="user-details-stub" />,
      AddressDetails: () => <View testID="address-details-stub" />,
      SignupForm: () => <View testID="signup-form-stub" />,
      StripeElementsForm: () => <View testID="stripe-elements-form-stub" />,
      StripeCardsList: () => <View testID="stripe-cards-list-stub" />,
      FloatingButton: (props) => (
        <TouchableOpacity testID="floating-button" onPress={props.handleClick}>
          <Text>{props.text || props.btnText || 'Go'}</Text>
        </TouchableOpacity>
      )
    }
  }
}
