import React from 'react'
import { GiftCardUI as GiftCardController, SafeAreaViewWrapper, NavBar } from '@ui';
import { useLanguage } from '@components';

interface Props {
  navigation: any;
  route: any;
}

const GiftCards = (props: Props) => {
  const giftCardProps = { ...props  }
  const [, t] = useLanguage()

  return (
    <>
      <NavBar title={t('GIFT_CARDS', 'Gift Cards')} onActionLeft={() => giftCardProps.navigation.goBack()} />
      <SafeAreaViewWrapper>
        <GiftCardController
          {...giftCardProps}
        />
      </SafeAreaViewWrapper>
    </>
  )
}

export default GiftCards
