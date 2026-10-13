import React, { useEffect } from 'react';
import { View } from 'react-native';
import moment from 'moment';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';

import { FavoriteParams } from '../../types';
import { Container, WrappButton } from './styles'
import { getOrderStatus } from '../../utils'

import {
  FavoriteList as FavoriteListController,
  useOrder,
  useLanguage
} from '@components';

import {
  _setStoreData,
  OButton,
  BusinessController,
  SingleProductCard,
  NotFoundSource,
  SingleOrderCard
} from '@ui'

const FavoriteListUI = (props: FavoriteParams) => {
  const {
    favoriteList,
    handleUpdateFavoriteList,
    pagination,
    getFavoriteList,
    navigation,
    onNavigationRedirect,
    reorderState,
    handleReorder,
    isBusiness,
    isOrder,
    isProduct
  } = props

  const theme = useTheme();
  const [, t] = useLanguage()
  const [orderState] = useOrder();
  const [{ carts }] = useOrder()

  const pastOrders = [1, 2, 5, 6, 10, 11, 12, 15, 16, 17]

  const onProductClick = (product: any) => {
    const categoryId = product?.category?.id
    const businessId = product?.category?.business?.id
    if (!categoryId || !businessId) return
    onNavigationRedirect && onNavigationRedirect('ProductDetails', {
      isRedirect: 'business',
      productId: product?.id,
      businessId: businessId,
      categoryId: categoryId,
      business: {
        store: product?.category?.business.slug,
        header: product?.category?.header,
      }
    })
  }

  useEffect(() => {
    const _businessId = 'businessId:' + reorderState?.result?.business_id
    if (reorderState?.error) {
      if (reorderState?.result?.business_id) {
        _setStoreData('adjust-cart-products', JSON.stringify(_businessId))
        onNavigationRedirect && onNavigationRedirect('Business', { store: reorderState?.result?.business?.slug })
      }
    }
    if (!reorderState?.error && reorderState.loading === false && reorderState?.result?.business_id) {
      const cartProducts = carts?.[_businessId]?.products
      const available = cartProducts.every((product: any) => product.valid === true)
      const orderProducts = favoriteList?.favorites.find((order: any) => order?.id === reorderState?.result?.orderId)?.products

      if (available && reorderState?.result?.uuid && (cartProducts?.length === orderProducts?.length)) {
        onNavigationRedirect && onNavigationRedirect('CheckoutPage', { cartUuid: reorderState?.result.uuid })
      } else {
        _setStoreData('adjust-cart-products', JSON.stringify(_businessId))
        cartProducts?.length !== orderProducts?.length && _setStoreData('already-removed', JSON.stringify('removed'))
        onNavigationRedirect && onNavigationRedirect('Business', { store: reorderState?.result?.business?.slug })
      }
    }
  }, [reorderState])

  const handleBusinessClick = (business: any) => {
    onNavigationRedirect && onNavigationRedirect('Business', {
      store: business.slug,
      header: business.header,
      logo: business.logo,
    });
  }

  const BusinessSkeleton = () => {
    const skeletonCardStyle = {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 15,
      padding: 15,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    };

    return (
      <Placeholder Animation={Fade} style={skeletonCardStyle}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <PlaceholderLine height={theme.utils.tsize.xl} width={60} style={{ marginBottom: 10 }} />
          <PlaceholderLine height={24} width={24} style={{ borderRadius: 12, marginBottom: 10 }} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <PlaceholderLine height={theme.utils.tsize.m} width={15} style={{ marginBottom: 10 }} />
          <PlaceholderLine height={theme.utils.tsize.m} width={30} style={{ marginLeft: 8, marginBottom: 10 }} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <PlaceholderLine height={theme.utils.tsize.m} width={20} style={{ marginBottom: 10 }} />
          <PlaceholderLine height={theme.utils.tsize.m} width={20} style={{ marginLeft: 12, marginBottom: 10 }} />
          <PlaceholderLine height={theme.utils.tsize.m} width={20} style={{ marginLeft: 12, marginBottom: 10 }} />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <PlaceholderLine height={theme.utils.tsize.s} width={40} style={{ marginBottom: 0 }} />
          <PlaceholderLine height={36} width={30} style={{ borderRadius: 10, marginBottom: 0 }} />
        </View>
      </Placeholder>
    )
  }

  const ProductSkeleton = () => {
    const skeletonCardStyle = {
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: 25,
    };

    const lineStyle = {
      borderRadius: 4,
      backgroundColor: theme.colors.backgroundGray200,
      marginBottom: 0,
    };

    return (
      <View style={skeletonCardStyle}>
        <Placeholder Animation={Fade}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <PlaceholderLine height={theme.utils.tsize.xl || 18} width={70} style={{ ...lineStyle, marginBottom: 4 }} />
              <PlaceholderLine height={theme.utils.tsize.m || 14} width={90} style={{ ...lineStyle, marginBottom: 4 }} />
              <PlaceholderLine height={theme.utils.tsize.m || 14} width={80} style={{ ...lineStyle, marginBottom: 8 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <PlaceholderLine height={theme.utils.tsize.m || 14} width={40} style={{ ...lineStyle, marginRight: 8 }} />
                </View>
                <PlaceholderLine height={28} width={30} style={{ ...lineStyle, borderRadius: 8 }} />
              </View>
            </View>

            <PlaceholderLine height={80} width={20} style={{ ...lineStyle, borderRadius: 8 }} />
          </View>
        </Placeholder>
      </View>
    )
  }

  const OrderSkeleton = () => {
    const skeletonCardStyle = {
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: 25,
    };

    const lineStyle = {
      borderRadius: 4,
      backgroundColor: theme.colors.backgroundGray200,
      marginBottom: 0,
    };
    return (
      <View style={skeletonCardStyle}>
        <Placeholder Animation={Fade}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <PlaceholderLine height={theme.utils.tsize.xl || 18} width={30} style={{ ...lineStyle, marginBottom: 4 }} />
                <PlaceholderLine height={theme.utils.tsize.xl || 14} width={50} style={{ ...lineStyle, marginBottom: 4 }} />
              </View>
              <PlaceholderLine height={theme.utils.tsize.m || 14} width={80} style={{ ...lineStyle, marginBottom: 8 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <PlaceholderLine height={18} width={60} style={{ ...lineStyle }} />
                </View>
                <PlaceholderLine height={theme.utils.tsize.m || 14} width={10} style={{ ...lineStyle, marginRight: 8 }} />
              </View>
            </View>
          </View>
        </Placeholder>
      </View>
    )
  }

  return (
    <Container>
      {isBusiness && (
        <>
          {favoriteList?.favorites?.length > 0 && (
            favoriteList.favorites?.sort((a: any, b: any) => a?.name?.toLowerCase() > b?.name?.toLowerCase()).map((business: any, i: number) => (
              <BusinessController
                key={`${business.id}_` + i}
                favoriteView
                business={business}
                isBusinessOpen={business.open}
                handleCustomClick={handleBusinessClick}
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
                handleUpdateBusinessList={handleUpdateFavoriteList}
              />
            ))
          )}
          {favoriteList?.loading && (
            [...Array(5).keys()].map(i => (
              <BusinessSkeleton key={i} />
            ))
          )}
          {!favoriteList?.loading && !favoriteList?.favorites?.length && (
            <NotFoundSource
              iconName='heart-outline'
              content={t('NOT_FOUND_FAVORITES_LIST', 'No favorites to show at this time.')}
            />
          )}
        </>
      )}

      {isProduct && (
        <>
          {favoriteList?.favorites?.length > 0 && (
            favoriteList.favorites?.sort((a: any, b: any) => a?.name?.toLowerCase() > b?.name?.toLowerCase()).map((product: any, i: number) => (
              <SingleProductCard
                key={`${product?.id}_${i}`}
                isSoldOut={product?.inventoried && !product?.quantity}
                product={product}
                onProductClick={onProductClick}
                handleUpdateProducts={handleUpdateFavoriteList}
              />
            ))
          )}
          {favoriteList?.loading && (
            [...Array(5).keys()].map(i => (
              <ProductSkeleton key={i} />
            ))
          )}
          {!favoriteList?.loading && !favoriteList?.favorites?.length && (
            <NotFoundSource
              iconName='heart-outline'
              content={t('NOT_FOUND_FAVORITES_LIST', 'No favorites to show at this time.')}
            />
          )}
        </>
      )}

      {isOrder && (
        <>
          {favoriteList?.favorites?.length > 0 && (
            favoriteList.favorites?.sort((a: any, b: any) => moment(a?.delivery_datetime_utc).valueOf() - moment(b?.delivery_datetime_utc).valueOf())
              .map((order: any, i: number) => (
                <SingleOrderCard
                  key={`${order?.id}_${i}`}
                  order={order}
                  getOrderStatus={getOrderStatus}
                  onNavigationRedirect={onNavigationRedirect}
                  pastOrders={pastOrders.includes(order?.status)}
                  handleUpdateOrderList={handleUpdateFavoriteList}
                  handleUpdateFavoriteList={handleUpdateFavoriteList}
                  handleReorder={handleReorder}
                  reorderLoading={reorderState?.loading}
                />
              ))
          )}
          {favoriteList?.loading && (
            [...Array(5).keys()].map(i => (
              <OrderSkeleton key={i} />
            ))
          )}
          {!favoriteList?.loading && !favoriteList?.favorites?.length && (
            <NotFoundSource
              iconName='heart-outline'
              content={t('NOT_FOUND_FAVORITES_LIST', 'No favorites to show at this time.')}
            />
          )}
        </>
      )}

      {!favoriteList?.loading && pagination.totalPages && pagination.currentPage < pagination.totalPages && (
        <WrappButton>
          <OButton
            onClick={() => getFavoriteList(pagination?.currentPage + 1)}
            text={t('LOAD_MORE_ITEMS', 'Load more items')}
          />
        </WrappButton>
      )}
    </Container>
  )
}

export const FavoriteList = (props: any) => {
  const favoriteBusinessesProps = {
    ...props,
    UIComponent: FavoriteListUI,
    enableLoadingAtRender: true
  }
  return <FavoriteListController {...favoriteBusinessesProps} />
}
