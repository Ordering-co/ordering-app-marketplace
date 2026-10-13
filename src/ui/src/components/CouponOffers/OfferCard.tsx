import React from 'react'
import AntIcon from 'react-native-vector-icons/AntDesign'
import { useTheme } from 'styled-components/native'

import {
  OfferAction,
  OfferActionText,
  OfferCardContainer,
  OfferCode,
  OfferContent,
  OfferDescription,
  OfferIcon,
  OfferRate,
  OfferRateText,
  OfferTitle
} from './styles'

interface OfferCardProps {
  applyingOfferId?: number | string | null
  cartHasOffers?: boolean
  isCurrent?: boolean
  isCoupon?: boolean
  offer: any
  onApply?: (offer: any) => void
  onRemove?: (offer: any, isCoupon: boolean) => void
  removingOfferId?: number | string | null
  t: (key: string, fallback: string) => string
}

export const OfferCard = ({
  applyingOfferId,
  cartHasOffers,
  isCurrent,
  isCoupon,
  offer,
  onApply,
  onRemove,
  removingOfferId,
  t
}: OfferCardProps) => {
  const theme = useTheme()
  const rate = offer?.rate_type === 1 && offer?.rate ? `${offer.rate}%` : null
  const unavailable = !isCurrent && offer?.applicable === false
  const applying = applyingOfferId === offer?.id
  const removing = removingOfferId === offer?.id
  const operationPending = Boolean(applyingOfferId || removingOfferId)
  const actionDisabled = unavailable || operationPending
  const canRemove = Boolean(isCoupon || offer?.id)
  const applyLabel = applying
    ? t('APPLYING', 'Applying...')
    : !offer?.stackable && cartHasOffers
      ? t('REPLACE', 'Replace')
      : t('APPLY', 'Apply')

  return (
    <OfferCardContainer $unavailable={unavailable}>
      {rate
        ? (
          <OfferRate>
            <OfferRateText>{rate}</OfferRateText>
          </OfferRate>
          )
        : (
          <OfferIcon>
            <AntIcon name='tagso' size={19} color={theme.colors.primary} />
          </OfferIcon>
          )}
      <OfferContent>
        <OfferTitle numberOfLines={2}>
          {offer?.name || t('APPLIED_OFFER', 'Applied offer')}
        </OfferTitle>
        {!!(offer?.coupon || offer?.code) && (
          <OfferCode>{offer.coupon || offer.code}</OfferCode>
        )}
        {!!offer?.description && (
          <OfferDescription numberOfLines={3}>{offer.description}</OfferDescription>
        )}
        {unavailable && (
          <OfferDescription $danger>
            {t('OFFER_REQUIREMENTS_NOT_MET', "This cart doesn't meet this offer's requirements yet.")}
          </OfferDescription>
        )}
      </OfferContent>

      {isCurrent
        ? canRemove && (
          <OfferAction
            $danger
            $disabled={operationPending}
            disabled={operationPending}
            onPress={() => onRemove?.(offer, Boolean(isCoupon))}
            accessibilityRole='button'
            accessibilityLabel={`${t('REMOVE', 'Remove')} ${offer?.name || offer?.coupon || t('OFFER', 'Offer')}`}
          >
            <OfferActionText $danger>
              {removing ? t('REMOVING', 'Removing...') : t('REMOVE', 'Remove')}
            </OfferActionText>
          </OfferAction>
          )
        : (
          <OfferAction
            $disabled={actionDisabled}
            disabled={actionDisabled}
            onPress={() => onApply?.(offer)}
            accessibilityRole='button'
            accessibilityLabel={`${applyLabel} ${offer?.name || t('OFFER', 'Offer')}`}
          >
            <OfferActionText>
              {applyLabel}
            </OfferActionText>
          </OfferAction>
          )}
    </OfferCardContainer>
  )
}
