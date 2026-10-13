import React from 'react'
import { Platform } from 'react-native'
import settings from '../config.json'

import { BusinessListingSearch as BusinessListingSearchController, SafeAreaViewWrapper } from '@ui'

const BusinessListingSearch = (props: any) => {

  const BusinessesListingSearchProps = {
    ...props,
    onBusinessClick: (business: any) => {
      props.navigation.navigate('Business', {
        store: props?.route?.params?.store || business.slug,
        header: business.header,
        logo: business.logo,
      });
    },
    businessTypes: props?.route?.params?.businessTypes || [],
    defaultTerm: props?.route?.params?.defaultTerm || '',
    shouldClearSearchTerm: props?.shouldClearSearchTerm || false,
    setShouldClearSearchTerm: props?.setShouldClearSearchTerm || (() => {}),
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) {
        return;
      }
      props.navigation.navigate(page, params);
    },
    brandId: settings.franchiseSlug,
    isIos: Platform.OS === 'ios'
  };

  return (
    <SafeAreaViewWrapper pt disableScrollView>
      <BusinessListingSearchController {...BusinessesListingSearchProps} />
    </SafeAreaViewWrapper>
  )
}

export default BusinessListingSearch
