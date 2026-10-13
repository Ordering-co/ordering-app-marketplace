import React from 'react'
import {
  ReviewProducts as ReviewProductsController,
  SafeAreaViewWrapper,
  NavBar
} from '@ui';
import { useLanguage } from '@components';

const ReviewProducts = ({ navigation, route }: any) => {
  const [, t] = useLanguage();
  const reviewProductProps = {
    navigation,
    order: route?.params?.order,
    onNavigationRedirect: (route: string, params: any) => navigation.navigate(route, params)
  }

  return (
    <>
      <NavBar
        title={t('REVIEW_PRODUCT', 'Review Product')}
        onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
      />
      <SafeAreaViewWrapper disableScrollView>
        <ReviewProductsController {...reviewProductProps} />
      </SafeAreaViewWrapper>
    </>
  )
}

export default ReviewProducts
