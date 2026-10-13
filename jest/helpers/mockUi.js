import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export const _setStoreData = jest.fn()
export const _removeStoreData = jest.fn()
export const _retrieveStoreData = jest.fn()

export const NavBar = ({ title, subtitle, onActionLeft }) => (
  <View testID="navbar">
    <Text testID="navbar-title">{title}</Text>
    {subtitle ? <Text testID="navbar-subtitle">{subtitle}</Text> : null}
    {onActionLeft ? (
      <TouchableOpacity testID="navbar-back" onPress={onActionLeft} />
    ) : null}
  </View>
)

export const SafeAreaViewWrapper = ({ children, onRefresh }) => (
  <View testID="safe-area">
    {onRefresh ? (
      <TouchableOpacity testID="safe-area-refresh" onPress={onRefresh} />
    ) : null}
    {children}
  </View>
)

export const CouponOffers = (props) => (
  <View testID="coupon-offers-controller">
    <Text testID="coupon-offers-business-id">{props.businessId}</Text>
    <TouchableOpacity testID="coupon-offers-back" onPress={props.onGoBack} />
  </View>
)

export const Container = ({ children, refreshControl }) => (
  <View testID="container">
    {refreshControl?.props?.onRefresh ? (
      <TouchableOpacity
        testID="container-refresh"
        onPress={refreshControl.props.onRefresh}
      />
    ) : null}
    {children}
  </View>
)

export const LoginForm = (props) => (
  <View testID="login-form">
    <Text>{props.loginButtonText}</Text>
    <TouchableOpacity
      testID="login-success-home"
      onPress={() =>
        props.handleSuccessLogin?.({
          id: 1,
          email: 'user@test.com',
          addresses: [{ default: true }]
        })
      }
    />
    <TouchableOpacity
      testID="login-success-address"
      onPress={() => props.handleSuccessLogin?.({ id: 2, addresses: [] })}
    />
    <TouchableOpacity
      testID="login-success-missing-addresses"
      onPress={() =>
        props.handleSuccessLogin?.({
          id: 7,
          email: 'user@test.com',
          session: { access_token: 'token' }
        })
      }
    />
    <TouchableOpacity
      testID="login-redirect"
      onPress={() => props.onNavigationRedirect?.('Signup')}
    />
  </View>
)

export const SignupForm = (props) => (
  <View testID="signup-form">
    <Text>{props.signupButtonText}</Text>
    <TouchableOpacity
      testID="signup-success-home"
      onPress={() =>
        props.handleSuccessSignup?.({
          id: 3,
          email: 'new@test.com',
          phone_verified: true,
          email_verified: true,
          session: { access_token: 'token' },
          addresses: [{ default: true }]
        })
      }
    />
    <TouchableOpacity
      testID="signup-success-verify"
      onPress={() =>
        props.handleSuccessSignup?.({
          id: 4,
          email_verified: false,
          phone_verified: false,
          session: { access_token: 'token' }
        })
      }
    />
    <TouchableOpacity
      testID="signup-success-missing-addresses"
      onPress={() =>
        props.handleSuccessSignup?.({
          id: 5,
          email: 'new@test.com',
          phone_verified: true,
          email_verified: true,
          session: { access_token: 'token' }
        })
      }
    />
    <TouchableOpacity
      testID="signup-success-empty-addresses"
      onPress={() =>
        props.handleSuccessSignup?.({
          id: 6,
          email: 'new@test.com',
          phone_verified: true,
          email_verified: true,
          session: { access_token: 'token' },
          addresses: []
        })
      }
    />
    <TouchableOpacity
      testID="signup-redirect"
      onPress={() => props.onNavigationRedirect?.('Login')}
    />
  </View>
)

export const ForgotPasswordForm = (props) => (
  <View testID="forgot-password-form">
    <TouchableOpacity
      testID="forgot-back"
      onPress={() => props.navigation?.goBack?.()}
    />
  </View>
)

export const UserVerification = (props) => (
  <View testID="user-verification-controller" {...props} />
)

export const Sessions = (props) => (
  <View testID="sessions-controller" {...props} />
)

