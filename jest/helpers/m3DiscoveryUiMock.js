const React = require('react')
const { View, TouchableOpacity, Text } = require('react-native')

module.exports = {
  getUiMock: () => {
    const OText = require('@/ui/src/components/shared/OText').default
    const OButton = require('@/ui/src/components/shared/OButton').default
    const OInput = require('@/ui/src/components/shared/OInput').default
    const OIcon = require('@/ui/src/components/shared/OIcon').default
    const OModal = require('@/ui/src/components/shared/OModal').default
    const OAlertOriginal = require('@/ui/src/components/shared/OAlertOriginal').default
    const { NotFoundSource } = jest.requireActual('@/ui/src/components/NotFoundSource/index')
    const { AnimatedItem } = jest.requireActual('@/ui/src/components/AnimatedItem/index')
    const { BusinessHeaderPlaceholder } = jest.requireActual('@/ui/src/components/BusinessHeaderPlaceholder/index')
    const { View: RNView } = require('react-native')

    const CardAnimation = ({ children, onClick }) => {
      return (
        <TouchableOpacity testID="card-animation" onPress={onClick}>
          {children}
        </TouchableOpacity>
      )
    }
    const LottieAnimation = (props) => (
      <TouchableOpacity testID="lottie-animation" onPress={props.onClick} />
    )

    return {
      OText,
      OButton,
      OInput,
      OIcon,
      OModal,
      OAlert: OAlertOriginal,
      OAlertOriginal,
      NotFoundSource,
      AnimatedItem,
      LottieAnimation,
      CardAnimation,
      BusinessHeaderPlaceholder,
      FavoriteList: (props) => (
        <View testID={`favorite-list-${props.isBusiness ? 'business' : props.isProduct ? 'product' : 'order'}`} />
      ),
      ReviewTrigger: (props) => (
        <View testID="review-trigger">
          <TouchableOpacity testID="review-trigger-star" onPress={() => props.handleOpenOrderReview?.(5)} />
        </View>
      ),
      OBottomPopup: ({ children, open, onClose, title }) =>
        open ? (
          <View testID="bottom-popup">
            <Text testID="bottom-popup-title">{title}</Text>
            <TouchableOpacity testID="bottom-popup-close" onPress={onClose} />
            {children}
          </View>
        ) : null,
      NotificationSetting: ({ setCheckNotificationStatus }) => (
        <TouchableOpacity
          testID="notification-setting"
          onPress={() => setCheckNotificationStatus?.({ open: false, checked: true })}
        />
      ),
      BusinessController: (props) => (
        <View testID="business-controller-stub">
          <Text testID="business-controller-name">{props.business?.name}</Text>
        </View>
      ),
      GoogleMap: React.forwardRef((props, ref) => {
        React.useImperativeHandle(ref, () => ({
          focusOnCoordinate: jest.fn(),
          recenterToUserLocation: jest.fn()
        }))
        return <View testID="google-map-stub" ref={ref} {...props} />
      }),
      DeviceOrientationMethods: {
        useDeviceOrientation: () => [{ dimensions: { width: 390, height: 844 } }]
      },
      ScheduleAccordion: () => <View testID="schedule-accordion" />,
      SingleProductCard: (props) => {
        const { TouchableOpacity, Text } = require('react-native')
        return (
          <TouchableOpacity testID="single-product-card" onPress={() => props.onProductClick?.(props.product)}>
            <Text>{props.product?.name}</Text>
          </TouchableOpacity>
        )
      },
      SingleOrderCard: (props) => {
        const { View, Text, TouchableOpacity } = require('react-native')
        return (
          <View testID="single-order-card">
            <Text>{props.order?.id}</Text>
            <TouchableOpacity testID="reorder-button" onPress={() => props.handleReorder?.(props.order)} />
          </View>
        )
      },
      SearchBar: (props) => {
        const { TextInput, View } = require('react-native')
        return (
          <View testID="search-bar">
            <TextInput
              testID="search-bar-input"
              value={props.searchValue}
              onChangeText={props.onSearch}
              placeholder={props.placeholder}
            />
          </View>
        )
      },
      BusinessTypeFilter: () => <View testID="business-type-filter-stub" />,
      BusinessReservation: () => <View testID="business-reservation" />,
      StoreMethods: {
        _retrieveStoreData: jest.fn().mockResolvedValue(null),
        _setStoreData: jest.fn(),
        _removeStoreData: jest.fn()
      },
      SafeAreaViewWrapper: ({ children }) => children,
      Toast: () => null,
      Alert: ({ open, content, onClose, onAccept }) =>
        open ? (
          <View testID="alert-provider">
            <Text testID="alert-content">{Array.isArray(content) ? content.join(' ') : content}</Text>
            <TouchableOpacity testID="alert-close" onPress={onClose || onAccept} />
          </View>
        ) : null
    }
  }
}
