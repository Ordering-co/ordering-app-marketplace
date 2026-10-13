import React, { useCallback, useRef, useState } from 'react'
import { FlatList, Platform, RefreshControl, StatusBar, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native'

import { FlatListBusinessListHeader } from './FlatListBusinessListHeader'
import { FlatListBusinessListFooter } from './FlatListBusinessListFooter'
import { HomeHeader } from '../Maweja/HomeHeader'

import { useOrder } from '@components';
import { BusinessController } from '@ui';
import { themeBrandColor } from '@/utils/themeBrandColor'

export const FlatListBusinessListing = (props: any) => {
  const {
    handleScroll,
    businessesList,
    handleBusinessClick,
    navigation,
    handleUpdateBusinessList,
    favoriteIds,
    setFavoriteIds,
    handleOnRefresh
  } = props

  const [orderState] = useOrder()
  const [refreshing] = useState(false);
  const theme = useTheme()
  const pageColor = props.homeLayout === 'maweja' ? theme.colors.backgroundPage : undefined
  const listStyle = pageColor ? { flex: 1, backgroundColor: pageColor } : undefined
  const headerActiveRef = useRef(false)
  const [headerActive, setHeaderActive] = useState(false)
  const insets = useSafeAreaInsets()
  const notchColor = headerActive ? themeBrandColor(theme) : theme.colors.backgroundPage

  useFocusEffect(useCallback(() => {
    if (props.homeLayout !== 'maweja') return undefined
    StatusBar.setBarStyle(headerActive ? 'light-content' : 'dark-content', true)
    if (Platform.OS === 'android') StatusBar.setBackgroundColor(notchColor, true)
    return () => {
      StatusBar.setBarStyle('dark-content', true)
      if (Platform.OS === 'android') StatusBar.setBackgroundColor(theme.colors.backgroundPage, true)
    }
  }, [headerActive, notchColor, props.homeLayout, theme.colors.backgroundPage]))

  const onListScroll = (event: any) => {
    handleScroll(event)
    if (props.homeLayout !== 'maweja') return
    const active = event.nativeEvent.contentOffset.y > 8
    if (active === headerActiveRef.current) return
    headerActiveRef.current = active
    setHeaderActive(active)
  }

  const list = (
    <FlatList
      style={listStyle}
      contentContainerStyle={pageColor ? { backgroundColor: pageColor } : undefined}
      ListHeaderComponent={<FlatListBusinessListHeader {...props} />}
      ListFooterComponent={<FlatListBusinessListFooter {...props} />}
      renderItem={({ item: business }: any) =>
        <View style={{ paddingHorizontal: 20 }}>
          <BusinessController
            business={business}
            isBusinessOpen={business.open}
            handleCustomClick={handleBusinessClick}
            orderType={orderState?.options?.type}
            navigation={navigation}
            businessHeader={business?.header}
            businessFeatured={business?.featured}
            businessLogo={business?.logo}
            businessReviews={business?.reviews}
            businessDeliveryPrice={business?.delivery_price}
            businessDeliveryTime={business?.delivery_time}
            businessPickupTime={business?.pickup_time}
            businessDistance={business?.distance}
            handleUpdateBusinessList={handleUpdateBusinessList}
            favoriteIds={favoriteIds}
            setFavoriteIds={setFavoriteIds}
            layout={props.homeLayout}
          />
        </View>
      }
      onScroll={onListScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      data={businessesList.businesses}
      keyExtractor={(item: any, i: number) => `${item?.id ?? i}`}
      removeClippedSubviews={Platform.OS === 'android'}
      initialNumToRender={8}
      maxToRenderPerBatch={10}
      windowSize={5}
      updateCellsBatchingPeriod={50}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => handleOnRefresh()}
        />
      }
    />
  )

  if (props.homeLayout !== 'maweja') return list

  return (
    <View style={{ flex: 1, marginTop: -insets.top, backgroundColor: notchColor }}>
      <HomeHeader
        part="sticky"
        scrolled={headerActive}
        topInset={insets.top}
        navigation={navigation}
        showBusinessSearchMap
        isGuestUser={props.isGuestUser}
        setOrderTypeValue={props.setOrderTypeValue}
        orderTypeValue={props.orderTypeValue}
        onHandleCart={() => navigation.navigate('Cart')}
      />
      {list}
    </View>
  )
}

