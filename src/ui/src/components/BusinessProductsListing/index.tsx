import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View, Animated, TouchableOpacity, StyleSheet, Dimensions, Platform, Keyboard, KeyboardEvent, BackHandler, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { useIsFocused } from '@react-navigation/native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

import { BusinessProductsListingParams } from '../../types'
import { resolveAppDesign } from '@/utils/appDesign'
import settings from '@/config'
import { openFromCheckout } from '@/utils/checkoutReturn'
import { MawejaBusinessMenu } from './layouts/Maweja'

import { OIcon, OModal, OText } from '../shared'
import { _retrieveStoreData, _removeStoreData } from '../../providers/StoreUtil';
import { BusinessesListing } from '../BusinessesListing/Layout/Original'
import { HeaderContent } from '../BusinessesListing/Layout/Original/HeaderContent'

import {
  TopHeader,
  WrapSearchBar,
  WrapContent,
  FiltProductsContainer,
  BackgroundGray,
  ProfessionalFilterWrapper,
  NearBusiness,
  TopActions
} from './styles'

import {
  BusinessAndProductList,
  useLanguage,
  useOrder,
  useSession,
  useUtils,
  ToastType,
  useToast,
  useConfig,
  useEvent,
  useSchoolStudents,
  useFreeDeliveryProgress
} from '@components'

import {
  Alert,
  BusinessBasicInformation,
  SearchBar,
  BusinessProductsCategories,
  BusinessProductsList,
  FloatingButton,
  UpsellingRedirect,
  ProfessionalFilter,
  ServiceForm,
  PageBanner,
  StudentSelector,
  StudentOnboardingPopup
} from '@ui'
import dayjs from 'dayjs'
import { FreeDeliveryProgress } from '../FreeDeliveryProgress'

const PIXELS_TO_SCROLL = 2000

