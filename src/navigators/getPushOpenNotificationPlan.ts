function hasValue (value: unknown) {
  return value != null && value !== '' && value !== 'null'
}

function isPushOrderStackGated ({
  isProfileCompletionRequired,
  isUserVerifyRequired,
  isGuest
}: {
  isProfileCompletionRequired?: unknown
  isUserVerifyRequired?: unknown
  isGuest?: unknown
}) {
  return !!isProfileCompletionRequired || (!!isUserVerifyRequired && !isGuest)
}

export function getPushNotificationTarget (notification: unknown) {
  const additionalData = notification && typeof notification === 'object'
    ? (notification as { additionalData?: any, data?: any }).additionalData ??
      (notification as { additionalData?: any, data?: any }).data
    : undefined

  if (hasValue(additionalData?.order_uuid)) {
    return {
      screen: 'OrderDetails' as const,
      params: {
        orderId: additionalData.order_uuid,
        isFromRoot: true
      }
    }
  }

  if (hasValue(additionalData?.cart_uuid)) {
    return {
      screen: 'CheckoutPage' as const,
      params: {
        cartUuid: additionalData.cart_uuid
      }
    }
  }

  return null
}

export function getPushOpenNotificationPlan ({
  loaded,
  auth,
  isProfileCompletionRequired,
  isUserVerifyRequired,
  isGuest,
  notification
}: {
  loaded?: unknown
  auth?: unknown
  isProfileCompletionRequired?: unknown
  isUserVerifyRequired?: unknown
  isGuest?: unknown
  notification?: unknown
}) {
  const target = getPushNotificationTarget(notification)
  const shouldOpen = !!loaded &&
    !!auth &&
    !isPushOrderStackGated({ isProfileCompletionRequired, isUserVerifyRequired, isGuest }) &&
    target != null

  return {
    shouldOpen,
    screen: shouldOpen ? target.screen : null,
    params: shouldOpen ? target.params : null
  }
}
