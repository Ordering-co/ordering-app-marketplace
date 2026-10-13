const React = require('react')
const { View, TouchableOpacity, Text, TextInput } = require('react-native')

module.exports = {
  getUiMock: () => {
    const m3 = require('./m3DiscoveryUiMock').getUiMock()

    return {
      ...m3,
      ODropDown: (props) => (
        <View testID="odropdown">
          <Text>{props.placeholder}</Text>
          {(props.options || []).map((option, index) => (
            <TouchableOpacity
              key={`odropdown-${index}`}
              testID={`odropdown-option-${index}`}
              onPress={() => props.onSelect?.(option.value ?? option)}
            >
              <Text>{option.content || option.name || String(option)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ),
      BusinessProductsCategories: (props) => (
        <TouchableOpacity
          testID="business-products-categories-stub"
          onPress={() => props.handlerClickCategory?.({ id: 10, name: 'Pizzas' })}
        />
      ),
      BusinessProductsList: (props) => (
        <View testID="business-products-list-stub">
          <TouchableOpacity
            testID="bpl-product-click"
            onPress={() => props.onProductClick?.({
              id: 100,
              name: 'Cheese Slice',
              enabled: true,
              ingredients: [],
              extras: [],
              category_id: 10
            })}
          />
          <TouchableOpacity
            testID="bpl-service-click"
            onPress={() => props.onProductClick?.({
              id: 101,
              name: 'Haircut',
              type: 'service',
              enabled: true,
              ingredients: [{ id: 1 }],
              extras: [{ id: 1 }],
              category_id: 10
            })}
          />
          <TouchableOpacity
            testID="bpl-disabled-product"
            onPress={() => props.onProductClick?.({
              id: 102,
              name: 'Disabled',
              enabled: false,
              ingredients: [{ id: 1 }],
              extras: [],
              category_id: 10
            })}
          />
        </View>
      ),
      BusinessBasicInformation: () => <View testID="business-basic-information-stub" />,
      BusinessMenuList: (props) => (
        <View testID="business-menu-list-stub">
          <TouchableOpacity
            testID="business-menu-set"
            onPress={() => props.setMenu?.({
              id: 1,
              name: 'Lunch',
              schedule: Array.from({ length: 7 }, () => ({
                enabled: true,
                lapses: [{ open: { hour: 9, minute: 0 }, close: { hour: 22, minute: 0 } }]
              }))
            })}
          />
        </View>
      ),
      BusinessCart: (props) => (
        <TouchableOpacity
          testID="business-cart-stub"
          onPress={() => props.handleCartStoreClick?.(props.business)}
        >
          <Text>{props.business?.name || 'skeleton'}</Text>
        </TouchableOpacity>
      ),
      BusinessItemAccordion: (props) => (
        <View testID="business-item-accordion-stub">
          <Text>{props.cart?.business?.name}</Text>
          {props.children}
        </View>
      ),
      Cart: (props) => (
        <View testID="cart-stub">
          <Text>{props.cart?.business?.name || 'cart'}</Text>
        </View>
      ),
      ProductItemAccordion: (props) => (
        <View testID="product-item-accordion-stub">
          <Text>{props.product?.name}</Text>
          <TouchableOpacity
            testID="product-delete"
            onPress={() => props.onDeleteProduct?.(props.product)}
          />
        </View>
      ),
      ProductIngredient: (props) => (
        <TouchableOpacity testID="product-ingredient-stub" onPress={() => props.toggleSelect?.()}>
          <Text>{props.ingredient?.name}</Text>
        </TouchableOpacity>
      ),
      ProductOption: (props) => (
        <View testID="product-option-stub">
          <Text>{props.option?.name}</Text>
          {props.children}
        </View>
      ),
      ProductOptionSubOption: (props) => (
        <TouchableOpacity testID="product-option-suboption-stub" onPress={() => props.toggleSelect?.()}>
          <Text>{props.suboption?.name}</Text>
        </TouchableOpacity>
      ),
      CouponControl: () => <View testID="coupon-control-stub" />,
      UpsellingProducts: () => <View testID="upselling-products-stub" />,
      UpsellingRedirect: () => <View testID="upselling-redirect-stub" />,
      TaxInformation: () => <View testID="tax-information-stub" />,
      CartStoresListing: () => <View testID="cart-stores-listing-stub" />,
      CartStudentAlert: () => <View testID="cart-student-alert-stub" />,
      PlaceSpot: () => <View testID="place-spot-stub" />,
      MomentOption: () => <View testID="moment-option-stub" />,
      OrderItAgain: () => <View testID="order-it-again-stub" />,
      CategoryDescriptionMemoized: () => <View testID="category-description-stub" />,
      ProfessionalFilter: () => <View testID="professional-filter-stub" />,
      ServiceForm: () => <View testID="service-form-stub" />,
      StudentSelector: () => <View testID="student-selector-stub" />,
      StudentOnboardingPopup: () => <View testID="student-onboarding-stub" />,
      UserDetails: () => <View testID="user-details-stub" />,
      FloatingButton: (props) => (
        <TouchableOpacity testID="floating-button" onPress={props.handleClick}>
          <Text>{props.btnText || 'Go'}</Text>
        </TouchableOpacity>
      ),
      SearchBar: (props) => (
        <View testID="search-bar">
          <TextInput
            testID="search-bar-input"
            value={props.searchValue}
            onChangeText={props.onSearch}
            placeholder={props.placeholder}
          />
        </View>
      ),
      PageBanner: () => <View testID="page-banner-stub" />,
      SingleProductCard: (props) => (
        <TouchableOpacity
          testID="single-product-card"
          onPress={() => props.onProductClick?.(props.product)}
        >
          <Text>{props.product?.name}</Text>
        </TouchableOpacity>
      )
    }
  }
}
