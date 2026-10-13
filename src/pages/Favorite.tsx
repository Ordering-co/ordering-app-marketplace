import React from 'react'
import settings from '../config';
import { Favorite as FavoriteController, NavBar, SafeAreaViewWrapper } from '@ui';
import { useLanguage } from '@components';

interface Props {
  navigation: any;
  route: any;
}

const Favorite = (props: Props) => {
  const [, t] = useLanguage();
  const favoriteProps = {
    ...props,
    franchiseId: settings.franchiseSlug,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onRedirect: (route: string, params?: any) => {
      props.navigation.navigate(route, params)
    }
  }

  return (
    <>
      <NavBar
        title={t('FAVORITE', 'Favorite')}
        onActionLeft={() => favoriteProps.goToBack()}
      />
      <SafeAreaViewWrapper>
        <FavoriteController {...favoriteProps} />
      </SafeAreaViewWrapper>
    </>
  )
}

export default Favorite;
