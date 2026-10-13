import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, Dimensions, FlatList, View, TouchableOpacity } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import FastImage from 'react-native-fast-image'
import { useTheme } from 'styled-components/native'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import { convertHoursToMinutes } from '../../utils'
import { BusinessSearchParams } from '../../types'
import { BusinessSearchHeader } from './BusinessSearchHeader'
import { HeaderContent } from '../BusinessesListing/Layout/Original/HeaderContent';

import { BusinessContent, BusinessInfoContent, BusinessLogo, BusinessRightFooter, BusinessRightFooterTitle, Reviews } from '../BusinessController/styles'
import {
  SingleBusinessSearch,
  Metadata,
  BContainer,
} from './styles'

import { useLanguage, BusinessSearchList, useOrder, useUtils, useEvent, useToast, ToastType } from '@components'
import { OIcon, OText, SingleProductCard } from '@ui'

const deliveryTypes = [1, 7]

const PRODUCT_TEXT_HEIGHT = 124

const getCarouselHeight = (windowWidth: number, hasImages: boolean) =>
  (hasImages ? Math.round((windowWidth * 0.5) / 1.7) : 0) + PRODUCT_TEXT_HEIGHT

const businessHasProducts = (business: any) => business?.categories?.some((category: any) => category?.products?.length > 0)

const businessHasProductImages = (business: any) =>
  business?.categories?.some((category: any) => category?.products?.some((product: any) => !!product?.images))

const ROW_INFO_HEIGHT = 130

const getRowHeight = (windowWidth: number, hasProducts: boolean, hasImages: boolean) =>
  hasProducts ? ROW_INFO_HEIGHT + getCarouselHeight(windowWidth, hasImages) : ROW_INFO_HEIGHT

const PaginationFooter = () => (
  <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
    <Placeholder Animation={Fade}>
      <View style={{ flexDirection: 'row', width: '100%' }}>
        <View style={{ width: '20%' }}>
          <PlaceholderLine height={70} style={{ marginBottom: 10 }} />
        </View>
        <View style={{ width: '75%', marginLeft: 15 }}>
          <PlaceholderLine height={15} width={60} style={{ marginBottom: 10 }} />
          <PlaceholderLine height={15} width={40} style={{ marginBottom: 10 }} />
          <PlaceholderLine height={15} width={80} />
        </View>
      </View>
    </Placeholder>
  </View>
)

