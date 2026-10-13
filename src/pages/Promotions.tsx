import React from 'react'
import { NavBar, Promotions as PromotionsController, SafeAreaViewWrapper } from '@ui'
import settings from '../config';
import { useLanguage } from '@components';

const Promotions = (props: any) => {
  const [, t] = useLanguage()
  const promotionsProps = {
    ...props,
    franchiseId: settings.franchiseSlug
  }

  return (
    <>
      <NavBar title={t('OFFERS', 'Offers')} />
      <SafeAreaViewWrapper disableScrollView >
        <PromotionsController {...promotionsProps} />
      </SafeAreaViewWrapper>
    </>
  )
}

export default Promotions
