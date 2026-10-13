import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react'
import { Animated, FlatList, PanResponder } from 'react-native'
import { BusinessController } from '@ui'
import BusinessCardSkeleton from './BusinessCardSkeleton'
import {
  SheetContainer,
  SheetHandleArea,
  SheetGrabber,
  SheetTitle,
  SheetCardWrapper,
  sheetListContent,
  SHEET_COLLAPSED_TRANSLATE_Y
} from './styles'

const COLLAPSED_TRANSLATE_Y = SHEET_COLLAPSED_TRANSLATE_Y
const DRAG_ACTIVATION = 6
const SNAP_DURATION = 280

export interface MapBottomSheetHandle {
  expand: () => void
  collapse: () => void
  scrollToBusiness: (index: number) => void
}

interface MapBottomSheetProps {
  businesses: any[]
  loading: boolean
  title: string
  selectedBusinessId: number | string | null
  orderType: number
  onCardPress: (business: any) => void
  onBusinessClick: (business: any) => void
  handleUpdateBusinessList?: (id: any, changes: any, status: any) => void
  onEndReached: () => void
  navigation?: any
}

const MapBusinessCard = React.memo(({ business, orderType, selected, onCardPress, onBusinessClick, navigation, handleUpdateBusinessList }: any) => (
  <SheetCardWrapper selected={selected}>
    <BusinessController
      businessListingSearchview
      business={business}
      isBusinessOpen={business.open}
      onCardSelect={onCardPress}
      onBusinessClick={onBusinessClick}
      navigation={navigation}
      orderType={orderType}
      handleUpdateBusinessList={handleUpdateBusinessList}
    />
  </SheetCardWrapper>
))

export const MapBottomSheet = forwardRef<MapBottomSheetHandle, MapBottomSheetProps>(({
  businesses,
  loading,
  title,
  selectedBusinessId,
  orderType,
  onCardPress,
  onBusinessClick,
  handleUpdateBusinessList,
  onEndReached,
  navigation
}, ref) => {
  const translateY = useRef(new Animated.Value(COLLAPSED_TRANSLATE_Y)).current
  const restingOffsetRef = useRef(COLLAPSED_TRANSLATE_Y)
  const dragStartRef = useRef(COLLAPSED_TRANSLATE_Y)
  const listRef = useRef<FlatList>(null)

  const snapTo = useCallback((toValue: number) => {
    restingOffsetRef.current = toValue
    Animated.timing(translateY, {
      toValue,
      duration: SNAP_DURATION,
      useNativeDriver: true
    }).start()
  }, [translateY])

  useImperativeHandle(ref, () => ({
    expand: () => snapTo(0),
    collapse: () => snapTo(COLLAPSED_TRANSLATE_Y),
    scrollToBusiness: (index: number) => {
      if (index < 0) return
      listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0 })
    }
  }), [snapTo])

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_evt, gesture) => Math.abs(gesture.dy) > DRAG_ACTIVATION,
    onPanResponderGrant: () => {
      dragStartRef.current = restingOffsetRef.current
    },
    onPanResponderMove: (_evt, gesture) => {
      const next = Math.min(Math.max(dragStartRef.current + gesture.dy, 0), COLLAPSED_TRANSLATE_Y)
      translateY.setValue(next)
    },
    onPanResponderRelease: (_evt, gesture) => {
      const projected = dragStartRef.current + gesture.dy
      const draggingUp = gesture.vy < -0.5 || projected < COLLAPSED_TRANSLATE_Y / 2
      snapTo(draggingUp ? 0 : COLLAPSED_TRANSLATE_Y)
    }
  }), [snapTo, translateY])

  const renderItem = useCallback(({ item }: any) => (
    <MapBusinessCard
      business={item}
      orderType={orderType}
      selected={item.id === selectedBusinessId}
      onCardPress={onCardPress}
      onBusinessClick={onBusinessClick}
      navigation={navigation}
      handleUpdateBusinessList={handleUpdateBusinessList}
    />
  ), [orderType, selectedBusinessId, onCardPress, onBusinessClick, navigation, handleUpdateBusinessList])

  const keyExtractor = useCallback((item: any) => `${item.id}`, [])

  const handleScrollToIndexFailed = useCallback((info: { index: number, averageItemLength: number }) => {
    setTimeout(() => {
      listRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true })
    }, 60)
  }, [])

  return (
    <SheetContainer style={{ transform: [{ translateY }] }}>
      <SheetHandleArea {...panResponder.panHandlers}>
        <SheetGrabber />
        <SheetTitle weight='bold' size={18} numberOfLines={1}>{title}</SheetTitle>
      </SheetHandleArea>
      <FlatList
        ref={listRef}
        data={businesses}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        extraData={selectedBusinessId}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        contentContainerStyle={sheetListContent}
        ListFooterComponent={loading ? <BusinessCardSkeleton count={3} /> : null}
      />
    </SheetContainer>
  )
})

MapBottomSheet.displayName = 'MapBottomSheet'
