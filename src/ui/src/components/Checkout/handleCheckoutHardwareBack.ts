import { leaveGiftCardCheckout, shouldClearGiftCartOnLeave, type GiftCartLike } from '../../../../utils/giftCardCart'

type HandleCheckoutHardwareBackParams = {
  isPaypalWebviewOpen: boolean
  closePaypalWebview: () => void
  cart: GiftCartLike
  leave: () => void
}

export const handleCheckoutHardwareBack = ({
  isPaypalWebviewOpen,
  closePaypalWebview,
  cart,
  leave
}: HandleCheckoutHardwareBackParams): boolean => {
  if (isPaypalWebviewOpen) {
    closePaypalWebview()
    return true
  }
  if (shouldClearGiftCartOnLeave(cart)) {
    leaveGiftCardCheckout({ leave })
    return true
  }
  return false
}
