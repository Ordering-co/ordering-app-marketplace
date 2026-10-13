import { StackActions } from '@react-navigation/native'

export const checkoutReturnParams = (route: any) => (
  route?.params?.fromCheckout
    ? { fromCheckout: true, cartUuid: route.params.cartUuid }
    : null
)

export const leaveToCheckoutOrBack = (navigation: any, route: any) => {
  if (route?.params?.fromCheckout) {
    navigation.navigate('CheckoutPage', { cartUuid: route.params.cartUuid })
    return
  }
  if (navigation?.canGoBack?.()) navigation.goBack()
}

export const openFromCheckout = (navigation: any, route: any, name: string, params?: any) => {
  const stamp = checkoutReturnParams(route)
  if (!stamp) {
    navigation.navigate(name, params)
    return
  }
  if (name === 'CheckoutPage' || name === 'MultiCheckout') {
    navigation.navigate('CheckoutPage', { cartUuid: route.params.cartUuid })
    return
  }
  navigation.dispatch(StackActions.replace(name, { ...params, ...stamp }))
}
