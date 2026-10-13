import * as React from 'react';
import { StackActions } from '@react-navigation/native';
import { useTheme } from 'styled-components/native';
import settings from '../config.js'

import { useLanguage } from '@components';
import { resolveAppDesign } from '@/utils/appDesign';
import { leaveToCheckoutOrBack, openFromCheckout } from '@/utils/checkoutReturn';
import {
  CartContent,
  MawejaCartList,
  MawejaCartPage,
  NavBar,
  SafeAreaViewWrapper
} from '@ui';

interface Props {
  navigation: any;
  route: any;
  titleStyle?: any
}

const CartList = (props: Props) => {
  const [, t] = useLanguage();
  const theme = useTheme();
  const [refreshing] = React.useState(false);
  const isMaweja = resolveAppDesign(theme) === 'maweja';
  const businessSlug = props.route?.params?.businessSlug;

  const handleOnRefresh = () => {
    props?.route?.params?.refreshOrderOptions?.()
  }

  const cartProps = {
    ...props,
    isFranchiseApp: !!settings?.franchiseSlug,
    singleBusiness: settings?.businessSlug,
    onNavigationRedirect: (route: string, params: any, replace: boolean) => {
      if (props.route?.params?.fromCheckout) {
        openFromCheckout(props.navigation, props.route, route, params)
        return
      }
      if (replace) {
        props.navigation.dispatch(StackActions.replace(route, params))
        return
      }
      props.navigation.navigate(route, params)
    },
  };

  if (isMaweja) {
    return (
      <SafeAreaViewWrapper pt disableScrollView>
        {businessSlug ? (
          <MawejaCartPage {...cartProps} businessSlug={businessSlug} refreshing={refreshing} onRefresh={handleOnRefresh} />
        ) : (
          <MawejaCartList {...cartProps} refreshing={refreshing} onRefresh={handleOnRefresh} />
        )}
      </SafeAreaViewWrapper>
    )
  }

  return (
    <>
      <NavBar
        title={settings?.businessSlug
          ? t('CART', 'Cart')
          : t('MY_CARTS', 'My carts')}
        onActionLeft={() => leaveToCheckoutOrBack(props.navigation, props.route)}
      />
      <SafeAreaViewWrapper
        refreshing={refreshing}
        onRefresh={() => handleOnRefresh()}
      >
        <CartContent {...cartProps} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default CartList;
