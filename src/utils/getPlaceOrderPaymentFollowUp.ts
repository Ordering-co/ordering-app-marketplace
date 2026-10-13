export function getPlaceOrderPaymentFollowUp ({
  hasPlacedOrder,
  isPaymentPending,
  gateway,
  redirectUrl,
  stripePaymentOptions
}: {
  hasPlacedOrder: boolean
  isPaymentPending: boolean
  gateway: string | null
  redirectUrl: string | null
  stripePaymentOptions: string[]
}) {
  if (hasPlacedOrder) {
    return { type: 'order' as const }
  }

  if (isPaymentPending && gateway && stripePaymentOptions.includes(gateway)) {
    return { type: 'stripe' as const }
  }

  if (redirectUrl) {
    return {
      type: 'redirect' as const,
      url: redirectUrl
    }
  }

  return { type: 'none' as const }
}
