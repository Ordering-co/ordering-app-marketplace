import React from 'react';

import { useLanguage, useSession } from '@components';
import { SavedCards as SavedCardsController, NavBar, SafeAreaViewWrapper } from '@ui';

const SavedCards = ({ route, navigation }: any) => {
  const [{ user }] = useSession();
  const [, t] = useLanguage();

  const savedCardsProps = {
    navigation,
    route,
    userId: user?.id,
    goToBack: () => navigation?.canGoBack() ? navigation.goBack() : navigation.navigate('BottomTab', { screen: 'Home' }),
    onNavigationRedirect: (page: string, params?: any) => {
      navigation.navigate(page, params)
    }
  };

  return (
    <>
      <NavBar title={t('MY_CARDS', 'My cards')} onActionLeft={() => savedCardsProps.goToBack()} />
      <SafeAreaViewWrapper>
        <SavedCardsController {...savedCardsProps} />
      </SafeAreaViewWrapper>
    </>
  )
};

export default SavedCards;
