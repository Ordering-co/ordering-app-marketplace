function hasValue (value: unknown) {
  return value != null && value !== ''
}

function asParamsObject (value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
}

export function getHomeDeepLinkPlan ({
  orderIdParam,
  cartUuidParam,
  storeParam,
  productParam
}: {
  orderIdParam?: unknown
  cartUuidParam?: unknown
  storeParam?: unknown
  productParam?: unknown
}) {
  if (hasValue(orderIdParam)) {
    return {
      screen: 'OrderDetails' as const,
      routeParams: { orderId: orderIdParam }
    }
  }

  if (hasValue(cartUuidParam)) {
    return {
      screen: 'CheckoutPage' as const,
      routeParams: { cartUuid: cartUuidParam }
    }
  }

  if (hasValue(storeParam)) {
    return {
      screen: 'Business' as const,
      routeParams: {
        store: storeParam,
        ...asParamsObject(productParam)
      }
    }
  }

  return {
    screen: null,
    routeParams: null
  }
}

export function getMyAccountDeepLinkNavigateArgs (params: {
  orderIdParam?: unknown
  cartUuidParam?: unknown
  storeParam?: unknown
  productParam?: unknown
}) {
  if (!getHomeDeepLinkPlan(params).screen) return null

  return {
    name: 'MyAccount',
    params: {
      orderIdParam: params.orderIdParam ?? null,
      cartUuidParam: params.cartUuidParam ?? null,
      storeParam: params.storeParam ?? null,
      productParam: params.productParam ?? null
    },
    merge: true
  }
}