const BusinessStub = ({ testID, props }) => (
  <View testID={testID}>
    <TouchableOpacity
      testID={`${testID}-business`}
      onPress={() =>
        props.onBusinessClick?.({ slug: 'demo-store', header: 'Header', logo: 'logo.png' })
      }
    />
    <TouchableOpacity
      testID={`${testID}-nav`}
      onPress={() => props.onNavigationRedirect?.('BusinessListingSearch', { term: 'pizza' })}
    />
    <TouchableOpacity
      testID={`${testID}-nav-empty`}
      onPress={() => props.onNavigationRedirect?.('', null)}
    />
  </View>
)

export const HomeView = (props) => (
  <View testID="home-view">
    <TouchableOpacity
      testID="home-nav"
      onPress={() => props.onNavigationRedirect?.('BusinessListingSearch', { term: 'pizza' })}
    />
    <TouchableOpacity
      testID="home-nav-empty"
      onPress={() => props.onNavigationRedirect?.('', null)}
    />
  </View>
)

export const BusinessesListing = (props) => (
  <BusinessStub testID="businesses-listing" props={props} />
)

export const BusinessListingSearch = (props) => (
  <BusinessStub testID="business-listing-search" props={props} />
)

export const BusinessSearchMap = (props) => (
  <BusinessStub testID="business-search-map" props={props} />
)

export const BusinessProductsListing = (props) => (
  <View testID="business-products-listing">
    <TouchableOpacity
      testID="bpl-search-redirect"
      onPress={() => props.handleSearchRedirect?.()}
    />
    <TouchableOpacity testID="bpl-go-back" onPress={() => props.onGoBack?.()} />
    <TouchableOpacity
      testID="bpl-nav-replace"
      onPress={() => props.onNavigationRedirect?.('Checkout', { cartId: 1 }, true)}
    />
    <TouchableOpacity
      testID="bpl-nav"
      onPress={() => props.onNavigationRedirect?.('Cart', {}, false)}
    />
    <TouchableOpacity
      testID="bpl-business"
      onPress={() =>
        props.onBusinessClick?.({ slug: 'product-store', header: 'H', logo: 'L' })
      }
    />
  </View>
)

export const BusinessPreorder = (props) => (
  <View testID="business-preorder-controller">
    <TouchableOpacity testID="business-preorder-back" onPress={() => props.goToBack?.()} />
  </View>
)

export const Promotions = (props) => (
  <View testID="promotions-controller" {...props} />
)

export const Favorite = (props) => (
  <View testID="favorite-controller">
    <TouchableOpacity
      testID="favorite-redirect"
      onPress={() => props.onRedirect?.('Business', { store: 'fav-store' })}
    />
    <TouchableOpacity testID="favorite-back" onPress={() => props.goToBack?.()} />
  </View>
)

export const ProductForm = (props) => (
  <View testID="product-form">
    <TouchableOpacity testID="product-save" onPress={() => props.onSave?.()} />
    <TouchableOpacity testID="product-go-back" onPress={() => props.onGoBack?.()} />
  </View>
)

export const CartContent = (props) => (
  <View testID="cart-content">
    <TouchableOpacity
      testID="cart-nav-replace"
      onPress={() => props.onNavigationRedirect?.('Checkout', { cartId: 2 }, true)}
    />
    <TouchableOpacity
      testID="cart-nav"
      onPress={() => props.onNavigationRedirect?.('Home', {}, false)}
    />
  </View>
)

export const MomentOption = (props) => (
  <View testID="moment-option-controller" maxDate={props.maxDate}>
    <TouchableOpacity testID="moment-go-back" onPress={() => props.goToBack?.()} />
  </View>
)

export const OrderTypeSelector = (props) => (
  <View testID="order-type-selector">
    <TouchableOpacity
      testID="order-type-nav"
      onPress={() => props.onNavigationRedirect?.('MomentOption', { business: { id: 1 } })}
    />
    <TouchableOpacity testID="order-type-back" onPress={() => props.goToBack?.()} />
  </View>
)

export const UpsellingProducts = (props) => (
  <View testID="upselling-products">
    <TouchableOpacity testID="upselling-go-back" onPress={() => props.onGoBack?.()} />
    <TouchableOpacity
      testID="upselling-nav"
      onPress={() => props.onNavigationRedirect?.('ProductDetails', { productId: 9 })}
    />
  </View>
)

