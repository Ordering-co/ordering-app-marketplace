import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  PromotionsContainer,
  SingleOfferContainer,
  OfferInformation,
  SearchBarContainer,
  SingleBusinessOffer,
  OfferData,
  OfferHero,
  OfferValueChip,
  Code,
  CouponHighlight,
  CouponCodeBadge,
  OfferDescription,
  OfferMetaList,
  OfferMetaRow,
  BusinessInfo,
  WrapperSingleOffer
} from './styles'

import { PromotionParams } from '../../types'
import { PromotionsController, useLanguage, useUtils } from '@components'
import { CouponCardSkeleton } from './Skeletons'
import {
  OButton, OText,
  NotFoundSource,
  OInput,
  OModal
} from '@ui'

const PromotionsUI = (props: PromotionParams) => {
  const {
    navigation,
    offersState,
    handleSearchValue,
    searchValue,
    loadOffers,
    offerSelected,
    setOfferSelected,
  } = props

  const handleSearch = (val: string) => {
    handleSearchValue(val);
  };

  const theme = useTheme();

  const styles = StyleSheet.create({
    productStyle: {
      width: 45,
      height: 45,
      borderRadius: 15
    },
    buttonStyle: {
      width: '100%',
      height: 35,
      paddingLeft: 0,
      paddingRight: 0,
      borderRadius: 8,
      marginBottom: 20
    },
    modalButtonStyle: {
      width: 100,
      height: 35,
      paddingLeft: 0,
      paddingRight: 0,
      borderRadius: 7.6
    }
  });

  const [, t] = useLanguage()
  const [{ parseDate, parsePrice, optimizeImage }] = useUtils()
  const [openModal, setOpenModal] = useState(false)
  const [refreshPromotions, setRefreshPromotions] = useState(false)
  const [refreshing, setRefreshing] = useState(false);

  const handleClickOffer = (offer: any) => {
    setOpenModal(true)
    setOfferSelected(offer)
  }

  const handleBusinessClick = (store: any) => {
    setOpenModal(false)
    navigation.navigate('Business', { store: store.slug })
  }

  const handleOnRefresh = () => {
    if (!offersState.loading) {
      loadOffers();
    }
  }

  const filteredOffers = offersState?.offers?.filter((offer: any) =>
    offer.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const targetString = offerSelected?.target === 1
    ? t('SUBTOTAL', 'Subtotal')
    : offerSelected?.target === 2
      ? t('DELIVERY_FEE', 'Delivery fee')
      : t('SERVICE_FEE', 'Service fee')

  const offerMetaRows = [
    {
      key: 'applies',
      label: t('APPLIES_TO', 'Applies to'),
      value: targetString,
    },
    offerSelected?.auto
      ? {
        key: 'auto',
        label: t('OFFER_AUTOMATIC', 'This offer applies automatic'),
        value: null as string | null,
      }
      : null,
    offerSelected?.minimum
      ? {
        key: 'minimum',
        label: t('MINIMUM_PURCHASE_FOR_OFFER', 'Minimum purchase for use this offer'),
        value: parsePrice(offerSelected.minimum),
      }
      : null,
    offerSelected?.max_discount
      ? {
        key: 'max',
        label: t('MAX_DISCOUNT_ALLOWED', 'Max discount allowed'),
        value: parsePrice(offerSelected.max_discount),
      }
      : null,
  ].filter(Boolean) as Array<{ key: string; label: string; value: string | null }>

  useEffect(() => {
    if (refreshPromotions) {
      loadOffers()
      setRefreshPromotions && setRefreshPromotions(false)
    }
  }, [refreshPromotions])

  return (
    <PromotionsContainer>
      <View style={{ paddingHorizontal: theme.utils.margins.horizontal }}>
        <SearchBarContainer>
          <OInput
            placeholder={t('SEARCH_OFFERS', 'Search offers')}
            onChange={handleSearch}
            isLazyLoad
            customIcon={() => <Icon name='pricetags' size={20} color={theme.colors.primary} style={{ marginRight: 10 }} />}
          />
        </SearchBarContainer>
      </View>

      {offersState?.loading && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: theme.utils.margins.horizontal, paddingBottom: 120 }}
        >
          {[...Array(5).keys()].map((_, i) => (
            <CouponCardSkeleton key={i} />
          ))}
        </ScrollView>
      )}
      {((!offersState?.loading && filteredOffers?.length === 0) || offersState?.error) && (
        <NotFoundSource
          iconName='pricetags-outline'
          content={offersState?.error || t('NO_PROMOTIONS_AVAILABLE', 'No promotions available right now')}
          subContent={!offersState?.error ? t('CHECK_BACK_LATER_OFFERS', 'Check back later for new offers in your area') : undefined}
        />
      )}
      {!offersState?.loading && offersState.offers?.length > 0 && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleOnRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: theme.utils.margins.horizontal }}
        >
          {filteredOffers?.map((offer: any) => {
            const hasOfferImage = !!offer?.image && typeof offer?.image !== 'number'
            return (
              <WrapperSingleOffer key={offer.id}>
                <SingleOfferContainer>
                  <OfferInformation>
                    <OText size={12} color={theme.colors.textSecondary} numberOfLines={1} ellipsizeMode='tail'>
                      {t('EXPIRES', 'Expires')} {parseDate(offer?.end, { outputFormat: 'MMM DD, YYYY' })}
                    </OText>
                  </OfferInformation>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <OText weight='bold' size={18} numberOfLines={2} ellipsizeMode='tail' style={{ flex: 1, marginRight: hasOfferImage ? 12 : 0 }}>
                      {offer?.name}
                    </OText>
                    {hasOfferImage && (
                      <FastImage
                        style={{ height: 70, width: 70, aspectRatio: 1, borderRadius: 15 }}
                        source={{
                          uri: optimizeImage(offer?.image, 'h_1024,c_limit'),
                          priority: FastImage.priority.normal,
                        }}
                      />
                    )}
                  </View>
                </SingleOfferContainer>
                <View style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: theme.colors.border, marginBottom: 10 }} />
                <OButton
                  onClick={() => handleClickOffer(offer)}
                  text={t('VIEW', 'View')}
                  style={styles.buttonStyle}
                  class='active'
                  textStyle={{ fontSize: 14, flexWrap: 'nowrap' }}
                />
              </WrapperSingleOffer>
            )
          })}
        </ScrollView>
      )}
      <OModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={t('OFFER_DETAILS', 'Offer Details')}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 20 }}>
          <OfferHero>
            {!!offerSelected?.image && (
              <FastImage
                style={{ height: 115, width: 115, aspectRatio: 1, borderRadius: 15, marginBottom: 12 }}
                source={{
                  uri: optimizeImage(offerSelected?.image, 'h_1024,c_limit'),
                  priority: FastImage.priority.normal,
                }}
              />
            )}
            <OText size={12} color={theme.colors.textSecondary} align='center' mBottom={4}>
              {t('EXPIRES', 'Expires')} {parseDate(offerSelected?.end, { outputFormat: 'MMM DD, YYYY' })}
            </OText>
            {!(
              offerSelected?.type === 2 &&
              !!offerSelected?.coupon &&
              offerSelected?.name?.trim()?.toLowerCase() === offerSelected?.coupon?.trim()?.toLowerCase()
            ) && (
                <OText size={20} weight='bold' align='center'>
                  {offerSelected?.name}
                </OText>
              )}
          </OfferHero>

          <OfferValueChip>
            <OText size={14} weight='700' align='center' color={theme.colors.primary}>
              {t('VALUE_OF_OFFER', 'Value of offer')}: {offerSelected?.rate_type === 1 ? `${offerSelected?.rate}%` : `${parsePrice(offerSelected?.rate)}`}
            </OText>
          </OfferValueChip>

          <OfferData>
            {offerSelected?.type === 2 && !!offerSelected?.coupon && (
              <Code>
                <CouponHighlight>
                  <OText size={12} weight='600' align='center' color={theme.colors.textSecondary}>
                    {t('COUPON_CODE', 'Coupon code')}
                  </OText>
                  <CouponCodeBadge>
                    <OText
                      size={22}
                      weight='bold'
                      align='center'
                      color={theme.colors.primary}
                      style={{ letterSpacing: 2 }}
                    >
                      {offerSelected.coupon}
                    </OText>
                  </CouponCodeBadge>
                </CouponHighlight>
              </Code>
            )}

            {!!offerSelected?.description && (
              <OfferDescription>
                <OText
                  size={15}
                  weight='600'
                  color={theme.colors.primary}
                  style={{ lineHeight: 22 }}
                >
                  {offerSelected.description}
                </OText>
              </OfferDescription>
            )}

            {offerMetaRows.length > 0 && (
              <OfferMetaList>
                {offerMetaRows.map((row, index) => (
                  <OfferMetaRow key={row.key} $isLast={index === offerMetaRows.length - 1}>
                    <OText size={12} color={theme.colors.textSecondary} mBottom={row.value ? 2 : 0}>
                      {row.label}
                    </OText>
                    {!!row.value && (
                      <OText size={14} weight='600' color={theme.colors.colorPage}>
                        {row.value}
                      </OText>
                    )}
                  </OfferMetaRow>
                ))}
              </OfferMetaList>
            )}
          </OfferData>

          <OText style={{ marginTop: 16, marginBottom: 10 }} weight='600' size={14}>
            {t('AVAILABLE_BUSINESSES_FOR_OFFER', 'Available businesses for this offer')}:
          </OText>
          <View style={{ marginBottom: 70 }}>
            {offerSelected?.businesses?.map((business: any) => {
              return (
                <SingleBusinessOffer key={business.id}>
                  {!!business?.logo && (
                    <FastImage
                      style={styles.productStyle}
                      source={{
                        uri: optimizeImage(business?.logo, 'h_250,c_limit'),
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  )}
                  <BusinessInfo>
                    <OText style={{ maxWidth: '60%' }}>{business.name}</OText>
                    <OButton
                      onClick={() => handleBusinessClick(business)}
                      text={t('GO_TO_BUSINESSS', 'Go to business')}
                      style={styles.modalButtonStyle}
                      textStyle={{ fontSize: 10 }}
                    />
                  </BusinessInfo>
                </SingleBusinessOffer>
              )
            })}
          </View>
        </ScrollView>
      </OModal>
    </PromotionsContainer>
  )
}

export const Promotions = (props: PromotionParams) => {
  const PromotionsProps = {
    ...props,
    UIComponent: PromotionsUI
  }

  return (
    <PromotionsController {...PromotionsProps} />
  )
}
