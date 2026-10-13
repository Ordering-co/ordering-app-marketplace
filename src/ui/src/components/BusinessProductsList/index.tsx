import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';

import { BusinessProductsListParams } from '../../types';
import { lightenDarkenColor, shape } from '../../utils'
import { SubcategoriesComponentMemoized } from './SubcategoriesComponent';
import { ProductsContainer, ErrorMessage, WrapperNotFound, RibbonBox, HeaderWrapper, CatWrap, CatIcon } from './styles';
import { FeaturedProducts } from './FeaturedProducts';

import { ProductsList, useLanguage, useUtils, useConfig } from '@components';
import {
  OIcon, OText,
  NotFoundSource,
  SingleProductCard,
  OrderItAgain,
  CategoryDescriptionMemoized
} from '@ui'

const BusinessProductsListUI = (props: BusinessProductsListParams) => {
  const {
    errors,
    businessId,
    category,
    categories,
    categoryState,
    onProductClick,
    featured,
    searchValue,
    isBusinessLoading,
    handleSearchRedirect,
    handleClearSearch,
    errorQuantityProducts,
    handleCancelSearch,
    categoriesLayout,
    setCategoriesLayout,
    currentCart,
    setSubcategoriesSelected,
    subcategoriesSelected,
    onClickCategory,
    lazyLoadProductsRecommended,
    handleUpdateProducts,
    previouslyProducts,
    isFiltMode,
    navigation,
    businessSingleId
  } = props;

  const [, t] = useLanguage();
  const [{ optimizeImage }] = useUtils()
  const [{ configs }] = useConfig()
  const theme = useTheme()
  const isUseParentCategory = configs?.use_parent_category?.value === 'true' || configs?.use_parent_category?.value === '1'
  const [openDescription, setOpenDescription] = useState<any>(null)
  const handleOnLayout = (event: any, categoryId: any) => {
    const layout = event?.nativeEvent?.layout
    if (!layout) return
    const categoryKey = 'cat_' + categoryId
    setCategoriesLayout((prev: any) => ({
      ...prev,
      [categoryKey]: layout
    }))
  }

  const onClickSubcategory = (subCategory: any, parentCategory: any) => {
    if (parentCategory && lazyLoadProductsRecommended) {
      onClickCategory(parentCategory)
    }
    if (!subCategory) {
      setSubcategoriesSelected?.(subcategoriesSelected.filter((_subcategory: any) => _subcategory?.parent_category_id !== parentCategory?.id))
      return
    }
    const categoryFounded = subcategoriesSelected.find((_subcategory: any) => subCategory?.id === _subcategory?.id)
    setSubcategoriesSelected?.(categoryFounded
      ? subcategoriesSelected.filter((_subcategory: any) => subCategory?.id !== _subcategory?.id)
      : [...subcategoriesSelected, subCategory]
    )
  }

  return (
    <ProductsContainer renderToHardwareTextureAndroid={categoryState.loading || isBusinessLoading}>
      <HeaderWrapper>
        {category?.subcategories?.length > 0 && (
          <SubcategoriesComponentMemoized
            category={category}
            subcategoriesSelected={subcategoriesSelected}
            onClickSubcategory={onClickSubcategory}
          />
        )}
      </HeaderWrapper>
      {previouslyProducts?.length > 0 && (
        <OrderItAgain
          onProductClick={onProductClick}
          productList={previouslyProducts}
          businessId={businessId}
          categoryState={categoryState}
          navigation={navigation}
          handleUpdateProducts={handleUpdateProducts}
          currentCart={currentCart}
          searchValue={searchValue}
          businessSingleId={businessSingleId}
        />
      )}
      {category.id &&
        categoryState.products
          ?.filter((product: any) =>
            !subcategoriesSelected.find((subcategory: any) => subcategory?.parent_category_id === category?.id) ||
            subcategoriesSelected?.some((subcategory: any) => subcategory.id === product?.category_id))
          ?.sort((a: any, b: any) => a.rank - b.rank)
          ?.map((product: any, i: number) => (
            <SingleProductCard
              key={'prod_' + product.id + `_${i}`}
              isSoldOut={product.inventoried && !product.quantity}
              product={product}
              businessId={businessId}
              categoryState={categoryState}
              onProductClick={() => onProductClick(product)}
              productAddedToCartLength={currentCart?.products?.reduce((productsLength: number, Cproduct: any) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0)}
              handleUpdateProducts={handleUpdateProducts}
              navigation={navigation}
              businessSingleId={businessSingleId}
            />
          ))
      }
      {!category.id && featured && (
        <FeaturedProducts
          businessId={businessId}
          categoryState={categoryState}
          currentCart={currentCart}
          navigation={navigation}
          businessSingleId={businessSingleId}
          onProductClick={onProductClick}
          handleOnLayout={handleOnLayout}
          handleUpdateProducts={handleUpdateProducts}
        />
      )}

      {!category?.id && categories.filter(category => category?.id !== null).map((category, i, _categories) => {
        const _products = !isUseParentCategory
          ? categoryState?.products?.filter((product: any) => product?.category_id === category?.id) ?? []
          : categoryState?.products?.filter((product: any) => category?.children?.some((cat: any) => cat.category_id === product?.category_id)) ?? []
        const products = subcategoriesSelected?.length > 0
          ? _products?.filter((product: any) =>
            !subcategoriesSelected.find((subcategory: any) => subcategory?.parent_category_id === category?.id) ||
            subcategoriesSelected?.some((subcategory: any) => subcategory.id === product?.category_id))
          : _products

        return (
          <React.Fragment key={'cat_' + category.id}>
            {products.length > 0 && (
              <>
                <CatWrap onLayout={(event: any) => handleOnLayout(event, category.id)}>
                  {!!category.image && (
                    <CatIcon>
                      <OIcon
                        url={optimizeImage(category.image, 'h_250,c_limit')}
                        width={41}
                        height={41}
                        style={{ borderRadius: 7.6 }}
                      />
                    </CatIcon>
                  )}
                  <OText preset="sectionTitle">
                    {category.name}
                  </OText>
                  {category?.ribbon?.enabled && (
                    <RibbonBox
                      bgColor={category?.ribbon?.color}
                      colorText={lightenDarkenColor(category?.ribbon?.color)}
                      borderRibbon={lightenDarkenColor(category?.ribbon?.color)}
                      isRoundRect={category?.ribbon?.shape === shape?.rectangleRound}
                      isCapsule={category?.ribbon?.shape === shape?.capsuleShape}
                    >
                      <OText
                        size={10}
                        weight={'400'}
                        color={lightenDarkenColor(category?.ribbon?.color) ? theme.colors.black : theme.colors.white}
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        lineHeight={13}
                      >
                        {category?.ribbon?.text}
                      </OText>
                    </RibbonBox>
                  )}
                </CatWrap>
                {category?.subcategories?.length > 0 && !isFiltMode && (
                  <SubcategoriesComponentMemoized
                    category={category}
                    subcategoriesSelected={subcategoriesSelected}
                    onClickSubcategory={onClickSubcategory}
                  />
                )}
                <>
                  {products?.sort((a: any, b: any) => a.rank - b.rank)?.filter((product: any, i: number) => (i < 9 && product?.category_id === category?.id) || !lazyLoadProductsRecommended)?.map((product: any, i: any) => (
                    <SingleProductCard
                      key={`${product?.id}_${i}`}
                      isSoldOut={product.inventoried && !product.quantity}
                      businessId={businessId}
                      product={product}
                      categoryState={categoryState}
                      onProductClick={onProductClick}
                      handleUpdateProducts={handleUpdateProducts}
                      navigation={navigation}
                      productAddedToCartLength={currentCart?.products?.reduce((productsLength: number, Cproduct: any) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0)}
                      businessSingleId={businessSingleId}
                    />
                  ))}
                  {lazyLoadProductsRecommended && !categoryState?.loading && products?.length > 9 && (
                    <SingleProductCard
                      useCustomFunctionality
                      onCustomClick={() => onClickCategory(category)}
                      handleUpdateProducts={handleUpdateProducts}
                      customText={t('MORE', 'More')}
                    />
                  )}
                </>
              </>
            )}
          </React.Fragment>
        );
      })}

      {(categoryState.loading || isBusinessLoading) && (
        <>
          {[...Array(categoryState?.pagination?.nextPageItems).keys()].map(
            (_, i) => (
              <View style={{ minHeight: 165, marginBottom: 28, padding: 12 }} key={i}>
                <Placeholder style={{ padding: 5 }} Animation={Fade}>
                  <View style={{ flexDirection: 'row' }}>
                    <Placeholder style={{ paddingVertical: 10, flex: 1 }}>
                      <PlaceholderLine width={60} style={{ marginBottom: 15 }} />
                      <PlaceholderLine width={20} />
                    </Placeholder>
                    <PlaceholderLine
                      width={24}
                      height={70}
                      style={{ marginLeft: 10, marginBottom: 10 }}
                    />
                  </View>
                  <PlaceholderLine
                    height={52}
                  />
                </Placeholder>
              </View>
            ),
          )}
        </>
      )}
      {!categoryState.loading &&
        !isBusinessLoading &&
        categoryState.products.length === 0 &&
        !errors &&
        !isFiltMode &&
        !(
          (searchValue && errorQuantityProducts) ||
          (!searchValue && !errorQuantityProducts)
        ) && (
          <WrapperNotFound>
            <NotFoundSource
              content={
                !searchValue
                  ? t(
                    'ERROR_NOT_FOUND_PRODUCTS_TIME',
                    'No products found at this time',
                  )
                  : t(
                    'ERROR_NOT_FOUND_PRODUCTS',
                    'No products found, please change filters.',
                  )
              }
              btnTitle={
                !searchValue
                  ? t('SEARCH_REDIRECT', 'Go to Businesses')
                  : t('CLEAR_FILTERS', 'Clear filters')
              }
              onClickButton={!businessSingleId ? () =>
                !searchValue
                  ? handleSearchRedirect && handleSearchRedirect()
                  : handleCancelSearch && handleCancelSearch()
                : null
              }
            />
          </WrapperNotFound>
        )}

      {errors &&
        errors.length > 0 &&
        errors.map((e: any, i: number) => (
          <ErrorMessage key={i}>
            <OText space>ERROR:</OText>
            <OText>{e}</OText>
          </ErrorMessage>
        ))}
      {!!openDescription && (
        <CategoryDescriptionMemoized
          openDescription={openDescription}
          setOpenDescription={setOpenDescription}
        />
      )}
    </ProductsContainer>
  );
};

export const BusinessProductsList = (props: BusinessProductsListParams) => {
  const businessProductsListProps = {
    ...props,
    UIComponent: BusinessProductsListUI,
  };

  return <ProductsList {...businessProductsListProps} />;
};
