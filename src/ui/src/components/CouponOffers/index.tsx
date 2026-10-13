import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Alert, FlatList } from 'react-native'
import AntIcon from 'react-native-vector-icons/AntDesign'
import { useTheme } from 'styled-components/native'

import {
  CouponControl as CouponController,
  useEvent,
  useLanguage,
  useOrder
} from '@components'
import { OInput, OText } from '../shared'
import { OfferCard } from './OfferCard'
import {
  AppliedCouponCard,
  AppliedCouponInfo,
  CompactButton,
  CompactButtonText,
  couponOffersStyles,
  InputWrapper,
  ManualForm,
  ManualSection,
  OfferIcon,
  OfferState,
  OfferTab,
  OfferTabCount,
  OfferTabs,
  OfferTabText,
  ScreenContainer,
  SectionHeader
} from './styles'

type OffersTab = 'available' | 'current'

const CouponOffersUI = (props: any) => {
  const {
    applyingOfferId,
    canLoadOffers,
    cart,
    confirm,
    couponDefault,
    couponInput,
    handleButtonApplyClick,
    handleLoadOffers,
    handleOfferApplyClick,
    handleOfferRemoveClick,
    handleRemoveCouponClick,
    offersState,
    onChangeInputCoupon,
    onGoBack,
    removingOfferId,
    setConfirm
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [events] = useEvent()
  const [activeTab, setActiveTab] = useState<OffersTab>('available')
  const [removingCoupon, setRemovingCoupon] = useState(false)
  const handleLoadOffersRef = useRef(handleLoadOffers)

  const couponLabel = typeof couponDefault === 'object'
    ? couponDefault?.coupon || couponDefault?.code || ''
    : couponDefault
  const appliedOffers = Array.isArray(cart?.offers) ? cart.offers : []
  const normalizedCouponLabel = String(couponLabel || '').trim().toLowerCase()
  const couponIsListedAsOffer = appliedOffers.some((offer: any) => (
    normalizedCouponLabel &&
    String(offer?.coupon || offer?.code || '').trim().toLowerCase() === normalizedCouponLabel
  ))
  const currentOffers = [
    ...appliedOffers,
    ...(couponDefault && !couponIsListedAsOffer
      ? [{
          id: `coupon:${couponLabel}`,
          coupon: couponLabel,
          name: t('APPLIED_COUPON', 'Applied coupon'),
          isCoupon: true
        }]
      : [])
  ]
  const operationPending = Boolean(applyingOfferId || removingOfferId || removingCoupon || orderState.loading)

  useEffect(() => {
    handleLoadOffersRef.current = handleLoadOffers
  }, [handleLoadOffers])

  useEffect(() => {
    if (canLoadOffers) handleLoadOffersRef.current()
  }, [canLoadOffers, cart?.uuid])

  useEffect(() => {
    if (!confirm?.content) return

    const content = Array.isArray(confirm.content) ? confirm.content[0] : confirm.content
    Alert.alert(
      t('COUPON_ERROR', 'Coupon Error'),
      content,
      [{
        text: t('ACCEPT', 'Accept'),
        onPress: () => setConfirm({ open: false, content: null, error: false })
      }],
      { cancelable: false }
    )
  }, [confirm, setConfirm, t])

  const handleManualApply = async () => {
    events.emit('coupon_entered', { ...cart, coupon: couponInput })
    const applied = await handleButtonApplyClick()
    if (applied) onGoBack?.()
  }

  const handleOfferApply = async (offer: any) => {
    const applied = await handleOfferApplyClick(offer)
    if (applied) onGoBack?.()
  }

  const removeCoupon = async () => {
    setRemovingCoupon(true)
    try {
      await handleRemoveCouponClick()
      onChangeInputCoupon('')
    } finally {
      setRemovingCoupon(false)
    }
  }

  const confirmRemoval = (offer: any, isCoupon: boolean) => {
    Alert.alert(
      isCoupon ? t('COUPON', 'Coupon') : t('OFFER', 'Offer'),
      isCoupon
        ? t('QUESTION_DELETE_COUPON', 'Are you sure that you want to delete the coupon?')
        : t('QUESTION_DELETE_OFFER', 'Are you sure that you want to delete the offer?'),
      [
        { text: t('CANCEL', 'Cancel'), style: 'cancel' },
        {
          text: t('REMOVE', 'Remove'),
          style: 'destructive',
          onPress: () => isCoupon ? removeCoupon() : handleOfferRemoveClick(offer.id)
        }
      ]
    )
  }

  const renderManualSection = () => (
    <ManualSection>
      <SectionHeader>
        <OText size={16} weight='700'>{t('ENTER_A_COUPON_CODE', 'Enter a coupon code')}</OText>
        <OText size={12} color={theme.colors.textSecondary}>
          {t('ENTER_COUPON_HELP', 'Enter your code below to apply it to this cart.')}
        </OText>
      </SectionHeader>

      {couponDefault
        ? (
          <AppliedCouponCard>
            <OfferIcon>
              <AntIcon name='tagso' size={19} color={theme.colors.primary} />
            </OfferIcon>
            <AppliedCouponInfo>
              <OText size={11} color={theme.colors.textSecondary}>
                {t('APPLIED_COUPON', 'Applied coupon')}
              </OText>
              <OText size={14} weight='600' numberOfLines={1}>{couponLabel}</OText>
            </AppliedCouponInfo>
            <CompactButton
              onPress={() => setActiveTab('current')}
              accessibilityRole='button'
            >
              <CompactButtonText>{t('MANAGE', 'Manage')}</CompactButtonText>
            </CompactButton>
          </AppliedCouponCard>
          )
        : (
          <ManualForm>
            <InputWrapper>
              <OInput
                value={couponInput ?? ''}
                placeholder={t('DISCOUNT_COUPON', 'Discount coupon')}
                onChange={onChangeInputCoupon}
                style={couponOffersStyles.input}
              />
            </InputWrapper>
            <CompactButton
              $disabled={!couponInput || operationPending}
              disabled={!couponInput || operationPending}
              onPress={handleManualApply}
              accessibilityRole='button'
            >
              <CompactButtonText>{t('APPLY', 'Apply')}</CompactButtonText>
            </CompactButton>
          </ManualForm>
          )}
    </ManualSection>
  )

  const renderTabs = () => (
    <OfferTabs accessibilityRole='tablist'>
      <OfferTab
        $active={activeTab === 'available'}
        onPress={() => setActiveTab('available')}
        accessibilityRole='tab'
        accessibilityState={{ selected: activeTab === 'available' }}
      >
        <OfferTabText $active={activeTab === 'available'}>
          {t('AVAILABLE_OFFERS', 'Available offers')}
        </OfferTabText>
        {!offersState.loading && offersState.offers.length > 0 && (
          <OfferTabCount>{offersState.offers.length}</OfferTabCount>
        )}
      </OfferTab>
      <OfferTab
        $active={activeTab === 'current'}
        onPress={() => setActiveTab('current')}
        accessibilityRole='tab'
        accessibilityState={{ selected: activeTab === 'current' }}
      >
        <OfferTabText $active={activeTab === 'current'}>
          {t('CURRENT_OFFERS', 'Current offers')}
        </OfferTabText>
        <OfferTabCount>{currentOffers.length}</OfferTabCount>
      </OfferTab>
    </OfferTabs>
  )

  const renderEmptyState = () => {
    if (activeTab === 'available' && offersState.loading) {
      return (
        <OfferState accessibilityRole='progressbar'>
          <ActivityIndicator size='large' color={theme.colors.primary} />
          <OText size={13} color={theme.colors.textSecondary}>
            {t('LOADING', 'Loading...')}
          </OText>
        </OfferState>
      )
    }

    if (activeTab === 'available' && offersState.error) {
      return (
        <OfferState>
          <AntIcon name='exclamationcircleo' size={30} color={theme.colors.danger} />
          <OText size={15} weight='600' align='center'>
            {t('OFFERS_COULD_NOT_LOAD', "We couldn't load your offers")}
          </OText>
          <OText size={13} color={theme.colors.textSecondary} align='center'>
            {t('OFFERS_LOAD_RETRY_HELP', 'Check your connection and try again.')}
          </OText>
          <CompactButton onPress={handleLoadOffers} accessibilityRole='button'>
            <CompactButtonText>{t('TRY_AGAIN', 'Try again')}</CompactButtonText>
          </CompactButton>
        </OfferState>
      )
    }

    return (
      <OfferState>
        <AntIcon name='tagso' size={30} color={theme.colors.disabled} />
        <OText size={15} weight='600' align='center'>
          {activeTab === 'available'
            ? t('NO_OFFERS_AVAILABLE', 'No offers available right now')
            : t('NO_CURRENT_OFFERS', 'No offers applied yet')}
        </OText>
        <OText size={13} color={theme.colors.textSecondary} align='center'>
          {activeTab === 'available'
            ? t('NO_OFFERS_AVAILABLE_HELP', 'You can still enter a coupon code above.')
            : t('NO_CURRENT_OFFERS_HELP', 'Choose an available offer or enter a coupon code above.')}
        </OText>
      </OfferState>
    )
  }

  const listData = activeTab === 'available' && !offersState.loading && !offersState.error
    ? offersState.offers
    : activeTab === 'current'
      ? currentOffers
      : []

  return (
    <ScreenContainer>
      <FlatList
        data={listData}
        keyExtractor={(offer: any) => String(offer.id || offer.coupon || offer.code || offer.name)}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={couponOffersStyles.list}
        ListHeaderComponent={(
          <>
            {renderManualSection()}
            {canLoadOffers && renderTabs()}
            {canLoadOffers && (
              <OText size={12} color={theme.colors.textSecondary} mBottom={12}>
                {activeTab === 'available'
                  ? t('AVAILABLE_OFFERS_HELP', 'Choose an offer and apply it instantly.')
                  : t('CURRENT_OFFERS_HELP', 'Review or remove discounts applied to this cart.')}
              </OText>
            )}
          </>
        )}
        ListEmptyComponent={canLoadOffers ? renderEmptyState() : null}
        renderItem={({ item }: any) => (
          <OfferCard
            offer={item}
            isCurrent={activeTab === 'current'}
            isCoupon={Boolean(item.isCoupon)}
            cartHasOffers={Boolean(cart?.offers?.length)}
            applyingOfferId={applyingOfferId}
            removingOfferId={item.isCoupon && removingCoupon ? item.id : removingOfferId}
            onApply={handleOfferApply}
            onRemove={confirmRemoval}
            t={t}
          />
        )}
      />
    </ScreenContainer>
  )
}

export const CouponOffers = (props: any) => (
  <CouponController {...props} UIComponent={CouponOffersUI} />
)
