import React, { useEffect } from 'react';
import { View, ScrollView, Platform, Dimensions } from 'react-native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';

import { HighestRatedBusinessesParams } from '../../types';
import { ListWrapper } from './styles'

import {
  BusinessList as BusinessesListingController,
  useLanguage,
  useOrder
} from '@components';

import { OText, BusinessController } from '@ui'

const HighestRatedBusinessesUI = (props: HighestRatedBusinessesParams) => {
  const {
    businessesList,
    onBusinessClick,
    navigation,
    isLoading,
    getBusinesses,
    favoriteIds,
    setFavoriteIds,
    handleUpdateBusinessList,
    layout
  } = props;

  const theme = useTheme()
  const [, t] = useLanguage()
  const [orderState] = useOrder()

  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (businessesList?.loading || !isLoading) return
    getBusinesses(true)
  }, [isLoading])

  useEffect(() => {
    if (!businessesList?.businesses?.length) return
    const ids = [...favoriteIds]
    businessesList.businesses.forEach(business => {
      if (business?.favorite) {
        ids.push(business.id)
      }
    })
    setFavoriteIds([...new Set(ids)])
  }, [businessesList?.businesses?.length])

  return (
    <>
      {!businessesList.loading && businessesList.businesses.length > 0 && (
        <ListWrapper>
          <OText size={theme.utils.tsize.l} weight={Platform.OS === 'ios' ? '600' : 'bold'}>{t('TOP_BUSINESS', 'Top business')}</OText>
          <OText color={layout === 'maweja' ? theme.colors.backgroundGray300 : undefined} mBottom={layout === 'maweja' ? 12 : 0}>
            {t('TOP_BUSINESS_SUBTITLE', 'Sponsored')}
          </OText>
          <ScrollView
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: layout === 'maweja' ? 14 : 20 }}
          >
            {
              businessesList.businesses?.map(
                (business: any, i: number) => (
                  <View
                    key={i}
                    style={{
                      width: layout === 'maweja' ? windowWidth * 0.62 : windowWidth - 100,
                      paddingHorizontal: layout === 'maweja' ? 0 : 5,
                      height: '100%'
                    }}
                  >
                    <BusinessController
                      layout={layout}
                      isHighestRatedBusiness
                      business={business}
                      isBusinessOpen={business?.open}
                      handleCustomClick={onBusinessClick}
                      orderType={orderState?.options?.type}
                      navigation={navigation}
                      favoriteIds={favoriteIds}
                      setFavoriteIds={setFavoriteIds}
                      handleUpdateBusinessList={handleUpdateBusinessList}
                    />
                  </View>
                )
              )
            }
          </ScrollView>
        </ListWrapper>
      )}
      {businessesList.loading && (
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 20 }}
        >
          {[...Array(10).keys()].map((_, i) => (
            <Placeholder
              Animation={Fade}
              key={i}
              style={{ marginTop: 20, marginBottom: 10, width: windowWidth - 100 }}>
              <View style={{ width: '100%' }}>
                <PlaceholderLine height={150} style={{ marginBottom: 10, borderRadius: 30 }} />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <PlaceholderLine height={15} width={40} style={{ marginBottom: 10 }} />
                  <PlaceholderLine height={15} width={20} style={{ marginBottom: 10 }} />
                </View>
                <PlaceholderLine height={15} width={60} style={{ marginBottom: 10 }} />
              </View>
            </Placeholder>
          ))}
        </ScrollView>
      )}
    </>
  )
}

export const HighestRatedBusinesses = (props: any) => {
  const theme = useTheme()
  const hideHighestBusiness = theme?.business_listing_view?.components?.highest_rated_business_block?.hidden
  if (hideHighestBusiness) return null

  const highestRatedBusinessesProps = {
    ...props,
    UIComponent: HighestRatedBusinessesUI,
    isFeatured: true,
    paginationSettings: { initialPage: 1, pageSize: 20, controlType: 'infinity' }
  };

  return <BusinessesListingController {...highestRatedBusinessesProps} />;
};
