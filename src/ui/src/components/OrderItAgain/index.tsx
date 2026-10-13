import React from 'react'
import moment from 'moment';
import { ScrollView, Dimensions } from 'react-native'

import { OrderItAgainParams } from '../../types'
import { Container, ProductWrapper } from './styles'

import { useLanguage } from '@components'
import { SingleProductCard, OText } from '@ui'

export const OrderItAgain = (props: OrderItAgainParams) => {
  const {
    onProductClick,
    productList,
    businessId,
    categoryState,
    currentCart,
    handleUpdateProducts,
    navigation,
    searchValue,
    businessSingleId
  } = props

  const [, t] = useLanguage()

  const { width } = Dimensions.get('window');
  const productsFilterd = productList?.length > 0 &&
    productList.filter((product: any) => !searchValue || product?.name?.toLowerCase()
      ?.includes(searchValue?.toLowerCase()))
      ?.sort((a: any, b: any) => moment(b?.last_ordered_date).valueOf() - moment(a?.last_ordered_date).valueOf())

  return (
    productsFilterd?.length > 0 ? (
      <Container>
        <OText size={20} weight='bold'>
          {t('ORDER_IT_AGAIN', 'Order it again')}
        </OText>
        <ScrollView
          horizontal
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {productsFilterd.map((product: any, i: number) => (
            <ProductWrapper key={'prod_' + product.id + `_${i}`} style={{ width: width * 0.5, marginRight: 20 }}>
              <SingleProductCard
                isPreviously
                isSoldOut={product.inventoried && !product.quantity}
                product={product}
                businessId={businessId}
                categoryState={categoryState}
                onProductClick={() => onProductClick(product)}
                productAddedToCartLength={currentCart?.products?.reduce?.((productsLength: number, Cproduct: any) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0)}
                handleUpdateProducts={handleUpdateProducts}
                navigation={navigation}
                businessSingleId={businessSingleId}
              />
            </ProductWrapper>
          ))}
        </ScrollView>
      </Container>
    ) : null
  )
}
