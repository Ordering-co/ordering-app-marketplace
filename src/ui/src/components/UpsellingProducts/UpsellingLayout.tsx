import React from 'react'
import { useTheme } from 'styled-components/native';
import { Dimensions, View } from 'react-native'

import { UpsellingContainer } from './styles'

import { CustomItem } from '../SingleProductCard/CustomItem'

import { useUtils } from '@components'
import FastImage from 'react-native-fast-image';

export const UpsellingLayout = (props: any) => {
  const {
    upsellingProducts,
    productsList,
    onNavigationRedirect,
    business
  } = props

  const theme = useTheme()
  const [{ parsePrice }] = useUtils()

  const { width } = Dimensions.get('window')

  const handleFormProduct = (product: any) => {
    onNavigationRedirect && onNavigationRedirect('ProductDetails', {
      product: product,
      businessId: product?.api?.businessId,
      productId: product?.id,
      categoryId: product?.category_id,
      businessSlug: business.slug,
    })
  }

  return (
    <UpsellingContainer
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {!upsellingProducts.loading && !upsellingProducts.error && productsList.length > 0 && (
        productsList.map((product: any, i: number) => (
          <View
            key={`${product.id}_${i}`}
            style={{ width: width * 0.35, paddingVertical: 20, marginRight: 25 }}
          >
            <CustomItem
              isUpselling
              name={product?.name}
              image={product?.images ? {
                uri: product?.images,
                priority: FastImage.priority.normal,
              } : theme?.images?.dummies?.product}
              price={parsePrice(product?.price)}
              onClick={() => handleFormProduct(product)}
            />
          </View>
        ))
      )
      }
    </UpsellingContainer>
  )
}
