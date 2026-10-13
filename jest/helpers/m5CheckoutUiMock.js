const React = require('react')
const { View, TouchableOpacity, Text } = require('react-native')

module.exports = {
  getUiMock: () => {
    const m4 = require('./m4MenuUiMock').getUiMock()

    return {
      ...m4,
      PaymentOptions: (props) => (
        <View testID="payment-options-stub">
          <Text>{props.paymethodSelected?.name || 'payment'}</Text>
          <TouchableOpacity
            testID="payment-options-cash"
            onPress={() => props.handlePaymethodClick?.({ id: 1, gateway: 'cash', name: 'Cash' })}
          />
        </View>
      ),
      PaymentOptionCash: (props) => (
        <View testID="payment-option-cash-stub">
          <Text>{String(props.orderTotal ?? '')}</Text>
        </View>
      ),
      PaymentOptionStripe: () => <View testID="payment-option-stripe-stub" />,
      PaymentOptionWallet: () => <View testID="payment-option-wallet-stub" />,
      PaymentOptionCard: () => <View testID="payment-option-card-stub" />,
      PaymentOptionsWebView: (props) => (
        <View testID="payment-options-webview-stub">
          <Text>{props.uri}</Text>
          <TouchableOpacity
            testID="payment-webview-close"
            onPress={() => props.setShowGateway?.({ open: false, closedByUser: true })}
          />
        </View>
      ),
      StripeElementsForm: () => <View testID="stripe-elements-form-stub" />,
      StripeMethodForm: () => <View testID="stripe-method-form-stub" />,
      StripeRedirectForm: () => <View testID="stripe-redirect-form-stub" />,
      StripeCardForm: () => <View testID="stripe-card-form-stub" />,
      StripeCardsList: (props) => (
        <View testID="stripe-cards-list-stub">
          <TouchableOpacity
            testID="stripe-cards-open"
            onPress={() => props.onOpen?.()}
          />
        </View>
      ),
      StripeCardsListUI: (props) => (
        <View testID="stripe-cards-list-ui-stub">
          <Text>{props.cardsList?.cards?.[0]?.last4}</Text>
        </View>
      ),
      DriverTips: (props) => (
        <View testID="driver-tips-stub">
          <Text>{String(props.driverTip ?? '')}</Text>
          <Text testID="driver-tips-options">{(props.driverTipsOptions ?? []).join(',')}</Text>
        </View>
      ),
      AddressDetails: () => <View testID="address-details-stub" />,
      OrderSummary: () => <View testID="order-summary-stub" />,
      CheckoutStudentDetails: () => <View testID="checkout-student-details-stub" />,
      UserDetails: () => <View testID="user-details-stub" />,
      WalletTransactions: (props) => (
        <View testID="wallet-transactions-stub">
          <Text>{props.currentWalletSelected?.type || 'wallet'}</Text>
        </View>
      ),
      WalletTransactionItem: (props) => (
        <View testID="wallet-transaction-item-stub">
          <Text>{props.item?.description}</Text>
        </View>
      ),
      GiftCardUI: () => <View testID="gift-card-ui-stub" />,
      StudentFormModal: () => <View testID="student-form-modal-stub" />,
      LoginForm: () => <View testID="login-form-stub" />,
      SignupForm: () => <View testID="signup-form-stub" />,
      BusinessReservation: () => <View testID="business-reservation-stub" />,
      CartStoresListing: () => <View testID="cart-stores-listing-stub" />,
      FloatingButton: (props) => (
        <TouchableOpacity testID="floating-button" onPress={props.handleClick}>
          <Text>{props.btnText || 'Go'}</Text>
        </TouchableOpacity>
      ),
      NavBar: (props) => (
        <View testID="navbar">
          <Text testID="navbar-title">{props.title}</Text>
          {props.onActionLeft ? (
            <TouchableOpacity testID="navbar-back" onPress={props.onActionLeft} />
          ) : null}
        </View>
      ),
      NotFoundSource: (props) => (
        <View testID="not-found-source">
          <Text>{props.content}</Text>
          {props.onClickButton ? (
            <TouchableOpacity testID="not-found-btn" onPress={props.onClickButton}>
              <Text>{props.btnTitle}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ),
      OBottomPopup: ({ open, children }) => (open ? <View testID="obottom-popup">{children}</View> : null),
      currencyWithoutDecimals: ['USD', 'JPY']
    }
  }
}
