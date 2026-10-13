import React from 'react';
import {
  ReviewOrder as ReviewOrderController,
  NavBar,
  SafeAreaViewWrapper
} from '@ui';
import { useLanguage } from '@components';

const ReviewOrder = ({ navigation, route }: any) => {
  const [, t] = useLanguage();
  const reviewOrderProps = {
    navigation,
    order: route?.params?.order,
    setIsReviewed: route?.params?.setIsReviewed,
    handleReviewState: route?.params?.handleReviewState,
    onNavigationRedirect: (route: string, params: any) => navigation.navigate(route, params)
  }

  return (
    <>
      <NavBar
        title={t('REVIEW_ORDER', 'Review your Order')}
        onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
      />
      <SafeAreaViewWrapper disableScrollView>
        <ReviewOrderController {...reviewOrderProps} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default ReviewOrder;