export const BusinessListingSearchUI = (props: BusinessSearchParams) => {
  const {
    navigation,
    businessesSearchList,
    onBusinessClick,
    handleChangeTermValue,
    termValue,
    handleSearchbusinessAndProducts,
    handleChangeFilters,
    filters,
    businessTypes,
    setFilters,
    brandList,
    paginationProps,
    handleUpdateProducts,
    shouldClearSearchTerm,
    setShouldClearSearchTerm
  } = props

  const windowWidth = Dimensions.get('window').width
  const cartWidth = windowWidth - 40

  const theme = useTheme()
  const [orderState] = useOrder()
  const [events] = useEvent()
  const [, { showToast }] = useToast()
  const [, t] = useLanguage()
  const [{ parsePrice, parseDistance, parseNumber, optimizeImage }] = useUtils();

  const [openFilters, setOpenFilters] = useState(false)
  const isFetchingRef = useRef(false)
  const listRef = useRef<any>(null)
  const scrollOffsetRef = useRef(0)
  const contentSizeRef = useRef(0)
  const viewportHeightRef = useRef(0)
  const prevBusinessesCountRef = useRef(0)

  useEffect(() => {
    const count = businessesSearchList?.businesses?.length ?? 0
    const prev = prevBusinessesCountRef.current
    prevBusinessesCountRef.current = count
    if (count > prev && prev > 0) {
      const maxOffset = Math.max(0, contentSizeRef.current - viewportHeightRef.current)
      if (scrollOffsetRef.current > maxOffset) {
        listRef.current?.scrollToOffset?.({ offset: maxOffset, animated: false })
      }
    }
  }, [businessesSearchList?.businesses?.length])

  useEffect(() => {
    if (businessesSearchList.loading && (businessesSearchList?.businesses?.length ?? 0) === 0) {
      listRef.current?.scrollToOffset?.({ offset: 0, animated: false })
    }
  }, [businessesSearchList.loading, businessesSearchList?.businesses?.length])

  useEffect(() => {
    if (!businessesSearchList.loading) {
      isFetchingRef.current = false
    }
  }, [businessesSearchList.loading])

  const clearFilters = () => {
    setFilters({ business_types: [], orderBy: 'distance', franchise_ids: [], price_level: null })
  }

  const handleChangeActiveBusinessType = (type: any) => {
    if (type?.id === null) {
      handleChangeFilters('business_types', [])
      return
    }
    if (filters?.business_types?.includes(type?.id)) {
      const arrayAux = filters?.business_types
      const index = arrayAux?.indexOf(type?.id)
      arrayAux.splice(index, 1)
      handleChangeFilters('business_types', arrayAux)
    } else {
      handleChangeFilters('business_types', [...filters?.business_types, type?.id])
    }
  }

  const handleChangeBrandFilter = (brandId: number) => {
    let franchiseIds = [...filters?.franchise_ids]
    if (filters?.franchise_ids?.includes(brandId)) franchiseIds = filters?.franchise_ids?.filter((item: any) => item !== brandId)
    else franchiseIds.push(brandId)
    handleChangeFilters && handleChangeFilters('franchise_ids', franchiseIds)
  }

  const handleChangePriceRange = (value: string) => {
    if (value === filters?.price_level) handleChangeFilters('price_level', null)
    else handleChangeFilters('price_level', value)
  }

  const handleApplyFilters = () => {
    handleSearchbusinessAndProducts(true)
    setOpenFilters(false)
  }

  const isInteger = (val: any) => Number.isInteger(Number(val)) && !!val

  const onProductClick = (business: any, categoryId: any, productId: any, product: any) => {
    if (!isInteger(business?.id) ||
      !isInteger(categoryId) ||
      !isInteger(productId) ||
      !business.slug || !business.header || !business.logo) {
      showToast(ToastType.Error, t('NOT_AVAILABLE', 'Not Available'))
      return
    }
    const currentCart: any = Object.values(orderState.carts).find((cart: any) => cart?.business?.slug === business?.slug) ?? {}
    const productAddedToCartLength = currentCart?.products?.reduce((productsLength: number, Cproduct: any) => { return productsLength + (Cproduct?.id === productId ? Cproduct?.quantity : 0) }, 0) || 0
    navigation.navigate('ProductDetails', {
      isRedirect: 'business',
      businessId: business?.id,
      categoryId: categoryId,
      productId: productId,
      product: product,
      business: {
        store: business.slug,
        header: business.header,
        logo: business.logo,
      },
      productAddedToCartLength
    })
  }

  const handleEndReached = useCallback(() => {
    const hasMore = !(
      paginationProps.totalPages === paginationProps.currentPage
    );
    if (businessesSearchList.loading || isFetchingRef.current || !hasMore || !(businessesSearchList?.businesses?.length > 0)) return
    isFetchingRef.current = true
    handleSearchbusinessAndProducts(false, {}, termValue);
  }, [businessesSearchList.loading, businessesSearchList?.businesses?.length, paginationProps, termValue]);

  const rowContextRef = useRef<any>({})
  rowContextRef.current = {
    theme,
    t,
    parsePrice,
    parseDistance,
    parseNumber,
    optimizeImage,
    orderType: orderState?.options?.type,
    onBusinessClick,
    onProductClick,
    handleUpdateProducts,
    cartWidth,
    windowWidth
  }

  const renderBusinessItem = useCallback(({ item: business }: any) => (
    <BusinessRow business={business} rowContext={rowContextRef.current} />
  ), [])


  const onChangeTermValue = (query: any) => {
    handleChangeTermValue(query)
    if (query) {
      events.emit('products_searched', query)
    }
  }

  useEffect(() => {
    if (filters.business_types?.length === 0 && filters.orderBy === 'default' && Object.keys(filters)?.length === 2 && !openFilters) {
      handleSearchbusinessAndProducts(true)
    }
  }, [filters, openFilters])

  useEffect(() => {
    handleSearchbusinessAndProducts(true)
  }, [filters.business_types])

  useEffect(() => {
    if (shouldClearSearchTerm) {
      handleChangeTermValue('')
      setShouldClearSearchTerm(false)
    }
  }, [shouldClearSearchTerm, handleChangeTermValue, setShouldClearSearchTerm]);


  const hasSearchTerm = termValue?.length >= 3
  const hasMorePages = businessesSearchList?.businesses?.length > 0 &&
    (paginationProps?.totalPages == null || paginationProps?.currentPage < paginationProps?.totalPages)

  const businessFiltered = useMemo(() => {
    return businessesSearchList.businesses ?? []
  }, [businessesSearchList.businesses])

  const rowLayouts = useMemo(() => {
    let offset = 0
    return businessFiltered.map((business: any, index: number) => {
      const length = getRowHeight(windowWidth, businessHasProducts(business), businessHasProductImages(business))
      const layout = { length, offset, index }
      offset += length
      return layout
    })
  }, [businessFiltered, windowWidth])

  const getItemLayout = useCallback((data: any, index: number) => (
    rowLayouts[index] ?? { length: ROW_INFO_HEIGHT, offset: index * ROW_INFO_HEIGHT, index }
  ), [rowLayouts])

  return (
    <>
      <HeaderContent
        hideAddress
        hideOrderControl
        title={t('SEARCH', 'Search')}
        navigation={navigation}
        onHandleCart={() => navigation.navigate('Cart', {
          businessId: businessesSearchList?.businesses?.[0]?.id,
          business: businessesSearchList?.businesses?.[0]
        })}
      />
      <FlatList
        ref={listRef}
        data={businessFiltered}
        ListHeaderComponent={<BusinessSearchHeader
          businessesSearchList={businessesSearchList}
          paginationProps={paginationProps}
          termValue={termValue}
          brandList={brandList}
          filters={filters}
          openFilters={openFilters}
          businessTypes={businessTypes}
          onChangeTermValue={onChangeTermValue}
          handleChangeBrandFilter={handleChangeBrandFilter}
          handleChangePriceRange={handleChangePriceRange}
          handleApplyFilters={handleApplyFilters}
          clearFilters={clearFilters}
          handleChangeFilters={handleChangeFilters}
          handleChangeActiveBusinessType={handleChangeActiveBusinessType}
        />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={1}
        onContentSizeChange={(w: number, h: number) => { contentSizeRef.current = h }}
        onLayout={(e: any) => { viewportHeightRef.current = e.nativeEvent.layout.height }}
        ListFooterComponent={hasMorePages ? <PaginationFooter /> : null}
        removeClippedSubviews={false}
        initialNumToRender={8}
        maxToRenderPerBatch={25}
        windowSize={9}
        updateCellsBatchingPeriod={50}
        onScroll={(e: any) => { scrollOffsetRef.current = e.nativeEvent.contentOffset.y }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        keyExtractor={(business: any, index: number) => `card-${business?.id}-${index}`}
        getItemLayout={getItemLayout}
        renderItem={renderBusinessItem}
      />
    </>
  )
}

const BusinessRow = ({ business, rowContext }: any) => {
  const {
    theme,
    t,
    parsePrice,
    parseDistance,
    parseNumber,
    optimizeImage,
    orderType,
    onBusinessClick,
    onProductClick,
    handleUpdateProducts,
    cartWidth,
    windowWidth
  } = rowContext
  const hasProducts = businessHasProducts(business)
  const hasImages = businessHasProductImages(business)
  const carouselHeight = getCarouselHeight(windowWidth, hasImages)
  const rowHeight = getRowHeight(windowWidth, hasProducts, hasImages)
  const productsScrollRef = useRef<any>(null)

  useEffect(() => {
    productsScrollRef.current?.scrollTo?.({ x: 0, animated: false })
  }, [business?.id])
  return (
          <BContainer style={{ paddingHorizontal: 0, paddingTop: 0, paddingBottom: 0, height: rowHeight, overflow: 'hidden' }}>
            <View>
            <SingleBusinessSearch>
              <TouchableOpacity
                onPress={() => onBusinessClick(business)}
                activeOpacity={0.5}
                accessibilityLabel={t('GO_TO_STORE', 'Go to store')}
                accessibilityRole="button"
              >
                <BusinessContent>
                  {business?.logo && (
                    <BusinessLogo style={{ width: cartWidth * 0.2, height: cartWidth * 0.2 }}>
                      <FastImage
                        style={{ width: cartWidth * 0.2, height: cartWidth * 0.2, borderRadius: 15 }}
                        source={{
                          uri: optimizeImage(business?.logo, 'h_150,c_limit'),
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    </BusinessLogo>
                  )}
                  <BusinessRightFooter style={{ width: cartWidth * ((business?.logo) ? 0.8 : 1), paddingLeft: business?.logo ? 10 : 0 }}>
                    <BusinessRightFooterTitle>
                      <OText
                        size={16}
                        style={{ width: '90%' }}
                        weight={'500'}
                        numberOfLines={2}
                        ellipsizeMode='tail'
                      >
                        {business?.name}
                      </OText>
                      {business?.reviews?.total > 0 && (
                        <Reviews>
                          <OIcon src={theme.images.general.star} width={14} color={theme.colors.star} />
                          <OText mLeft={4}>
                            {parseNumber(business?.reviews?.total, { separator: '.' })}
                          </OText>
                        </Reviews>
                      )}
                    </BusinessRightFooterTitle>
                    {business?.reviews?.total > 0 && (
                      <Reviews>
                        <OIcon src={theme.images.general.star} width={14} color={theme.colors.star} />
                        <OText mLeft={4}>
                          {parseNumber(business?.reviews?.total, { separator: '.' })}
                        </OText>
                      </Reviews>
                    )}
                    <Metadata>
                      {!business?.open ? (
                        <OText color={theme.colors.red}>
                          {t('CLOSED', 'Closed')}
                        </OText>
                      ) : (
                        <BusinessInfoContent>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <SimpleLineIcons name='clock' size={14} color={theme.colors.textNormal} />
                            <OText>
                              {convertHoursToMinutes(
                                deliveryTypes.includes(orderType)
                                  ? (business?.delivery_time)
                                  : (business?.pickup_time),
                              )}
                            </OText>
                          </View>
                          {deliveryTypes.includes(orderType) && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                              <FastImage source={theme.images.general.delivery_fee} style={{ width: 14, height: 14 }} />
                              <OText>
                                {parsePrice(business?.delivery_price)}
                              </OText>
                            </View>
                          )}
                          <OText>
                            {parseDistance(business?.distance)}
                          </OText>
                        </BusinessInfoContent>
                      )}
                    </Metadata>
                  </BusinessRightFooter>
                </BusinessContent>
              </TouchableOpacity>
              {hasProducts && (
                <ScrollView
                  ref={productsScrollRef}
                  horizontal
                  style={{ height: carouselHeight }}
                  contentContainerStyle={{ flexGrow: 1, marginTop: 20 }}
                  showsHorizontalScrollIndicator={false}
                >
                  {business?.categories?.map((category: any) => category?.products?.map((product: any, i: number) => (
                    <View key={'prod_' + product.id + `_${i}`} style={{ width: windowWidth * 0.5, marginRight: 20 }}>

                      <SingleProductCard
                        key={product?.id}
                        isPreviously
                        isSoldOut={(product.inventoried && !product.quantity)}
                        product={product}
                        businessId={business?.id}
                        onProductClick={(product: any) => onProductClick(business, category?.id, product?.id, product)}
                        productAddedToCartLength={0}
                        handleUpdateProducts={(productId: number, changes: any) => handleUpdateProducts(productId, category?.id, business?.id, changes)}
                      />
                    </View>
                  )))}
                </ScrollView>
              )}
            </SingleBusinessSearch>
            </View>
          </BContainer>
  )
}

export const BusinessListingSearch = (props: BusinessSearchParams) => {
  const BusinessListSearchProps = {
    ...props,
    UIComponent: BusinessListingSearchUI,
    lazySearch: true
  }
  return <BusinessSearchList {...BusinessListSearchProps} />
}
