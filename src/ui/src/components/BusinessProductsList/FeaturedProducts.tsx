import React from 'react'
import { View, ScrollView, Dimensions } from 'react-native'

import { useLanguage } from '@components'
import { OText, SingleProductCard } from '@ui'

export const FeaturedProducts = (props: any) => {
  const {
    businessId,
    categoryState,
    onProductClick,
    handleOnLayout,
    handleUpdateProducts,
    currentCart,
    navigation,
    businessSingleId
  } = props;

  const { width } = Dimensions.get('window');
  const [, t] = useLanguage();

  const featuredProducts = categoryState?.products?.length > 0
    ? categoryState?.products
      ?.filter((product: any) => product.featured)
      ?.sort((a: any, b: any) => a.rank - b.rank)
    : []

  return (
    <View>
      <OText size={20} weight={'bold'}>
        {t('FEATURED_ITEMS', 'Featured items')}
      </OText>
      <ScrollView
        horizontal
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {featuredProducts.map((product: any, i: any) => (
          <View
            key={'feat_' + product.id + `_${i}`}
            onLayout={(event: any) => handleOnLayout(event, 'featured')}
            style={{ width: width * 0.35, paddingVertical: 20, marginRight: 20 }}
          >
            <SingleProductCard
              isFeatured
              isSoldOut={product.inventoried && !product.quantity}
              product={product}
              businessId={businessId}
              categoryState={categoryState}
              onProductClick={onProductClick}
              handleUpdateProducts={handleUpdateProducts}
              productAddedToCartLength={currentCart?.products?.reduce((productsLength: number, Cproduct: any) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0)}
              navigation={navigation}
              businessSingleId={businessSingleId}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
