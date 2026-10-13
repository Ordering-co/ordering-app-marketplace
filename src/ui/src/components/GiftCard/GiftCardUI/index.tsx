import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons'

import { PurchaseGiftCard } from '../PurchaseGiftCard'
import { RedeemGiftCard } from '../RedeemGiftCard'

import { Container, HeroCard, HeroChip, HeroWatermark, HeroTitleWrap, Divider } from './styles'
import { useLanguage } from '@components';
import { OText, OButton, OBottomPopup } from '@ui';

export const GiftCardUI = (props: any) => {
  const {
    navigation
  } = props
  const [, t] = useLanguage()
  const theme = useTheme()
  const [openModal, setOpenModal] = useState<any>(null)

  const style = StyleSheet.create({
    actionWrapper: {
      marginTop: 10
    },
    btnStyle: {
      borderRadius: 15,
      height: 35
    },
    redeemWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 20
    },
  })

  const handleCustomGoToCheckout = (uuid: any) => {
    setOpenModal(null)
    navigation.navigate('CheckoutPage', {
      cartUuid: uuid
    })
  }

  return (
    <Container>
      <HeroCard>
        <HeroWatermark>
          <Ionicons name='gift' size={130} color='rgba(255, 255, 255, 0.16)' />
        </HeroWatermark>
        <HeroChip>
          <Ionicons name='gift-outline' size={16} color={theme.colors.white} />
          <OText size={13} weight={600} color={theme.colors.white} style={{ marginLeft: 6 }}>{t('GIFT_CARD', 'Gift Card')}</OText>
        </HeroChip>
        <HeroTitleWrap>
          <OText size={22} weight={700} color={theme.colors.white}>{t('GIFT_CARD_WALLET', 'Gift Card Wallet')}</OText>
          <OText size={13} weight={400} color={theme.colors.white} style={{ opacity: 0.9, marginTop: 2 }}>{t('GIFT_CARD_HERO_SUBTITLE', 'Treat someone to their favorite meal')}</OText>
        </HeroTitleWrap>
      </HeroCard>
      <View style={{ marginTop: 20 }}>
        <OText size={20} weight={600} align='center'>{t('GIFT_CARD_SCREEN_TITLE', 'Give the gift of special moments with our Gift Cards')}</OText>
        <OText size={12} weight={400}>{t('GIFT_CARD_SCREEN_DESCRIPTION', 'Our Gift Cards are the perfect way to surprise someone special. Whether it’s for a birthday, a celebration, or just to brighten their day, they offer flexibility and the freedom to choose what they love most. The perfect gift for any occasion!')}</OText>
      </View>
      <Divider />
      <View style={style.actionWrapper}>
        <OText size={20} weight={600} mBottom={10}>{t('SELECT_YOUR_GIFT_CARD', 'Select your gift card')}</OText>
        <PurchaseGiftCard
          handleCustomGoToCheckout={handleCustomGoToCheckout}
          onClose={() => setOpenModal(null)}
        />
      </View>
      <View style={style.redeemWrapper}>
        <View>
          <OText size={18} weight={600}>{t('GOT_A_GIFT_CARD', 'Got a Gift Card?')}</OText>
          <OText size={14} weight={400}>{t('REDEEM_IT_HERE', 'Redeem it here!')}</OText>
        </View>
        <OButton
          onClick={() => setOpenModal('redeem')}
          text={t('REDEEM', 'Redeem')}
          style={style.btnStyle}
          class='fourth'
        />
      </View>
      <OBottomPopup
        open={openModal === 'redeem'}
        onClose={() => setOpenModal(null)}
        bottomContainerStyle={{ minHeight: 300 }}
        title={t('REDEEM_GIFT_CARD', 'Redeem Gift Card')}
        closeIcon
        presentationStyle="overFullScreen"
      >
        <RedeemGiftCard onClose={() => setOpenModal(null)} />
      </OBottomPopup>
    </Container>
  )
}