export const Checkout = (props) => (
  <View testID="checkout-controller">
    <TouchableOpacity
      testID="checkout-place-order-existing"
      onPress={() =>
        props.onPlaceOrderClick?.(
          {},
          {},
          { order: { uuid: 'ord-1' }, order_id: 42 }
        )
      }
    />
    <TouchableOpacity
      testID="checkout-place-order-stripe"
      onPress={() =>
        props.onPlaceOrderClick?.(
          {},
          { gateway: 'stripe' },
          { status: 2, uuid: 'cart-1' },
          { scrollToTop: jest.fn() }
        )
      }
    />
    <TouchableOpacity
      testID="checkout-place-order-redirect"
      onPress={() =>
        props.onPlaceOrderClick?.(
          {},
          { gateway: 'epayco' },
          {
            status: 2,
            paymethod_data: { result: { redirect_url: 'https://pay.test' } }
          },
          { scrollToTop: jest.fn() }
        )
      }
    />
    <TouchableOpacity
      testID="checkout-place-order-redirect-no-gateway"
      onPress={() =>
        props.onPlaceOrderClick?.(
          {},
          {},
          {
            paymethod_data: { result: { redirect_url: 'https://pay-no-gateway.test' } }
          },
          { scrollToTop: jest.fn() }
        )
      }
    />
    <TouchableOpacity
      testID="checkout-nav-order-details"
      onPress={() =>
        props.onNavigationRedirect?.('OrderDetails', {
          isFromCheckout: true,
          orderId: 'ord-x',
          orderNumberId: 7
        })
      }
    />
    <TouchableOpacity
      testID="checkout-nav"
      onPress={() => props.onNavigationRedirect?.('SavedCards', { userId: 1 })}
    />
    <TouchableOpacity
      testID="checkout-nav-empty"
      onPress={() => props.onNavigationRedirect?.('', null)}
    />
    <TouchableOpacity
      testID="checkout-go-back"
      onPress={() => {
        const handler = props.onGoBack?.()
        if (typeof handler === 'function') handler()
      }}
    />
  </View>
)

export const MultiCart = (props) => (
  <View testID="multi-cart-controller">
    <TouchableOpacity
      testID="multi-cart-checkout"
      onPress={() => props.handleOnRedirectCheckout?.('cart-uuid-1')}
    />
    <TouchableOpacity
      testID="multi-cart-multi-checkout"
      onPress={() => props.handleOnRedirectMultiCheckout?.('cart-uuid-2')}
    />
  </View>
)

export const MultiCheckout = (props) => (
  <View testID="multi-checkout-controller">
    <TouchableOpacity
      testID="multi-checkout-place-complete"
      onPress={() => props.onPlaceOrderClick?.({ id: 99, status: 'complete' })}
    />
    <TouchableOpacity
      testID="multi-checkout-place-incomplete"
      onPress={() => props.onPlaceOrderClick?.({ status: 'payment_incomplete' })}
    />
    <TouchableOpacity
      testID="multi-checkout-replace-nav"
      onPress={() => props.onNavigationRedirectReplace?.('Home', { tab: 'orders' })}
    />
    <TouchableOpacity
      testID="multi-checkout-stripe-action"
      onPress={() =>
        props.actionsBeforePlace?.(
          {
            gateway: 'stripe',
            paymethod_data: { id: 'pm_1' },
            paymethod_id: 1,
            paymethod: { credentials: { publishable: 'pk_test' } }
          },
          {
            status: 'payment_incomplete',
            total: 10,
            payment_events: [
              {
                event: 'pending_payment',
                data: { extra: { client_secret: 'secret_test' } }
              }
            ],
            paymethod_data: { result: { client_secret: 'secret_test' } }
          }
        )
      }
    />
    <TouchableOpacity
      testID="multi-checkout-epayco-action"
      onPress={() =>
        props.actionsBeforePlace?.({ gateway: 'epayco' }, {
          id: 'cart-epayco',
          paymethod_data: { result: { redirect_url: 'https://epayco.test/pay' } }
        })
      }
    />
  </View>
)

export const SavedCards = (props) => (
  <View testID="saved-cards-controller">
    <TouchableOpacity testID="saved-cards-back" onPress={() => props.goToBack?.()} />
    <TouchableOpacity
      testID="saved-cards-nav"
      onPress={() => props.onNavigationRedirect?.('CheckoutPage', { cartUuid: 'c1' })}
    />
  </View>
)

export const CashWallet = (props) => (
  <View testID="cash-wallet-controller">
    <TouchableOpacity
      testID="cash-wallet-refresh"
      onPress={() => props.setRefreshWallets?.(true)}
    />
  </View>
)

