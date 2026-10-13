import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Keyboard, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'styled-components/native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { Placeholder, PlaceholderLine } from 'rn-placeholder'

import {
  BrandContainer,
  BrandItem,
  CircleButton,
  FilterContainer,
  filterRowContent,
  GoogleMapContainer,
  HeaderContainer,
  HeaderRow,
  NoResult,
  PriceListContainer,
  SearchAreaButton,
  SearchAreaWrapper,
  WrapMomentOption,
  WrapperNotFound
} from './styles'

import { useLanguage, BusinessSearchList, useConfig, useOrder } from '@components'
import { OBottomPopup, OButton, OText, GoogleMap, OIcon, OInput, BusinessTypeFilter, NotFoundSource } from '@ui'
import { GoogleMapHandle } from '../../types'
import { MapBottomSheet, MapBottomSheetHandle } from './MapBottomSheet'
import { MaxSectionItem } from '../BusinessListingSearch/MaxSectionItem'

// Neighborhood-level zoom (~9km N-S) so the user sees the stores around their
// address, not a street/building-level view nor a continental fit.
const MAP_NEIGHBORHOOD_DELTA = 0.08

const BusinessSearchMapUI = (props: any) => {
  const {
    businessesSearchList,
    onBusinessClick,
    handleChangeFilters,
    filters,
    handleChangeTermValue,
    termValue,
    paginationProps,
    handleSearchbusinessAndProducts,
    brandList,
    handleUpdateBusinessList,
    navigation
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [orderState] = useOrder()
  const InputRef = useRef<TextInput>(null)
  const googleMapRef = useRef<GoogleMapHandle>(null)
  const sheetRef = useRef<MapBottomSheetHandle>(null)

  const [openFilter, setOpenFilter] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [isKeyboardShow, setIsKeyboardShow] = useState(false)
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | string | null>(null)

  const defaultLocation = {
    lat: configs?.location_default_latitude?.value ? Number(configs?.location_default_latitude?.value) : 40.7744146,
    lng: configs?.location_default_longitude?.value ? Number(configs?.location_default_longitude?.value) : -73.9678064
  }
  const addressLocation = orderState?.options?.address?.location
  const mapCenter = (addressLocation?.lat != null && addressLocation?.lng != null)
    ? { lat: addressLocation.lat, lng: addressLocation.lng }
    : defaultLocation

  // "Search this area": surface the panned map center and re-query when it moves
  // far enough from the location the current results were fetched for.
  const [showSearchArea, setShowSearchArea] = useState(false)
  const pannedCenterRef = useRef<{ lat: number, lng: number } | null>(null)
  const searchedCenterRef = useRef(mapCenter)

  useEffect(() => {
    searchedCenterRef.current = mapCenter
    pannedCenterRef.current = null
    setShowSearchArea(false)
  }, [mapCenter.lat, mapCenter.lng])

  const handleMapRegionChange = useCallback((center: { latitude: number, longitude: number }) => {
    pannedCenterRef.current = { lat: center.latitude, lng: center.longitude }
    const searched = searchedCenterRef.current
    const moved = Math.abs(center.latitude - searched.lat) > 0.02 || Math.abs(center.longitude - searched.lng) > 0.02
    setShowSearchArea(moved)
  }, [])

  const handleSearchThisArea = () => {
    const center = pannedCenterRef.current
    if (!center) return
    searchedCenterRef.current = center
    setShowSearchArea(false)
    handleSearchbusinessAndProducts(true, { location: center })
  }

  const filterOptionsEnabled = configs?.filter_search_options?.value?.split('|') || []
  const currency = configs.format_number_currency?.value
  const orderType = orderState?.options?.type
  const maxDeliveryFeeOptions = [1, 2, 5, 'default']
  const maxDistanceOptions = configs?.distance_unit?.value === 'km' ? [1000, 2000, 5000, 'default'] : [1609, 3218, 8046, 'default']
  const maxTimeOptions = [5, 15, 30, 'default']

  const businesses = useMemo(() => businessesSearchList?.businesses ?? [], [businessesSearchList?.businesses])
  const isEmptyResult = businesses.length === 0 && !businessesSearchList.loading

  const styles = StyleSheet.create({
    priceItem: {
      marginRight: 10,
      marginTop: 10,
      borderRadius: 15,
      paddingVertical: 4,
      paddingLeft: 5,
      paddingRight: 5,
      height: 27,
      borderWidth: 0
    },
    searchField: {
      flex: 1,
      height: 46,
      borderRadius: 24,
      marginHorizontal: 10,
      marginBottom: 0,
      paddingHorizontal: 18
    }
  })

  const locations = useMemo(() => businesses.map((business: any) => ({
    ...business,
    lat: business?.location?.lat,
    lng: business?.location?.lng,
    icon: business?.logo ?? theme?.images?.general?.mapPin
  })), [businesses])

  const priceList = [
    { level: '1', content: `${currency}` },
    { level: '2', content: `${Array(2).fill(currency).join('')}` },
    { level: '3', content: `${Array(3).fill(currency).join('')}` },
    { level: '4', content: `${Array(4).fill(currency).join('')}` },
    { level: '5', content: `${Array(5).fill(currency).join('')}` }
  ]

  const handleChangeBrandFilter = (brandId: any) => {
    let franchiseIds = [...filters?.franchise_ids]
    if (filters?.franchise_ids?.includes(brandId)) franchiseIds = filters?.franchise_ids?.filter((item: any) => item !== brandId)
    else franchiseIds.push(brandId)
    handleChangeFilters && handleChangeFilters('franchise_ids', franchiseIds)
  }

  const filterResetActions = {
    sort: () => handleChangeFilters('orderBy', null),
    price_range: () => handleChangeFilters('price_level', null),
    brands: () => handleChangeFilters('franchise_ids', []),
    max_delivery_fee: () => handleChangeFilters('max_delivery_price', null),
    max_delivery_time: () => handleChangeFilters('max_eta', null),
    max_distance: () => handleChangeFilters('max_distance', null),
    business_types: () => handleChangeFilters('business_types', [])
  }

  const handleCloseFilter = () => {
    setActiveFilter(null)
    setOpenFilter(null)
  }

  const handleResetActiveFilter = () => {
    filterResetActions[activeFilter as keyof typeof filterResetActions]?.()
    handleCloseFilter()
  }

  const handleOpenFilter = (filterType: string) => {
    setActiveFilter(filterType)
    const filter = filterType === 'max_delivery_time'
      ? orderType === 1
        ? 'max_delivery_time'
        : 'max_pickup_time'
      : filterType
    setOpenFilter(filter)
  }

  const handleChangePriceRange = (value: any) => {
    if (value === filters?.price_level) handleChangeFilters('price_level', null)
    else handleChangeFilters('price_level', value)
  }

  const handleEndReached = useCallback(() => {
    const hasMore = paginationProps?.totalPages !== paginationProps?.currentPage
    if (hasMore && !businessesSearchList.loading && businesses.length > 0) {
      handleSearchbusinessAndProducts()
    }
  }, [paginationProps?.totalPages, paginationProps?.currentPage, businessesSearchList.loading, businesses.length])

  const handleMarkerSelect = useCallback((business: any) => {
    setSelectedBusinessId(business?.id)
    sheetRef.current?.expand()
    const index = businesses.findIndex((item: any) => item.id === business?.id)
    if (index >= 0) sheetRef.current?.scrollToBusiness(index)
  }, [businesses])

  const handleCardPress = useCallback((business: any) => {
    setSelectedBusinessId(business?.id)
    const lat = business?.location?.lat
    const lng = business?.location?.lng
    if (lat != null && lng != null) googleMapRef.current?.focusOnCoordinate(lat, lng)
  }, [])

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardShow(true))
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardShow(false))
    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <HeaderContainer>
        <HeaderRow>
          <CircleButton onPress={() => props.navigation.goBack()}>
            <AntDesignIcon name='left' color={theme.colors.black} size={18} />
          </CircleButton>
          <OInput
            isLazyLoad
            style={styles.searchField}
            placeholder={t('SEARCH', 'Search')}
            onChange={(text: any) => handleChangeTermValue(text)}
            forwardRef={InputRef}
            iconCustomRight={termValue.length > 0
              ? (
                <TouchableOpacity
                  onPress={() => {
                    handleChangeTermValue('')
                    InputRef.current?.clear()
                  }}
                >
                  <FeatherIcon name='x-circle' color={theme.colors.black} size={16} />
                </TouchableOpacity>
              )
              : <OIcon src={theme.images.general.search} color={theme.colors.textNormal} width={16} />}
          />
          <CircleButton onPress={() => googleMapRef.current?.recenterToUserLocation()}>
            <FeatherIcon name='navigation' color={theme.colors.textNormal} size={18} />
          </CircleButton>
        </HeaderRow>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={filterRowContent}>
          {filterOptionsEnabled.includes('price_range') && (
            <WrapMomentOption activeOpacity={0.9} onPress={() => handleOpenFilter('price_range')} active={filters?.price_level}>
              <OIcon
                src={theme.images.general.label}
                color={filters?.price_level ? theme.colors.active : theme.colors.textNormal}
                width={15}
                style={{ marginRight: 5, bottom: 2 }}
              />
              <OText color={filters?.price_level ? theme.colors.active : theme.colors.textNormal}>{t('PRICE', 'Price')}</OText>
            </WrapMomentOption>
          )}
          {filterOptionsEnabled.includes('brands') && (
            <WrapMomentOption activeOpacity={0.9} onPress={() => handleOpenFilter('brands')} active={filters?.franchise_ids?.length > 0}>
              <OText color={filters?.franchise_ids?.length > 0 ? theme.colors.active : theme.colors.textNormal}>{t('BRANDS', 'Brands')}</OText>
            </WrapMomentOption>
          )}
          {orderType === 1 && filterOptionsEnabled.includes('max_delivery_fee') && (
            <WrapMomentOption activeOpacity={0.9} onPress={() => handleOpenFilter('max_delivery_fee')} active={filters?.max_delivery_price}>
              <OText color={filters?.max_delivery_price ? theme.colors.active : theme.colors.textNormal}>{t('DELIVERY_FEE', 'Delivery fee')}</OText>
            </WrapMomentOption>
          )}
          {[1, 2].includes(orderType) && filterOptionsEnabled.includes('max_delivery_time') && (
            <WrapMomentOption activeOpacity={0.9} onPress={() => handleOpenFilter('max_delivery_time')} active={filters?.max_eta}>
              <OText color={filters?.max_eta ? theme.colors.active : theme.colors.textNormal}>
                {orderType === 1 ? t('MAX_DELIVERY_TIME', 'Max delivery time') : t('MAX_PICKUP_TIME', 'Max pickup time')}
              </OText>
            </WrapMomentOption>
          )}
          {filterOptionsEnabled.includes('max_distance') && (
            <WrapMomentOption activeOpacity={0.9} onPress={() => handleOpenFilter('max_distance')} active={filters?.max_distance}>
              <OText color={filters?.max_distance ? theme.colors.active : theme.colors.textNormal}>{t('MAX_DISTANCE', 'Max distance')}</OText>
            </WrapMomentOption>
          )}
          {filterOptionsEnabled.includes('business_categories') && (
            <WrapMomentOption activeOpacity={0.9} onPress={() => handleOpenFilter('business_types')} active={filters?.business_types?.length > 0}>
              <OText color={filters?.business_types?.length > 0 ? theme.colors.active : theme.colors.textNormal}>{t('CATEGORIES', 'Categories')}</OText>
            </WrapMomentOption>
          )}
        </ScrollView>
        {showSearchArea && (
          <SearchAreaWrapper>
            <SearchAreaButton activeOpacity={0.9} onPress={handleSearchThisArea}>
              <FeatherIcon name='refresh-cw' color={theme.colors.primary} size={15} style={{ marginRight: 8 }} />
              <OText size={13} weight='600' color={theme.colors.primary}>{t('SEARCH_THIS_AREA', 'Search this area')}</OText>
            </SearchAreaButton>
          </SearchAreaWrapper>
        )}
      </HeaderContainer>

      <GoogleMapContainer style={{ height: '100%' }}>
        <GoogleMap
          ref={googleMapRef}
          location={mapCenter}
          delta={MAP_NEIGHBORHOOD_DELTA}
          locations={locations}
          manualZoom
          animateToRegion={false}
          useAllMapHeight
          zoomCustom
          showsUserLocation
          selectedBusinessId={selectedBusinessId}
          onMarkerSelect={handleMarkerSelect}
          onRegionChange={handleMapRegionChange}
          handleBusinessClick={(business: any) => onBusinessClick(business)}
        />
      </GoogleMapContainer>

      {isEmptyResult && (
        <WrapperNotFound>
          <NotFoundSource
            simple
            content={t('NOT_FOUND_BUSINESSES_MAP', 'No businesses to delivery / pick up at this moment, please change filters or change address.')}
          />
        </WrapperNotFound>
      )}

      {!isEmptyResult && !isKeyboardShow && (
        <MapBottomSheet
          ref={sheetRef}
          businesses={businesses}
          loading={businessesSearchList.loading}
          title={`${businesses.length} ${t('STORES_NEARBY', 'stores nearby')}`}
          selectedBusinessId={selectedBusinessId}
          orderType={orderType}
          navigation={navigation}
          onCardPress={handleCardPress}
          onBusinessClick={onBusinessClick}
          handleUpdateBusinessList={handleUpdateBusinessList}
          onEndReached={handleEndReached}
        />
      )}

      <OBottomPopup
        open={Boolean(activeFilter)}
        presentationStyle='overFullScreen'
        title={activeFilter ? t(activeFilter.toUpperCase(), activeFilter.replace(/_/g, ' ')) : ''}
        closeIcon
        transparent={activeFilter !== 'business_types'}
        onClose={() => handleCloseFilter()}
      >
        {activeFilter === 'price_range' && (
          <FilterContainer>
            <PriceListContainer>
              {priceList.map((price, i) => (
                <OButton
                  key={i}
                  class={filters?.price_level === price?.level ? 'active' : 'alert'}
                  onClick={() => handleChangePriceRange(price?.level)}
                  text={price.content}
                  style={styles.priceItem}
                  textStyle={{ fontSize: 10, color: (filters?.price_level === price?.level) ? theme.colors.active : theme.colors.disabled }}
                />
              ))}
            </PriceListContainer>
          </FilterContainer>
        )}
        {activeFilter === 'brands' && (
          <FilterContainer>
            {brandList.loading && (
              <Placeholder>
                <>
                  {[...Array(5).keys()].map(index => (
                    <BrandItem key={index}>
                      <PlaceholderLine width={120} height={15} />
                      <PlaceholderLine width={16} height={16} />
                    </BrandItem>
                  ))}
                </>
              </Placeholder>
            )}
            {!brandList.loading && (
              <BrandContainer>
                <ScrollView
                  style={{ maxHeight: 300, marginBottom: 10 }}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  {brandList.brands.map((brand: any) => (
                    <BrandItem
                      key={brand.id}
                      onPress={() => handleChangeBrandFilter(brand?.id)}
                      active={filters?.franchise_ids?.includes(brand?.id)}
                    >
                      <OText style={{ flex: 1 }} color={filters?.franchise_ids?.includes(brand?.id) ? theme.colors.active : theme.colors.textNormal}>{brand.name}</OText>
                      {filters?.franchise_ids?.includes(brand?.id) && (
                        <MaterialCommunityIcons name='checkbox-marked' size={22} color={theme.colors.active} />
                      )}
                    </BrandItem>
                  ))}
                </ScrollView>
                {!brandList?.loading && ((brandList?.brands?.filter((brand: any) => brand?.enabled))?.length === 0) && (
                  <NoResult>
                    <OText>{t('NO_RESULTS_FOUND', 'Sorry, no results found')}</OText>
                  </NoResult>
                )}
              </BrandContainer>
            )}
          </FilterContainer>
        )}
        {activeFilter === 'max_delivery_fee' && (
          <FilterContainer>
            <MaxSectionItem filters={filters} options={maxDeliveryFeeOptions} filter='max_delivery_price' handleChangeFilters={handleChangeFilters} />
          </FilterContainer>
        )}
        {activeFilter === 'max_delivery_time' && (
          <FilterContainer>
            <MaxSectionItem filters={filters} options={maxTimeOptions} filter='max_eta' handleChangeFilters={handleChangeFilters} />
          </FilterContainer>
        )}
        {activeFilter === 'max_distance' && (
          <FilterContainer>
            <MaxSectionItem filters={filters} options={maxDistanceOptions} filter='max_distance' handleChangeFilters={handleChangeFilters} />
          </FilterContainer>
        )}
        {activeFilter === 'business_types' && (
          <ScrollView style={{ maxHeight: '70%' }}>
            <FilterContainer>
              <BusinessTypeFilter isSearchMode filters={filters} handleChangeFilters={handleChangeFilters} />
            </FilterContainer>
          </ScrollView>
        )}
        {Boolean(activeFilter) && (
          <View style={{ paddingHorizontal: 20, paddingBottom: 10, backgroundColor: theme.colors.white }}>
            <OButton onClick={handleCloseFilter} text={t('VIEW_RESULTS', 'View results')} style={{ marginTop: 10 }} class='primary' />
            <OButton onClick={handleResetActiveFilter} text={t('RESET', 'Reset')} style={{ marginTop: 10, borderWidth: 0 }} class='secondary' />
          </View>
        )}
      </OBottomPopup>
    </View>
  )
}

export const BusinessSearchMap = (props: any) => {
  const BusinessListSearch = {
    ...props,
    UIComponent: BusinessSearchMapUI
  }
  return <BusinessSearchList {...BusinessListSearch} />
}
