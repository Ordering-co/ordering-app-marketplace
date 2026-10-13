import React from 'react'
import { ScrollView, Dimensions } from 'react-native'
import { ListWrapper } from './styles'

import { PreviousProductsOrderedParams } from '../../../types'
import { SingleProductCard } from '../../SingleProductCard'

export const PreviousProductsOrdered = (props: PreviousProductsOrderedParams) => {
  const {
    products,
    fullWidth,
    onProductClick,
    handleUpdateProducts,
    isBusinessesSearchList
  } = props

  const windowWidth = Dimensions.get('window').width;

  const ProductList = () => {
    return (
      <>
        {products?.filter((product: any) => product?.business?.available)?.map((product: any) => (
          <SingleProductCard
            key={product?.id}
            isProductId
            isSoldOut={(product.inventoried && !product.quantity)}
            product={product}
            businessId={product?.business?.id}
            onProductClick={onProductClick}
            style={{ width: fullWidth ? '100%' : (windowWidth - (products?.length > 1 ? 120 : 80)), marginRight: 20 }}
            productAddedToCartLength={0}
            handleUpdateProducts={handleUpdateProducts}
          />
        ))}
      </>
    )
  }
  return (
    <ScrollView
      horizontal={isBusinessesSearchList}
      showsVerticalScrollIndicator={false}
    >
      {isBusinessesSearchList ? (
        <ProductList />
      ) : (
        <ListWrapper isBusinessesSearchList={isBusinessesSearchList}>
          <ProductList />
        </ListWrapper>
      )}
    </ScrollView>
  )
}
