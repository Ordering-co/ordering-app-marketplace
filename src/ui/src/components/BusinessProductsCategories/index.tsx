import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components/native';

import { BusinessProductsCategoriesParams } from '../../types';
import { Tabs } from '../../Forms/Tabs'

import { BusinessProductsCategories as ProductsCategories } from '@components';

const BusinessProductsCategoriesUI = (props: any) => {
  const {
    categories,
    loading,
    scrollViewRef,
    productListLayout,
    categoriesLayout,
    selectedCategoryId,
    handlerClickCategory,
    lazyLoadProductsRecommended,
    setCategoryClicked,
    setSelectedCategoryId
  } = props;

  const theme = useTheme();

  const tabs = categories?.length > 0 ? categories.map((category: any) => ({
    id: category.id,
    tab: category.id,
    type: `cat_${category.id}`,
    text: category.name,
    enabled: true
  })) : []

  const handleCategoryScroll = (category: any) => {
    setCategoryClicked(true);
    setSelectedCategoryId(`cat_${category?.id}`);

    if (!lazyLoadProductsRecommended) {
      if (category?.id) {
        const layout = categoriesLayout[`cat_${category?.id}`]
        if (layout && productListLayout) {
          scrollViewRef?.current?.scrollTo?.({
            y: layout.y + productListLayout.y - 70,
            animated: true
          })
        }
      } else {
        if (productListLayout) {
          scrollViewRef?.current?.scrollTo?.({
            y: productListLayout.y - 70,
            animated: true
          })
        }
      }
    } else {
      handlerClickCategory(category)
    }
  }

  if (loading) return null

  return (
    <View style={{ paddingHorizontal: 20, backgroundColor: 'white', paddingBottom: 10 }}>
      <Tabs
        setFullItemAfterClick
        defaultTab={selectedCategoryId ?? `cat_null`}
        defaultTabs={tabs}
        bgColorSelected={theme.colors.active}
        textColorSelected={theme.colors.white}
        textColorUnselected={theme.colors.black}
        handleChangeTab={handleCategoryScroll}
      />
    </View>
  );
};

export const BusinessProductsCategories = (
  props: BusinessProductsCategoriesParams,
) => {
  const businessProductsCategoriesProps = {
    ...props,
    UIComponent: BusinessProductsCategoriesUI,
  };

  return <ProductsCategories {...businessProductsCategoriesProps} />;
};
