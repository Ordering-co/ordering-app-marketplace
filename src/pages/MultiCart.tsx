import React from 'react'
import { MultiCart as MultiCartController } from '@ui'

const MultiCart = (props: any) => {

  const multiCheckoutProps = {
    ...props,
    handleOnRedirectMultiCheckout: (cartUuid: string) => {
      props.navigation.navigate('MultiCheckout', {
        cartUuid: cartUuid
      })
    },
    handleOnRedirectCheckout: (cartUuid: string) => {
      props.navigation.navigate('CheckoutPage', {
        cartUuid: cartUuid
      })
    },
    cartUuid: props.route?.params?.cartUuid,
    cartGroup: props.route?.params?.cartGroup
  }

  return (
    <>
      <MultiCartController {...multiCheckoutProps} />
    </>
  )
}

export default MultiCart
