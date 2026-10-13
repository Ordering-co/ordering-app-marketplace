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

import { MawejaBusinessCard } from '../BusinessesListing/Layout/Maweja/BusinessCard';
import { BusinessSimpleCard } from './BusinessSimpleCard';
import { BusinessFavoriteCard } from './BusinessFavoriteCard';
import { BusinessSearchCard } from './BusinessSearchCard';
import { BusinessHeaderPlaceholder } from '../BusinessHeaderPlaceholder';

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
  OText
} from '@ui'

function BusinessControllerPropsAreEqual(prevProps: any, nextProps: any) {
  return JSON.stringify(prevProps.business) === JSON.stringify(nextProps.business) &&
    prevProps.isBusinessOpen === nextProps.isBusinessOpen &&
    prevProps.onCardSelect === nextProps.onCardSelect &&
    prevProps.onBusinessClick === nextProps.onBusinessClick &&
    prevProps.layout === nextProps.layout
}

const deliveryTypes = [1, 7]

export const BusinessControllerUI = React.memo((props: BusinessControllerParams) => {
  const {
    business,
    handleClick,
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
    simpleView,
    favoriteView,
    isHighestRatedBusiness,
    businessListingSearchview,
    layout
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
  const resolvedHeader = businessHeader || business?.header || (typeof theme.images?.dummies?.businessHeader === 'string' ? theme.images.dummies.businessHeader : '')
  const localHeaderAsset = !businessHeader && !business?.header && typeof theme.images?.dummies?.businessHeader === 'number'
    ? theme.images.dummies.businessHeader
    : null
  const headerImageUri = resolvedHeader ? optimizeImage(resolvedHeader, 'h_500,c_limit') : null
  const cardHeight = windowHeight * 0.34
  const cartWidth = windowWidth - 40

  const styles = StyleSheet.create({
    container: {
      marginVertical: 20,
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

  const handleBusinessClick = (selectedBusiness: any) => {
    vibrateApp()
    if (business?.open) handleClick && handleClick(selectedBusiness)
    else {
      if (configState?.configs?.preorder_status_enabled?.value === '1') {
        navigation.navigate('MomentOption', { business: selectedBusiness, handleBusinessClick: handleClick })
        return
      }
      showToast(ToastType.Info, t('ERROR_ADD_PRODUCT_BUSINESS_CLOSED', 'The business is closed at the moment'));
    }
  }

  const handleChangeFavorite = () => {
    if (auth) {
      handleFavoriteBusiness && handleFavoriteBusiness(!business?.favorite)
    } else {
      navigation && navigation.navigate('Login');
    }
  }

  if (businessListingSearchview) {
    return (
      <BusinessSearchCard
        {...props}
      />
    );
  }

  if (simpleView) {
    return (
      <BusinessSimpleCard
        business={business}
        isBusinessOpen={isBusinessOpen}
        handleClick={handleClick}
        businessLogo={businessLogo}
        businessDeliveryPrice={businessDeliveryPrice}
        businessDeliveryTime={businessDeliveryTime}
        businessPickupTime={businessPickupTime}
      />
    );
  }

  if (favoriteView) {
    return (
      <BusinessFavoriteCard
        business={business}
        businessFavorite={business?.favorite}
        handlePressBusiness={handleClick}
        handleChangeFavorite={handleChangeFavorite}
        handleBusinessClick={handleBusinessClick}
      />
    );
  }

  const hasBanner = !!(headerImageUri || localHeaderAsset)

  if (layout === 'maweja') {
    const categoryName = Array.isArray(business?.types)
      ? business.types.map((type: any) => type?.name).filter(Boolean)[0]
      : ''
    const ratingValue = businessReviews?.reviews?.total ?? business?.reviews?.total
    const priceValue = businessDeliveryPrice ?? business?.delivery_price
    const showDeliveryPrice = deliveryTypes.includes(orderState?.options?.type) && !hideBusinessFee
    const headerSource = headerImageUri
      ? { uri: headerImageUri, priority: FastImage.priority.normal }
      : localHeaderAsset
    const logoUri = businessLogo || business?.logo

    return (
      <MawejaBusinessCard
        compact={isHighestRatedBusiness}
        name={business?.name}
        categoryName={categoryName}
        headerSource={hasBanner ? headerSource : null}
        logoSource={logoUri ? { uri: optimizeImage(logoUri, 'h_150,c_limit'), priority: FastImage.priority.normal } : null}
        logoUrl={logoUri}
        optimizeImage={optimizeImage}
        ratingLabel={ratingValue > 0 ? parseNumber(ratingValue, { separator: '.' }) : ''}
        offerLabel={!hideBusinessOffer && getBusinessOffer(business?.offers)
          ? `${t('DISCOUNT', 'Discount')} ${getBusinessOffer(business?.offers)}`
          : ''}
        preorderLabel={!isBusinessOpen && configState?.configs?.preorder_status_enabled?.value === '1'
          ? t('PREORDER', 'PREORDER')
          : ''}
        timeLabel={!hideBusinessTime
          ? convertHoursToMinutes(
            deliveryTypes.includes(orderState?.options?.type)
              ? (businessDeliveryTime ?? business?.delivery_time)
              : (businessPickupTime ?? business?.pickup_time)
          )
          : ''}
        priceLabel={showDeliveryPrice ? parsePrice(priceValue) : ''}
        distanceLabel={!hideBusinessDistance && (businessDistance ?? business?.distance) != null
          ? parseDistance(businessDistance ?? business?.distance)
          : ''}
        cityName={business?.city?.name || (typeof business?.city === 'string' ? business.city : '')}
        isOpen={isBusinessOpen}
        closedLabel={t('CLOSED', 'Closed')}
        favorite={business?.favorite}
        showFavorite={!hideBusinessFavorite}
        onPress={() => handleBusinessClick(business)}
        onFavorite={handleChangeFavorite}
      />
    )
  }

  return (
    <View style={{ minHeight: 200 }}>
      <CardAnimation
        style={[style, styles.container]}
        onClick={() => handleBusinessClick(business)}
      >
        {business?.ribbon?.enabled && !props.simpleView && (
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
        )}
        <BusinessHero>
          {!hideBusinessHeader && (
            hasBanner ? (
              <FastImage
                style={{ height: cardHeight * (isHighestRatedBusiness ? 0.6 : 0.66), borderRadius: 30 }}
                source={
                  headerImageUri
                    ? {
                        uri: headerImageUri,
                        priority: FastImage.priority.normal,
                      }
                    : localHeaderAsset
                }
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <BusinessHeaderPlaceholder
                logo={businessLogo || business?.logo}
                name={business?.name}
                height={cardHeight * (isHighestRatedBusiness ? 0.6 : 0.66)}
                optimizeImage={optimizeImage}
              />
            )
          )}
          {!hideBusinessOffer && (
            !!getBusinessOffer((business?.offers)) &&
            <OfferBox
              isClosed={!isBusinessOpen && (configState?.configs?.preorder_status_enabled?.value === '1')}
              isRibbon={business?.ribbon?.enabled && !!business?.ribbon?.text}
            >
              <OText
                size={10}
                weight={'400'}
                color={theme.colors.textThird}
                numberOfLines={2}
                ellipsizeMode='tail'
                lineHeight={13}
              >{t('DISCOUNT', 'Discount')}{' '}{getBusinessOffer((business?.offers))}</OText>
            </OfferBox>
          )}
          <BusinessState isRibbon={business?.ribbon?.enabled && !!business?.ribbon?.text}>
            {!isBusinessOpen && (configState?.configs?.preorder_status_enabled?.value === '1') && (
              <BusinessStateView>
                <OText
                  color={theme.colors.textThird}
                  size={10}
                  style={{ textAlign: 'center' }}>
                  {t('PREORDER', 'PREORDER')}
                </OText>
              </BusinessStateView>
            )}
          </BusinessState>
        </BusinessHero>
        <BusinessContent>
          {(businessLogo || business?.logo) && !isHighestRatedBusiness && (
            <BusinessLogo style={{ width: cartWidth * 0.2, height: cartWidth * 0.2 }}>
              <FastImage
                style={{ width: cartWidth * 0.2, height: cartWidth * 0.2, borderRadius: 15 }}
                source={{
                  uri: optimizeImage(businessLogo || business?.logo, 'h_150,c_limit'),
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </BusinessLogo>
          )}
          <BusinessRightFooter style={{ width: cartWidth * ((businessLogo || business?.logo) ? 0.8 : 1), paddingLeft: businessLogo || business?.logo ? 10 : 0 }}>
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
              {(businessReviews?.reviews?.total > 0 || business?.reviews?.total > 0) && isHighestRatedBusiness && (
                <Reviews>
                  <OIcon src={theme.images.general.star} width={14} color={theme.colors.star} />
                  <OText mLeft={4}>
                    {parseNumber(businessReviews?.reviews?.total ?? business?.reviews?.total, { separator: '.' })}
                  </OText>
                </Reviews>
              )}
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
            {(businessReviews?.reviews?.total > 0 || business?.reviews?.total > 0) && !isHighestRatedBusiness && (
              <Reviews>
                <OIcon src={theme.images.general.star} width={14} color={theme.colors.star} />
                <OText mLeft={4}>
                  {parseNumber(businessReviews?.reviews?.total ?? business?.reviews?.total, { separator: '.' })}
                </OText>
              </Reviews>
            )}
            <Metadata>
              {!isBusinessOpen ? (
                <OText color={theme.colors.red}>
                  {t('CLOSED', 'Closed')}
                </OText>
              ) : (
                <BusinessInfoContent>
                  {!hideBusinessTime && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <SimpleLineIcons name='clock' size={14} color={theme.colors.textNormal} />
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <FastImage source={theme.images.general.delivery_fee} style={{ width: 14, height: 14 }} />
                      <OText>
                        {parsePrice(businessDeliveryPrice ?? business?.delivery_price)}
                      </OText>
                    </View>
                  )}
                  {!hideBusinessDistance && !isHighestRatedBusiness && (
                    <OText>
                      {parseDistance(businessDistance ?? business?.distance)}
                    </OText>
                  )}
                </BusinessInfoContent>
              )}
            </Metadata>
          </BusinessRightFooter>
        </BusinessContent>
      </CardAnimation>
    </View>
  );
}, BusinessControllerPropsAreEqual);

export const BusinessController = (props: BusinessControllerParams) => {
  const BusinessControllerProps = {
    ...props,
    UIComponent: BusinessControllerUI,
  };

  return <BusinessSingleCard {...BusinessControllerProps} />;
};
