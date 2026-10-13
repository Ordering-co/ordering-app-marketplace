import React from 'react';
import settings from '../config.js'
import { useBusiness } from '@components'
import { BusinessesListing as BusinessListingController, SafeAreaViewWrapper } from '@ui';

const BusinessesListing = (props: any) => {
  const [businessState] = useBusiness();

  const BusinessesListingProps = {
    ...props,
    isSearchByName: true,
    isSearchByDescription: true,
    showAwayAddressPopover: true,
    franchiseId: settings?.franchiseSlug,
    businessId: businessState?.business?.id ?? settings?.businessSlug,
    isGuestUser: props?.route?.params?.isGuestUser ?? null,
    propsToFetch: [
      'id',
      'name',
      'header',
      'logo',
      'location',
      'schedule',
      'open',
      'delivery_price',
      'distance',
      'ribbon',
      'delivery_time',
      'pickup_time',
      'reviews',
      'featured',
      'offers',
      'food',
      'laundry',
      'alcohol',
      'groceries',
      'slug',
      'address',
      'configs',
      'timezone',
      'today',
      'enabled',
      'disabled_reason',
      'available_drivers_count',
      'activated_orders'
    ],
    paginationSettings: {
      initialPage: 1,
      pageSize: 50,
      controlType: 'infinity'
    },
    onBusinessClick: (business: any) => {
      props.navigation.navigate('Business', {
        store: props?.route?.params?.store || business.slug,
        header: business.header,
        logo: business.logo,
      });
    },
  };

  return (
    <SafeAreaViewWrapper pt disableScrollView>
      <BusinessListingController {...BusinessesListingProps} />
    </SafeAreaViewWrapper>
  );
};

export default BusinessesListing;
