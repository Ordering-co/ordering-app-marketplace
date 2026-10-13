import React from 'react'
import { View, Dimensions } from 'react-native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';

import { BusinessController } from '../../BusinessController'
import { Container, ListWrapper } from './styles'
import { PreviousBusinessOrderedParams } from '../../../types';
import { useOrder } from '@components'

const BusinessControllerList = ({ businesses, onBusinessClick, navigation, orderState, handleCustomUpdate, style }: any) => {
  return (
    <>
      {businesses?.result?.map((business: any, i: number) => (
        <View style={style} key={`${business.id}_` + i}>
          <BusinessController
            simpleView
            business={business}
            isBusinessOpen={business.open}
            handleCustomClick={() => onBusinessClick(business)}
            orderType={orderState?.options?.type}
            navigation={navigation}
            businessHeader={business?.header}
            businessFeatured={business?.featured}
            businessLogo={business?.logo}
            businessReviews={business?.reviews}
            businessDeliveryPrice={business?.delivery_price}
            businessDeliveryTime={business?.delivery_time}
            businessPickupTime={business?.pickup_time}
            businessDistance={business?.distance}
            handleCustomUpdate={handleCustomUpdate}
          />
        </View>
      ))}
    </>
  )
}

const BusinessSkeletons = () => {
  return (
    <>
      {[...Array(6).keys()].map((_, i) => (
        <Placeholder
          key={i}
          Animation={Fade}
          style={{
            marginBottom: 20,
            padding: 15,
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#E0E0E0'
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <PlaceholderLine width={45} style={{ borderRadius: 4 }} />
            <PlaceholderLine width={20} style={{ borderRadius: 4 }} />
          </View>
          <PlaceholderLine width={70} style={{ marginBottom: 10, borderRadius: 4 }} />
          <PlaceholderLine width={30} style={{ borderRadius: 4, marginBottom: 0 }} />
        </Placeholder>
      ))}
    </>
  )
}

export const PreviousBusinessOrdered = (props: PreviousBusinessOrderedParams) => {
  const {
    navigation,
    businesses,
    onNavigationRedirect,
    isBusinessesSearchList,
    handleUpdateBusinesses,
  } = props

  const [orderState] = useOrder()
  const windowWidth = Dimensions.get('window').width;
  const onBusinessClick = (business: any) => {
    onNavigationRedirect('Business', { store: business.slug, logo: business.logo, header: business.header })
  }

  return (
    <Container
      horizontal={isBusinessesSearchList}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      {isBusinessesSearchList ? (
        <>
          {!businesses?.loading && (
            <BusinessControllerList
              style={{ width: windowWidth - 120, marginRight: 20 }}
              onBusinessClick={onBusinessClick}
              orderState={orderState}
              navigation={navigation}
              businesses={businesses}
              handleCustomUpdate={handleUpdateBusinesses}
            />
          )}
        </>
      ) : (
        <ListWrapper>
          {businesses?.loading ? (
            <BusinessSkeletons />
          ) : (
            <BusinessControllerList
              onBusinessClick={onBusinessClick}
              orderState={orderState}
              navigation={navigation}
              businesses={businesses}
              handleCustomUpdate={handleUpdateBusinesses}
            />
          )}
        </ListWrapper>
      )}
    </Container>
  )
}
