
import React, { useState, useEffect } from 'react'
import { useTheme } from 'styled-components/native'

import { BusinessesListing as OriginalBusinessListing } from './Layout/Original'
import { BusinessesListing as MawejaBusinessListing } from './Layout/Maweja'
import { resolveAppDesign } from '@/utils/appDesign'

import { useOrder, useSession, useLanguage, useConfig } from '@components';
import { NotificationSetting, OBottomPopup, ReviewTrigger } from '@ui';

export const BusinessesListing = (props: any) => {
  const theme = useTheme()
  const Listing = resolveAppDesign(theme) === 'maweja' ? MawejaBusinessListing : OriginalBusinessListing
  const [, t] = useLanguage();
  const [{ auth, loading: userLoading }] = useSession()
  const [{ loading }, { getLastOrderHasNoReview }] = useOrder();
  const [{ configs, loading: configsLoading }] = useConfig()
  const isShowReviewsPopupEnabled = configs?.show_reviews_popups_enabled?.value === '1'

  const [, setIsReviewed] = useState()
  const [checkNotificationStatus, setCheckNotificationStatus] = useState({ open: false, checked: false })
  const [firstLoad, setFirstLoad] = useState(true)
  const defaultOrder = {
    id: 0,
    business_id: 0,
    business_name: '',
    logo: '',
    driver: {},
    products: [],
    review: {},
    user_review: {},
    delivery_datetime: ''
  }
  const [lastOrderReview, setLastOrderReview] = useState({
    isReviewOpen: false,
    order: defaultOrder,
    defaultStar: 5,
  })

  const _getLastOrderHasNoReview = async () => {
    const lastOrderHasNoReview = await getLastOrderHasNoReview()
    lastOrderHasNoReview && OrderReviewRequired(lastOrderHasNoReview)
  }

  const OrderReviewRequired = (order: any) => {
    setLastOrderReview({
      isReviewOpen: true,
      order: {
        id: order?.id,
        business_id: order?.business_id,
        business_name: order?.business?.name,
        logo: order.business?.logo,
        driver: order?.driver,
        products: order?.products,
        review: order?.review,
        user_review: order?.user_review,
        delivery_datetime: order?.delivery_datetime_utc
      },
      defaultStar: 5
    })
  }

  const handleOpenOrderReview = (star: number) => {
    setLastOrderReview({
      ...lastOrderReview, isReviewOpen: false, order: defaultOrder
    })
    props?.navigation && props.navigation.navigate(
      'ReviewOrder',
      {
        order: lastOrderReview.order,
        defaultStar: star || 5,
        setIsReviewed
      }
    )
  }

  useEffect(() => {
    if (!isShowReviewsPopupEnabled) return
    (checkNotificationStatus?.checked && auth) && _getLastOrderHasNoReview()
  }, [checkNotificationStatus, auth, isShowReviewsPopupEnabled])

  useEffect(() => {
    if (loading || userLoading || configsLoading) return
    setFirstLoad(false)
  }, [loading, userLoading, configsLoading])

  return (
    <>
      {!firstLoad && <Listing {...props} isOrderStateReady />}
      {lastOrderReview?.isReviewOpen && props.isLogin && (
        <OBottomPopup
          open={lastOrderReview?.isReviewOpen}
          transparent={true}
          onClose={() => setLastOrderReview({ ...lastOrderReview, isReviewOpen: false, order: defaultOrder })}
          title={t('DONT_FORGET_TO_RATE_YOUR_ORDER', 'Don\'t forget to rate your order!')}
          titleStyle={{ textAlign: 'center', color: theme.colors.black }}
          closeIcon={theme.images.general.close}
          presentationStyle='overFullScreen'
        >
          {lastOrderReview?.order && (
            <ReviewTrigger
              order={lastOrderReview?.order}
              handleOpenOrderReview={handleOpenOrderReview}
            />
          )}
        </OBottomPopup>
      )}
      <NotificationSetting checkNotificationStatus={checkNotificationStatus}
        setCheckNotificationStatus={setCheckNotificationStatus} />
    </>
  )
}
