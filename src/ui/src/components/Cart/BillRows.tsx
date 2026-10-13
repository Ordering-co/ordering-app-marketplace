import React, { useState } from 'react'
import { Alert } from 'react-native'
import { useTheme } from 'styled-components/native'
import AntIcon from 'react-native-vector-icons/AntDesign'

import { useConfig, useLanguage, useOrder, useUtils } from '@components'
import { OText } from '@ui'
import { OSTable, TaxesFeesDetail } from '../OrderSummary/styles'
import { BillAmount, BillLabel, BillLabelText, BillToggle, BillToggleIcon, BillInfoButton, BillStrikethrough } from './styles'
import { verifyDecimals, capitalize } from '../../utils'

const deliveryTypes = [1, 7]
const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 }

const getTaxAmount = (tax: any) => tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0

const getFeeAmount = (fee: any) => {
  if (fee?.summary?.amount != null) return fee.summary.amount
  const fixed = Number(fee?.summary?.fixed) || 0
  const percentage = Number(fee?.summary?.percentage_after_discount ?? fee?.summary?.percentage) || 0
  return fixed + percentage
}

const getTaxesByTarget = (taxes: any[], target: string) =>
  (taxes ?? []).filter((tax: any) => tax?.target === target && parseFloat(getTaxAmount(tax)) !== 0 && tax?.type !== 1)

const getVisibleFees = (fees: any[]) =>
  (fees ?? []).filter((fee: any) =>
    parseFloat(getFeeAmount(fee)) !== 0 ||
    (fee?.fee_id === null && fee?.type === 'product' && fee?.percentage > 0))

const translatedName = (t: any, name?: string) =>
  name ? t(name.toUpperCase().replace(/ /g, '_'), name) : t('INHERIT_FROM_BUSINESS', 'Inherit from business')

const BillRow = ({ label, amount, color, onInfo, extra }: {
  label: React.ReactNode,
  amount: React.ReactNode,
  color?: string,
  onInfo?: () => void,
  extra?: React.ReactNode
}) => {
  const theme = useTheme()
  return (
    <OSTable>
      <BillLabel>
        <BillLabelText>
          <OText size={12} lineHeight={18} color={color} numberOfLines={1}>{label}</OText>
        </BillLabelText>
        {onInfo && (
          <BillInfoButton onPress={onInfo} hitSlop={hitSlop}>
            <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
          </BillInfoButton>
        )}
        {extra}
      </BillLabel>
      <BillAmount>
        {typeof amount === 'string'
          ? <OText size={12} lineHeight={18} color={color}>{amount}</OText>
          : amount}
      </BillAmount>
    </OSTable>
  )
}

const TaxRows = ({ taxes, setOpenTaxModal, color }: { taxes: any[], setOpenTaxModal: any, color?: string }) => {
  const [, t] = useLanguage()
  const [{ parsePrice, parseNumber }] = useUtils()
  return (
    <>
      {taxes.map((tax: any, i: number) => (
        <BillRow
          key={`${tax?.target}-${tax?.id ?? 'null'}-${i}`}
          label={`${translatedName(t, tax?.name)}${tax?.rate > 0 ? ` (${verifyDecimals(tax.rate, parseNumber)}%)` : ''}`}
          amount={parsePrice(getTaxAmount(tax))}
          color={color}
          onInfo={() => setOpenTaxModal({ open: true, data: tax, type: 'tax' })}
        />
      ))}
    </>
  )
}

export const CartTaxesAndFeesRows = ({ cart, setOpenTaxModal }: { cart: any, setOpenTaxModal: any }) => {
  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils()
  const [showDetail, setShowDetail] = useState(false)

  const productTaxes = getTaxesByTarget(cart?.taxes, 'product')
  const fees = getVisibleFees(cart?.fees)
  if (!productTaxes.length && !fees.length) return null

  const total =
    productTaxes.reduce((sum: number, tax: any) => sum + (getTaxAmount(tax) ?? 0), 0) +
    fees.reduce((sum: number, fee: any) => sum + (getFeeAmount(fee) ?? 0), 0)

  return (
    <>
      <OSTable>
        <BillToggle
          onPress={() => setShowDetail(!showDetail)}
          accessibilityRole='button'
          accessibilityState={{ expanded: showDetail }}
          hitSlop={hitSlop}
        >
          <BillLabelText>
            <OText size={12} lineHeight={18} numberOfLines={1}>{t('TAXES_AND_FEES', 'Taxes and fees')}</OText>
          </BillLabelText>
          <BillToggleIcon open={showDetail}>
            <AntIcon name='down' size={14} color={theme.colors.textSecondary} />
          </BillToggleIcon>
        </BillToggle>
        <BillAmount>
          <OText size={12} lineHeight={18}>{parsePrice(total)}</OText>
        </BillAmount>
      </OSTable>
      {showDetail && (
        <TaxesFeesDetail>
          <TaxRows taxes={productTaxes} setOpenTaxModal={setOpenTaxModal} color={theme.colors.textSecondary} />
          {fees.map((fee: any, i: number) => (
            <BillRow
              key={`${fee?.type ?? 'fee'}-${fee?.id ?? fee?.fee_id ?? 'null'}-${i}`}
              label={`${translatedName(t, fee?.name)}${(fee?.fixed > 0 || fee?.percentage > 0)
                ? ` (${fee?.fixed > 0 ? `${parsePrice(fee?.fixed)}${fee?.percentage > 0 ? ' + ' : ''}` : ''}${fee?.percentage > 0 ? `${fee.percentage}%` : ''})`
                : ''}`}
              amount={parsePrice(getFeeAmount(fee))}
              color={theme.colors.textSecondary}
              onInfo={() => setOpenTaxModal({ open: true, data: fee, type: 'fee' })}
            />
          ))}
        </TaxesFeesDetail>
      )}
    </>
  )
}

