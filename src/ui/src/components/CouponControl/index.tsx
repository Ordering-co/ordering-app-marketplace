import React, { useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign'
import { CouponControl as CouponController, useLanguage, useEvent } from '@components';
import { useTheme } from 'styled-components/native';
import {
  CContainer,
  CCWrapper,
  CCButton,
  CouponEntryButton,
  CouponEntryContent,
  CouponEntryIcon
} from './styles';

import { OInput, OButton, OAlert, OText } from '../shared';

const CouponControlUI = (props: any) => {
  const {
    couponDefault,
    couponInput,
    handleButtonApplyClick,
    handleRemoveCouponClick,
    onChangeInputCoupon,
    confirm,
    setConfirm,
    cart,
    canLoadOffers,
    onOpenOffers
  } = props

  const [, t] = useLanguage()
  const theme = useTheme();
  const [events] = useEvent()

  const styles = StyleSheet.create({
    inputsStyle: {
      borderColor: theme.colors.border,
      borderRadius: 8,
      flex: 1,
      height: 44,
      marginBottom: 0
    },
  });

  const handleOnAccept = () => {
    if (!confirm.error) {
      handleRemoveCouponClick && handleRemoveCouponClick()
    }
    onChangeInputCoupon('')
  }

  const cleanSetConfirm = () => {
    setConfirm({ ...confirm, open: false, error: false })
  }

  const onButtonApplyClick = () => {
    events.emit('coupon_entered', { ...cart, coupon: couponInput })
    handleButtonApplyClick()
  }

  useEffect(() => {
    if (confirm.content) {
      Alert.alert(
        t('COUPON_ERROR', 'Coupon Error'),
        confirm.content[0],
        [
          {
            text: t('CANCEL', 'cancel'),
            onPress: () => cleanSetConfirm(),
            style: 'cancel'
          },
          {
            text: t('ACCEPT', 'Accept'),
            onPress: () => cleanSetConfirm()
          }
        ],
        { cancelable: false }
      )
    }
  }, [confirm])

  if (canLoadOffers && onOpenOffers) {
    const couponLabel = typeof couponDefault === 'object'
      ? couponDefault?.coupon || couponDefault?.code || ''
      : couponDefault
    const couponIsListedAsOffer = cart?.offers?.some((offer: any) => (
      String(offer?.coupon || offer?.code || '').trim().toLowerCase() ===
      String(couponLabel || '').trim().toLowerCase()
    ))
    const appliedOffersCount = (cart?.offers?.length || 0) + (couponDefault && !couponIsListedAsOffer ? 1 : 0)

    return (
      <CContainer>
        <CouponEntryButton
          onPress={onOpenOffers}
          accessibilityRole='button'
          accessibilityLabel={t('OFFERS_AND_COUPONS', 'Offers and coupons')}
        >
          <CouponEntryIcon>
            <AntIcon name='tagso' size={20} color={theme.colors.primary} />
          </CouponEntryIcon>
          <CouponEntryContent>
            <OText size={14} weight='600'>
              {t('OFFERS_AND_COUPONS', 'Offers and coupons')}
            </OText>
            <OText size={12} color={theme.colors.textSecondary}>
              {appliedOffersCount
                ? `${appliedOffersCount} ${t('APPLIED', 'applied')}`
                : t('ADD_A_COUPON_OR_OFFER', 'Add a coupon or offer')}
            </OText>
          </CouponEntryContent>
          <AntIcon name='right' size={16} color={theme.colors.textSecondary} />
        </CouponEntryButton>
      </CContainer>
    )
  }

  return (
    <CContainer>
      {couponDefault ? (
        <OAlert
          title={t('REMOVE_COUPON', 'Remove Coupon')}
          message={t('QUESTION_DELETE_COUPON', 'Are you sure that you want to delete the coupon?')}
          onAccept={() => handleOnAccept()}
        >
          <CCButton>
            <OText
              size={12}
              color={theme.colors.white}
              style={{ textAlign: 'center' }}
            >
              {`${t('REMOVE_COUPON', 'Remove Coupon')} ${couponDefault}`}
            </OText>
          </CCButton>
        </OAlert>
      ) : (
        <CCWrapper>
          <OInput
            value={couponInput}
            placeholder={t('DISCOUNT_COUPON', 'Discount coupon')}
            onChange={(e: any) => onChangeInputCoupon(e)}
            style={styles.inputsStyle}
            inputStyle={{ fontSize: 12 }}
          />
          <OButton
            onClick={() => onButtonApplyClick()}
            textStyle={{ fontSize: 12 }}
            text={t('APPLY', 'Apply')}
            disabled={!couponInput}
            style={{ borderRadius: 8, height: 44 }}
          />
        </CCWrapper>
      )}
    </CContainer>
  )
}

export const CouponControl = (props: any) => {
  const couponProp = {
    ...props,
    UIComponent: CouponControlUI
  }
  return (
    <CouponController {...couponProp} />
  )
}
