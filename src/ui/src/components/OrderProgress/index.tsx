import React, { useEffect, useState } from 'react'

import { Divider } from './styles'
import { OrderCard } from './OrderCard'
import { OrderStatusSkeleton } from './OrderStatusSkeleton'

import { getOrderStatuPickUp, getOrderStatus } from '../../utils'
import { useTheme } from 'styled-components/native'
import { OrderList, useLanguage } from '@components'

const OrderProgressUI = (props: any) => {
  const {
    orderList,
    navigation,
    loadOrders,
    isFocused
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()

  const [lastOrder, setLastOrder] = useState<any>(null)
  const [initialLoaded, setInitialLoaded] = useState(false)
  const statusToShow = [0, 3, 4, 7, 8, 9, 13, 14, 18, 19, 20, 21, 22, 23, 24, 25, 26]

  const progressBarObjt = (s: any) => lastOrder?.delivery_type && lastOrder?.delivery_type === 2 ? getOrderStatuPickUp(s, t, theme) : getOrderStatus(s, t, theme)

  const handleGoToOrder = (index: string, params: any) => {
    navigation && navigation.navigate(index, params)
  }

  useEffect(() => {
    if (orderList?.orders.length > 0) {
      const sortedOrders = orderList.orders.sort((a: any, b: any) => a.id > b.id ? -1 : 1)
      const orderInProgress = sortedOrders.find((order: any) => (statusToShow.includes(order.status)))

      let _lastOrder = null
      if (orderInProgress) {
        _lastOrder = orderInProgress
      } else {
        _lastOrder = sortedOrders[0]
      }
      setLastOrder(_lastOrder)
    }
  }, [orderList?.orders])

  useEffect(() => {
    if (isFocused) {
      loadOrders(false, false, false, true)
    }
  }, [isFocused])

  useEffect(() => {
    if (orderList.loading || initialLoaded) return
    setInitialLoaded(true)
  }, [orderList.loading, initialLoaded])

  return (
    <>
      {(orderList?.loading && !initialLoaded) && <OrderStatusSkeleton />}
      {(!orderList?.loading || initialLoaded) && orderList?.orders?.length > 0 && lastOrder && (
        <>
          <OrderCard
            lastOrder={lastOrder}
            statusToShow={statusToShow}
            progressBarObjt={progressBarObjt}
            handleGoToOrder={handleGoToOrder}
          />
          <Divider />
        </>
      )}
    </>
  )
}

export const OrderProgress = (props: any) => {
  const orderProgressProps = {
    ...props,
    UIComponent: OrderProgressUI,
    orderStatus: [0, 3, 4, 7, 8, 9, 13, 14, 18, 19, 20, 21, 22, 23, 24, 25, 26],
    useDefualtSessionManager: true,
    paginationSettings: {
      initialPage: 1,
      pageSize: 10,
      controlType: 'infinity'
    },
    propsToFetch: [
      'id',
      'name',
      'business',
      'status',
      'delivery_type',
      'delivery_datetime_utc',
      'delivery_datetime',
      'reporting_data',
      'eta_current_status_time',
      'eta_previous_status_times',
      'eta_time',
      'delivered_in',
      'prepared_in',
      'eta_drive_time',
      'uuid'
    ],
    noGiftCardOrders: true,
    disabledLeaveOrderSocket: true
  }

  return <OrderList {...orderProgressProps} />

}