export const CartChargesRows = (props: {
  cart: any,
  hideDeliveryFee?: boolean,
  hideDriverTip?: boolean,
  hideCartDiscount?: boolean,
  setOpenTaxModal: any,
  renderOfferRemove: (offerId: any) => React.ReactNode
}) => {
  const { cart, hideDeliveryFee, hideDriverTip, hideCartDiscount, setOpenTaxModal, renderOfferRemove } = props
  const theme = useTheme()
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ configs }] = useConfig()
  const [{ parsePrice, parseNumber }] = useUtils()

  const clearAmount = (value: number) =>
    parseFloat((Math.trunc(value * 100) / 100).toFixed(configs?.format_number_decimal_length?.value ?? 2))
  const getIncludedDeliveryTaxes = () => !cart?.taxes
    ? (cart?.business?.tax_type === 1 ? cart?.tax ?? 0 : 0)
    : cart.taxes.reduce((sum: number, tax: any) =>
      sum + (tax.type === 1 && tax.target === 'delivery_fee' ? tax.summary?.tax : 0), 0)

  const deliveryFeeTotal = clearAmount((cart?.delivery_price_with_discount ?? 0) + getIncludedDeliveryTaxes())
  const deliveryFeeOffers = cart?.offers?.filter((offer: any) => offer?.target === 2) || []
  const freeDeliveryValue = parseFloat(cart?.metafields?.find?.((meta: any) => meta?.key === 'extra_value_free_delivery')?.value)
  const isDeliveryFreeByMetafield = Number.isFinite(freeDeliveryValue) &&
    freeDeliveryValue < 0 &&
    clearAmount(-freeDeliveryValue) === deliveryFeeTotal
  const partnerName = String(cart?.metafields?.find?.((meta: any) => meta?.key === 'free_delivery_partner_name')?.value ?? '').trim()
  const freeDeliveryTooltip = partnerName
    ? `${t('FREE_DELIVERY_FOR', 'Free delivery for')} ${partnerName} ${t('CARDHOLDERS', 'Cardholders')}`
    : t('FREE_DELIVERY_APPLIED_TOOLTIP', 'Free delivery applied')

  const extraValueMetafields = (cart?.metafields ?? []).filter((meta: any) =>
    meta?.key?.startsWith('extra_value_') &&
    !!parseFloat(meta?.value) &&
    !(isDeliveryFreeByMetafield && meta?.key === 'extra_value_free_delivery'))

  const showDeliveryFee = deliveryTypes.includes(orderState?.options?.type) &&
    !hideDeliveryFee &&
    cart?.business_id &&
    !deliveryFeeOffers.length &&
    (deliveryFeeTotal !== 0 || isDeliveryFreeByMetafield)

  return (
    <>
      <TaxRows taxes={getTaxesByTarget(cart?.taxes, 'order')} setOpenTaxModal={setOpenTaxModal} />
      {showDeliveryFee && (
        <BillRow
          label={t('DELIVERY_FEE', 'Delivery Fee')}
          onInfo={isDeliveryFreeByMetafield ? () => Alert.alert(t('DELIVERY_FEE', 'Delivery Fee'), freeDeliveryTooltip) : undefined}
          amount={isDeliveryFreeByMetafield ? (
            <>
              <BillStrikethrough>
                <OText size={12} lineHeight={18} color={theme.colors.disabled} style={{ textDecorationLine: 'line-through' }}>
                  {parsePrice(deliveryFeeTotal)}
                </OText>
              </BillStrikethrough>
              <OText size={12} lineHeight={18} weight={'600'} color={theme.colors.primary}>{t('FREE', 'Free')}</OText>
            </>
          ) : parsePrice(deliveryFeeTotal)}
        />
      )}
      {cart?.extra_value_checkprice > 0 && (
        <BillRow
          label={t('EXTRA_VALUE_CHECKPRICE', 'Extra value checkprice')}
          amount={parsePrice(cart?.extra_value_checkprice)}
        />
      )}
      <TaxRows taxes={getTaxesByTarget(cart?.taxes, 'delivery_fee')} setOpenTaxModal={setOpenTaxModal} />
      {!hideCartDiscount && deliveryFeeOffers.map((offer: any) => (
        <BillRow
          key={offer.id}
          label={`${offer.name}${offer?.rate_type === 1 ? ` (${verifyDecimals(offer?.rate, parsePrice)}%)` : ''}`}
          amount={parsePrice(deliveryFeeTotal)}
          onInfo={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_2' })}
          extra={!!offer?.id && renderOfferRemove(offer.id)}
        />
      ))}
      {cart?.driver_tip > 0 && !hideDriverTip && (
        <BillRow
          label={`${t('DRIVER_TIP', 'Driver tip')}${cart?.driver_tip_rate > 0 &&
            parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
            !parseInt(configs?.driver_tip_use_custom?.value, 10)
            ? ` (${verifyDecimals(cart?.driver_tip_rate, parseNumber)}%)`
            : ''}`}
          amount={parsePrice(cart?.driver_tip)}
        />
      )}
      {extraValueMetafields.map((meta: any) => {
        const value = parseFloat(meta?.value)
        const fallback = meta?.key?.replace('extra_value_', '')?.split('_')?.map((word: string) => capitalize(word))?.join(' ')
        return (
          <BillRow
            key={meta?.key}
            label={t(meta?.key?.toUpperCase(), fallback)}
            amount={value > 0 ? parsePrice(value) : `- ${parsePrice(-value)}`}
          />
        )
      })}
    </>
  )
}
