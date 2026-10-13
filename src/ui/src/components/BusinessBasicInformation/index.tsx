import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import FastImage from 'react-native-fast-image'
import { useTheme } from 'styled-components/native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(timezone);
dayjs.extend(isBetween);

import { convertHoursToMinutes, lightenDarkenColor, shape } from '../../utils';
import { BusinessBasicInformationParams } from '../../types';
import { SocialIcons } from './SocialIcons';
import { BusinessHeaderPlaceholder } from '../BusinessHeaderPlaceholder';

import {
  BusinessContainer,
  BusinessHeader,
  BusinessLogo,
  BusinessInfo,
  BusinessInfoItem,
  WrapReviews,
  TitleWrapper,
  RibbonBox,
  SocialListWrapper,
  BusinessInfoHeader,
  BusinessInfoActions,
  BusinessInfoActionsItem,
  CardContainer,
  InfoSection,
  VerticalSeparator,
} from './styles';

import { useUtils, useOrder, useLanguage } from '@components';
import { BusinessReservation, OIcon, OText, OModal } from '@ui'

let BusinessInformation: null | React.ElementType = null
let BusinessReviews: null | React.ElementType = null

export const BusinessBasicInformation = (
  props: BusinessBasicInformationParams,
) => {
  const { navigation, businessState, isBusinessInfoShow, logo, header, isPreOrder, currentCart, categoryState } = props;
  const { business, loading } = businessState;
  const types = business?.types && business?.types?.filter(({ enabled }: any) => (enabled)).map(({ name }: any) => (name))

  const theme = useTheme();
  const [orderState] = useOrder();
  const [, t] = useLanguage();
  const [{ parsePrice, parseDistance, optimizeImage }] = useUtils();
  const [openBusinessInformation, setOpenBusinessInformation] = useState(false);
  const [openBusinessReviews, setOpenBusinessReviews] = useState(false);
  const [businessInformationObtained, setBusinessInformationObtained] = useState(false)
  const [businessReviewsObtained, setBusinessReviewsObtainedbtained] = useState(false)
  const [openReservations, setOpenReservations] = useState(false)
  const [imageRealSize, setImageRealSize] = useState({ width: 16, height: 9, loading: true })
  const hideLogo = theme?.business_view?.components?.header?.components?.business?.components?.logo?.hidden
  const hideDeliveryFee = theme?.business_view?.components?.header?.components?.business?.components?.fee?.hidden
  const hideTime = theme?.business_view?.components?.header?.components?.business?.components?.time?.hidden
  const hideReviews = theme?.business_view?.components?.header?.components?.business?.components?.reviews?.hidden
  const hideReviewsPopup = theme?.business_view?.components?.header?.components?.reviews?.hidden
  const hideDistance = theme?.business_view?.components?.header?.components?.business?.components?.distance?.hidden
  const hideInfoIcon = theme?.business_view?.components?.header?.components?.business?.components?.business_info?.hidden
  const hideCity = theme?.business_view?.components?.header?.components?.business?.components?.city?.hidden
  const hideHeader = theme?.business_view?.components?.header?.hidden

  const styles = StyleSheet.create({
    logoStyle: {
      width: 69,
      height: 69,
      borderRadius: 15,
      justifyContent: 'flex-start',
      alignItems: 'flex-start'
    },
    metadata: {
      marginRight: 2,
    },
    modalTitleSectionStyle: {
      position: 'absolute',
      width: '100%',
      top: 0,
      zIndex: 100,
      left: 20
    }
  });

  const showReservationCta = !loading &&
    orderState?.options?.type === 9 &&
    categoryState?.products?.length !== 0

  const hasAutoOpenedReservation = useRef(false)

  useEffect(() => {
    if (hasAutoOpenedReservation.current || !showReservationCta) return
    hasAutoOpenedReservation.current = true
    setOpenReservations(true)
  }, [showReservationCta])

  const handleClickBusinessInformation = () => {
    if (!businessInformationObtained) {
      BusinessInformation = require('../BusinessInformation').BusinessInformation
      setBusinessInformationObtained(true)
    }
    setOpenBusinessInformation(true)
  }

  const handleClickBusinessReviews = () => {
    if (!businessReviewsObtained) {
      BusinessReviews = require('../BusinessReviews').BusinessReviews
      setBusinessReviewsObtainedbtained(true)
    }
    setOpenBusinessReviews(true)
  }

  const getBusinessType = () => {
    if (!types) return t('GENERAL', 'General');
    const _types: any = [];
    types.forEach(
      (type: any) =>
        _types.push(type)
    );
    return _types.join(', ');
  };

  useEffect(() => {
    if (businessState?.loading) return
    let timeout: any = null
    const currentDate = dayjs().tz(businessState?.business?.timezone)
    let lapse = null
    if (businessState?.business?.today?.enabled) {
      lapse = businessState?.business?.today?.lapses?.find((lapse: any) => {
        const from = currentDate.hour(lapse.open.hour).minute(lapse.open.minute)
        const to = currentDate.hour(lapse.close.hour).minute(lapse.close.minute)
        return currentDate.unix() >= from.unix() && currentDate.unix() <= to.unix()
      })
    }
    if (lapse) {
      const to = currentDate.hour(lapse.close.hour).minute(lapse.close.minute)
      const timeToClose = (to.unix() - currentDate.unix()) * 1000
      timeout = setTimeout(() => {
        navigation.navigate('MomentOption', { business: businessState?.business, handleBusinessClick: () => navigation?.goBack() })
      }, timeToClose)
    }
    return () => {
      timeout && clearTimeout(timeout)
    }
  }, [businessState?.business])

  useEffect(() => {
    const bannerImage = header || businessState?.business?.header
    if (!bannerImage) {
      setImageRealSize({ width: 16, height: 9, loading: false })
      return
    }
    Image.getSize(bannerImage, (width: number, height: number) => {
      setImageRealSize({ width: width, height: height, loading: false });
    }, (error: any) => {
      setImageRealSize({ ...imageRealSize, loading: false });
    });
  }, [header, businessState?.business?.header])

  return (
    <BusinessContainer>
      {!hideHeader && (
        <>
          {!(loading || imageRealSize?.loading) ? (
            (header || businessState?.business?.header) ? (
              <BusinessHeader
                source={{ uri: optimizeImage(businessState?.business?.header, 'h_250,c_limit') || header }}
              />
            ) : (
              <BusinessHeaderPlaceholder
                logo={logo || businessState?.business?.logo}
                name={businessState?.business?.name}
                height={210}
                borderRadius={0}
                optimizeImage={optimizeImage}
              />
            )
          ) : (
            <Placeholder Animation={Fade}>
              <PlaceholderLine height={210} style={{ borderRadius: 8, marginBottom: 0 }} />
            </Placeholder>
          )}
        </>
      )}
      <BusinessInfo>
        <SocialIcons loading={loading} />

        <BusinessInfoHeader>
          <BusinessLogo>
            {!isBusinessInfoShow && (
              <>
                {!loading && (
                  <FastImage
                    style={styles.logoStyle}
                    source={(logo || businessState?.business?.logo || typeof theme.images.dummies.businessLogo === 'string') ? {
                      uri: logo || optimizeImage(businessState?.business?.logo, 'h_70,c_limit') || theme.images.dummies.businessLogo,
                      priority: FastImage.priority.high,
                      cache: FastImage.cacheControl.web
                    } : theme.images.dummies.businessLogo}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                )}
                {loading && (
                  <View style={styles.logoStyle}>
                    <Placeholder Animation={Fade}>
                      <PlaceholderLine height={69} style={{ borderRadius: 8 }} />
                    </Placeholder>
                  </View>
                )}
              </>
            )}
          </BusinessLogo>
          <BusinessInfoItem>
            {!loading && (
              <TitleWrapper>
                <OText size={20} weight={'600'} numberOfLines={2} ellipsizeMode='tail'>
                  {business?.name}
                </OText>
                {business?.ribbon?.enabled && (
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
                <OText numberOfLines={1} ellipsizeMode='tail'>
                  {business?.address}
                </OText>
                <>
                  {loading && (
                    <Placeholder Animation={Fade}>
                      <PlaceholderLine height={30} width={20} />
                    </Placeholder>
                  )}
                  {!loading && (
                    <OText numberOfLines={1} ellipsizeMode='tail'>
                      {getBusinessType()}
                    </OText>
                  )}
                </>
              </TitleWrapper>
            )}
            {loading && (
              <Placeholder Animation={Fade}>
                <PlaceholderLine height={18} width={80} style={{ marginBottom: 5, borderRadius: 8 }} />
                <PlaceholderLine height={18} width={60} style={{ marginBottom: 5, borderRadius: 8 }} />
                <PlaceholderLine height={18} width={78} style={{ marginBottom: 0, borderRadius: 8 }} />
              </Placeholder>
            )}
          </BusinessInfoItem>
        </BusinessInfoHeader>

        <BusinessInfoActions>
          {/* {!hideDistance && (
            <OText color={theme.colors.textSecondary} size={12} style={styles.metadata}>
              {parseDistance(business?.distance || 0) + `  \u2022 `}
            </OText>
          )} */}

          {!loading && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, width: '100%' }}>
              {business?.reviews?.total > 0 && (
                <BusinessInfoActionsItem
                  activeOpacity={0.7}
                  onPress={() => handleClickBusinessReviews()}
                >
                  <OIcon src={theme.images.general.star} width={14} color={theme.colors.black} />
                  <OText size={14} weight={600}>
                    {business?.reviews?.total}
                  </OText>
                </BusinessInfoActionsItem>
              )}

              <BusinessInfoActionsItem
                activeOpacity={0.7}
                onPress={() => handleClickBusinessInformation()}
              >
                <Ionicons name='information-circle-outline' size={20} color={theme.colors.black} />
                <OText size={14} weight={600}>
                  {t('INFO', 'Info')}
                </OText>
              </BusinessInfoActionsItem>

              {isPreOrder && (!business?.professionals || business?.professionals?.length === 0) && (
                <BusinessInfoActionsItem
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('MomentOption', { business: businessState?.business, handleBusinessClick: () => navigation?.goBack() })}
                >
                  <OText size={14} weight={600}>
                    {t('PREORDER', 'Preorder')}
                  </OText>
                </BusinessInfoActionsItem>
              )}

              {showReservationCta && (
                <BusinessInfoActionsItem
                  activeOpacity={0.7}
                  style={{ backgroundColor: theme.colors.primary }}
                  onPress={() => setOpenReservations(true)}
                >
                  <Ionicons name='time-outline' size={18} color={theme.colors.white} />
                  <OText size={14} weight={600} color={theme.colors.white}>
                    {t('RESERVATION', 'Reservation')}
                  </OText>
                </BusinessInfoActionsItem>
              )}
            </View>
          )}

          {loading && (
            <Placeholder Animation={Fade}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <PlaceholderLine height={20} width={40} style={{ marginRight: 10, borderRadius: 8, marginBottom: 0 }} />
                <PlaceholderLine height={20} width={40} style={{ marginRight: 10, borderRadius: 8, marginBottom: 0 }} />
                <PlaceholderLine height={20} width={13} style={{ marginBottom: 0 }} />
              </View>
            </Placeholder>
          )}
        </BusinessInfoActions>

        {loading && (
          <Placeholder Animation={Fade}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <PlaceholderLine height={70} style={{ marginBottom: 0, borderRadius: 8, flex: 1, marginRight: 10 }} />
              <PlaceholderLine height={70} style={{ marginBottom: 0, borderRadius: 8, flex: 1 }} />
            </View>
          </Placeholder>
        )}

        {!loading && (
          <CardContainer>
            <InfoSection>
              <OText size={14} weight={'bold'}>{business && parsePrice(business?.delivery_price || 0)}</OText>
              <OText size={12} weight={400}>{t('DELIVERY_FEE', 'Delivery fee')}</OText>
            </InfoSection>

            <VerticalSeparator />

            <InfoSection>
              <OText size={14} weight={'bold'}>{convertHoursToMinutes(orderState?.options?.type === 1 ? business?.delivery_time : business?.pickup_time)}</OText>
              <OText size={12} weight={400}>{t('DELIVERY_TIME', 'Delivery time')}</OText>
            </InfoSection>
          </CardContainer>
        )}

      </BusinessInfo>

      {businessReviewsObtained ? (
        <OModal
          title={t('REVIEWS', 'Reviews')}
          open={openBusinessReviews}
          onClose={() => setOpenBusinessReviews(false)}
        >
          {BusinessReviews && (
            <BusinessReviews
              businessState={businessState}
              businessId={business.id}
              reviews={business.reviews?.reviews}
            />
          )}
        </OModal>
      ) : null}

      {businessInformationObtained ? (
        <OModal
          title={businessState?.business?.name}
          subtitle={getBusinessType()}
          open={openBusinessInformation}
          onClose={() => setOpenBusinessInformation(false)}
        >
          {BusinessInformation && (
            <BusinessInformation
              businessState={businessState}
              business={business}
            />
          )}
        </OModal>
      ) : null}

      <OModal
        title={business?.name}
        open={openReservations}
        onClose={() => setOpenReservations(false)}
        showToastInsideModal
      >
        <BusinessReservation
          cart={currentCart}
          business={business}
          scheduleList={business?.schedule}
          navigation={navigation}
          setOpenReservations={setOpenReservations}
        />
      </OModal>
    </BusinessContainer>
  );
};