export const Wallets = (props) => (
  <View testID="wallets-controller">
    <TouchableOpacity
      testID="wallets-refresh"
      onPress={() => props.setRefreshWallets?.(true)}
    />
  </View>
)

export const LoyaltyPoints = (props) => (
  <View testID="loyalty-points-controller">
    <TouchableOpacity
      testID="loyalty-refresh"
      onPress={() => props.setRefreshWallets?.(true)}
    />
  </View>
)

export const MyOrders = (props) => (
  <View testID="my-orders-controller">
    <TouchableOpacity testID="my-orders-back" onPress={() => props.goToBack?.()} />
    <TouchableOpacity
      testID="my-orders-nav"
      onPress={() => props.onNavigationRedirect?.('OrderDetails', { orderId: 5 })}
    />
    <TouchableOpacity
      testID="my-orders-nav-empty"
      onPress={() => props.onNavigationRedirect?.('', null)}
    />
    <TouchableOpacity
      testID="my-orders-checkout"
      onPress={() => props.handleRedirectToCheckout?.('cart-uuid')}
    />
    <TouchableOpacity
      testID="my-orders-checkout-empty"
      onPress={() => props.handleRedirectToCheckout?.(null)}
    />
    <TouchableOpacity
      testID="my-orders-refresh"
      onPress={() => props.setRefreshOrders?.(true)}
    />
  </View>
)

export const OrderDetails = (props) => (
  <View testID="order-details-controller">
    <TouchableOpacity testID="order-details-go-back" onPress={() => props.onGoBack?.()} />
    <TouchableOpacity
      testID="order-details-nav"
      onPress={() => props.onNavigationRedirect?.('ReviewOrder', { order: { id: 1 } })}
    />
    <TouchableOpacity
      testID="order-details-nav-empty"
      onPress={() => props.onNavigationRedirect?.('', null)}
    />
  </View>
)

export const MultiOrdersDetails = (props) => (
  <View testID="multi-orders-details-controller">
    <TouchableOpacity testID="multi-orders-redirect" onPress={() => props.onRedirectPage?.()} />
  </View>
)

export const ReviewDriver = (props) => (
  <View testID="review-driver-controller">
    <TouchableOpacity
      testID="review-driver-nav"
      onPress={() => props.onNavigationRedirect?.('OrderDetails', { orderId: 2 })}
    />
  </View>
)

export const ReviewOrder = (props) => (
  <View testID="review-order-controller">
    <TouchableOpacity
      testID="review-order-nav"
      onPress={() => props.onNavigationRedirect?.('ReviewProducts', { order: { id: 3 } })}
    />
  </View>
)

export const ReviewProducts = (props) => (
  <View testID="review-products-controller">
    <TouchableOpacity
      testID="review-products-nav"
      onPress={() => props.onNavigationRedirect?.('Home', {})}
    />
  </View>
)

export const UserProfile = (props) => (
  <View testID="user-profile-controller">
    <TouchableOpacity
      testID="user-profile-nav"
      onPress={() => props.onNavigationRedirect?.('UserProfileForm', {})}
    />
    <TouchableOpacity testID="user-profile-back" onPress={() => props.goToBack?.()} />
  </View>
)

export const UserProfileForm = (props) => (
  <View testID="user-profile-form-controller">
    <TouchableOpacity
      testID="user-profile-form-nav"
      onPress={() => props.onNavigationRedirect?.('AddressList', {})}
    />
  </View>
)

export const AddressForm = (props) => (
  <View testID="address-form-controller">
    <TouchableOpacity
      testID="address-form-nav"
      onPress={() => props.onNavigationRedirect?.('AddressList', {})}
    />
    <Text testID="address-form-guest-store">{String(props.isGuestFromStore)}</Text>
    <Text testID="address-form-go-back">{String(props.isGoBack)}</Text>
  </View>
)

export const AddressList = (props) => (
  <View testID="address-list-controller">
    <TouchableOpacity testID="address-list-back" onPress={() => props.goToBack?.()} />
    <TouchableOpacity
      testID="address-list-nav"
      onPress={() => props.onNavigationRedirect?.('AddressForm', { isEditing: true })}
    />
  </View>
)

export const StudentsList = (props) => (
  <View testID="students-list-controller" />
)

