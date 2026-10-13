import React, { useEffect } from 'react'
import { UpsellingPage as UpsellingPageController } from '@components'

const UpsellingRedirectUI = (props: any) => {
  const {
    setOpenUpselling,
    upsellingProducts,
    onRedirect
  } = props

  useEffect(() => {
    if (!upsellingProducts.loading) {
      onRedirect &&
        onRedirect('UpsellingPage', { ...props, products: upsellingProducts?.products || [] })
      setOpenUpselling(false)
    }
  }, [upsellingProducts.loading, upsellingProducts?.products.length])

  return (<>{null}</>)
}

export const UpsellingRedirect = (props: any) => {
  const upsellingProps = {
    ...props,
    useSuggestiveUpselling: !!props.cartProducts?.length,
    UIComponent: UpsellingRedirectUI
  }
  return (
    <UpsellingPageController {...upsellingProps} />
  )
}
