import React from 'react';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from 'styled-components/native';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';

import { CardContainer, LogoContainer, GiftCardInfoContainer, SingleGiftCardContainer, SingleGiftCardPriceContainer } from './styles'
import { useLanguage, useUtils } from '@components';
import { OText } from '../../shared'

export const SingleGiftCard = (props: any) => {
  const {
    card,
    isSkeleton,
    onNavigationRedirect
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ parsePrice, optimizeImage, parseDate }] = useUtils()

  const styles = StyleSheet.create({
    logo: {
      width: 70,
      height: 70
    }
  });

  const getGiftCardStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: t('PENDING', 'Pending'), color: theme.colors.black }
      case 'activated':
        return { text: t('REDEEMED', 'Redeemed'), color: theme.colors.active }
      default:
        return { text: t(status.toUpperCase(), status), color: theme.colors.active }
    }
  }

  const handleClickGiftCardOrder = (card: any) => {
    onNavigationRedirect?.('OrderDetails', { orderId: card.order_product?.order_id });
  }

  return (
    <CardContainer
      activeOpacity={0.8}
      onPress={() => handleClickGiftCardOrder(card)}
    >
      {isSkeleton ? (
        <Placeholder style={{ marginBottom: 0, padding: 10 }} Animation={Fade}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: 64, marginRight: 14 }}>
              <PlaceholderLine
                width={100}
                height={64}
                style={{ marginRight: 10, marginBottom: 0 }}
              />
            </View>
            <Placeholder style={{ paddingTop: 5 }}>
              <PlaceholderLine width={60} style={{ marginBottom: 6 }} />
              <PlaceholderLine width={40} style={{ marginBottom: 6 }} />
              <PlaceholderLine width={20} style={{ marginBottom: 0 }} />
            </Placeholder>
          </View>
        </Placeholder>
      ) : (
        <SingleGiftCardContainer>
          <GiftCardInfoContainer>
            <OText weight={'bold'}>
              {card?.order_product?.name}
            </OText>
            <OText style={{ marginTop: 5 }}>
              {parseDate(card?.created_at)}
            </OText>
            <SingleGiftCardPriceContainer>
              <OText style={{ marginRight: 10 }}>
                {parsePrice(card?.order_product?.price)}
              </OText>
              <OText color={getGiftCardStatus(card?.status)?.color}>
                {getGiftCardStatus(card?.status)?.text}
              </OText>
            </SingleGiftCardPriceContainer>
          </GiftCardInfoContainer>
          <LogoContainer>
            <FastImage
              style={styles.logo}
              source={card?.order_product?.images ? {
                uri: optimizeImage(card?.order_product?.images, 'h_86,c_limit')
              } : theme?.images?.dummies?.giftCard}
              resizeMode={FastImage.resizeMode.contain}
            />
          </LogoContainer>
        </SingleGiftCardContainer>
      )}
    </CardContainer>
  )
}
