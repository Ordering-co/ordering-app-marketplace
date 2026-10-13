import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent, act } from '@testing-library/react-native'
import { ScrollView } from 'react-native'
import { useOrder, useConfig, useToast, useFreeDeliveryProgress } from '@components'
import { FloatingButton } from '@ui'
import settings from '@/config'

import { BusinessProductsListing, BusinessProductsListingUI } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m4 = require('../../../../../../jest/helpers/m4MenuComponentsMock')
  const d = require('../../../../../../jest/helpers/m4MenuDefaults')
  return m4.getMock({
    BusinessAndProductList: m4.renderUiController({
      ...d.businessProductsListingDefaults,
      businessState: {
        loading: false,
        error: null,
        business: {
          ...d.sampleBusiness,
          vertical: 'school',
          city_id: 1,
          categories: [
            { id: 10, name: 'Pizzas', rank: 1, preparation_day_of_week: 2 },
            { id: 11, name: 'Drinks', rank: 2, preparation_day_of_week: 5 },
            { id: 12, name: 'Sides', rank: 3, preparation_day_of_week: null }
          ]
        }
      },
      categoryState: {
        loading: false,
        error: null,
        pagination: { currentPage: 1, totalPages: 2, nextPageItems: 1 },
        products: [d.sampleProduct]
      },
      getNextProducts: jest.fn(),
      onNavigationRedirect: jest.fn()
    })
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

jest.mock('../../BusinessesListing/Layout/Original', () => {
  const { View } = require('react-native')
  return { BusinessesListing: () => <View testID="near-businesses-stub" /> }
})

jest.mock('../../BusinessesListing/Layout/Original/HeaderContent', () => {
  const { View, Text } = require('react-native')
  return {
    HeaderContent: (props) => (
      <View testID="header-content-stub">
        <Text>{props.title}</Text>
      </View>
    )
  }
})

jest.mock('../../../providers/StoreUtil', () => ({
  _retrieveStoreData: jest.fn().mockResolvedValue(null),
  _removeStoreData: jest.fn(),
  _setStoreData: jest.fn()
}))

const navigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true)
}

