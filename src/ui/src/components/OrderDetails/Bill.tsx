import React, { useState } from 'react'
import { Alert, Platform, View, TouchableOpacity } from 'react-native'
import AntIcon from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from 'styled-components/native'

import { Divider, OrderBill, PaymentMethodItem, PaymentMethodItemAmount, PaymentMethodItemInfo, Separator, Table, WrapperPaymethods } from './styles'
import { MawejaCardTitle, MawejaInvoiceHeader, MawejaTotalRule } from '../Checkout/layouts/Maweja'
import { Card, CardBody, PayIconWrap } from '../Checkout/layouts/Maweja/styles'
import { themeBrandColor } from '@/utils/themeBrandColor'
import { ProductList } from './ProductList'
import { OSRow } from '../OrderSummary/styles';
import { useConfig, useLanguage, useUtils } from '@components'
import { getPayIcon, OIcon, OModal, OText, TaxInformation, verifyDecimals } from '@ui'
import { capitalize } from '../../utils'

export const Bill = (props: any) => {
  const {
    order,
    isPickup,
    hideTotal,
    isGiftCardOrder,
    isCustomOrder,
    declaredValue,
    layout,
    showComment
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [{ parsePrice, parseNumber }] = useUtils()

  const [openTaxModal, setOpenTaxModal] = useState<any>({ open: false, tax: null, type: '' })
  const extraValueMetafields = order?.metafields?.filter?.((meta: any) => meta?.key?.startsWith('extra_value_')) || []

  const walletName: any = {
    cash: {
      name: t('PAY_WITH_CASH_WALLET', 'Pay with Cash Wallet'),
    },
    credit_point: {
      name: t('PAY_WITH_CREDITS_POINTS_WALLET', 'Pay with Credit Points Wallet'),
    }
  }

  const getIncludedTaxes = (isDeliveryFee?: boolean) => {
    if (order?.taxes?.length === 0 || !order?.taxes) {
      return order.tax_type === 1 ? order?.summary?.tax ?? 0 : 0
    } else {
      return order?.taxes.reduce((taxIncluded: number, tax: any) => {
        return taxIncluded + (((!isDeliveryFee && tax.type === 1 && tax.target === 'product') || (isDeliveryFee && tax.type === 1 && tax.target === 'delivery_fee')) ? tax.summary?.tax : 0)
      }, 0)
    }
  }

  const getIncludedTaxesDiscounts = () => {
    return order?.taxes?.filter((tax: any) => tax?.type === 1 && tax?.target === 'product')?.reduce((carry: number, tax: any) => carry + (tax?.summary?.tax_after_discount ?? tax?.summary?.tax), 0)
  }

  const clearAmount = (value: any) => parseFloat((Math.trunc(value * 100) / 100).toFixed(configs.format_number_decimal_length?.value ?? 2))
  const deliveryTotalForFreeCheck = clearAmount(
    (Number(
      order?.summary?.delivery_price_with_discount ??
      order?.summary?.delivery_price ??
      order?.delivery_price,
    ) || 0) + getIncludedTaxes(true),
  )
  const freeDeliveryMetaRaw = order?.metafields?.find?.((m: any) => m?.key === 'extra_value_free_delivery')?.value
  const parsedFreeDeliveryMeta = freeDeliveryMetaRaw != null ? Number(freeDeliveryMetaRaw) : NaN
  const isDeliveryFreeViaMetafield =
    deliveryTotalForFreeCheck > 0 &&
    Number.isFinite(parsedFreeDeliveryMeta) &&
    clearAmount(parsedFreeDeliveryMeta + deliveryTotalForFreeCheck) === 0

  const rawFreeDeliveryPartnerName = order?.metafields?.find?.((m: any) => m?.key === 'free_delivery_partner_name')?.value
  const freeDeliveryPartnerName = ((): string => {
    if (rawFreeDeliveryPartnerName == null || rawFreeDeliveryPartnerName === '') return ''
    if (typeof rawFreeDeliveryPartnerName === 'string') {
      try {
        const parsed = JSON.parse(rawFreeDeliveryPartnerName)
        return typeof parsed === 'string' ? parsed.trim() : String(parsed).trim()
      } catch {
        return rawFreeDeliveryPartnerName.trim()
      }
    }
    return String(rawFreeDeliveryPartnerName).trim()
  })()
  const freeDeliveryFeeTooltipMessage = isDeliveryFreeViaMetafield
    ? (freeDeliveryPartnerName
      ? t('FREE_DELIVERY_FOR', 'Free delivery for') + ' ' + freeDeliveryPartnerName + ' ' + t('CARDHOLDERS', 'Cardholders')
      : t('FREE_DELIVERY', 'Free delivery'))
    : ''

  const isMaweja = layout === 'maweja'
  const paymentEvents = (order?.payment_events || []).filter((event: any) => event?.amount > 0)
  const paymentMethodName = (event: any) => {
    const methodName = (event?.wallet_event ?? event?.wallet_event_id)
      ? walletName[event?.wallet_event?.wallet?.type ?? event?.data?.wallet_currency]?.name
      : t(event?.data?.gateway?.toUpperCase()?.replace(/ /g, '_') || event?.paymethod?.name?.toUpperCase()?.replace(/ /g, '_'), event?.data?.gateway || event?.paymethod?.name)
    return event?.event === 'refund' ? `${t('REFUND', 'Refund')} (${methodName})` : methodName
  }
  const paymentMethodIcon = (event: any) => {
    if (event?.wallet_event || event?.wallet_event_id) return 'wallet-outline'
    const gateway = String(event?.paymethod?.gateway ?? event?.data?.gateway ?? event?.paymethod?.name ?? '').toLowerCase()
    if (gateway.includes('cash')) return 'cash'
    if (gateway.includes('paypal')) return 'paypal'
    if (gateway.includes('apple')) return 'apple'
    if (gateway.includes('google')) return 'google'
    return 'credit-card-outline'
  }
  const Line = (props: any) => (
    <Table
      {...props}
      hideBackground={isMaweja || props.hideBackground}
      pb={isMaweja ? (props.pb ?? 8) : props.pb}
    />
  )

  return (
    <>
      <OrderBill>
        <ProductList order={order} layout={layout} />
        {isMaweja && showComment && !!order?.comment && (
          <Card>
            <CardBody>
              <MawejaCardTitle icon="comment-text-outline" title={t('COMMENT', 'Comment')} />
              <OText size={14} color={theme.colors.black}>{order.comment}</OText>
            </CardBody>
          </Card>
        )}
        <View style={isMaweja ? {
          backgroundColor: theme.colors.backgroundCard || theme.colors.white,
          borderRadius: 18,
          paddingTop: 16,
          paddingHorizontal: 16,
          paddingBottom: 16
        } : { backgroundColor: theme.colors.backgroundGray100, borderRadius: 15, padding: 20, marginTop: 10 }}>
          {isMaweja && (
            <MawejaInvoiceHeader title={t('INVOICE', 'Invoice')} brand={order?.business?.name} />
          )}
          {!isCustomOrder && (
            <Line>
              <OText size={12} lineHeight={18} weight={'400'}>{t('SUBTOTAL', 'Subtotal')}</OText>
              <OText size={12} lineHeight={18} weight={'400'}>
                {parsePrice(((order?.summary?.subtotal_with_discount ?? order?.subtotal_with_discount) || 0))}
              </OText>
            </Line>
          )}
          {(order?.summary?.discount > 0 || order?.discount > 0) && order?.offers?.length === 0 && (
            <Line>
              {order?.offer_type === 1 ? (
                <OText size={12} lineHeight={18} weight={'400'}>
                  {t('DISCOUNT', 'Discount')}
                  <OText size={12} lineHeight={18} weight={'400'}>{`(${verifyDecimals(
                    order?.offer_rate,
                    parsePrice,
                  )}%)`}</OText>
                </OText>
              ) : (
                <OText size={12} lineHeight={18} weight={'400'}>{t('DISCOUNT', 'Discount')}</OText>
              )}
              <OText size={12} lineHeight={18} weight={'400'}>
                - {parsePrice(order?.summary?.discount || order?.discount)}
              </OText>
            </Line>
          )}
          {
            !isGiftCardOrder && order?.offers?.length > 0 && order?.offers?.filter((offer: any) => offer?.target === 1)?.map((offer: any) => (
              <Line key={offer.id}>
                <OSRow>
                  <OText size={12} lineHeight={18} weight={'400'} numberOfLines={1}>
                    {offer.name}
                    {offer.rate_type === 1 && (
                      <OText size={12} lineHeight={18} weight={'400'}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                    )}
                  </OText>
                  <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_1' })}>
                    <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                </OSRow>
                <OText size={12} lineHeight={18} weight={'400'}>- {parsePrice(offer?.summary?.discount)}</OText>
              </Line>
            ))
          }
          {
            order?.taxes?.length === 0 && order?.tax_type === 2 && (
              <Line>
                <OText size={12} lineHeight={18} weight={'400'}>
                  {t('TAX', 'Tax')} {`(${verifyDecimals(order?.tax, parseNumber)}%)`}
                </OText>
                <OText size={12} lineHeight={18} weight={'400'}>{parsePrice(order?.summary?.tax || 0)}</OText>
              </Line>
            )
          }
          {
            order?.fees?.length === 0 && (
              <Line>
                <OText size={12} lineHeight={18} weight={'400'}>
                  {t('SERVICE_FEE', 'Service fee')}
                  {`(${verifyDecimals(order?.service_fee, parseNumber)}%)`}
                </OText>
                <OText size={12} lineHeight={18} weight={'400'}>{parsePrice(order?.summary?.service_fee || 0)}</OText>
              </Line>
            )
          }
          {
            order?.taxes?.length > 0 && order?.taxes?.filter((tax: any) => tax?.rate !== 0 && tax?.target === 'product').map((tax: any) => (
              <Line key={tax.id}>
                <OSRow>
                  <OText size={12} lineHeight={18} weight={'400'} numberOfLines={1}>
                    {t('TAX', 'Tax')}
                    {` (${verifyDecimals(tax?.rate, parseNumber)}%)`}{' '}
                  </OText>
                </OSRow>
                <OText
                  size={12}
                  lineHeight={18}
                  weight={'400'}

                >
                  {parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}
                </OText>
              </Line>
            ))
          }
          {
            !isGiftCardOrder && order?.fees?.length > 0 && order?.fees?.filter((fee: any) => !(fee.fixed === 0 && fee.percentage === 0))?.map((fee: any) => (
              <Line key={fee.id}>
                <OSRow>
                  <OText size={12} lineHeight={18} weight={'400'} numberOfLines={1}>
                    {fee.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                    ({fee?.fixed > 0 && `${parsePrice(fee?.fixed)}${fee.percentage > 0 ? ' + ' : ''}`}{fee.percentage > 0 && `${fee.percentage}%`}){' '}
                  </OText>
                  <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: fee, type: 'fee' })}>
                    <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                </OSRow>
                <OText size={12} lineHeight={18} weight={'400'}>{parsePrice(fee?.summary?.amount ?? ((fee?.summary?.fixed + (fee?.summary?.percentage_after_discount || fee?.summary?.percentage)) || 0))}</OText>
              </Line>
            ))
          }
          {
            !isGiftCardOrder && order?.offers?.length > 0 && order?.offers?.filter((offer: any) => offer?.target === 3)?.map((offer: any) => (
              <Line key={offer.id}>
                <OSRow>
                  <OText size={12} lineHeight={18} weight={'400'} numberOfLines={1}>
                    {offer.name}
                    {offer.rate_type === 1 && (
                      <OText>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                    )}
                  </OText>
                  <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_3' })}>
                    <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                </OSRow>
                <OText size={12} lineHeight={18} weight={'400'}>- {parsePrice(offer?.summary?.discount)}</OText>
              </Line>
            ))
          }
          {!isPickup && !isGiftCardOrder &&
            (
              isDeliveryFreeViaMetafield ||
              (typeof order?.summary?.delivery_price === 'number' && order?.summary?.delivery_price > 0)
            ) && (
            <Line>
              {isDeliveryFreeViaMetafield ? (
                <OSRow style={{ alignItems: 'center', width: '80%' }}>
                  <OText size={12} lineHeight={18} weight={'400'}>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
                  <View
                    style={{ marginLeft: 6 }}
                    {...(Platform.OS === 'web' ? ({ title: freeDeliveryFeeTooltipMessage } as Record<string, string>) : {})}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (Platform.OS !== 'web') {
                          Alert.alert(t('DELIVERY_FEE', 'Delivery Fee'), freeDeliveryFeeTooltipMessage)
                        }
                      }}
                      accessibilityLabel={freeDeliveryFeeTooltipMessage}
                      accessibilityRole='button'
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </View>
                </OSRow>
              ) : (
                <OText size={12} lineHeight={18} weight={'400'}>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
              )}
              {isDeliveryFreeViaMetafield ? (
                <OSRow style={{ alignItems: 'center' }}>
                  <OText
                    size={12}
                    lineHeight={18}
                    weight={'400'}
                    style={{ textDecorationLine: 'line-through', color: theme.colors.disabled || '#9E9E9E', marginRight: 6 }}
                  >
                    {parsePrice((order?.summary?.delivery_price_with_discount ?? order?.summary?.delivery_price ?? order?.delivery_price) + getIncludedTaxes(true))}
                  </OText>
                  <OText size={12} lineHeight={18} weight={'600'} color={theme.colors.primary}>
                    {t('FREE', 'Free')}
                  </OText>
                </OSRow>
              ) : (
                <OText size={12} lineHeight={18} weight={'400'}>
                  {parsePrice(order?.summary?.delivery_price + getIncludedTaxes(true))}
                </OText>
              )}
            </Line>
          )}
          {isCustomOrder && declaredValue > 0 && (
            <Line>
              <OText size={12} lineHeight={18} weight={'400'}>{t('DECLARED_VALUE', 'Declared value')}</OText>
              <OText size={12} lineHeight={18} weight={'400'}>{parsePrice(declaredValue)}</OText>
            </Line>
          )}
          {
            !isGiftCardOrder && order?.taxes?.length > 0 && order?.taxes?.filter((tax: any) => tax?.type === 2 && tax?.rate !== 0 && tax?.target === 'delivery_fee').map((tax: any, i: number) => (
              <Line key={`${tax?.description}_${i}`}>
                <OSRow>
                  <OText size={12} lineHeight={18} weight={'400'} numberOfLines={1}>
                    {t(tax?.name?.toUpperCase()?.replace(/ /g, '_'), tax?.name?.toUpperCase()?.replace(/_/g, ' ')) || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                    {`(${verifyDecimals(tax?.rate, parseNumber)}%) `}
                  </OText>
                  {setOpenTaxModal && (
                    <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: tax, type: 'tax' })}>
                      <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                  )}
                </OSRow>
                <OText size={12} lineHeight={18} weight={'400'}>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</OText>
              </Line>
            ))
          }
          {
            !isGiftCardOrder && order?.offers?.length > 0 && order?.offers?.filter((offer: any) => offer?.target === 2)?.map((offer: any) => (
              <Line key={offer.id}>
                <OSRow>
                  <OText size={12} lineHeight={18} weight={'400'} numberOfLines={1}>
                    {offer.name}
                    {offer.rate_type === 1 && (
                      <OText size={12} lineHeight={18} weight={'400'}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                    )}
                  </OText>
                  <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_2' })}>
                    <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                </OSRow>
                <OText size={12} lineHeight={18} weight={'400'}>- {parsePrice(offer?.summary?.discount)}</OText>
              </Line>
            ))
          }
          {order?.summary?.driver_tip > 0 && (
            <Line>
              <OText size={12} lineHeight={18} weight={'400'}>
                {t('DRIVER_TIP', 'Driver tip')}
                {order?.summary?.driver_tip > 0 &&
                  parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                  !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                  (
                    `(${verifyDecimals(order?.summary?.driver_tip, parseNumber)}%)`
                  )}
              </OText>
              <OText size={12} lineHeight={18} weight={'400'}>{parsePrice(order?.summary?.driver_tip ?? order?.totalDriverTip)}</OText>
            </Line>
          )}
          {extraValueMetafields.filter((meta: any) =>
            !!parseFloat(meta?.value) &&
            !(isDeliveryFreeViaMetafield && meta?.key === 'extra_value_free_delivery'),
          ).map((meta: any) => {
            const strippedKey = meta?.key?.replace('extra_value_', '')
            const langKey = meta?.key?.toUpperCase()
            const fallback = strippedKey?.replace(/_/g, ' ')?.split(' ')?.map((word: string) => capitalize(word))?.join(' ')
            return (
              <Line key={meta?.key}>
                <OText size={12} lineHeight={18} weight={'400'}>
                  {t(langKey, fallback)}{' '}
                </OText>
                <OText size={12} lineHeight={18} weight={'400'}>{parseFloat(meta?.value) > 0 ? parsePrice(parseFloat(meta?.value)) : `- ${parsePrice(parseFloat(meta?.value) * -1)}`}</OText>
              </Line>
            )
          })}
          {!hideTotal && (
            <>
              {isMaweja && <MawejaTotalRule />}
              <Line pb={0}>
                <OText size={isMaweja ? 16 : 12} style={isMaweja ? { fontWeight: 'bold' } : undefined}>
                  {isCustomOrder
                    ? t('ESTIMATED_TOTAL', 'Estimated Total')
                    : isMaweja
                      ? t('TOTAL_TO_PAY', 'Total to pay')
                      : t('TOTAL', 'Total')}
                </OText>
                <OText
                  size={isMaweja ? 18 : 12}
                  color={isMaweja ? themeBrandColor(theme) : undefined}
                  style={isMaweja ? { fontWeight: 'bold' } : undefined}
                >
                  {isCustomOrder ? '~ ' : ''}
                  {parsePrice(
                    isCustomOrder
                      ? (order?.summary?.total ?? order?.total ?? 0) + (declaredValue || 0)
                      : (order?.summary?.total ?? order?.total)
                  )}
                </OText>
              </Line>
            </>
          )}
        </View>
        {!isMaweja && <Separator />}
        {paymentEvents.length > 0 && (
          isMaweja ? (
            <Card style={{ marginTop: 12 }}>
              <CardBody>
                <MawejaCardTitle icon="credit-card-outline" title={t('PAYMENT_METHODS', 'Payment methods')} />
                {paymentEvents.map((event: any, index: number) => {
                  const isRefund = event?.event === 'refund'
                  return (
                    <View
                      key={event.id || index}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: index === paymentEvents.length - 1 ? 0 : 8,
                        paddingTop: 12,
                        paddingBottom: 12,
                        paddingLeft: 12,
                        paddingRight: 12,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: '#D8DCE3'
                      }}
                    >
                      <PayIconWrap>
                        <MaterialCommunityIcons name={paymentMethodIcon(event)} size={20} color={theme.colors.black} />
                      </PayIconWrap>
                      <OText size={15} weight="bold" color={theme.colors.black} style={{ flex: 1 }}>
                        {paymentMethodName(event)}
                      </OText>
                      {!isCustomOrder && (
                        <OText size={14} weight="bold" color={isRefund ? (theme.colors.green || theme.colors.success) : theme.colors.black}>
                          {isRefund ? '+' : '-'}{parsePrice(event.amount, { isTruncable: true })}
                        </OText>
                      )}
                    </View>
                  )
                })}
              </CardBody>
            </Card>
          ) : (
          <>
            <OText lineHeight={24} weight={'500'}>{t('PAYMENT_METHODS', 'Payment methods')}</OText>
            <WrapperPaymethods>
              {paymentEvents.map((event: any) => {
                const isRefund = event?.event === 'refund'
                return (
                <PaymentMethodItem key={event.id}>
                  <PaymentMethodItemInfo>
                    <OIcon
                      src={getPayIcon(event?.paymethod?.gateway ?? event?.data?.gateway, theme)}
                      width={30}
                      height={30}
                      color={theme.colors.black}
                    />
                    <OText mLeft={10} weight={500}>
                      {paymentMethodName(event)}
                    </OText>
                  </PaymentMethodItemInfo>
                  <PaymentMethodItemAmount>
                    {!isCustomOrder && (
                      <OText>
                        {isRefund ? '+' : '-'}{parsePrice(event.amount, { isTruncable: true })}
                      </OText>
                    )}
                  </PaymentMethodItemAmount>
                </PaymentMethodItem>
                )
              })}
            </WrapperPaymethods>
            <Separator />
          </>
          )
        )}
      </OrderBill>
      <OModal
        open={openTaxModal.open}
        onClose={() => setOpenTaxModal({ open: false, data: null, type: '' })}
      >
        <TaxInformation
          type={openTaxModal.type}
          data={openTaxModal.data}
          products={order?.products}
        />
      </OModal>
    </>
  )
}

