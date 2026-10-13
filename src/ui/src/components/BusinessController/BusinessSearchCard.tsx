import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FastImage from 'react-native-fast-image'
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

import { BusinessControllerParams } from '../../types';
import { convertHoursToMinutes, lightenDarkenColor, shape } from '../../utils';

import {
  BusinessHero,
  BusinessContent,
  Metadata,
  BusinessState,
  BusinessLogo,
  Reviews,
  RibbonBox,
  OfferBox,
  BusinessRightFooter,
  BusinessRightFooterTitle,
  BusinessInfoContent,
  BusinessStateView
} from './styles';

import { BusinessSimpleCard } from './BusinessSimpleCard';
import { BusinessFavoriteCard } from './BusinessFavoriteCard';

import {
  BusinessController as BusinessSingleCard,
  useUtils,
  useOrder,
  useLanguage,
  useConfig,
  useToast,
  useSession,
  ToastType
} from '@components';

import {
  LottieAnimation,
  CardAnimation,
  OIcon,
  OText,
  OButton
} from '@ui'

const deliveryTypes = [1, 7]

export const BusinessSearchCard = (props: BusinessControllerParams) => {
  const {
    business,
    handleClick,
    onCardSelect,
    navigation,
    isBusinessOpen,
    style,
    businessHeader,
    businessLogo,
    businessReviews,
    businessDeliveryPrice,
    businessDeliveryTime,
    businessPickupTime,
    businessDistance,
    handleFavoriteBusiness,
    getBusinessOffer,
    isHighestRatedBusiness,
  } = props;

  const [{ parsePrice, parseDistance, parseNumber, optimizeImage }] = useUtils();
  const [, { showToast }] = useToast()
  const [orderState] = useOrder();
  const [{ auth }] = useSession()
  const [configState] = useConfig();
  const [, t] = useLanguage();
  const theme = useTheme()
  const windowWidth = Dimensions.get('window').width
  const windowHeight = Dimensions.get('window').height

  const hideBusinessFee = theme?.business_listing_view?.components?.business?.components?.fee?.hidden
  const hideBusinessTime = theme?.business_listing_view?.components?.business?.components?.time?.hidden
  const hideBusinessDistance = theme?.business_listing_view?.components?.business?.components?.distance?.hidden
  const hideBusinessFavorite = theme?.business_listing_view?.components?.business?.components?.favorite?.hidden
  const hideBusinessOffer = theme?.business_listing_view?.components?.business?.components?.offer?.hidden
  const hideBusinessHeader = theme?.business_listing_view?.components?.business?.components?.header?.hidden

  const cardHeight = windowHeight * 0.34
  const cartWidth = windowWidth - 40

  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
      width: '100%',
      position: 'relative'
    }
  })

  const vibrateApp = (impact?: any) => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    };
    ReactNativeHapticFeedback.trigger(impact || "impactLight", options);
  }

  const handleCardSelect = (selectedBusiness: any) => {
    vibrateApp()
    onCardSelect?.(selectedBusiness)
  }

  const handleOrderNow = (selectedBusiness: any) => {
    vibrateApp()
    if (business?.open) {
      handleClick?.(selectedBusiness)
      return
    }
    if (configState?.configs?.preorder_status_enabled?.value === '1') {
      navigation.navigate('MomentOption', { business: selectedBusiness, handleBusinessClick: handleClick })
      return
    }
    showToast(ToastType.Info, t('ERROR_ADD_PRODUCT_BUSINESS_CLOSED', 'The business is closed at the moment'));
  }

  const handleChangeFavorite = () => {
    if (auth) {
      handleFavoriteBusiness && handleFavoriteBusiness(!business?.favorite)
    } else {
      navigation && navigation.navigate('Login');
    }
  }

  return (
    <View style={{
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      marginHorizontal: 10,
      marginBottom: 20,
    }}>
      <CardAnimation
        style={[style, styles.container]}
        onClick={() => handleCardSelect(business)}
      >
        {business?.ribbon?.enabled && (
          <View style={{ bottom: 20 }}>
            <RibbonBox
              bgColor={business?.ribbon?.color}
              colorText={lightenDarkenColor(business?.ribbon?.color)}
              borderRibbon={lightenDarkenColor(business?.ribbon?.color)}
              isRoundRect={business?.ribbon?.shape === shape?.rectangleRound}
              isCapsule={business?.ribbon?.shape === shape?.capsuleShape}
            >
              <OText
                size={10}
                weight={'400'}
                color={lightenDarkenColor(business?.ribbon?.color) ? theme.colors.black : theme.colors.white}
                numberOfLines={2}
                ellipsizeMode='tail'
                lineHeight={13}
              >
                {business?.ribbon?.text}
              </OText>
            </RibbonBox>
          </View>
        )}
        <BusinessContent>
          <BusinessRightFooter style={{ width: '100%' }}>
            <BusinessRightFooterTitle>
              <OText
                size={16}
                style={{ width: isHighestRatedBusiness ? '75%' : '90%' }}
                weight={'500'}
                numberOfLines={isHighestRatedBusiness ? 1 : 2}
                ellipsizeMode='tail'
              >
                {business?.name}
              </OText>
              {!hideBusinessFavorite && !isHighestRatedBusiness && (
                <LottieAnimation
                  type='favorite'
                  onClick={handleChangeFavorite}
                  initialValue={business?.favorite ? 0.5 : 0}
                  toValue={business?.favorite ? 0 : 0.5}
                  disableAnimation={!auth}
                  iconProps={{ color: theme.colors.danger, size: 18 }}
                  isActive={business?.favorite}
                />
              )}
            </BusinessRightFooterTitle>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {(businessReviews?.reviews?.total > 0 || business?.reviews?.total > 0) && !isHighestRatedBusiness && (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <OIcon src={theme.images.general.star} width={14} color={theme.colors.star} />
                    <OText mLeft={4} color={theme.colors.star}>
                      {parseNumber(businessReviews?.reviews?.total ?? business?.reviews?.total, { separator: '.' })}
                    </OText>
                  </View>
                  <OIcon
                    src={theme.images.general.option_normal}
                    width={10}
                    height={10}
                    color={theme.colors.disabled}
                    style={{ marginLeft: 10, marginBottom: 2, marginRight: 10 }}
                  />
                </>
              )}
              <>
                {!hideBusinessTime && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4}}>
                    <OText>
                      {convertHoursToMinutes(
                        deliveryTypes.includes(orderState?.options?.type)
                          ? (businessDeliveryTime ?? business?.delivery_time)
                          : (businessPickupTime ?? business?.pickup_time),
                      )}
                    </OText>
                  </View>
                )}
                {deliveryTypes.includes(orderState?.options?.type) && !hideBusinessFee && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4  }}>
                    <FastImage source={theme.images.general.delivery_fee} style={{ width: 14, height: 14 }} />
                    <OText>
                      {parsePrice(businessDeliveryPrice ?? business?.delivery_price)}
                    </OText>
                  </View>
                )}
                {!hideBusinessDistance && !isHighestRatedBusiness && (
                  <OText mLeft={10}>
                    {parseDistance(businessDistance ?? business?.distance)}
                  </OText>
                )}
              </>
            </View>

          </BusinessRightFooter>
        </BusinessContent>
        {!hideBusinessFee && (
          <View style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: theme.colors.backgroundGray100,
            borderRadius: 20,
            marginBottom: 10,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <OText size={14} weight={'600'}>
                {t('DELIVERY', 'Delivery')}
              </OText>
              <OText color={theme.colors.backgroundGray300}>
                {business && parsePrice((businessDeliveryPrice ?? business?.delivery_price))}
              </OText>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <OText size={14} weight={'600'}>
                {t('PICKUP', 'Pickup')}
              </OText>
              <OText color={theme.colors.backgroundGray300}>
                {business && parsePrice((business?.service_fee))}
              </OText>
            </View>
          </View>
        )}
      </CardAnimation>
      <OButton
        text={t('ORDER_NOW', 'Order Now')}
        onClick={() => handleOrderNow(business)}
        style={{ height: 55 }}
      />
    </View>
  );
}