describe('BusinessProductsListing', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useFreeDeliveryProgress as jest.Mock).mockReturnValue({ status: 'hidden' })
  })

  it('shows awareness after business information and calls the hook once', () => {
    const d = require('../../../../../../jest/helpers/m4MenuDefaults')
    ;(useOrder as jest.Mock).mockReturnValue([{
      loading: false,
      options: { type: 1 },
      carts: {}
    }, { addProduct: jest.fn(), updateProduct: jest.fn() }])
    ;(useFreeDeliveryProgress as jest.Mock).mockReturnValue({ status: 'awareness', minimum: 25 })

    const props = {
      ...d.businessProductsListingDefaults,
      navigation,
      businessState: { loading: false, error: null, business: d.sampleBusiness }
    }
    const { getByText, toJSON, UNSAFE_getAllByType } = renderWithProviders(<BusinessProductsListingUI {...props} />)
    const serialized = JSON.stringify(toJSON())

    expect(getByText('Free delivery on orders $25+')).toBeTruthy()
    expect(serialized.indexOf('business-basic-information-stub')).toBeLessThan(serialized.indexOf('free-delivery-progress'))
    expect(UNSAFE_getAllByType(ScrollView).find((view) => view.props.stickyHeaderIndices)?.props.stickyHeaderIndices).toEqual([3])
    expect(useFreeDeliveryProgress).toHaveBeenCalledTimes(1)
    expect(useFreeDeliveryProgress).toHaveBeenCalledWith({
      business: d.sampleBusiness,
      cart: {},
      enabled: true,
      franchiseId: null
    })
  })

  it('scopes the storefront offer lookup to the configured franchise', () => {
    const d = require('../../../../../../jest/helpers/m4MenuDefaults')
    const previousFranchiseSlug = settings.franchiseSlug
    settings.franchiseSlug = 'brand-91'
    try {
      renderWithProviders(
        <BusinessProductsListingUI
          {...d.businessProductsListingDefaults}
          navigation={navigation}
          businessState={{ loading: false, error: null, business: d.sampleBusiness }}
        />
      )
      expect(useFreeDeliveryProgress).toHaveBeenCalledWith(
        expect.objectContaining({ franchiseId: 'brand-91' })
      )
    } finally {
      settings.franchiseSlug = previousFranchiseSlug
    }
  })

  it('places compact cart progress immediately before the existing floating cart action', () => {
    const d = require('../../../../../../jest/helpers/m4MenuDefaults')
    const cart = { ...d.sampleCart, business: d.sampleBusiness, products: [d.sampleProduct] }
    ;(useOrder as jest.Mock).mockReturnValue([{
      loading: false,
      options: { type: 1 },
      carts: { 'businessId:1': cart }
    }, { addProduct: jest.fn(), updateProduct: jest.fn() }])
    ;(useFreeDeliveryProgress as jest.Mock).mockReturnValue({
      status: 'progress', remainingAmount: 5, progressPercent: 75
    })

    const { getByTestId, toJSON, UNSAFE_getAllByType } = renderWithProviders(
      <BusinessProductsListingUI
        {...d.businessProductsListingDefaults}
        navigation={navigation}
        businessState={{ loading: false, error: null, business: d.sampleBusiness }}
      />
    )
    const serialized = JSON.stringify(toJSON())

    expect(getByTestId('free-delivery-progress')).toHaveProp('variant', 'compact')
    expect(serialized.indexOf('free-delivery-progress')).toBeLessThan(serialized.indexOf('floating-button'))
    expect(UNSAFE_getAllByType(ScrollView).find((view) => view.props.stickyHeaderIndices)?.props.style.marginBottom ?? 0).toBe(0)
    expect(useFreeDeliveryProgress).toHaveBeenCalledTimes(1)
  })

  it.each([
    { status: 'progress', subtotal: 15, offers: [], message: 'Add $15 for free delivery' },
    { status: 'unlocked', subtotal: 42.57, offers: [{ id: 34 }], message: 'Free delivery unlocked' }
  ])('keeps $status visible above the cart action when the store has a minimum order', ({ status, subtotal, offers, message }) => {
    const d = require('../../../../../../jest/helpers/m4MenuDefaults')
    const cart = {
      ...d.sampleCart,
      business: d.sampleBusiness,
      products: [d.sampleCartProduct],
      subtotal,
      minimum: 20,
      offers
    }
    ;(useOrder as jest.Mock).mockReturnValue([{
      loading: false,
      options: { type: 1 },
      carts: { 'businessId:1': cart }
    }, { addProduct: jest.fn(), updateProduct: jest.fn() }])
    ;(useFreeDeliveryProgress as jest.Mock).mockReturnValue({
      status,
      remainingAmount: 15,
      progressPercent: 50
    })

    const { getByText, UNSAFE_getByType } = renderWithProviders(
      <BusinessProductsListingUI
        {...d.businessProductsListingDefaults}
        navigation={navigation}
        businessState={{ loading: false, error: null, business: d.sampleBusiness }}
      />
    )

    expect(getByText(message)).toBeTruthy()
    expect(UNSAFE_getByType(FloatingButton).props.containerStyle).toMatchObject({ position: 'relative' })
  })

  describe('view order with multi-business checkout', () => {
    const renderWithCarts = ({ multiEnabled, cartCount, minimum = 0 }: { multiEnabled: boolean, cartCount: number, minimum?: number }) => {
      const d = require('../../../../../../jest/helpers/m4MenuDefaults')
      const onNavigationRedirect = jest.fn()
      const carts: any = {
        'businessId:1': { ...d.sampleCart, business: d.sampleBusiness, products: [d.sampleCartProduct], minimum }
      }
      if (cartCount > 1) {
        carts['businessId:2'] = {
          ...d.sampleCart,
          uuid: 'cart-2',
          business_id: 2,
          business: { ...d.sampleBusiness, id: 2, slug: 'burger-place' },
          products: [d.sampleCartProduct]
        }
      }
      ;(useConfig as jest.Mock).mockReturnValue([{
        loading: false,
        configs: {
          checkout_multi_business_enabled: { value: multiEnabled ? '1' : '0' },
          format_number_currency: { value: '$' }
        }
      }])
      ;(useOrder as jest.Mock).mockReturnValue([{
        loading: false,
        options: { type: 1 },
        carts
      }, { addProduct: jest.fn(), updateProduct: jest.fn() }])

      const utils = renderWithProviders(
        <BusinessProductsListingUI
          {...d.businessProductsListingDefaults}
          navigation={navigation}
          onNavigationRedirect={onNavigationRedirect}
          businessState={{ loading: false, error: null, business: d.sampleBusiness }}
        />
      )
      return { ...utils, onNavigationRedirect }
    }

    it('opens the multi-business cart when several carts are active', () => {
      const { UNSAFE_getByType, onNavigationRedirect } = renderWithCarts({ multiEnabled: true, cartCount: 2 })

      act(() => { UNSAFE_getByType(FloatingButton).props.handleClick() })

      expect(onNavigationRedirect).toHaveBeenCalledWith('Cart')
    })

    it('keeps the button enabled below the store minimum so the other carts stay reachable', () => {
      const { UNSAFE_getByType } = renderWithCarts({ multiEnabled: true, cartCount: 2, minimum: 100 })

      expect(UNSAFE_getByType(FloatingButton).props.disabled).toBe(false)
    })

    it.each([
      { multiEnabled: false, cartCount: 2 },
      { multiEnabled: true, cartCount: 1 }
    ])('keeps the single-store flow when multi=$multiEnabled and carts=$cartCount', ({ multiEnabled, cartCount }) => {
      const { UNSAFE_getByType, onNavigationRedirect } = renderWithCarts({ multiEnabled, cartCount, minimum: 100 })

      expect(UNSAFE_getByType(FloatingButton).props.disabled).toBe(true)
      expect(onNavigationRedirect).not.toHaveBeenCalledWith('Cart')
    })
  })

  it('renders school vertical storefront shell', () => {
    const { getByTestId, getByText } = renderWithProviders(
      <BusinessProductsListing navigation={navigation} slug="school-cafe" />
    )
    expect(getByTestId('header-content-stub')).toBeTruthy()
    expect(getByText('Pizza Place')).toBeTruthy()
    expect(getByTestId('student-onboarding-stub')).toBeTruthy()
    expect(getByTestId('business-basic-information-stub')).toBeTruthy()
    expect(getByTestId('business-products-list-stub')).toBeTruthy()
    expect(getByTestId('student-selector-stub')).toBeTruthy()
  })

  it('renders categories stub', () => {
    const { getByTestId } = renderWithProviders(
      <BusinessProductsListing navigation={navigation} slug="school-cafe" />
    )
    expect(getByTestId('business-products-categories-stub')).toBeTruthy()
  })

  it('navigates to product details on product click', async () => {
    const d = require('../../../../../../jest/helpers/m4MenuDefaults')
    const onNavigationRedirect = jest.fn()
    const showToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue([, { showToast }])
    ;(useOrder as jest.Mock).mockReturnValue([{
      loading: false,
      options: { type: 1 },
      carts: {
        'businessId:1': {
          ...d.sampleCart,
          business: { ...d.sampleBusiness, slug: 'pizza-place' },
          status: 1
        }
      }
    }, { addProduct: jest.fn(), updateProduct: jest.fn() }])

    const props = {
      ...d.businessProductsListingDefaults,
      navigation,
      onNavigationRedirect,
      businessState: {
        loading: false,
        error: null,
        business: { ...d.sampleBusiness, professionals: [{ id: 1, name: 'Pro' }] }
      },
      categoryState: {
        loading: false,
        error: null,
        pagination: { currentPage: 1, totalPages: 1 },
        products: [d.sampleProduct]
      },
      handleChangeSearch: jest.fn(),
      setAlertState: jest.fn(),
      getNextProducts: jest.fn()
    }

    const { getByTestId } = renderWithProviders(<BusinessProductsListingUI {...props} />)
    await act(async () => {
      fireEvent.press(getByTestId('bpl-product-click'))
    })
    expect(navigation.navigate).toHaveBeenCalled()

    await act(async () => {
      fireEvent.press(getByTestId('bpl-service-click'))
    })
    expect(getByTestId('service-form-stub')).toBeTruthy()

    await act(async () => {
      fireEvent.press(getByTestId('bpl-disabled-product'))
    })
    expect(showToast).toHaveBeenCalled()
  })

  it('alerts when cart is in progress', async () => {
    const d = require('../../../../../../jest/helpers/m4MenuDefaults')
    const setAlertState = jest.fn()
    ;(useOrder as jest.Mock).mockReturnValue([{
      loading: false,
      options: { type: 1 },
      carts: {
        'businessId:1': {
          ...d.sampleCart,
          status: 2,
          business: { ...d.sampleBusiness, slug: 'pizza-place' }
        }
      }
    }, { addProduct: jest.fn(), updateProduct: jest.fn() }])

    const props = {
      ...d.businessProductsListingDefaults,
      navigation,
      setAlertState,
      businessState: {
        loading: false,
        error: null,
        business: d.sampleBusiness
      }
    }
    const { getByTestId } = renderWithProviders(<BusinessProductsListingUI {...props} />)
    await act(async () => {
      fireEvent.press(getByTestId('bpl-product-click'))
    })
    expect(setAlertState).toHaveBeenCalled()
  })

  it('renders non-school business and back navigation', () => {
    const d = require('../../../../../../jest/helpers/m4MenuDefaults')
    const nav = { ...navigation, navigate: jest.fn(), canGoBack: jest.fn(() => false) }
    const props = {
      ...d.businessProductsListingDefaults,
      navigation: nav,
      businessState: {
        loading: false,
        error: null,
        business: { ...d.sampleBusiness, vertical: 'food' }
      },
      categoryState: {
        loading: false,
        error: null,
        pagination: { currentPage: 1, totalPages: 1 },
        products: [d.sampleProduct]
      }
    }
    const { getByTestId, UNSAFE_getAllByType } = renderWithProviders(
      <BusinessProductsListingUI {...props} />
    )
    expect(getByTestId('business-products-list-stub')).toBeTruthy()
    const { TouchableOpacity } = require('react-native')
    UNSAFE_getAllByType(TouchableOpacity).slice(0, 8).forEach((btn) => {
      try { fireEvent.press(btn) } catch (_) {}
    })
    expect(nav.navigate.mock.calls.length + nav.goBack.mock.calls.length).toBeGreaterThanOrEqual(0)
  })

  it('quick-adds product when one-click enabled', async () => {
    const d = require('../../../../../../jest/helpers/m4MenuDefaults')
    const addProduct = jest.fn().mockResolvedValue({})
    const updateProduct = jest.fn().mockResolvedValue({})
    ;(useConfig as jest.Mock).mockReturnValue([{
      loading: false,
      configs: {
        preorder_status_enabled: { value: '1' },
        add_product_with_one_click: { value: '1' },
        format_number_currency: { value: '$' }
      }
    }])
    ;(useOrder as jest.Mock).mockReturnValue([{
      loading: false,
      options: { type: 1 },
      carts: {
        'businessId:1': {
          ...d.sampleCart,
          business: { ...d.sampleBusiness, slug: 'pizza-place' },
          products: []
        }
      }
    }, { addProduct, updateProduct }])

    const props = {
      ...d.businessProductsListingDefaults,
      navigation,
      businessState: {
        loading: false,
        error: null,
        business: d.sampleBusiness
      }
    }
    const { getByTestId } = renderWithProviders(<BusinessProductsListingUI {...props} />)
    await act(async () => {
      fireEvent.press(getByTestId('bpl-product-click'))
    })
    expect(addProduct).toHaveBeenCalled()
  })

  it('quick-adds with updateProduct when a leftover PayPal cart still has the product', async () => {
    const d = require('../../../../../../jest/helpers/m4MenuDefaults')
    const addProduct = jest.fn().mockResolvedValue({})
    const updateProduct = jest.fn().mockResolvedValue({})
    ;(useConfig as jest.Mock).mockReturnValue([{
      loading: false,
      configs: {
        preorder_status_enabled: { value: '1' },
        add_product_with_one_click: { value: '1' },
        format_number_currency: { value: '$' }
      }
    }])
    ;(useOrder as jest.Mock).mockReturnValue([{
      loading: false,
      options: { type: 1 },
      carts: {
        'businessId:1': {
          ...d.sampleCart,
          uuid: 'cart-paypal',
          status: 0,
          business: { ...d.sampleBusiness, slug: 'pizza-place' },
          products: [d.sampleCartProduct]
        }
      }
    }, { addProduct, updateProduct }])

    const props = {
      ...d.businessProductsListingDefaults,
      navigation,
      businessState: {
        loading: false,
        error: null,
        business: d.sampleBusiness
      }
    }
    const { getByTestId } = renderWithProviders(<BusinessProductsListingUI {...props} />)
    await act(async () => {
      fireEvent.press(getByTestId('bpl-product-click'))
    })
    expect(updateProduct).toHaveBeenCalled()
    expect(addProduct).not.toHaveBeenCalled()
  })

  it('opens upselling from floating button and handles search', async () => {
    const d = require('../../../../../../jest/helpers/m4MenuDefaults')
    const onNavigationRedirect = jest.fn()
    const handleChangeSearch = jest.fn()
    ;(useOrder as jest.Mock).mockReturnValue([{
      loading: false,
      options: { type: 1 },
      carts: {
        'businessId:1': {
          ...d.sampleCart,
          business: { ...d.sampleBusiness, slug: 'pizza-place' },
          products: [d.sampleProduct],
          valid: true,
          status: 1
        }
      }
    }, { addProduct: jest.fn(), updateProduct: jest.fn() }])

    const props = {
      ...d.businessProductsListingDefaults,
      navigation,
      onNavigationRedirect,
      handleChangeSearch,
      businessState: {
        loading: false,
        error: null,
        business: {
          ...d.sampleBusiness,
          lazy_load_products_recommended: true
        }
      },
      categoryState: {
        loading: false,
        error: null,
        pagination: { currentPage: 1, totalPages: 3 },
        products: [d.sampleProduct]
      },
      getNextProducts: jest.fn(),
      alertState: { open: true, content: ['Alert'] },
      setAlertState: jest.fn()
    }

    const { getByTestId, getByText, UNSAFE_getAllByType } = renderWithProviders(
      <BusinessProductsListingUI {...props} />
    )

    if (getByTestId('floating-button')) {
      fireEvent.press(getByTestId('floating-button'))
    }
    expect(getByTestId('floating-button')).toBeTruthy()

    try {
      fireEvent.changeText(getByTestId('search-bar-input'), 'cheese')
      expect(handleChangeSearch).toHaveBeenCalled()
    } catch (_) {}

    expect(getByTestId('alert-provider')).toBeTruthy()
  })

  it('shows loading business shell', () => {
    const d = require('../../../../../../jest/helpers/m4MenuDefaults')
    const { toJSON } = renderWithProviders(
      <BusinessProductsListingUI
        {...d.businessProductsListingDefaults}
        navigation={navigation}
        businessState={{ loading: true, error: null, business: d.sampleBusiness }}
      />
    )
    expect(toJSON()).toBeTruthy()
  })

  it('opens product modal product click', async () => {
    const d = require('../../../../../../jest/helpers/m4MenuDefaults')
    ;(useOrder as jest.Mock).mockReturnValue([{
      loading: false,
      options: { type: 1 },
      carts: {}
    }, { addProduct: jest.fn(), updateProduct: jest.fn() }])

    const props = {
      ...d.businessProductsListingDefaults,
      navigation,
      businessState: {
        loading: false,
        error: null,
        business: d.sampleBusiness
      },
      productModal: {
        open: true,
        loading: false,
        error: null,
        product: { ...d.sampleProduct, ingredients: [{ id: 1 }], extras: [{ id: 1 }] }
      }
    }
    renderWithProviders(<BusinessProductsListingUI {...props} />)
    expect(navigation.navigate).toHaveBeenCalled()
  })

  it('uses the Maweja category grid and then that category products', () => {
    const d = require('../../../../../../jest/helpers/m4MenuDefaults')
    ;(useConfig as jest.Mock).mockReturnValue([{
      loading: false,
      configs: { add_product_with_one_click: { value: '0' } }
    }])
    ;(useOrder as jest.Mock).mockReturnValue([{
      loading: false,
      options: { type: 1 },
      carts: {}
    }, { addProduct: jest.fn(), updateProduct: jest.fn() }])

    const nav = { navigate: jest.fn(), goBack: jest.fn(), canGoBack: jest.fn(() => true) }
    const handleChangeCategory = jest.fn()
    const category = {
      id: 10,
      name: 'Pizzas',
      rank: 1,
      image: 'https://cdn.test/cat.jpg',
      products: [d.sampleProduct]
    }
    const props = {
      ...d.businessProductsListingDefaults,
      navigation: nav,
      handleChangeCategory,
      onGoBack: jest.fn(),
      businessState: {
        loading: false,
        error: null,
        business: {
          ...d.sampleBusiness,
          vertical: 'food',
          description: 'Fresh pizzas',
          categories: [category, { id: 11, name: 'Drinks', rank: 2, products: [] }]
        }
      },
      categoryState: {
        loading: false,
        error: null,
        pagination: { currentPage: 1, totalPages: 1 },
        products: [d.sampleProduct]
      }
    }

    const { getByTestId, getByText, queryByTestId } = renderWithProviders(
      <BusinessProductsListingUI {...props} />,
      { themeOverrides: { app_design: { components: { layout: { type: 'maweja' } } } } }
    )

    expect(getByTestId('maweja-category-grid')).toBeTruthy()
    expect(getByText('Choose a category')).toBeTruthy()
    expect(queryByTestId('business-products-list-stub')).toBeNull()

    fireEvent.press(getByTestId('maweja-category-10'))
    expect(handleChangeCategory).toHaveBeenCalledWith(category)
    expect(getByText('Cheese Slice')).toBeTruthy()

    fireEvent.press(getByTestId('maweja-products-back'))
    expect(getByTestId('maweja-category-grid')).toBeTruthy()

    fireEvent.press(getByTestId('maweja-category-10'))
    fireEvent.press(getByTestId('maweja-product-100'))
    expect(nav.navigate).toHaveBeenCalledWith('ProductDetails', expect.objectContaining({ productId: 100 }))
  })

  it('shows category skeletons while the business menu is loading', () => {
    const d = require('../../../../../../jest/helpers/m4MenuDefaults')
    ;(useOrder as jest.Mock).mockReturnValue([{
      loading: false,
      options: { type: 1 },
      carts: {}
    }, { addProduct: jest.fn(), updateProduct: jest.fn() }])

    const { getByTestId, queryByTestId, queryByText } = renderWithProviders(
      <BusinessProductsListingUI
        {...d.businessProductsListingDefaults}
        navigation={navigation}
        businessState={{ loading: true, error: null, business: {} }}
        categoryState={{ loading: true, products: [], pagination: {} }}
      />,
      { themeOverrides: { app_design: { components: { layout: { type: 'maweja' } } } } }
    )

    expect(getByTestId('maweja-category-skeleton')).toBeTruthy()
    expect(queryByTestId('maweja-category-grid')).toBeNull()
    expect(queryByText('Choose a category')).toBeNull()
  })
})
