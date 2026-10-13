import React from 'react';
import { StackActions } from '@react-navigation/native';
import settings from '../config';

import { useApi } from '@components';
import { BusinessProductsListing as BusinessProductsListController, NavBar, SafeAreaViewWrapper } from '@ui';
import { leaveToCheckoutOrBack, openFromCheckout } from '@/utils/checkoutReturn';

const BusinessProductsList = (props: any) => {
  const [ordering] = useApi();
  const store =
    settings?.businessSlug || (props.route.params?.store ?? props.route.params?.productLogin?.store_slug);
  const header = props.route.params?.header;
  const logo = props.route.params?.logo;
  const product = props.route.params?.productId ? {
    categoryId: props.route?.params?.categoryId,
    businessId: parseInt(props.route?.params?.store),
    id: props.route?.params?.productId
  } : props.route.params?.productLogin;

  const fromMulti = props.route.params?.fromMulti
  const businessProductsProps = {
    ...props,
    ordering,
    isSearchByName: true,
    isSearchByDescription: true,
    slug: store,
    businessSingleId: settings?.businessSlug,
    businessProps: [
      'id',
      'name',
      'header',
      'logo',
      'name',
      'open',
      'about',
      'ribbon',
      'description',
      'address',
      'address_notes',
      'location',
      'timezone',
      'schedule',
      'service_fee',
      'delivery_price',
      'distance',
      'delivery_time',
      'gallery',
      'pickup_time',
      'reviews',
      'featured',
      'offers',
      'food',
      'laundry',
      'alcohol',
      'groceries',
      'slug',
      'vertical',
      'products',
      'zones',
      'professionals',
      'facebook_profile',
      'instagram_profile',
      'tiktok_profile',
      'pinterest_profile',
      'whatsapp_number',
      'snapchat_profile',
      'city',
      'city_id',
      'previously_products',
      'available_products_count',
      'today',
      'lazy_load_products_recommended',
      'minimum',
      'valid_service',
      'configs'
    ],
    handleSearchRedirect: () => {
      props.navigation.navigate('BottomTab', { screen: 'Home' });
    },
    onProductRedirect: ({ slug, category, product }: any) => { },
    onCheckoutRedirect: (cartUuid: any) => { },
    onGoBack: () => leaveToCheckoutOrBack(props.navigation, props.route),
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
    onBusinessClick: (business: any) => {
      props.navigation.navigate('Business', {
        store: business.slug,
        header: business.header,
        logo: business.logo,
      });
    },
    logo,
    header,
    product,
    fromMulti
  };

  return (
    <SafeAreaViewWrapper pt disableScrollView>
      <BusinessProductsListController {...businessProductsProps} />
    </SafeAreaViewWrapper>
  );
};

export default BusinessProductsList;
