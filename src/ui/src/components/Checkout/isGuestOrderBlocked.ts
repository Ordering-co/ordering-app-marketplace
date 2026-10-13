export function isGuestOrderBlocked ({
  guestId,
  isGuestCheckoutEnabled,
  isMaweja
}: {
  guestId?: unknown
  isGuestCheckoutEnabled: boolean
  isMaweja: boolean
}) {
  return !!guestId && (!isGuestCheckoutEnabled || isMaweja)
}

export function showContinueAsGuest ({
  isGuestCheckoutEnabled,
  isMaweja
}: {
  isGuestCheckoutEnabled: boolean
  isMaweja: boolean
}) {
  return isGuestCheckoutEnabled && !isMaweja
}
