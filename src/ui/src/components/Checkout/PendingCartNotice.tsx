import React, { useRef } from 'react'
import { Alert } from 'react-native'
import { useTheme } from 'styled-components/native'

import { useLanguage, useToast, ToastType } from '@components'

import OButton from '../shared/OButton'
import OText from '../shared/OText'
import { MawejaCartNotice } from './layouts/Maweja'
import { Notice } from './layouts/Maweja/styles'
import { PendingCartNoticeAction, PendingCartNoticeContent } from './styles'

export const PendingCartNotice = (props: any) => {
  const {
    isMaweja,
    isPlacedHere,
    paymethodName,
    isPendingCartReleasable,
    releasingPendingCart,
    handleReleasePendingCart,
    onOrderCreated,
    onReleased
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [, { showToast }] = useToast()
  // The dialogs outlive the render that opened them: always release with the latest handler
  const releasePendingCart = useRef(handleReleasePendingCart)
  releasePendingCart.current = handleReleasePendingCart

  const paymethod = paymethodName || t('PAYMENT_GATEWAY', 'the payment gateway')
  const withPaymethod = (text: string) => text.replace('_paymethod_', paymethod)

  const handleRelease = async () => {
    let response
    try {
      response = await releasePendingCart.current?.()
    } catch {
      response = { outcome: 'error' }
    }
    if (!response) return
    if (response.outcome === 'released') {
      onReleased && onReleased()
      return
    }
    if (response.outcome === 'order_created') {
      showToast(ToastType.Success, withPaymethod(t('PAYMENT_FOUND_ORDER_CREATED', 'We found your payment with _paymethod_ and created your order.')))
      response.order?.uuid && onOrderCreated && onOrderCreated(response.order)
      return
    }
    if (response.outcome === 'still_pending') {
      Alert.alert(
        t('CART_STILL_PENDING_TITLE', 'It can\'t be cancelled yet'),
        withPaymethod(t('CART_STILL_PENDING_DESC', '_paymethod_ has a payment in process (for example, a cash payment) or did not respond. Try again in a few minutes.')),
        [{ text: t('ACCEPT', 'Accept') }],
        { cancelable: false }
      )
      return
    }
    Alert.alert(
      t('CANCEL_PAYMENT_ATTEMPT_ERROR_TITLE', 'We couldn\'t connect'),
      t('CANCEL_PAYMENT_ATTEMPT_ERROR_DESC', 'Check your connection and try again. Your cart has not changed.'),
      [
        { text: t('CLOSE', 'Close'), style: 'cancel' },
        { text: t('RETRY', 'Retry'), onPress: handleRelease }
      ],
      { cancelable: false }
    )
  }

  const handleConfirmRelease = () => {
    Alert.alert(
      t('CANCEL_PAYMENT_ATTEMPT_QUESTION', 'Cancel the payment attempt?'),
      [
        withPaymethod(t('CANCEL_PAYMENT_ATTEMPT_DESC', 'If you didn\'t pay, your cart will be released so you can pay again. If you already paid with _paymethod_, nothing is cancelled: we\'ll create your order.')),
        withPaymethod(t('CANCEL_PAYMENT_ATTEMPT_CLOSE_TAB', 'If you left the _paymethod_ page open, close it: a payment made there after cancelling won\'t create your order.'))
      ].join('\n\n'),
      [
        { text: t('KEEP_WAITING', 'Keep waiting'), style: 'cancel' },
        { text: t('YES_CANCEL', 'Yes, cancel'), onPress: handleRelease }
      ],
      { cancelable: false }
    )
  }

  if (!isPendingCartReleasable || !handleReleasePendingCart || isPlacedHere) {
    const message = t('CART_STATUS_PENDING_MESSAGE_APP', 'Your order is being processed, please wait a little more. if you\'ve been waiting too long, please reload the app')
    return isMaweja
      ? <MawejaCartNotice message={message} />
      : <OText align='center' color={theme.colors.error} size={17}>{message}</OText>
  }

  const content = (
    <PendingCartNoticeContent testID='pending-cart-notice'>
      <OText align='center' color={isMaweja ? theme.colors.black : theme.colors.error} size={isMaweja ? 15 : 17} weight='600'>
        {withPaymethod(t('CART_PENDING_PAYMENT_TITLE', 'Your payment with _paymethod_ is still pending'))}
      </OText>
      <OText align='center' color={theme.colors.textNormal} size={14} mTop={8}>
        {t('CART_PENDING_PAYMENT_DESC', 'If you didn\'t complete the payment, cancel the attempt to pay again.')}
      </OText>
      <PendingCartNoticeAction>
        <OButton
          testID='cancel-payment-attempt'
          class='secondary'
          disabled={releasingPendingCart}
          text={releasingPendingCart
            ? withPaymethod(t('VERIFYING_WITH_PAYMETHOD', 'Verifying with _paymethod_…'))
            : t('CANCEL_PAYMENT_ATTEMPT', 'Cancel payment attempt')}
          onClick={handleConfirmRelease}
        />
      </PendingCartNoticeAction>
    </PendingCartNoticeContent>
  )

  return isMaweja ? <Notice $tone='alert'>{content}</Notice> : content
}