export const ProjectForm = (props) => (
  <View testID="project-form-controller">
    <TouchableOpacity
      testID="project-form-nav"
      onPress={() => props.onNavigationRedirect?.('Home', { tab: 'profile' })}
    />
    <TouchableOpacity
      testID="project-form-nav-empty"
      onPress={() => props.onNavigationRedirect?.('', null)}
    />
  </View>
)

export const Languages = (props) => (
  <View testID="languages-controller">
    <TouchableOpacity
      testID="languages-redirect"
      onPress={() => props.onRedirect?.('Profile', {})}
    />
  </View>
)

export const NotificationsList = (props) => (
  <View testID="notifications-list-controller">
    <TouchableOpacity
      testID="notifications-nav"
      onPress={() => props.onNavigationRedirect?.('Profile', {})}
    />
  </View>
)

export const USER_TYPE = {
  DRIVER: 'driver',
  BUSINESS: 'business'
}

export const MessageListing = (props) => (
  <View testID="message-listing-controller">
    <TouchableOpacity
      testID="message-listing-nav"
      onPress={() => props.onNavigationRedirect?.('MessageView', { orderId: 1 })}
    />
    <TouchableOpacity testID="message-listing-back" onPress={() => props.goToBack?.()} />
    <TouchableOpacity
      testID="message-listing-refresh"
      onPress={() => props.setRefreshOrders?.(true)}
    />
  </View>
)

export const Messages = (props) => (
  <View testID="messages-chat-controller">
    <TouchableOpacity testID="messages-close" onPress={() => props.onClose?.()} />
  </View>
)

export const Help = (props) => (
  <View testID="help-controller">
    <TouchableOpacity
      testID="help-redirect"
      onPress={() => props.onRedirect?.('HelpOptions', { topic: 'orders' })}
    />
  </View>
)

export const HelpOptions = (props) => (
  <View testID="help-options-controller" />
)

export const GiftCardUI = (props) => (
  <View testID="gift-card-controller" />
)

export const SafeAreaContainer = ({ children }) => (
  <View testID="safe-area-container">{children}</View>
)

export const NetworkError = () => (
  <View testID="network-error-screen" />
)

export const NotFoundSource = ({ onClickButton, btnTitle, content }) => (
  <View testID="not-found-source">
    <Text testID="not-found-content">{content}</Text>
    <Text testID="not-found-btn-title">{btnTitle}</Text>
    <TouchableOpacity testID="not-found-button" onPress={() => onClickButton?.()} />
  </View>
)

export const OIcon = (props) => <View testID="o-icon" {...props} />
export const OText = ({ children }) => <Text testID="o-text">{children}</Text>

export const PoweredBy = (props) => {
  const { PoweredBy: RealPoweredBy } = require('../../src/ui/src/components/PoweredBy')
  return <RealPoweredBy {...props} />
}

export const DeviceOrientationMethods = {
  useDeviceOrientation: () => [{ dimensions: { width: 390, height: 844 } }]
}

const mockUi = {
  NavBar,
  SafeAreaViewWrapper,
  Container,
  LoginForm,
  SignupForm,
  ForgotPasswordForm,
  UserVerification,
  Sessions,
  HomeView,
  BusinessesListing,
  BusinessListingSearch,
  BusinessSearchMap,
  BusinessProductsListing,
  BusinessPreorder,
  Promotions,
  Favorite,
  ProductForm,
  CartContent,
  CouponOffers,
  MomentOption,
  OrderTypeSelector,
  UpsellingProducts,
  Checkout,
  MultiCart,
  MultiCheckout,
  SavedCards,
  CashWallet,
  Wallets,
  LoyaltyPoints,
  MyOrders,
  OrderDetails,
  MultiOrdersDetails,
  ReviewDriver,
  ReviewOrder,
  ReviewProducts,
  UserProfile,
  UserProfileForm,
  AddressForm,
  AddressList,
  StudentsList,
  ProjectForm,
  Languages,
  NotificationsList,
  USER_TYPE,
  MessageListing,
  Messages,
  Help,
  HelpOptions,
  GiftCardUI,
  SafeAreaContainer,
  NetworkError,
  NotFoundSource,
  OIcon,
  OText,
  PoweredBy,
  _setStoreData,
  _removeStoreData,
  _retrieveStoreData,
  DeviceOrientationMethods
}

module.exports = mockUi
