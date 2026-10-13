import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';

import { Container, GiftCardCopy, GiftCardHeader, GiftCardItem, PurchaseButtonWrap } from './styles'
import { useApi, useLanguage, PurchaseGiftCard as PurchaseGiftCardController, useOrder, useSession, useUtils } from '@components'
import { listRemoteGiftCarts, purchaseGiftCard } from '../../../../../utils/giftCardCart'
import { OText, OButton, OIcon } from '@ui';

const purchaseButtonStyle = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch'
  },
  button: {
    alignSelf: 'stretch',
    borderRadius: 15
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold'
  }
})

const PurchaseGiftCardUI = (props: any) => {
  const {
    productsListState,
    handleCustomGoToCheckout,
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils()
  const [ordering] = useApi()
  const [{ token }] = useSession()
  const [orderState, { clearCart, addProduct }] = useOrder()
  const [purchasingId, setPurchasingId] = useState<string | number | null>(null)

  const handlePurchase = async (product: any) => {
    if (purchasingId != null) return
    setPurchasingId(product.id)
    try {
      const outcome = await purchaseGiftCard({
        product,
        carts: orderState?.carts,
        listGiftCarts: () => listRemoteGiftCarts({
          getCarts: () => ordering.setAccessToken(token).carts().get()
        }),
        clearCart,
        addProduct
      })
      if (outcome.type === 'failed') return
      handleCustomGoToCheckout?.(outcome.uuid)
    } finally {
      setPurchasingId(null)
    }
  }

  return (
    <Container>
      <View>
        {productsListState.loading && (
          [...Array(5).keys()].map(i => (
            <GiftCardItem key={i}>
              <Placeholder
                Animation={Fade}
              >
                <PlaceholderLine height={70} style={{ marginBottom: 0, width: '100%' }} />
              </Placeholder>
            </GiftCardItem>
          ))
        )}
        {productsListState.products.map((product: any) => (
          <GiftCardItem key={product.id}>
            <GiftCardHeader>
              <OIcon src={Boolean(theme.images.general[`giftCard${product.price}`]) ? theme.images.general[`giftCard${product.price}`] : theme.images.general.giftCard5} width={70} height={70} />
              <GiftCardCopy>
                <OText color={theme.colors.textNormal} size={16} weight={600}>{parsePrice(product.price)}</OText>
                <OText color={theme.colors.textSecondary} size={12}>{product.name}</OText>
              </GiftCardCopy>
            </GiftCardHeader>
            <PurchaseButtonWrap>
              <OButton
                testID={`purchase-gift-${product.id}`}
                onClick={() => handlePurchase(product)}
                text={t('PURCHASE', 'Purchase')}
                textStyle={purchaseButtonStyle.text}
                parentStyle={purchaseButtonStyle.wrap}
                style={purchaseButtonStyle.button}
                class='active'
                loading={purchasingId === product.id}
              />
            </PurchaseButtonWrap>
          </GiftCardItem>
        ))}
      </View>
    </Container>
  )
}

export const PurchaseGiftCard = (props: any) => {
  const purchaseGiftCardProps = {
    ...props,
    UIComponent: PurchaseGiftCardUI
  }
  return <PurchaseGiftCardController {...purchaseGiftCardProps} />
}
