import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  LayoutChangeEvent,
} from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons'

import { PageBannerWrapper } from './styles'
import { useTheme } from 'styled-components/native'
import { useUtils, useEvent, PageBanner as PageBannerController } from '@components'
import { OText } from '@ui'

const PageBannerUI = (props: any) => {
  const {
    pageBannerState,
    navigation,
    layout
  } = props

  const isMaweja = layout === 'maweja'

  const theme = useTheme()
  const [{ optimizeImage }] = useUtils();
  const [events] = useEvent()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [viewedBanner, setViewedBanner] = useState<any>(null)
  const swiperRef = useRef<SwiperFlatList>(null)

  const windowWidth = Dimensions.get('window').width
  /** Match PageBannerWrapper horizontal margin (20 + 20); refined via onLayout */
  const BANNER_HORIZONTAL_GUTTER = 40
  const BANNER_HEIGHT = isMaweja ? 180 : 162
  const bannerRadius = isMaweja ? 20 : 30
  const [slideWidth, setSlideWidth] = useState(windowWidth - BANNER_HORIZONTAL_GUTTER)

  const styles = StyleSheet.create({
    swiperButton: {
      position: 'absolute',
      zIndex: 100,
      top: (BANNER_HEIGHT - 32) / 2,
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(0,0,0,0.28)'
    },
    slideClip: {
      overflow: 'hidden',
    },
    sliderWrapper: {
      height: BANNER_HEIGHT,
      borderRadius: bannerRadius,
      overflow: 'hidden'
    },
    caption: {
      position: 'absolute' as const,
      left: 14,
      bottom: 8,
      maxWidth: '42%',
    },
    bannerImage: {
      height: BANNER_HEIGHT
    },
    swiper: {
      overflow: 'hidden',
      flexGrow: 0,
      flexShrink: 0,
    }
  })

  const handleWrapperLayout = (event: LayoutChangeEvent) => {
    const w = Math.round(event.nativeEvent.layout.width)
    if (w <= 0) {
      return
    }
    setSlideWidth((prev) => (prev !== w ? w : prev))
  }

  const getItemLayout = useCallback(
    (_data: unknown, index: number) => ({
      length: slideWidth,
      offset: slideWidth * index,
      index,
    }),
    [slideWidth],
  )

  const onRedirect = useCallback((route: string, params?: any) => {
    navigation.push(route, params)
  }, [navigation])

  const handleGoToPage = useCallback(
    (item: any) => {
      const action = item.action
      if (!action?.url) return
      let slug
      if (action.type === 'business') {
        slug = action.url.split('store/')[1]
        onRedirect('Business', {
          store: slug,
        })
      }
      if (action.type === 'product') {
        slug = action.url.split('store/')[1]?.split('?')[0]
        onRedirect('ProductDetails', {
          businessSlug: slug,
          businessId: action.business_id,
          categoryId: action.category_id,
          productId: action.product_id,
          isRedirect: 'business',
          business: {
            store: slug,
          },
        })
      }
      const clickedBanner = pageBannerState.result.find((banner: any) => banner.id === item?.banner_id)
      events.emit('promotion_clicked', clickedBanner)
    },
    [onRedirect, pageBannerState.result, events],
  )

  const bannerCaption = useCallback((item: any) => {
    const parent = pageBannerState.result?.find((banner: any) => banner.id === item?.banner_id)
    const caption = item?.name || parent?.name
    return typeof caption === 'string' ? caption.trim() : ''
  }, [pageBannerState.result])

  const renderBannerItem = useCallback(
    ({ item }: { item: any }) => {
      const caption = isMaweja ? bannerCaption(item) : ''
      return (
        <View style={[styles.slideClip, { width: slideWidth }]}>
          <TouchableOpacity
            activeOpacity={1}
            style={{ width: slideWidth }}
            onPress={() => handleGoToPage(item)}
          >
            <View style={[styles.sliderWrapper, { width: slideWidth }]}>
              <FastImage
                style={[styles.bannerImage, { width: slideWidth }]}
                resizeMode={FastImage.resizeMode.cover}
                source={{
                  uri: optimizeImage(
                    item.url,
                    `w_${Math.round(slideWidth)},h_${BANNER_HEIGHT},c_limit`,
                  ),
                }}
              />
              {!!caption && (
                <View style={styles.caption}>
                  <OText size={14} weight="600" color={theme.colors.white} numberOfLines={1}>{caption}</OText>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      )
    },
    [slideWidth, optimizeImage, handleGoToPage, styles.bannerImage, styles.sliderWrapper, styles.slideClip, styles.caption, isMaweja, bannerCaption, BANNER_HEIGHT],
  )

  const handleChangeIndex = ({ index }: { index: number }) => {
    setCurrentIndex(index)
  }

  const slides = pageBannerState.banner?.items ?? []

  const stepBanner = (direction: number) => {
    if (slides.length < 2) return
    const next = (currentIndex + direction + slides.length) % slides.length
    swiperRef.current?.scrollToIndex({ index: next })
  }

  useEffect(() => {
    if (pageBannerState.loading) return
    if (pageBannerState.banner?.items && pageBannerState.banner?.items.length > 0) {
      const bannerId = pageBannerState.banner.items[currentIndex]?.banner_id
      if (pageBannerState.result && bannerId) {
        const _viewedBanner = pageBannerState.result.find((banner: any) => banner.id === bannerId)
        if (_viewedBanner?.id !== viewedBanner?.id) {
          setViewedBanner(_viewedBanner)
          events.emit('promotion_viewed', _viewedBanner)
        }
      }
    }
  }, [pageBannerState.loading, currentIndex, viewedBanner])

  return (
    <>
      {pageBannerState.loading ? (
        <PageBannerWrapper>
          <Placeholder
            Animation={Fade}
            style={{ height: 162 }}
          >
            <PlaceholderLine height={BANNER_HEIGHT} style={{ borderRadius: bannerRadius }} />
          </Placeholder>
        </PageBannerWrapper>
      ) : (
        <>
          {slides.length > 0 && (
            <PageBannerWrapper $flush={isMaweja} onLayout={handleWrapperLayout}>
              <SwiperFlatList
                ref={swiperRef}
                style={[styles.swiper, { width: slideWidth }]}
                data={slides}
                renderItem={renderBannerItem}
                keyExtractor={(item: any, index: number) => {
                  const id = item?.banner_id ?? item?.id
                  return id != null ? `page-banner-${String(id)}-${index}` : `page-banner-slot-${index}`
                }}
                pagingEnabled
                index={currentIndex}
                onChangeIndex={handleChangeIndex}
                getItemLayout={getItemLayout}
                removeClippedSubviews
                autoplay
                autoplayLoop
                autoplayDelay={6}
                showPagination
                paginationStyle={isMaweja ? { width: slideWidth, left: 0, bottom: 10 } : undefined}
                paginationStyleItem={isMaweja ? { width: 6, height: 6, borderRadius: 3, marginHorizontal: 3 } : undefined}
                paginationStyleItemActive={isMaweja ? { width: 16, backgroundColor: theme.colors.white } : undefined}
                paginationStyleItemInactive={isMaweja ? { width: 6, backgroundColor: 'rgba(255,255,255,0.45)' } : undefined}
                autoplayLoopKeepAnimation
              />
              {isMaweja && slides.length > 1 && (
                <>
                  <TouchableOpacity
                    testID="maweja-banner-prev"
                    style={[styles.swiperButton, { left: 8 }]}
                    onPress={() => stepBanner(-1)}
                    accessibilityRole="button"
                  >
                    <Ionicons name="chevron-back" size={18} color={theme.colors.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    testID="maweja-banner-next"
                    style={[styles.swiperButton, { right: 8 }]}
                    onPress={() => stepBanner(1)}
                    accessibilityRole="button"
                  >
                    <Ionicons name="chevron-forward" size={18} color={theme.colors.white} />
                  </TouchableOpacity>
                </>
              )}
            </PageBannerWrapper>
          )}
        </>
      )}
    </>
  )
}

export const PageBanner = (props: any) => {
  const pageBannerProps = {
    ...props,
    UIComponent: PageBannerUI
  }
  return <PageBannerController {...pageBannerProps} />
}
