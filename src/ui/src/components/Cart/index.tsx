import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import AntIcon from 'react-native-vector-icons/AntDesign'

import { CContainer, CheckoutAction } from './styles';
import { OSBill, OSTable, OSCoupon, OSRow } from '../OrderSummary/styles';
import { verifyDecimals } from '../../utils';
import { deleteCartProduct } from '../../../../utils/giftCardCart'
import settings from '@/config'

import {
  Cart as CartController,
  useOrder,
  useLanguage,
  useConfig,
  useUtils,
  useValidationFields,
  useFreeDeliveryProgress,
} from '@components';

import {
  ProductItemAccordion,
  BusinessItemAccordion,
  CouponControl,
  OButton,
  OModal,
  OText,
  UpsellingProducts,
  TaxInformation,
  CartStoresListing,
  OAlert,
  PlaceSpot,
  MomentOption,
  CartStudentAlert
} from '@ui'
import { FreeDeliveryProgress } from '../FreeDeliveryProgress'
import { CartTaxesAndFeesRows, CartChargesRows } from './BillRows'

const deliveryTypes = [1, 7]
const pickupTypes = [2, 8]

export const CartUI = (props: any) => {
  const {
    cart,
    clearCart,
    changeQuantity,
    getProductMax,
    offsetDisabled,
    removeProduct,
    handleCartOpen,
    setIsCartsLoading,
    onNavigationRedirect,
    handleRemoveOfferClick,
    isMultiCheckout,
    hideCouponInput,
    hideDeliveryFee,
    hideDriverTip,
    showBillDetails,
    preorderSlotInterval,
    preorderLeadTime,
    preorderTimeRange,
    preorderMaximumDays,
    preorderMinimumDays,
    cateringTypes,
    isFromUpselling,
    cartsOpened,
    setCartsOpened,
    changeActiveState,
    isActive,
    hasCartReservation,
    callbackAfterUpdateCart
  } = props

  const theme = useTheme();

  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ configs }] = useConfig();
  const [{ parsePrice, parseDate, getMaxPreorderDays }] = useUtils()
  const [validationFields] = useValidationFields()
  const [openUpselling, setOpenUpselling] = useState(false)
  const [openChangeStore, setOpenChangeStore] = useState(false)
  const [canOpenUpselling, setCanOpenUpselling] = useState(false)
  const [openTaxModal, setOpenTaxModal] = useState<any>({ open: false, data: null, type: '' })
  const [openPlaceModal, setOpenPlaceModal] = useState(false)
  const [maxDate, setMaxDate] = useState<any>(null)
  const isCartPending = cart?.status === 2
  const isCouponEnabled = validationFields?.fields?.checkout?.coupon?.enabled
  const business: any = (orderState?.carts && Object.values(orderState.carts).find((_cart: any) => _cart?.uuid === props.cartuuid)) ?? {}
  const businessId = business?.business_id ?? null
  const placeSpotTypes = [4]
  const hideCartDiscount = theme?.business_view?.components?.cart?.components?.discount?.hidden
  const hasNoReservation = !cart?.reservation && orderState?.options?.type === 9
  const momentFormatted = !orderState?.option?.moment
    ? t('RIGHT_NOW', 'Right Now')
    : parseDate(orderState?.option?.moment, { outputFormat: 'YYYY-MM-DD HH:mm' })
  const freeDeliveryProgress: any = (useFreeDeliveryProgress as any)({
    business: cart?.business,
    cart,
    enabled: isActive !== false && Boolean(cart?.products?.length),
    franchiseId: settings.franchiseSlug
  })

  const handleDeleteClick = async (product: any) => {
    await deleteCartProduct({
      cart,
      product,
      removeProduct,
      clearCart
    })
    callbackAfterUpdateCart && callbackAfterUpdateCart()
  }

  const handleEditProduct = (product: any) => {
    onNavigationRedirect('ProductDetails', {
      businessId,
      isCartProduct: true,
      productCart: product,
      businessSlug: cart?.business?.slug,
      categoryId: product?.category_id,
      productId: product?.id,
      callbackAfterUpdateCart
    })
  }

  const handleClearProducts = async () => {
    try {
      setIsCartsLoading && setIsCartsLoading(true)
      await clearCart(cart?.uuid)
      callbackAfterUpdateCart && callbackAfterUpdateCart()
      setIsCartsLoading && setIsCartsLoading(false)
    } catch (error) {
      setIsCartsLoading && setIsCartsLoading(false)
    }
  }

  const handleUpsellingPage = (individualCart: any) => {
    const isProductCartParam = !!individualCart?.products?.length
    setOpenUpselling(false)
    setCanOpenUpselling(false)

    const cartsAvailable: any = Object.values(orderState?.carts)
      ?.filter((_cart: any) => _cart?.valid && _cart?.status !== 2 && _cart?.products?.length)
      ?.filter((_c: any) => !isProductCartParam ? _c.uuid !== individualCart?.uuid : _c)
    if (cartsAvailable.length === 1 || !isMultiCheckout || !cart?.business_id) {
      const cart = isMultiCheckout ? cartsAvailable[0] : individualCart
      onNavigationRedirect('CheckoutPage', {
        cartUuid: cart?.uuid,
        businessLogo: cart?.business?.logo,
        businessName: cart?.business?.name,
        cartTotal: cart?.total,
        fromProductsList: isFromUpselling
      })
    } else {
      const groupKeys: any = {}
      cartsAvailable.forEach((_cart: any) => {
        groupKeys[_cart?.group?.uuid]
          ? groupKeys[_cart?.group?.uuid] += 1
          : groupKeys[_cart?.group?.uuid ?? 'null'] = 1
      })

      if (
        (Object.keys(groupKeys).length === 1 && Object.keys(groupKeys)[0] === 'null') ||
        Object.keys(groupKeys).length > 1
      ) {
        onNavigationRedirect('MultiCheckout', {
          checkCarts: true
        })
      } else {
        onNavigationRedirect('MultiCheckout', {
          cartUuid: cartsAvailable[0]?.group?.uuid
        })
      }
    }
  }

  const getIncludedTaxes = (isDeliveryFee?: boolean) => {
    if (cart?.taxes === null || !cart?.taxes) {
      return cart?.business.tax_type === 1 ? cart?.tax : 0
    } else {
      return cart?.taxes.reduce((taxIncluded: number, tax: any) => {
        return taxIncluded +
          (((!isDeliveryFee && tax.type === 1 && tax.target === 'product') ||
            (isDeliveryFee && tax.type === 1 && tax.target === 'delivery_fee')) ? tax.summary?.tax : 0)
      }, 0)
    }
  }

  const getIncludedTaxesDiscounts = () => {
    return cart?.taxes?.filter((tax: any) => (tax?.type === 1 && tax?.target === 'product'))?.reduce((carry: number, tax: any) => carry + (tax?.summary?.tax_after_discount ?? tax?.summary?.tax), 0)
  }

  const OfferAlert = ({ offerId }: any) => {
    return (
      <OAlert
        title={t('OFFER', 'Offer')}
        message={t('QUESTION_DELETE_OFFER', 'Are you sure that you want to delete the offer?')}
        onAccept={() => handleRemoveOfferClick(offerId)}
      >
        <AntIcon style={{ marginLeft: 3 }} name='closecircle' size={16} color={theme.colors.primary} />
      </OAlert>
    )
  }

  const subtotalWithTaxes = cart?.taxes?.reduce((acc: any, item: any) => {
    if (item?.type === 1)
      return acc = acc + item?.summary?.tax
    return acc = acc
  }, cart?.subtotal)
  const belowMinimum = cart?.reservation ? !cart?.valid_minimum : subtotalWithTaxes < cart?.minimum

  const handleClickCheckout = () => {
    if (cart?.business_id) {
      setOpenUpselling(true)
    } else {
      onNavigationRedirect('CheckoutPage', {
        cartUuid: cart?.uuid,
        cartTotal: cart?.total
      }, true)
    }
  }

  const defaultLimitDays = getMaxPreorderDays(orderState?.options?.type)

  useEffect(() => {
    const limitDays = parseInt(preorderMaximumDays ?? defaultLimitDays, 10)
    const currentDate = new Date()
    const time = limitDays > 1
      ? currentDate.getTime() + ((limitDays - 1) * 24 * 60 * 60 * 1000)
      : limitDays === 1 ? currentDate.getTime() : currentDate.getTime() + (6 * 24 * 60 * 60 * 1000)

    currentDate.setTime(time)
    currentDate.setHours(23)
    currentDate.setMinutes(59)
    setMaxDate(currentDate)
  }, [preorderMaximumDays, defaultLimitDays])

  return (
    <CContainer>
      {cart?.business?.vertical === 'school' && (
        <CartStudentAlert cart={cart} />
      )}
      {!!openUpselling && (
        <UpsellingProducts
          handleUpsellingPage={handleUpsellingPage}
          openUpselling={openUpselling}
          businessId={cart?.business_id}
          business={cart?.business}
          cartProducts={cart?.products}
          canOpenUpselling={canOpenUpselling}
          setCanOpenUpselling={setCanOpenUpselling}
          handleCloseUpsellingPage={() => { }}
          isFromCart
        />
      )}
      <BusinessItemAccordion
        cart={cart}
        singleBusiness={props.singleBusiness}
        moment={momentFormatted}
        handleClearProducts={handleClearProducts}
        handleCartOpen={handleCartOpen}
        onNavigationRedirect={props.onNavigationRedirect}
        handleChangeStore={() => {
          setOpenChangeStore(true)
        }}
        handleClickCheckout={() => handleClickCheckout()}
        checkoutButtonDisabled={(openUpselling && !canOpenUpselling) || belowMinimum || !cart?.valid_address || hasNoReservation}
        isMultiCheckout={isMultiCheckout}
        isFromUpselling={isFromUpselling}
        cartsOpened={cartsOpened}
        setCartsOpened={setCartsOpened}
        changeActiveState={changeActiveState}
        isActive={isActive}
        isGiftCart={!cart?.business_id}
        cartReservation={cart?.reservation}
        hasCartReservation={hasCartReservation}
      >
        {cart?.products?.length > 0 && cart?.products.map((product: any, i: number) => (
          <ProductItemAccordion
            key={`${product.code}_${i}`}
            isCartPending={isCartPending}
            isCartProductView
            isCartProduct
            isDisabledEdit={!cart?.business_id}
            product={product}
            changeQuantity={changeQuantity}
            getProductMax={getProductMax}
            offsetDisabled={offsetDisabled}
            onDeleteProduct={handleDeleteClick}
            onEditProduct={handleEditProduct}
            viewString='business_view'
          />
        ))}

        {!!cart?.products?.length && (
          <FreeDeliveryProgress {...freeDeliveryProgress} variant='full' />
        )}

        {cart?.valid_products && (
          <OSBill>
            <OSTable>
              <OText size={12} lineHeight={18}>{t('SUBTOTAL', 'Subtotal')}</OText>
              <OText size={12} lineHeight={18}>
                {parsePrice(cart?.subtotal + getIncludedTaxes())}
              </OText>
            </OSTable>
            {!hideCartDiscount && cart?.discount > 0 && cart?.total >= 0 && cart?.offers?.length === 0 && (
              <OSTable>
                {cart?.discount_type === 1 ? (
                  <OText size={12} lineHeight={18}>
                    {t('DISCOUNT', 'Discount')}
                    <OText size={12} lineHeight={18}>{`(${verifyDecimals(cart?.discount_rate, parsePrice)}%)`}</OText>
                  </OText>
                ) : (
                  <OText size={12} lineHeight={18}>{t('DISCOUNT', 'Discount')}</OText>
                )}
                <OText size={12} lineHeight={18}>- {parsePrice(cart?.discount || 0)}</OText>
              </OSTable>
            )}
            {
              !hideCartDiscount && cart?.offers?.length > 0 && cart?.offers?.filter((offer: any) => offer?.target === 1)?.map((offer: any, i: number) => (
                <OSTable key={`${offer.id}_${i}`}>
                  <OSRow>
                    <OText size={12} lineHeight={18}>{offer.name}</OText>
                    {offer.rate_type === 1 && (
                      <OText size={12} lineHeight={18}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                    )}
                    <TouchableOpacity style={{ marginLeft: 3 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_1' })}>
                      <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                    {!!offer?.id && (
                      <OfferAlert offerId={offer?.id} />
                    )}
                  </OSRow>
                  <OText size={12} lineHeight={18}>
                    - {parsePrice(offer?.summary?.discount)}
                  </OText>
                </OSTable>
              ))
            }
            {/* <Divider /> */}
            {!hideCartDiscount &&
              cart?.offers?.filter((offer: any) => offer?.target === 1)?.length > 0 &&
              cart?.subtotal_with_discount > 0 &&
              cart?.discount > 0 &&
              cart?.total >= 0 && (
                <OSTable>
                  <OText size={12} lineHeight={18} numberOfLines={1}>{t('SUBTOTAL_WITH_DISCOUNT', 'Subtotal with discount')}</OText>
                  {cart?.business?.tax_type === 1 ? (
                    <OText size={12} lineHeight={18}>{parsePrice(cart?.subtotal_with_discount + getIncludedTaxesDiscounts())}</OText>
                  ) : (
                    <OText size={12} lineHeight={18}>{parsePrice(cart?.subtotal_with_discount)}</OText>
                  )}
                </OSTable>
              )}
            {showBillDetails && (
              <CartTaxesAndFeesRows cart={cart} setOpenTaxModal={setOpenTaxModal} />
            )}
            {
              cart?.offers?.length > 0 && cart?.offers?.filter((offer: any) => offer?.target === 3)?.map((offer: any) => (
                <OSTable key={offer.id}>
                  <OSRow>
                    <OText size={12} lineHeight={18}>{offer.name}</OText>
                    {offer.rate_type === 1 && (
                      <OText size={12} lineHeight={18}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                    )}
                    <TouchableOpacity style={{ marginLeft: 3 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_3' })}>
                      <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                    {!!offer?.id && (
                      <OfferAlert offerId={offer?.id} />
                    )}
                  </OSRow>
                  <OText size={12} lineHeight={18}>
                    - {parsePrice(offer?.summary?.discount)}
                  </OText>
                </OSTable>
              ))
            }
            {showBillDetails && (
              <CartChargesRows
                cart={cart}
                hideDeliveryFee={hideDeliveryFee}
                hideDriverTip={hideDriverTip}
                hideCartDiscount={hideCartDiscount}
                setOpenTaxModal={setOpenTaxModal}
                renderOfferRemove={(offerId: any) => <OfferAlert offerId={offerId} />}
              />
            )}
            {isCouponEnabled && !isCartPending && !hideCouponInput && (
              <OSTable>
                <OSCoupon>
                  <CouponControl
                    businessId={cart?.business_id ?? businessId}
                    price={cart.total}
                    cart={cart}
                    onOpenOffers={() => onNavigationRedirect('CouponOffers', {
                      businessId: cart?.business_id ?? businessId,
                      cartUuid: cart?.uuid
                    })}
                  />
                </OSCoupon>
              </OSTable>
            )}

            {placeSpotTypes.includes(orderState?.options?.type) && (
              <OSTable style={{ marginTop: 15 }}>
                <OText size={14} lineHeight={21} weight={'600'}>
                  {t('SPOT', 'Spot')}: {cart?.place?.name || t('NO_SELECTED', 'No selected')}
                </OText>
                <TouchableOpacity onPress={() => setOpenPlaceModal(true)}>
                  <OText
                    size={14}
                    lineHeight={21}
                    weight={'600'}
                    color={theme.colors.primary}
                    style={{ textDecorationLine: 'underline' }}
                  >
                    {t('EDIT', 'Edit')}
                  </OText>
                </TouchableOpacity>
              </OSTable>
            )}
          </OSBill>
        )}
        {cateringTypes.includes(orderState?.options?.type) && maxDate && cart?.valid_products && (
          <View>
            <MomentOption
              maxDate={maxDate}
              cateringPreorder
              isCart
              preorderSlotInterval={preorderSlotInterval}
              preorderLeadTime={preorderLeadTime}
              preorderTimeRange={preorderTimeRange}
              preorderMaximumDays={preorderMaximumDays}
              preorderMinimumDays={preorderMinimumDays}
              business={cart?.business}
            />
          </View>
        )}
        {!cart?.valid_address && cart?.status !== 2 && (
          <OText
            color={theme.colors.error}
            size={12}
          >
            {t('INVALID_CART_ADDRESS', 'Selected address is invalid, please select a closer address.')}
          </OText>
        )}
        {(!isMultiCheckout || !cart?.business_id) && (
          <>
            {cart?.valid_products ? (
              <CheckoutAction>
                <OButton
                  text={!cart?.valid_address
                    ? (
                      t('OUT_OF_COVERAGE', 'Out of Coverage')
                    )
                    : !cart?.valid_maximum
                      ? (
                        `${t('MAXIMUM_SUBTOTAL_ORDER', 'Maximum subtotal order')}: ${parsePrice(cart?.maximum)}`
                      )
                      : belowMinimum
                        ? (
                          `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(cart?.minimum)}`
                        )
                        : hasNoReservation
                          ? t('MISSING_RESERVATION', 'Missing reservation')
                          : !openUpselling !== canOpenUpselling ? t('CHECKOUT', 'Checkout') : t('LOADING', 'Loading')}
                  // bgColor={(!cart?.valid_maximum || subtotalWithTaxes < cart?.minimum || !cart?.valid_address || hasNoReservation) ? theme.colors.secundary : theme.colors.primary}
                  // borderColor={(!cart?.valid_maximum || subtotalWithTaxes < cart?.minimum || !cart?.valid_address || hasNoReservation) ? theme.colors.secundary : theme.colors.primary}
                  disabled={(openUpselling && !canOpenUpselling) || !cart?.valid_maximum || belowMinimum || !cart?.valid_address || hasNoReservation}
                  textStyle={{ textAlign: 'center', flex: 1 }}
                  onClick={() => handleClickCheckout()}
                  style={{ width: '100%', flexDirection: 'row', justifyContent: 'center' }}
                />
              </CheckoutAction>
            ) : (
              <View style={{ alignItems: 'center', width: '100%' }}>
                <OText size={12} color={theme.colors.red} style={{ textAlign: 'center', marginTop: 5 }}>
                  {t('WARNING_INVALID_PRODUCTS_CHECKOUT', 'To continue with your checkout, please remove from your cart the products that are not available.')}
                </OText>
              </View>
            )}
          </>
        )}
      </BusinessItemAccordion>

      <OModal
        open={openChangeStore}
        onClose={() => setOpenChangeStore(false)}
      >
        <CartStoresListing
          cartuuid={cart?.uuid}
          onClose={() => setOpenChangeStore(false)}
        />
      </OModal>
      <OModal
        open={openTaxModal.open}
        onClose={() => setOpenTaxModal({ open: false, data: null, type: '' })}
      >
        <TaxInformation
          type={openTaxModal.type}
          data={openTaxModal.data}
          products={cart?.products}
        />
      </OModal>
      <OModal
        open={openPlaceModal}
        title={t('CHOOSE_YOUR_SPOT', 'Choose your spot')}
        onClose={() => setOpenPlaceModal(false)}
      >
        <PlaceSpot
          cart={cart}
          isOpenPlaceSpot={openPlaceModal}
          setOpenPlaceModal={setOpenPlaceModal}
        />
      </OModal>
    </CContainer>
  )
}

export const Cart = (props: any) => {
  const cartProps = {
    ...props,
    UIComponent: CartUI
  }

  return (
    <CartController {...cartProps} />
  )
}
