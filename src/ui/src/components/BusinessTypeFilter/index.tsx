import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';

import {
  CategoryItemContainer,
  CategoryName,
  CategoriesContainer,
  CategoryRowScrollView,
  CategoryCardContainer,
  CategoryCardName,
  IconWrapper
} from './styles';

import { BusinessTypeFilterParams } from '../../types';
import { BusinessTypeFilter as BusinessTypeFilterController, useLanguage } from '@components';
import { OButton, OIcon } from '@ui';

export const BusinessTypeFilterUI = (props: BusinessTypeFilterParams) => {
  const {
    typesState,
    currentTypeSelected,
    handleChangeBusinessType,
    setBusinessTypes,
    isSearchMode,
    filters,
    handleChangeFilters,
    layout
  } = props;

  const [, t] = useLanguage();
  const theme = useTheme();
  const isMaweja = layout === 'maweja'

  useEffect(() => {
    if (typesState?.types?.length > 0) {
      setBusinessTypes && setBusinessTypes(typesState?.types)
    }
  }, [typesState?.types]);

  const normalizeBusinessTypeKey = (name: string) =>
    String(name ?? '')
      .trim()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .toUpperCase()

  // Synthetic All uses id=null; some projects also ship an API type named "All" / "All :)".
  const isAllBusinessType = (type: any) => {
    if (type?.id == null) return true
    const raw = String(type?.name ?? '').trim()
    if (/^all\b/i.test(raw)) return true
    return normalizeBusinessTypeKey(raw) === 'ALL'
  }

  const getCategoryLabel = (type: any) => {
    // Always resolve via ALL — do not use BUSINESS_TYPE_ALL (some project
    // dictionaries store "All :)" under that key and would overwrite "Todos").
    if (type?.id == null) {
      return t('ALL', type?.name || 'All')
    }
    if (isAllBusinessType(type)) {
      return t('ALL', 'All')
    }
    const keySuffix = normalizeBusinessTypeKey(type?.name)
    if (!keySuffix) return type?.name
    return t(`BUSINESS_TYPE_${keySuffix}`, type.name)
  }

  const categories = typesState?.types ?? [];
  // Gated per collection, not per item: defaultImage() always resolves, so a per-item
  // check would show the generic icon for every project (the regression).
  const hasCategoryImages = categories.some((type: any) => !!type?.image);
  const showTwoRows = hasCategoryImages && categories.length >= 10;
  const midPoint = Math.ceil(categories.length / 2);
  const row1Categories = showTwoRows ? categories.slice(0, midPoint) : categories;
  const row2Categories = showTwoRows ? categories.slice(midPoint) : [];

  const defaultImage = (name: string) => theme.images?.categories?.[name?.toLowerCase().replace(/ /g, '_')] ?? theme.images?.categories?.all;

  const handleChangeActiveBusinessType = (type: any) => {
    if (type?.id === null) {
      handleChangeFilters('business_types', [])
      return
    }
    if (filters?.business_types?.includes(type?.id)) {
      const arrayAux = [...(filters?.business_types ?? [])]
      const index = arrayAux.indexOf(type?.id)
      arrayAux.splice(index, 1)
      handleChangeFilters('business_types', arrayAux)
    } else {
      handleChangeFilters('business_types', [...filters?.business_types, type?.id])
    }
  }

  const renderCategory = (item: any) => {
    const isSelected = currentTypeSelected === item?.id;
    return (
      <CategoryItemContainer
        key={item?.id ?? item?.name}
        onPress={() => handleChangeBusinessType(item?.id)}
        isSelected={isSelected}
        $maweja={isMaweja}
      >
        {isMaweja && !!item?.image && (
          <View style={{ marginRight: 6 }}>
            <OIcon url={item.image} width={16} height={16} />
          </View>
        )}
        <CategoryName isSelected={isSelected} $maweja={isMaweja} numberOfLines={1}>
          {getCategoryLabel(item)}
        </CategoryName>
      </CategoryItemContainer>
    );
  }

  const renderCategoryCard = (item: any) => {
    const isAllCategory = isAllBusinessType(item);
    const isSelected = currentTypeSelected === item?.id;
    const resolvedDefaultImage = defaultImage(item?.name);
    const hasImage = !!item?.image || !!resolvedDefaultImage;
    const label = getCategoryLabel(item);
    const longestWord = label.trim().split(/\s+/).reduce((a: string, b: string) => a.length >= b.length ? a : b, '');
    const slotInnerWidth = 50;
    const maxFontSizeByWord = Math.floor(slotInnerWidth / (longestWord.length * 0.55));
    const dynamicFontSize = Math.min(12, Math.max(8, maxFontSizeByWord));
    return (
      <CategoryCardContainer
        key={item?.id ?? item?.name}
        onPress={() => handleChangeBusinessType(item?.id)}
        isSelected={isSelected}
        $maweja={isMaweja}
        style={{
          ...((isAllCategory || !hasImage) && {
            justifyContent: 'center',
          })
        }}
      >
        {!isAllCategory && hasImage && (
          <IconWrapper testID='category-icon' $maweja={isMaweja} isSelected={isSelected}>
            <OIcon
              src={!item?.image ? resolvedDefaultImage : undefined}
              url={item?.image}
              width={isMaweja ? 64 : 56}
              height={isMaweja ? 64 : 56}
              borderRadius={isMaweja ? 18 : 30}
            />
          </IconWrapper>
        )}
        <CategoryCardName
          isSelected={isSelected}
          numberOfLines={3}
          ellipsizeMode='tail'
          align='center'
          style={{ fontSize: dynamicFontSize }}
        >
          {label}
        </CategoryCardName>
      </CategoryCardContainer>
    );
  }

  if (typesState?.loading) {
    return (
      <CategoriesContainer>
        <Placeholder Animation={Fade}>
          <CategoryRowScrollView>
            {[...Array(8)].map((_, i) => (
              <View key={i} style={{ marginRight: 8 }}>
                <PlaceholderLine style={{ width: 64 + (i % 3) * 16, height: 34, borderRadius: 20 }} />
              </View>
            ))}
          </CategoryRowScrollView>
        </Placeholder>
      </CategoriesContainer>
    );
  }

  if (typesState?.error || !typesState?.types || typesState?.types.length === 0) {
    return null;
  }

  if (isSearchMode) {
    return (
      <CategoriesContainer>
        <CategoryRowScrollView>
          {categories.map((type: any) => type.enabled && (
            <OButton
              key={type?.id}
              style={{ height: 32, paddingLeft: 0, paddingRight: 0, marginRight: 8 }}
              text={getCategoryLabel(type)}
              class={(filters?.business_types?.includes(type?.id) || (type?.id === null && filters?.business_types?.length === 0)) ? 'active' : 'fourth'}
              onClick={() => handleChangeActiveBusinessType(type)}
            />
          ))}
        </CategoryRowScrollView>
      </CategoriesContainer>
    );
  }

  return (
    <CategoriesContainer>
      <CategoryRowScrollView testID='category-row' isCardMode={!isMaweja && hasCategoryImages}>
        {(isMaweja ? categories : row1Categories).map(
          !isMaweja && hasCategoryImages ? renderCategoryCard : renderCategory
        )}
      </CategoryRowScrollView>
      {!isMaweja && showTwoRows && (
        <CategoryRowScrollView testID='category-row' isCardMode>
          {row2Categories.map(renderCategoryCard)}
        </CategoryRowScrollView>
      )}
    </CategoriesContainer>
  );
};

export const BusinessTypeFilter = (props: BusinessTypeFilterParams) => {
  const businessTypeFilterProps = {
    ...props,
    UIComponent: BusinessTypeFilterUI,
    businessTypes: props.businessTypes,
    defaultBusinessType: props.defaultBusinessType || null,
    onChangeBusinessType: props.handleChangeBusinessType,
  };

  return <BusinessTypeFilterController {...businessTypeFilterProps} />;
};
