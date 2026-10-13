export type GiftCartLike = {
  business_id?: number | null
  uuid?: string | null
} | null | undefined

export const isGiftCardCart = (cart: GiftCartLike): boolean =>
  Boolean(cart) && cart?.business_id == null

export const shouldClearGiftCartOnLeave = (cart: GiftCartLike): boolean =>
  isGiftCardCart(cart) && typeof cart?.uuid === 'string' && cart.uuid.length > 0

const isFailedCartAction = (result: unknown): boolean =>
  result === false || Boolean(result && typeof result === 'object' && (result as { error?: unknown }).error)

export const findGiftCart = (
  carts: Record<string, unknown> | null | undefined
): GiftCartLike =>
  collectGiftCarts(carts)[0] ?? null

export const collectGiftCarts = (
  carts: Record<string, unknown> | null | undefined,
  listedCarts?: unknown[] | null
): GiftCartLike[] => {
  const collected = new Map<string, GiftCartLike>()
  const add = (item: unknown) => {
    if (!isGiftCardCart(item as GiftCartLike)) return
    const uuid = (item as { uuid?: string })?.uuid
    if (!uuid) return
    collected.set(uuid, item as GiftCartLike)
  }
  Object.values(carts ?? {}).forEach(add)
  ;(Array.isArray(listedCarts) ? listedCarts : []).forEach(add)
  return [...collected.values()]
}

export const listRemoteGiftCarts = async ({
  getCarts
}: {
  getCarts: () => Promise<any>
}): Promise<GiftCartLike[]> => {
  const response = await getCarts()
  const content = response?.content ?? response
  if (isFailedCartAction(content)) {
    throw new Error('failed to list gift carts')
  }
  const result = content?.result
  if (Array.isArray(result)) {
    return result.filter((item) => isGiftCardCart(item))
  }
  if (result && typeof result === 'object' && isGiftCardCart(result)) {
    return [result]
  }
  return []
}

export const findCartByUuid = (
  carts: Record<string, unknown> | null | undefined,
  uuid: string | null | undefined
): GiftCartLike => {
  if (!uuid) return null
  return (Object.values(carts ?? {}).find((item: any) => item?.uuid === uuid) as GiftCartLike) ?? null
}

export const deleteCartProduct = async ({
  cart,
  product,
  removeProduct,
  clearCart
}: {
  cart: GiftCartLike
  product: unknown
  removeProduct: (product: unknown, cart: GiftCartLike) => Promise<unknown>
  clearCart: (uuid: string) => Promise<unknown>
}): Promise<unknown> => {
  if (shouldClearGiftCartOnLeave(cart)) {
    return clearCart(cart?.uuid as string)
  }
  return removeProduct(product, cart)
}

export const leaveGiftCardCheckout = ({
  leave
}: {
  leave: () => void
}): boolean => {
  leave()
  return true
}

const leftoverGiftProducts = (cart: GiftCartLike): Array<{ id?: unknown }> =>
  (cart as { products?: Array<{ id?: unknown }> } | null)?.products ?? []

const isReusableGiftCart = (cart: GiftCartLike, productId: unknown): boolean => {
  const products = leftoverGiftProducts(cart)
  return Boolean(cart?.uuid) && products.length === 1 && products[0]?.id === productId
}

export type PurchaseGiftCardResult =
  | { type: 'reuse', uuid: string }
  | { type: 'created', uuid: string }
  | { type: 'failed' }

export const purchaseGiftCard = async ({
  product,
  carts,
  listGiftCarts,
  clearCart,
  addProduct
}: {
  product: { id?: unknown } | null | undefined
  carts: Record<string, unknown> | null | undefined
  listGiftCarts?: () => Promise<unknown[]>
  clearCart: (uuid: string, configurations?: { disableLoading?: boolean }) => Promise<any>
  addProduct: (
    product: { id: unknown, quantity: number },
    cart: null,
    isQuickAdd: null,
    isPlatform: true
  ) => Promise<any>
}): Promise<PurchaseGiftCardResult> => {
  const productId = product?.id
  if (productId == null) return { type: 'failed' }

  let listedCarts: unknown[] = []
  if (listGiftCarts) {
    try {
      listedCarts = await listGiftCarts()
    } catch {
      return { type: 'failed' }
    }
    if (!Array.isArray(listedCarts)) listedCarts = []
  }

  const leftovers = collectGiftCarts(carts, listedCarts)
  const reusable = leftovers.find((cart) => isReusableGiftCart(cart, productId)) ?? null
  const leftoversToClear = leftovers.filter((cart) => cart?.uuid && cart.uuid !== reusable?.uuid)

  for (const leftover of leftoversToClear) {
    try {
      const result = await clearCart(leftover?.uuid as string, { disableLoading: true })
      if (isFailedCartAction(result)) return { type: 'failed' }
    } catch {
      return { type: 'failed' }
    }
  }

  if (reusable?.uuid) {
    return { type: 'reuse', uuid: reusable.uuid }
  }

  try {
    const response = await addProduct({ id: productId, quantity: 1 }, null, null, true)
    if (isFailedCartAction(response) || !response?.result?.uuid) return { type: 'failed' }
    return { type: 'created', uuid: response.result.uuid }
  } catch {
    return { type: 'failed' }
  }
}

export const shouldLeaveGiftCheckoutWhenCartMissing = ({
  cart,
  isGiftCardCart,
  cartState
}: {
  cart: GiftCartLike
  isGiftCardCart: boolean
  cartState?: { loading?: boolean, cart?: unknown } | null
}): boolean => {
  if (!isGiftCardCart) return false
  if (cart) return false
  if (cartState?.loading) return false
  if (cartState?.cart) return false
  return true
}

export const giftCartStatePatch = (
  cart: GiftCartLike
): Record<string, GiftCartLike> | null => {
  if (!shouldClearGiftCartOnLeave(cart)) return null
  return { 'businessId:null': cart }
}
