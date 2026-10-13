const MENU_PRODUCT_FIELDS = [
  'id',
  'name',
  'price',
  'description',
  'images',
  'favorite',
  'quantity',
  'inventoried',
  'maximum_per_order',
  'code',
  'last_ordered_date'
] as const

function areProductTagsEqual (prev?: any, next?: any) {
  if (prev === next) return true
  const prevTags = Array.isArray(prev) ? prev : []
  const nextTags = Array.isArray(next) ? next : []
  if (prevTags.length !== nextTags.length) return false
  for (let i = 0; i < prevTags.length; i++) {
    if (prevTags[i] === nextTags[i]) continue
    if (prevTags[i]?.image !== nextTags[i]?.image) return false
  }
  return true
}

function areProductRibbonsEqual (prev?: any, next?: any) {
  if (prev === next) return true
  return (
    prev?.enabled === next?.enabled &&
    prev?.text === next?.text &&
    prev?.color === next?.color &&
    prev?.shape === next?.shape
  )
}

export function areMenuProductsEqual (prev?: any, next?: any) {
  if (prev === next) return true
  if (!prev || !next) return prev === next

  for (const field of MENU_PRODUCT_FIELDS) {
    if (prev[field] !== next[field]) return false
  }

  return areProductRibbonsEqual(prev.ribbon, next.ribbon) &&
    areProductTagsEqual(prev.tags, next.tags)
}

export function areSingleProductCardPropsEqual (prevProps: any, nextProps: any) {
  return (
    prevProps.isSoldOut === nextProps.isSoldOut &&
    prevProps.productAddedToCartLength === nextProps.productAddedToCartLength &&
    prevProps.isPreviously === nextProps.isPreviously &&
    prevProps.isFeatured === nextProps.isFeatured &&
    prevProps.useCustomFunctionality === nextProps.useCustomFunctionality &&
    prevProps.customText === nextProps.customText &&
    areMenuProductsEqual(prevProps.product, nextProps.product)
  )
}
