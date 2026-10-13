import React from 'react'
import { useTheme } from 'styled-components/native';
import { useIsFocused } from '@react-navigation/native';

import { ListWrapper } from './styles';
import { HeaderContent } from './HeaderContent';
import { HomeHeader } from '../Maweja/HomeHeader';

import { useLanguage, useSession } from '@components';

import {
  OModal,
  OText,
  HighestRatedBusinesses,
  PageBanner,
  NotFoundSource,
  BusinessTypeFilter,
  CitiesControl,
  OrderProgress,
  PoweredBy
} from '@ui'

export const FlatListBusinessListHeader = (props: any) => {
  const {
    navigation,
    businessesList,
    businessTypeSelected,
    handleChangeBusinessType,
    handleBusinessClick,
    businessId,
    isGuestUser,
    citiesState,
    orderTypeValue,
    setIsOpenCities,
    favoriteIds,
    setFavoriteIds,
    setOrderTypeValue,
    isOpenCities,
    handleChangeCity
  } = props

  const theme = useTheme()
  const [{ auth }] = useSession()
  const [, t] = useLanguage()
  const isFocused = useIsFocused()

  const hideHighestBusiness = theme?.business_listing_view?.components?.highest_rated_business_block?.hidden
  const isAllCategoriesHidden = theme?.business_listing_view?.components?.categories?.hidden

  return (
    <>
      {auth && <PoweredBy containerStyle={{ top: 20 }} />}

      {props.homeLayout === 'maweja' ? (
        <HomeHeader
          part="filters"
          navigation={navigation}
          showBusinessSearchMap
          isGuestUser={isGuestUser}
          setOrderTypeValue={setOrderTypeValue}
          orderTypeValue={orderTypeValue}
          onHandleCart={() => navigation.navigate('Cart')}
        />
      ) : (
        <HeaderContent
          navigation={navigation}
          showAwayAddressPopover={props.showAwayAddressPopover}
          showBusinessSearchMap
          isGuestUser={isGuestUser}
          setOrderTypeValue={setOrderTypeValue}
          orderTypeValue={orderTypeValue}
          onHandleCart={() => navigation.navigate('Cart')}
        />
      )}

      {/* <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <OInput
          placeholder={t('SEARCH', 'Search')}
          autoCapitalize="none"
          autoCorrect={false}
          blurOnSubmit={false}
          // borderColor={null}
          onChange={(e: any) => {
            console.log('e', e)
          }}
          style={{ marginBottom: 10 }}
        />
      </View> */}

      {/* {!hideCities && orderTypeValue === 2 && (
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            style={styles.buttonCityStyle}
            onPress={() => setIsOpenCities(true)}
            disabled={orderState?.loading}
          >
            <OText size={18} color={theme.colors.backgroundGray} weight='bold' style={{ textAlign: 'center' }}>
              {citiesState?.cities?.find((city: any) => city?.id === orderState?.options?.city_id)?.name || t('FILTER_BY_CITY', 'Filter by city')}
            </OText>
          </TouchableOpacity>
        </View>
      )} */}

      {/* {!businessId && !props.franchiseId && featuredBusiness && featuredBusiness.length > 0 && (
        <FeaturedWrapper>
          <OText size={16} style={{ marginLeft: 20 }} weight={Platform.OS === 'ios' ? '600' : 'bold'}>{t('BUSINESS_FEATURE', 'Featured business')}</OText>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            horizontal
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {featuredBusiness.map((bAry: any, idx: number) => (
              <View key={'f-listing_' + idx}>
                <BusinessFeaturedController
                  business={bAry[0]}
                  isBusinessOpen={bAry[0]?.open}
                  handleCustomClick={handleBusinessClick}
                  orderType={orderState?.options?.type}
                />
                {bAry.length > 1 && (
                  <BusinessFeaturedController
                    business={bAry[1]}
                    isBusinessOpen={bAry[1]?.open}
                    handleCustomClick={handleBusinessClick}
                    orderType={orderState?.options?.type}
                  />
                )}
              </View>
            ))}
          </ScrollView>
        </FeaturedWrapper>
      )} */}

      <ListWrapper style={{
        paddingHorizontal: 20,
        ...(props.homeLayout === 'maweja' ? { backgroundColor: theme.colors.backgroundPage } : {})
      }}>
        <OrderProgress {...props} isFocused={isFocused} />

        <PageBanner position='app_business_listing' navigation={navigation} layout={props.homeLayout} />

        {!hideHighestBusiness && !businessId && !props.franchiseId && (
          <HighestRatedBusinesses
            propsToFetch={props.propsToFetch}
            onBusinessClick={handleBusinessClick}
            navigation={navigation}
            favoriteIds={favoriteIds}
            setFavoriteIds={setFavoriteIds}
            isOrderStateReady={props.isOrderStateReady}
            layout={props.homeLayout}
          />
        )}

        {!businessId && !isAllCategoriesHidden && (
          <BusinessTypeFilter
            images={props.images}
            businessTypes={props.businessTypes}
            defaultBusinessType={props.defaultBusinessType}
            handleChangeBusinessType={handleChangeBusinessType}
            layout={props.homeLayout}
          />
        )}

        {!businessTypeSelected && (
          <OText preset="sectionTitle" mBottom={props.homeLayout === 'maweja' ? 16 : 0}>
            {t('ALL_BUSINESS', 'All business')}
          </OText>
        )}

        {!businessesList.loading && businessesList.businesses.length === 0 && businessesList?.fetched && (
          <NotFoundSource
            content={t(
              'NOT_FOUND_BUSINESSES',
              'No businesses to delivery / pick up at this address, please change filters or change address.',
            )}
          />
        )}
      </ListWrapper>
      <OModal
        open={isOpenCities}
        onClose={() => setIsOpenCities(false)}
        title={t('SELECT_A_CITY', 'Select a city')}
      >
        <CitiesControl
          cities={citiesState?.cities}
          onClose={() => setIsOpenCities(false)}
          handleChangeCity={handleChangeCity}
        />
      </OModal>
    </>
  )
}
