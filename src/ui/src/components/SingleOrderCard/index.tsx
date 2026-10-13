import React, { useState, useEffect } from 'react';
import FastImage from 'react-native-fast-image'
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { useIsFocused } from '@react-navigation/native';

import { SingleOrderCardParams } from '../../types';
import { OrderEta } from '../OrderDetails/OrderEta'
import {
  InnerContainer,
  Logo,
  CardInfoWrapper,
  ContentHeader,
  ButtonWrapper,
  ContentFooter,
  UnreadMessageCounter,
  Price,
  MultiLogosContainer,
  InfoText
} from './styles';

import {
  SingleOrderCard as SingleOrderCardController,
  useUtils,
  useOrder,
  useLanguage,
  useConfig
} from '@components';

import { OAlertOriginal as OAlert, OText, OButton, CardAnimation, LottieAnimation } from '@ui'

const SingleOrderCardUI = (props: SingleOrderCardParams) => {
  const {
    order,
    reorderLoading,
    handleReorder,
    getOrderStatus,
    handleFavoriteOrder,
    onNavigationRedirect,
    pastOrders,
    isMessageView,
    handleClickOrder,
    handleRemoveCart,
    cartState
  } = props;

  const [{ parsePrice, optimizeImage, parseDate }] = useUtils();
  const [, t] = useLanguage();
  const [{ carts }] = useOrder()
  const [{ configs }] = useConfig()
  const theme = useTheme();
  const isFocused = useIsFocused();

  let [reorderSelected, setReorderSelected] = useState<number | null>(null);
  const [confirm, setConfirm] = useState<any>({ open: false, content: null, handleOnAccept: null, id: null, title: null })

  const allowedOrderStatus = [1, 2, 5, 6, 10, 11, 12, 15];
  const isCustomOrder = order?.declared_value != null || order?.metafields?.find?.((m: any) => m?.key === 'declared_value')
  const isGiftCardOrder = !order?.business_id && !isCustomOrder
  const changeIdToExternalId = configs?.change_order_id?.value === '1'

  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
      padding: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    logo: {
      borderRadius: 8,
      width: 64,
      height: 64
    },
    minilogo: {
      borderRadius: 8,
      width: 40,
      height: 40
    },
    logoWrapper: {
      overflow: 'hidden',
      backgroundColor: 'white',
      borderRadius: 8,
      shadowColor: '#000000',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 3
    },
    buttonsActions: {
      paddingVertical: 7,
      paddingLeft: 18,
      paddingRight: 18,
      minHeight: 40,
      height: 'auto',
      borderRadius: 30
    }
  });

  const handleReorderClick = (order: any) => {
    setReorderSelected(null)
    reorderSelected = null
    const isMultiOrders = Array.isArray(order?.id)

    const isRemoveCart = isMultiOrders
      ? order?.business_id?.some((businessId: any) => !!carts[`businessId:${businessId}`]?.uuid)
      : carts[`businessId:${order?.business_id}`] && !!carts[`businessId:${order?.business_id}`]?.uuid

    if (isRemoveCart) {
      setConfirm({
        open: true,
        content: [t('QUESTION_DELETE_PRODUCTS_FROM_CART', 'Are you sure that you want to delete all products from cart?')],
        title: t('ORDER', 'Order'),
        handleOnAccept: async () => {
          handleRemoveCart(order)
          setConfirm({ ...confirm, open: false })
        }
      })
    } else {
      const orderId = Array.isArray(order?.id) ? order?.id[0] : order?.id
      setReorderSelected(orderId)
      reorderSelected = orderId
      handleReorder && handleReorder(order?.id)
    }
  };

  const handleClickOrderReview = (order: any) => {
    if (pastOrders) {
      onNavigationRedirect &&
        onNavigationRedirect('ReviewOrder', {
          order: {
            id: order?.id,
            business_id: order?.business_id,
            logo: order?.business?.length > 1 ? order?.business?.map?.((business: any) => business?.logo) : order?.business?.logo,
            driver: order?.driver,
            products: order?.products,
            review: order?.review,
            user_review: order?.user_review,
            business: order?.business
          },
        });
      return
    }
    if (isMessageView) {
      handleClickOrder(order?.uuid)
      return
    }
    onNavigationRedirect &&
      onNavigationRedirect('OrderDetails', { orderId: order?.uuid, orderNumberId: order?.id });
  };

  const handleClickViewOrder = (order: any) => {
    if (isMessageView) {
      handleClickOrder(order?.uuid)
      return
    }
    if (order?.cart_group_id) {
      onNavigationRedirect?.('MultiOrdersDetails', { orderId: order?.cart_group_id });
    } else {
      onNavigationRedirect?.('OrderDetails', { orderId: order?.uuid, orderNumberId: order?.id });
    }
  };

  const handleChangeFavorite = () => {
    handleFavoriteOrder && handleFavoriteOrder(!order?.favorite)
  };

  const handleOriginalReorder = () => {
    setConfirm({ ...confirm, open: false, title: null })
  }

  const hideBusinessLogo = theme?.orders?.components?.business_logo?.hidden
  const hideDate = theme?.orders?.components?.date?.hidden
  const hideBusinessName = theme?.orders?.components?.business_name?.hidden
  const hideOrderNumber = theme?.orders?.components?.order_number?.hidden
  const hideReviewOrderButton = theme?.orders?.components?.review_order_button?.hidden
  const hideReorderButton = theme?.orders?.components?.reorder_button?.hidden
  const hideFavorite = theme?.orders?.components?.favorite?.hidden
  const hideOrderStatus = theme?.orders?.components?.order_status?.hidden
  const isReservationPreorder = parseInt(order?.delivery_type, 10) === 9 && parseInt(order?.status, 10) === 13

  useEffect(() => {
    if (isFocused) setReorderSelected(null)
  }, [isFocused])

  return (
    <>
      <CardAnimation
        onClick={() => handleClickViewOrder(order)}
        style={[styles.container]}
      >
        <InnerContainer>
          {/* {!hideBusinessLogo && (!!order.business?.logo || theme?.images?.dummies?.businessLogo) && (
            <>
              {order?.business?.length > 1 ? (
                <MultiLogosContainer>
                  {order?.business?.map((business: any, i: number) => i < 2 && (
                    <Logo
                      isMulti
                      key={business?.id}
                      style={styles.logoWrapper}
                    >
                      <FastImage
                        style={styles.minilogo}
                        source={business?.logo ? {
                          uri: optimizeImage(business?.logo, 'h_300,c_limit'),
                          priority: FastImage.priority.normal,
                        } : theme?.images?.dummies?.businessLogo}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </Logo>
                  ))}
                  {order?.business?.length > 1 && (order?.business?.length - 2) > 0 && (
                    <OText mRight={3}>{`+ ${order?.business?.length - 2}`}</OText>
                  )}
                </MultiLogosContainer>
              ) : (
                <Logo style={styles.logoWrapper}>
                  <FastImage
                    style={styles.logo}
                    source={order.business?.logo ? {
                      uri: optimizeImage(order.business?.logo, 'h_300,c_limit'),
                      priority: FastImage.priority.normal,
                    } : theme?.images?.dummies?.businessLogo}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </Logo>
              )}
            </>
          )} */}
          <CardInfoWrapper>
            <ContentHeader>
              {(order?.business?.length > 1 && !hideOrderNumber) || (!order?.business?.length && !hideBusinessName) && (
                <View style={{ flex: 1 }}>
                  <OText lineHeight={18} weight={'600'} numberOfLines={1} ellipsizeMode={'tail'}>
                    {order?.business?.length > 1 ? `${t('GROUP_ORDER', 'Group Order')} ${t('No', 'No')}. ${order?.cart_group_id}` : order.business?.name}
                  </OText>
                </View>
              )}
              {!!!pastOrders && (
                <>
                  {isMessageView ? (
                    <>
                      {order?.unread_count > 0 && (
                        <UnreadMessageCounter>
                          <OText color={theme.colors.active} lineHeight={18} >
                            {order?.unread_count}
                          </OText>
                        </UnreadMessageCounter>
                      )}
                    </>
                  ) : (
                    <Price>
                      <OText lineHeight={18}>
                        {parsePrice(order?.summary?.total ?? order?.total)}
                      </OText>
                    </Price>
                  )}
                </>
              )}
            </ContentHeader>
            <ContentFooter>
              <View style={{ flex: 1 }}>
                <InfoText>
                  {(!!!pastOrders || order?.business?.length > 1) && !hideOrderNumber && (
                    <>
                      <OText
                        space
                        style={{ marginVertical: 3 }}
                        numberOfLines={1}
                      >
                        {order?.business?.length > 1 ? order?.business?.length : !(changeIdToExternalId && order?.external_id) && (t('ORDER_NO', 'Order No') + '.')}
                      </OText>
                      <OText
                        style={{ marginVertical: 3 }}
                        numberOfLines={1}
                      >
                        {order?.business?.length > 1 ? t('ORDERS', 'orders') + ' \u2022 ' : ((changeIdToExternalId && order?.external_id) || order.id) + ` \u2022 `}
                      </OText>
                    </>
                  )}
                  {!hideDate && (
                    <OText
                      style={{ marginVertical: 3 }}
                      numberOfLines={1}>
                      {
                        pastOrders
                          ? order?.delivery_datetime_utc ? parseDate(order?.delivery_datetime_utc) : parseDate(order?.delivery_datetime, { utc: false })
                          : <OrderEta order={order} />
                      }
                    </OText>
                  )}
                </InfoText>
                {!hideOrderStatus && (
                  <OText
                    color={theme.colors.active}
                    numberOfLines={1}>
                    {isReservationPreorder
                      ? t('RESERVATION', 'Reservation')
                      : getOrderStatus(order.status, t, theme)?.value}
                  </OText>
                )}
              </View>
              {!isMessageView && !order?.business?.length && !hideFavorite && (
                <LottieAnimation
                  type='favorite'
                  onClick={handleChangeFavorite}
                  initialValue={order?.favorite ? 0.5 : 0}
                  toValue={order?.favorite ? 0 : 0.5}
                  style={{ marginBottom: 5 }}
                  iconProps={{ color: theme.colors.danger, size: 16, style: { top: 7 } }}
                  isActive={order?.favorite}
                />
              )}
            </ContentFooter>
            {!!pastOrders && !isGiftCardOrder && (
              <ButtonWrapper>
                {!hideReviewOrderButton &&
                  allowedOrderStatus.includes(parseInt(order?.status)) &&
                  !order.review && order?.cart && (
                    <OButton
                      text={t('REVIEW', 'Review')}
                      class='secondary'
                      style={styles.buttonsActions}
                      textStyle={{ fontSize: 12, fontWeight: 'bold' }}
                      onClick={() => handleClickOrderReview(order)}
                    />
                  )}
                {!hideReorderButton && typeof order?.id === 'number' && order?.cart && !order?.cloned_order_id && (
                  <OButton
                    text={t('REORDER', 'Reorder')}
                    class='active'
                    style={styles.buttonsActions}
                    textStyle={{ fontSize: 12, fontWeight: 'bold' }}
                    onClick={() => handleReorderClick(order)}
                    loading={(reorderLoading && order.id === reorderSelected) || cartState?.loading}
                  />
                )}
              </ButtonWrapper>
            )}
          </CardInfoWrapper>
        </InnerContainer>
      </CardAnimation>
      <OAlert
        open={confirm.open}
        title={confirm.title}
        content={confirm.content}
        onAccept={confirm.handleOnAccept}
        onCancel={() => handleOriginalReorder()}
        onClose={() => handleOriginalReorder()}
      />
    </>

  )
}

export const SingleOrderCard = (props: any) => {
  const singleOrderCardProps = {
    ...props,
    UIComponent: SingleOrderCardUI
  }
  return <SingleOrderCardController {...singleOrderCardProps} />
}