const BusinessProductsListingOriginal = (props: BusinessProductsListingParams) => {
  const {
    navigation,
    errors,
    businessState,
    categoryState,
    handleChangeSearch,
    categorySelected,
    searchValue,
    handleChangeCategory,
    handleSearchRedirect,
    featuredProducts,
    errorQuantityProducts,
    header,
    logo,
    alertState,
    setAlertState,
    multiRemoveProducts,
    getNextProducts,
    handleUpdateProducts,
    professionalSelected,
    handleUpdateProfessionals,
    handleChangeProfessionalSelected,
    onBusinessClick,
    businessSingleId,
    productModal
  } = props

  const insets = useSafeAreaInsets()
  const theme = useTheme();
  const [, t] = useLanguage()
  const [{ auth }] = useSession()
  const { refresh: refreshStudents } = useSchoolStudents()
  const [orderState, { addProduct, updateProduct }] = useOrder()
  const [{ parsePrice }] = useUtils()
  const [, { showToast }] = useToast()
  const [{ configs }] = useConfig()
  const [events] = useEvent()
  const isFocused = useIsFocused();
  const isPreOrder = configs?.preorder_status_enabled?.value === '1'

  const showLogo = !theme?.business_view?.components?.header?.components?.business?.components?.logo?.hidden
  const hideBusinessNearCity = theme?.business_view?.components?.near_business?.hidden ?? true
  const backgroundColor = theme?.business_view?.components?.style?.backgroundColor
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1
    },
    BackIcon: {
      paddingRight: 20,
    },
    headerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 2,
      marginHorizontal: 20,
    },
    btnBackArrow: {
      borderWidth: 0,
      backgroundColor: theme.colors.clear,
      shadowColor: theme.colors.clear,
      padding: 40,
    },
    searchIcon: {
      borderWidth: 0,
      padding: 10,
      justifyContent: 'center',
      shadowColor: theme.colors.clear,
    },
    businessSkeleton: {
      borderRadius: 8,
      marginRight: 20,
      width: 56,
      height: 56
    },
  })

  const { business, loading, error } = businessState

  const sortedCategories = useMemo(() => {
    const cats = business?.categories ? [...business.categories] : []
    if (business?.vertical === 'school') {
      const todayDow = dayjs().day()
      const upcomingDiff = (prepDay: any) => {
        if (prepDay === null || prepDay === undefined || prepDay === '') return null
        return (Number(prepDay) - todayDow + 7) % 7
      }
      return cats.sort((a: any, b: any) => {
        const aDiff = upcomingDiff(a?.preparation_day_of_week)
        const bDiff = upcomingDiff(b?.preparation_day_of_week)
        if (aDiff !== null && bDiff !== null) return (aDiff - bDiff) || ((a.rank || 0) - (b.rank || 0))
        if (aDiff !== null) return -1
        if (bDiff !== null) return 1
        return (a.rank || 0) - (b.rank || 0)
      })
    }
    return cats.sort((a: any, b: any) => (a.rank || 0) - (b.rank || 0))
  }, [business?.categories, business?.vertical])

  useEffect(() => {
    if (business?.vertical === 'school') refreshStudents()
  }, [business?.slug, business?.vertical])

  const isSchool = business?.vertical === 'school'
  const menuCategories = useMemo(() => {
    const base: any[] = [{ id: null, name: t('ALL', 'All') }]
    if (!isSchool) base.push({ id: 'featured', name: t('FEATURED', 'Featured') })
    return [...base, ...sortedCategories]
  }, [sortedCategories, isSchool])

  const [openBusinessInformation, setOpenBusinessInformation] = useState(false)
  const [isOpenSearchBar, setIsOpenSearchBar] = useState(false)
  const [openUpselling, setOpenUpselling] = useState(false)
  const [canOpenUpselling, setCanOpenUpselling] = useState(false)
  const scrollViewRef = useRef<any>(null)
  const [categoriesLayout, setCategoriesLayout] = useState<any>({})
  const [productListLayout, setProductListLayout] = useState<any>(null)
  const [isCategoryClicked, setCategoryClicked] = useState(false)
  const [subcategoriesSelected, setSubcategoriesSelected] = useState([])
  const [openService, setOpenService] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [searchBarHeight, setSearchBarHeight] = useState(60)
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [viewedCategory, setViewedCategory] = useState<any>(null)
  const [showTitle, setShowTitle] = useState(false)

  const isQuickAddProduct = configs?.add_product_with_one_click?.value === '1'
  const currentCart: any = Object.values(orderState.carts).find((cart: any) => cart?.business?.slug === business?.slug) ?? {}
  const freeDeliveryProgress: any = (useFreeDeliveryProgress as any)({
    business,
    cart: currentCart,
    enabled: !loading,
    franchiseId: settings.franchiseSlug
  })
  const isOpenFiltProducts = isOpenSearchBar && !!searchValue
  const viewOrderButtonVisible = !loading && auth && currentCart?.products?.length > 0 && categoryState.products.length !== 0
  const showFreeDeliveryAwareness = !currentCart?.products?.length && freeDeliveryProgress.status === 'awareness'
  const hasNoReservation = !currentCart?.reservation && orderState?.options?.type === 9
  const isMultiCheckout = configs?.checkout_multi_business_enabled?.value === '1' && orderState?.options?.type !== 9
  const openMultiCart = isMultiCheckout && Object.values(orderState?.carts ?? {})
    .filter((cart: any) => cart?.valid && cart?.status !== 2 && cart?.products?.length).length > 1

  const handleViewOrder = () => {
    if (openMultiCart) {
      props.onNavigationRedirect('Cart')
      return
    }
    setOpenUpselling(true)
  }

  const onRedirect = (route: string, params?: any) => {
    const sourceRoute = (props as any).route
    if (sourceRoute?.params?.fromCheckout) {
      openFromCheckout(navigation, sourceRoute, route, params)
      return
    }
    navigation.navigate(route, params)
  }
  const vibrateApp = (impact?: any) => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    };
    ReactNativeHapticFeedback.trigger(impact || "impactLight", options);
  }
  const onProductClick = async (product: any) => {
    if (currentCart?.status === 2) {
      setAlertState({ open: true, content: [t('YOU_HAVE_CART_IN_PROGRESS', 'You have a cart in progress, please complete it')] })
      return
    }
    if (product.ingredients?.length === 0 && product.extras.length === 0 && !product.inventoried && auth && isQuickAddProduct) {
      const isProductAddedToCart = currentCart?.products?.find((Cproduct: any) => Cproduct.id === product.id)
      const productQuantity = isProductAddedToCart?.quantity
      const minimumPerOrder = product?.minimum_per_order || 1
      const addCurrentProduct = {
        ...product,
        quantity: minimumPerOrder
      }
      const updateCurrentProduct = {
        name: product?.name,
        id: product.id,
        code: isProductAddedToCart?.code,
        quantity: productQuantity + 1
      }
      vibrateApp()
      const cartData = currentCart?.business_id ? currentCart : { business_id: business.id }
      if (isProductAddedToCart) {
        await updateProduct(updateCurrentProduct, cartData, isQuickAddProduct)
      } else {
        await addProduct(addCurrentProduct, cartData, isQuickAddProduct)
      }
    } else {
      const productAddedToCartLength = currentCart?.products?.reduce((productsLength: number, Cproduct: any) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0) || 0
      if (product?.type === 'service' && business?.professionals?.length > 0) {
        setCurrentProduct(product)
        setOpenService(true)
        return
      }
      if (product?.enabled) {
        onRedirect('ProductDetails', {
          product: product,
          business: business,
          businessSlug: business?.slug,
          productId: product?.id,
          categoryId: product?.category_id,
          businessId: business.id || product?.category?.business_id,
          productAddedToCartLength,
          isRedirect: false
        })
      } else {
        showToast(ToastType.Error, t('PRODUCT_NOT_FOUND', 'Product not found'))
      }
    }
    events.emit('product_clicked', product)
  }

  const handleCancel = () => {
    setIsOpenSearchBar(false)
    handleChangeSearch('')
  }

  const carts = useMemo(() => {
    return (orderState?.carts &&
      Object.values(orderState?.carts).filter((cart: any) =>
        cart.products?.length > 0 || (cart?.reservation && orderState?.options?.type === 9)
      )) ?? [];
  }, [orderState?.carts, orderState?.options?.type]);

  const cartGroups: any = useMemo(() => {
    if (!Object.values(carts)?.length) return {}
    return Object.values(carts).sort((a: any, b: any) => b?.status - a?.status).reduce((groups: any, cart: any) => {
      const groupId: any = cart?.status === 2 ? [`pending:${cart?.group?.uuid || cart?.uuid}`] : ['active']
      groups[groupId] = [...(groups[groupId] || []), cart]
      return groups
    }, {})
  }, [carts])

  const handleUpsellingPage = (cart: any) => {
    setOpenUpselling(false)
    setCanOpenUpselling(false)
    const isProductCartParam = !!cart?.products?.length
    const cartsAvailable: any = Object.values(orderState?.carts)
      ?.filter((_cart: any) => _cart?.valid && _cart?.products?.length)
      ?.filter((_c: any) => !isProductCartParam ? _c.uuid !== cart?.uuid : _c)
    const group = cartGroups[`pending:${cart?.group?.uuid || cart?.uuid}`]
    const isSingleCart = cartsAvailable.length === 1
    const hasNotGroup = !cart?.group?.uuid
    const cartGroupUuid = cart?.group?.uuid
    if (isSingleCart || !group) {
      props.onNavigationRedirect('CheckoutPage', {
        cartUuid: cart?.uuid,
        businessLogo: cart?.business?.logo,
        businessName: cart?.business?.name,
        cartTotal: cart?.total,
        fromProductsList: true
      })
    } else if (hasNotGroup) {
      props.onNavigationRedirect('MultiCheckout', {
        checkCarts: true
      })
    } else {
      props.onNavigationRedirect('MultiCheckout', {
        cartUuid: cartGroupUuid
      })
    }
  }

  const handleCloseUpsellingPage = () => {
    setOpenUpselling(false)
  }

  const [selectedCategoryId, setSelectedCategoryId] = useState<any>(null)

  const handlePageScroll = useCallback(({ nativeEvent }: any) => {
    const scrollOffset = nativeEvent.contentOffset.y
    setShowTitle(scrollOffset > 30)

    if (businessState?.business?.lazy_load_products_recommended) {
      const height = nativeEvent.contentSize.height
      const hasMore = !(categoryState.pagination.totalPages === categoryState.pagination.currentPage)
      if (scrollOffset + PIXELS_TO_SCROLL > height && !loading && hasMore && getNextProducts) {
        getNextProducts()
        showToast(ToastType.Info, t('LOADING_MORE_PRODUCTS', 'Loading more products'))
      }
    } else {
      if (!scrollOffset || !categoriesLayout || !productListLayout || isCategoryClicked) return

      for (const key in categoriesLayout) {
        const categoryOffset = categoriesLayout[key].y + productListLayout?.y - 70
        if (scrollOffset < 10) {
          setSelectedCategoryId('cat_all');
          return;
        }
        if (categoryOffset - 50 <= scrollOffset && scrollOffset <= categoryOffset + 50) {
          if (selectedCategoryId !== key) {
            setSelectedCategoryId(key)
          }
        }
      }
    }
  }, [isCategoryClicked, selectedCategoryId, productListLayout])

  const handleTouchDrag = useCallback(() => {
    setCategoryClicked(false);
  }, []);

  const handleBackNavigation = () => {
    navigation?.canGoBack() && !props.fromMulti ? navigation.goBack() : navigation.navigate('BottomTab')
  }

  const adjustBusiness = async (adjustBusinessId: number) => {
    const _carts = orderState?.carts?.[adjustBusinessId]
    const products = _carts?.products
    const unavailableProducts = products.filter((product: any) => product.valid !== true)
    const alreadyRemoved = await _retrieveStoreData('already-removed')
    _removeStoreData('already-removed')
    if (unavailableProducts.length > 0) {
      multiRemoveProducts && await multiRemoveProducts(unavailableProducts, _carts)
      return
    }

    if (alreadyRemoved === 'removed') {
      setAlertState({ open: true, content: [t('NOT_AVAILABLE_PRODUCT', 'This product is not available.')] })
    }
  }

  const removeCartByReOrder = async () => {
    const adjustBusinessId = await _retrieveStoreData('adjust-cart-products')
    if (currentCart && adjustBusinessId) {
      _removeStoreData('adjust-cart-products')
      adjustBusiness(adjustBusinessId)
    }
  }

  useEffect(() => {
    removeCartByReOrder()
  }, [currentCart])

  useEffect(() => {
    if (!isFocused) {
      handleChangeSearch('')
      setIsOpenSearchBar(false)
    }
  }, [isFocused])


  useEffect(() => {
    function onKeyboardDidShow(e: KeyboardEvent) {
      setKeyboardHeight(e?.endCoordinates?.height);
    }

    function onKeyboardDidHide() {
      setKeyboardHeight(0);
    }

    const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const subtotalWithTaxes = currentCart?.taxes?.reduce((acc: any, item: any) => {
    if (item?.type === 1)
      return acc = acc + item?.summary?.tax
    return acc = acc
  }, currentCart?.subtotal)
  const belowMinimum = currentCart?.reservation ? !currentCart?.valid_minimum : subtotalWithTaxes < currentCart?.minimum

  const onChangeSearch = (query: any) => {
    handleChangeSearch(query)
    if (query) {
      events.emit('products_searched', query)
    }
  }

  useEffect(() => {
    let categoryId: any = null
    if (business?.lazy_load_products_recommended) {
      if (categorySelected?.id) {
        categoryId = categorySelected.id
      }
    } else {
      if (selectedCategoryId) {
        const originCategoryId = selectedCategoryId.replace('cat_', '')
        if (!isNaN(originCategoryId)) {
          categoryId = Number(originCategoryId)
        }
      }
    }
    if (categoryId) {
      const _viewedCategory = business.categories.find((category: any) => category.id === categoryId)
      if (_viewedCategory?.id !== viewedCategory?.id) {
        setViewedCategory(_viewedCategory)
        events.emit('product_list_viewed', _viewedCategory)
      }
    } else {
      if (business.categories) {
        const categoryAll: any = {}
        categoryAll.business_id = business.id
        categoryAll.id = null
        categoryAll.name = 'All'
        events.emit('product_list_viewed', categoryAll)
      }
    }
  }, [business?.lazy_load_products_recommended, selectedCategoryId, categorySelected?.id, viewedCategory])

  useEffect(() => {
    const handleArrowBack: any = () => {
      navigation.goBack()
      return true
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleArrowBack);
    return () => {
      backHandler.remove();
    }
  }, [])

  useEffect(() => {
    if (!business && !loading && !error) {
      showToast(ToastType.Error, t('BUSINESS_NOT_FOUND', 'Business not found'))
      navigation.navigate('BottomTab', { screen: 'Home' })
    }
  }, [business, error, loading])

  useEffect(() => {
    if (productModal?.product && !productModal?.loading && !productModal?.error) {
      onProductClick(props?.productModal?.product)
    }
  }, [productModal])

  return (
    <>
      {business?.vertical === 'school' && (
        <StudentOnboardingPopup business={business} navigation={navigation} />
      )}
      <View style={{ flex: 1, backgroundColor: backgroundColor }}>
        <View style={{ marginBottom: 20 }}>
          <HeaderContent
            navigation={navigation}
            businessId={business?.id}
            title={business?.name}
            hideAddress
            collapseControls={showTitle}
            onHandleCart={viewOrderButtonVisible && handleViewOrder}
            onGoBack={() => props.onGoBack?.()}
          />
        </View>

        {/* <Animated.View style={{ position: 'relative' }}>
          <TopHeader
            style={{
              marginTop: Platform.OS === 'ios' ? insets.top : 0
            }}
            onLayout={(event: any) => setSearchBarHeight(event.nativeEvent.layout.height)}
            hideArrow={(businessSingleId && auth)}
          >
            {!isOpenSearchBar && (
              <>
                {!(businessSingleId && auth) && (
                  <TopActions onPress={() => handleBackNavigation()}>
                    <AntDesignIcon
                      name='arrowleft'
                      size={26}
                    />
                  </TopActions>
                )}
                {showTitle && (
                  <OText
                    size={16}
                    style={{ flex: 1, textAlign: 'center' }}
                    weight={Platform.OS === 'ios' ? '600' : 'bold'}
                    numberOfLines={2}
                    ellipsizeMode='tail'
                  >
                    {business?.name}
                  </OText>
                )}
                {!errorQuantityProducts && (
                  <View style={{ ...styles.headerItem }}>
                    <TouchableOpacity
                      onPress={() => setIsOpenSearchBar(true)}
                      style={styles.searchIcon}
                    >
                      <OIcon src={theme.images.general.search} color={theme.colors.textNormal} width={20} />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
            {isOpenSearchBar && (
              <WrapSearchBar>
                <SearchBar
                  autoFocus
                  onSearch={onChangeSearch}
                  onCancel={() => handleCancel()}
                  isCancelXButtonShow
                  noBorderShow
                  placeholder={t('SEARCH_PRODUCTS', 'Search Products')}
                  lazyLoad
                />
              </WrapSearchBar>
            )}
          </TopHeader>
          {!hideBusinessNearCity && loading && (
            <NearBusiness style={{ paddingBottom: 10 }}>
              <Placeholder Animation={Fade}>
                <View style={{ flexDirection: 'row' }}>
                  {[...Array(10).keys()].map(i => (
                    <View style={styles.businessSkeleton} key={i}>
                      <PlaceholderLine style={{ width: '100%', height: '100%' }} />
                    </View>
                  ))}
                </View>
              </Placeholder>
            </NearBusiness>
          )}
          {!loading && !hideBusinessNearCity && businessState?.business?.city_id && (
            <NearBusiness>
              <BusinessesListing
                logosLayout
                propsToFetch={['id', 'logo', 'location', 'timezone', 'schedule', 'open', 'slug']}
                cityId={businessState?.business?.city_id}
                onBusinessClick={onBusinessClick}
                actualSlug={businessState?.business?.slug}
              />
            </NearBusiness>
          )}
        </Animated.View> */}

        {/* {business?.categories?.length > 0 && isOpenFiltProducts && (
          <FiltProductsContainer
            style={{
              height: Dimensions.get('window').height - filtProductsHeight - keyboardHeight - (keyboardHeight > 0 && viewOrderButtonVisible ? 10 : 0),
              top: Platform.OS === 'ios' ? viewOrderButtonVisible ? (searchBarHeight - 10) + insets.top + 10 : (searchBarHeight - 10) + insets.top : searchBarHeight,
            }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={{ padding: 20, backgroundColor: theme.colors.white }}>
              <StudentSelector business={business} navigation={navigation} />
              <BusinessProductsList
                categories={menuCategories}
                category={categorySelected}
                categoryState={categoryState}
                businessId={business.id}
                errors={errors}
                onProductClick={onProductClick}
                handleSearchRedirect={handleSearchRedirect}
                featured={featuredProducts}
                searchValue={searchValue}
                handleClearSearch={handleChangeSearch}
                errorQuantityProducts={errorQuantityProducts}
                handleCancelSearch={handleCancel}
                categoriesLayout={categoriesLayout}
                subcategoriesSelected={subcategoriesSelected}
                lazyLoadProductsRecommended={business?.lazy_load_products_recommended}
                setCategoriesLayout={setCategoriesLayout}
                currentCart={currentCart}
                setSubcategoriesSelected={setSubcategoriesSelected}
                onClickCategory={handleChangeCategory}
                handleUpdateProducts={handleUpdateProducts}
                previouslyProducts={isSchool ? [] : business?.previously_products}
                navigation={navigation}
                isFiltMode
                businessSingleId={businessSingleId}
              />
            </View>
          </FiltProductsContainer>
        )} */}
        <ScrollView
          stickyHeaderIndices={[(business?.professionals?.length > 0 ? 3 : 2) + (showFreeDeliveryAwareness ? 1 : 0)]}
          style={styles.mainContainer}
          ref={scrollViewRef}
          onScroll={handlePageScroll}
          onScrollBeginDrag={handleTouchDrag}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          bounces={false}
        >
          <BusinessBasicInformation
            navigation={navigation}
            businessState={businessState}
            openBusinessInformation={openBusinessInformation}
            header={header}
            logo={logo}
            isPreOrder={isPreOrder}
            currentCart={currentCart}
            categoryState={categoryState}
          />
          {showFreeDeliveryAwareness && (
            <FreeDeliveryProgress {...freeDeliveryProgress} variant='full' />
          )}
          {business?.professionals?.length > 0 && (
            <ProfessionalFilterWrapper>
              <OText
                size={16}
                style={{ marginBottom: 16 }}
                weight={Platform.OS === 'ios' ? '600' : 'bold'}
              >
                {t('PROFESSIONALS', 'Professionals')}
              </OText>
              <ProfessionalFilter
                professionals={business?.professionals}
                professionalSelected={professionalSelected}
                handleChangeProfessionalSelected={handleChangeProfessionalSelected}
                handleUpdateProfessionals={handleUpdateProfessionals}
              />
            </ProfessionalFilterWrapper>
          )}
          {businessState?.business?.id && (
            <PageBanner position='app_business_page' businessId={businessState?.business?.id} navigation={navigation} />
          )}
          {!loading && business?.id && !(business?.categories?.length === 0) && (
            <BusinessProductsCategories
              categories={menuCategories}
              categorySelected={categorySelected}
              onClickCategory={handleChangeCategory}
              featured={featuredProducts}
              openBusinessInformation={openBusinessInformation}
              scrollViewRef={scrollViewRef}
              productListLayout={productListLayout}
              categoriesLayout={categoriesLayout}
              selectedCategoryId={selectedCategoryId}
              lazyLoadProductsRecommended={business?.lazy_load_products_recommended}
              setSelectedCategoryId={setSelectedCategoryId}
              setCategoryClicked={setCategoryClicked}
            />
          )}
          {!loading && business?.id && (
            <WrapContent
              onLayout={(event: any) => setProductListLayout(event.nativeEvent.layout)}
              style={{ paddingHorizontal: 20 }}
            >
              {business?.vertical === 'school' && (
                <StudentSelector business={business} navigation={navigation} />
              )}
              <BusinessProductsList
                categories={menuCategories}
                category={categorySelected}
                categoryState={categoryState}
                businessId={business.id}
                errors={errors}
                onProductClick={onProductClick}
                handleSearchRedirect={handleSearchRedirect}
                featured={featuredProducts}
                searchValue={searchValue}
                handleClearSearch={handleChangeSearch}
                errorQuantityProducts={errorQuantityProducts}
                handleCancelSearch={handleCancel}
                categoriesLayout={categoriesLayout}
                subcategoriesSelected={subcategoriesSelected}
                lazyLoadProductsRecommended={business?.lazy_load_products_recommended}
                setCategoriesLayout={setCategoriesLayout}
                currentCart={currentCart}
                setSubcategoriesSelected={setSubcategoriesSelected}
                onClickCategory={handleChangeCategory}
                handleUpdateProducts={handleUpdateProducts}
                navigation={navigation}
                previouslyProducts={isSchool ? [] : business?.previously_products}
                businessSingleId={businessSingleId}
              />
            </WrapContent>
          )}
          {loading && !error && (
            <>
              <BusinessProductsCategories
                categories={[]}
                categorySelected={categorySelected}
                onClickCategory={handleChangeCategory}
                featured={featuredProducts}
                openBusinessInformation={openBusinessInformation}
                loading={loading}
              />
              <WrapContent>
                <BusinessProductsList
                  categories={[]}
                  category={categorySelected}
                  categoryState={categoryState}
                  isBusinessLoading={loading}
                  errorQuantityProducts={errorQuantityProducts}
                  handleUpdateProducts={handleUpdateProducts}
                  navigation={navigation}
                />
              </WrapContent>
            </>
          )}
          {isOpenFiltProducts && (
            <BackgroundGray isIos={Platform.OS === 'ios'} />
          )}
        </ScrollView>
        {viewOrderButtonVisible && (
          <View style={{ marginBottom: 0 }}>
            <FreeDeliveryProgress {...freeDeliveryProgress} variant='compact' />
            <FloatingButton
              containerStyle={{ position: 'relative' }}
              text={
                openUpselling
                  ? t('LOADING', 'Loading')
                  : hasNoReservation
                    ? t('MISSING_RESERVATION', 'Missing Reservation')
                    : !belowMinimum
                      ? `${t('VIEW_ORDER', 'View Order')} · ${parsePrice(currentCart?.total)}`
                      : `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(currentCart?.minimum)}`
              }
              // isSecondaryBtn={subtotalWithTaxes < currentCart?.minimum || openUpselling || hasNoReservation}
              // btnLeftValueShow={subtotalWithTaxes >= currentCart?.minimum && currentCart?.products?.length > 0}
              // btnRightValueShow={subtotalWithTaxes >= currentCart?.minimum && currentCart?.products?.length > 0}
              // btnLeftValue={currentCart?.products.reduce((prev: number, product: any) => prev + product.quantity, 0)}
              // btnRightValue={parsePrice(currentCart?.total)}
              disabled={!openMultiCart && (belowMinimum || openUpselling || hasNoReservation)}
              handleClick={handleViewOrder}
            />
          </View>
        )}
        {openUpselling && (
          <UpsellingRedirect
            businessId={currentCart?.business_id}
            business={currentCart?.business}
            cartProducts={currentCart?.products}
            cart={currentCart}
            setOpenUpselling={setOpenUpselling}
            handleUpsellingPage={handleUpsellingPage}
            handleCloseUpsellingPage={handleCloseUpsellingPage}
            openUpselling={openUpselling}
            canOpenUpselling={canOpenUpselling}
            setCanOpenUpselling={setCanOpenUpselling}
            onRedirect={onRedirect}
          />
        )}
        <Alert
          open={alertState?.open || false}
          title=''
          content={alertState?.content || [t('NOT_AVAILABLE_PRODUCTS', 'These products are not available.')]}
          onAccept={() => setAlertState({ open: false, content: [] })}
          onClose={() => setAlertState({ open: false, content: [] })}
        />
      </View>
      <OModal
        open={openService}
        onClose={() => setOpenService(false)}
      >
        <ServiceForm
          navigation={navigation}
          product={currentProduct}
          businessSlug={business?.slug}
          businessId={business?.id}
          professionalList={business?.professionals}
          professionalSelected={professionalSelected}
          handleChangeProfessional={handleChangeProfessionalSelected}
          handleUpdateProfessionals={handleUpdateProfessionals}
          onSave={() => setOpenService(false)}
          onClose={() => setOpenService(false)}
        />
      </OModal>
    </>
  )
}

export const BusinessProductsListingUI = (props: BusinessProductsListingParams) => {
  const theme = useTheme()
  if (resolveAppDesign(theme) === 'maweja') {
    return <MawejaBusinessMenu {...props} />
  }
  return <BusinessProductsListingOriginal {...props} />
}

export const BusinessProductsListing = (props: BusinessProductsListingParams) => {
  const businessProductslistingProps = {
    ...props,
    isForceSearch: Platform.OS === 'ios',
    isApp: true,
    isFetchAllProducts: true,
    ignoreSlugToCompare: true,
    UIComponent: BusinessProductsListingUI
  }
  return (
    <BusinessAndProductList {...businessProductslistingProps} />
  )
}
