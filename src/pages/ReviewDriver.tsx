import React from 'react'
import {
  ReviewDriver as ReviewDriverController,
  NavBar,
  SafeAreaViewWrapper
} from '@ui'
import { useLanguage } from '@components';

const ReviewDriver = ({ navigation, route }: any) => {
  const [, t] = useLanguage();
  const reviewDriverProps = {
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
        <ReviewDriverController {...reviewDriverProps} />
      </SafeAreaViewWrapper>
    </>
  )
}

export default ReviewDriver
