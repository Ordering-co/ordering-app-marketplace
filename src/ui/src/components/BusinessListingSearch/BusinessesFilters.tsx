import React, { useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'styled-components/native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { MaxSectionItem } from './MaxSectionItem'

import {
  SortContainer,
  BrandContainer,
  BrandItem,
  PriceFilterWrapper,
  WrapperButtons,
  FiltersActionBar,
  FilterButton,
  PriceContainer,
  ClearButton,
  WrapperResults
} from './styles'

import { useLanguage, useOrder, useConfig } from '@components'
import { OButton, OText, OBottomPopup } from '../shared'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';


export const BusinessesFilters = (props: any) => {
  const {
    businessesSearchList,
    handleChangeFilters,
    brandList,
    filters,
    handleChangeBrandFilter,
    handleChangePriceRange,
    handleApplyFilters,
    clearFilters,
    termValue,
    paginationProps,
  } = props

  const theme = useTheme()
  const [orderState] = useOrder()
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const defaultFilters = {
    orderBy: 'distance',
    franchise_ids: [],
    price_level: null,
    business_types: [],
    max_delivery_price: null,
    max_eta: null,
    max_distance: null
  };

  const isFilterActive = (filterName: string) => {
    switch (filterName) {
      case 'sort':
        return filters.orderBy !== defaultFilters.orderBy;
      case 'brands':
        return filters.franchise_ids && filters.franchise_ids.length > 0;
      case 'price_range':
        return filters.price_level !== defaultFilters.price_level;
      case 'max_delivery_fee':
        return !!filters.max_delivery_price && filters.max_delivery_price !== 'default';
      case 'max_delivery_time':
        return !!filters.max_eta && filters.max_eta !== 'default';
      case 'max_distance':
        return !!filters.max_distance && filters.max_distance !== 'default';
      case 'business_categories':
        return filters.business_types && filters.business_types.length > 0;
      default:
        return false;
    }
  };

  const maxDeliveryFeeOptions = [15, 25, 35, 'default']
  const maxDistanceOptions = [1000, 2000, 5000, 'default']
  const maxTimeOptions = [5, 15, 30, 'default']
  const sortItems = [
    { text: t('PICKED_FOR_YOU', 'Picked for you (default)'), value: 'distance' },
    { text: t('DELIVERY_TIME', 'Delivery time'), value: 'delivery_time' },
    { text: t('PICKUP_TIME', 'Pickup time'), value: 'pickup_time' }
  ]
  const priceList = [
    { level: '1', content: '$' },
    { level: '2', content: '$$' },
    { level: '3', content: '$$$' },
    { level: '4', content: '$$$$' },
    { level: '5', content: '$$$$$' }
  ]
  const filterOptionsEnabled = configs?.filter_search_options?.value?.split('|') || []

  const styles = StyleSheet.create({
    priceItem: {
      minHeight: 40,
      height: 40,
      width: 40,
      borderRadius: 20,
      paddingVertical: 0,
      paddingHorizontal: 0,
      marginTop: 0,
      marginRight: 0,
      borderWidth: 0
    },
  });

  const openFilter = (filterName: string) => {
    setActiveFilter(filterName);
    setIsModalVisible(true);
  };

  const onApply = () => {
    handleApplyFilters();
    setIsModalVisible(false);
    setActiveFilter(null);
  }

  const onClear = () => {
    clearFilters();
    setIsModalVisible(false);
    setActiveFilter(null);
  }

  const getModalTitle = () => {
    switch (activeFilter) {
      case 'sort': return t('SORT', 'Sort');
      case 'brands': return t('BRANDS', 'Brands');
      case 'price_range': return t('PRICE', 'Price');
      case 'max_delivery_fee': return t('MAX_DELIVERY_FEE', 'Max delivery fee');
      case 'max_delivery_time': return orderState?.options?.type === 1 ? t('DELIVERY_TIME', 'Delivery time') : t('PICKUP_TIME', 'Pickup time');
      case 'max_distance': return t('MAX_DISTANCE', 'Max distance');
      default: return t('FILTERS', 'Filters');
    }
  }

  const filterButtons = [
    { name: 'sort', icon: 'funnel-outline', text: t('SORT', 'Sort'), enabled: filterOptionsEnabled.includes('sort') },
    { name: 'brands', icon: 'storefront-outline', text: t('BRANDS', 'Brands'), enabled: filterOptionsEnabled.includes('brands') },
    { name: 'price_range', icon: 'cash-outline', text: t('PRICE', 'Price'), enabled: filterOptionsEnabled.includes('price_range') },
    { name: 'max_delivery_fee', icon: 'bicycle-outline', text: t('DELIVERY_FEE', 'Delivery Fee'), enabled: orderState?.options?.type === 1 && filterOptionsEnabled.includes('max_delivery_fee') },
    { name: 'max_delivery_time', icon: 'time-outline', text: orderState?.options?.type === 1 ? t('DELIVERY_TIME', 'Delivery time') : t('PICKUP_TIME', 'Pickup time'), enabled: [1, 2].includes(orderState?.options?.type) && filterOptionsEnabled.includes('max_delivery_time') },
    { name: 'max_distance', icon: 'map-outline', text: t('DISTANCE', 'Distance'), enabled: filterOptionsEnabled.includes('max_distance') },
  ];

  const processedFilterButtons = filterButtons
    .filter(btn => btn.enabled)
    .map(btn => ({ ...btn, isActive: isFilterActive(btn.name) }))
    .sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0));

  const anyFilterIsActive = processedFilterButtons.some(btn => btn.isActive);
  const hasSearchTerm = termValue?.length >= 3;
  const showResultsCount = anyFilterIsActive || hasSearchTerm;

  return (
    <>
      {(!businessesSearchList?.loading || businessesSearchList?.businesses?.length > 0) && (
        <>
          <FiltersActionBar>
            {anyFilterIsActive && (
              <ClearButton onPress={onClear}>
                <OText weight={'bold'} color={theme.colors.primary}>
                  {t('CLEAR', 'Clear')}
                </OText>
              </ClearButton>
            )}
            {processedFilterButtons.map(btn => (
              <FilterButton key={btn.name} onPress={() => openFilter(btn.name)} isActive={btn.isActive}>
                <Icon name={btn.icon} size={16} color={btn.isActive ? theme.colors.active : theme.colors.black} />
                <OText style={{ color: btn.isActive ? theme.colors.active : theme.colors.black }}>
                  {btn.text}
                </OText>
              </FilterButton>
            ))}
          </FiltersActionBar>

          {showResultsCount && (
            <WrapperResults>
              <OText size={18} weight='bold'>
                {`${paginationProps?.totalItems ?? businessesSearchList?.businesses?.length} ${t('RESULTS', 'Results')}`}
              </OText>
            </WrapperResults>
          )}

          <OBottomPopup
            open={isModalVisible}
            transparent={true}
            onClose={() => setIsModalVisible(false)}
            title={getModalTitle()}
            titleStyle={{ textAlign: 'center', color: theme.colors.black }}
            closeIcon={theme.images.general.close}
            presentationStyle='overFullScreen'
          >
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
              {activeFilter === 'sort' && (
                <SortContainer>
                  {sortItems?.filter(item => !(orderState?.options?.type === 1 && item?.value === 'pickup_time') && !(orderState?.options?.type === 2 && item?.value === 'delivery_time'))?.map(item => (
                    <TouchableOpacity
                      key={item?.value}
                      onPress={() => handleChangeFilters('orderBy', item?.value)}
                      style={{ marginBottom: 7 }}
                    >
                      <OText
                        weight={filters?.orderBy?.includes(item?.value) ? 'bold' : '500'}
                        mBottom={filters?.orderBy?.includes(item?.value) ? 5 : 0}
                      >
                        {item?.text}  {(filters?.orderBy?.includes(item?.value)) && <>{filters?.orderBy?.includes('-') ? <AntDesignIcon color={theme.colors.active} name='caretup' /> : <AntDesignIcon color={theme.colors.active} name='caretdown' />}</>}
                      </OText>
                    </TouchableOpacity>
                  ))}
                </SortContainer>
              )}

              {activeFilter === 'brands' && (
                <BrandContainer>
                  {!brandList?.loading && !brandList?.error && brandList?.brands?.length > 0 && (
                    <ScrollView
                      style={{ maxHeight: 300, marginBottom: 10 }}
                      showsVerticalScrollIndicator={true}
                      nestedScrollEnabled={true}
                    >
                      {brandList?.brands.map((brand: any, i: number) => brand?.enabled && (
                        <BrandItem
                          key={brand.id}
                          onPress={() => handleChangeBrandFilter(brand?.id)}
                          active={filters?.franchise_ids?.includes(brand?.id)}
                        >
                          <OText style={{ flex: 1 }} color={filters?.franchise_ids?.includes(brand?.id) ? theme.colors.active : theme.colors.textNormal}>{brand.name}</OText>
                          {filters?.franchise_ids?.includes(brand?.id) && (
                            <MaterialCommunityIcons
                              name="checkbox-marked"
                              size={22}
                              color={theme.colors.active}
                            />)}
                        </BrandItem>
                      ))}
                    </ScrollView>
                  )}
                  {!brandList?.loading && ((brandList?.brands?.filter((brand: any) => brand?.enabled))?.length === 0) && (
                    <OText size={14} weight='400' style={{ marginBottom: 20 }}>{t('NO_RESULTS_FOUND', 'Sorry, no results found')}</OText>
                  )}
                </BrandContainer>
              )}

              {activeFilter === 'price_range' && (
                <PriceFilterWrapper>
                  <PriceContainer>
                    {priceList.map((price: any, i: number) => (
                      <OButton
                        key={i}
                        class={filters?.price_level === price?.level ? 'active' : 'fourth'}
                        onClick={() => handleChangePriceRange(price?.level)}
                        text={price.content}
                        style={styles.priceItem}
                        textStyle={{
                          fontSize: 11,
                          marginLeft: 0,
                          marginRight: 0,
                          color: filters?.price_level === price?.level ? theme.colors.active : theme.colors.textNormal
                        }}
                      />
                    ))}
                  </PriceContainer>
                </PriceFilterWrapper>
              )}

              {activeFilter === 'max_delivery_fee' && (
                <MaxSectionItem
                  filters={filters}
                  options={maxDeliveryFeeOptions}
                  filter='max_delivery_price'
                  handleChangeFilters={handleChangeFilters}
                />
              )}

              {activeFilter === 'max_delivery_time' && (
                <MaxSectionItem
                  filters={filters}
                  options={maxTimeOptions}
                  filter='max_eta'
                  handleChangeFilters={handleChangeFilters}
                />
              )}

              {activeFilter === 'max_distance' && (
                <MaxSectionItem
                  filters={filters}
                  options={maxDistanceOptions}
                  filter='max_distance'
                  handleChangeFilters={handleChangeFilters}
                />
              )}
            </ScrollView>
            <WrapperButtons>
              <View style={{ width: '100%', marginBottom: 10 }}>
                <OButton
                  text={t('VIEW_RESULTS', 'View results')}
                  onClick={onApply}
                />
              </View>
              <TouchableOpacity onPress={onClear} activeOpacity={1}>
                <OText weight={'bold'}>{t('RESET_FILTERS', 'Reset')}</OText>
              </TouchableOpacity>
            </WrapperButtons>
          </OBottomPopup>
        </>
      )}

      {businessesSearchList?.loading && (
        <>
          {[...Array(3).keys()].map(
            (_, i) => (
              <View key={`skeleton:${i}`} style={{ width: '100%', marginTop: 20 }}>
                <Placeholder key={i} style={{ paddingHorizontal: 5 }} Animation={Fade}>
                  <View style={{ flexDirection: 'row' }}>
                    <PlaceholderLine
                      width={24}
                      height={70}
                      style={{ marginRight: 10, marginBottom: 10 }}
                    />
                    <Placeholder style={{ paddingVertical: 10 }}>
                      <PlaceholderLine width={20} style={{ marginBottom: 25 }} />
                      <PlaceholderLine width={60} />
                    </Placeholder>
                  </View>
                </Placeholder>
                <Placeholder style={{ paddingHorizontal: 5, bottom: 10 }} Animation={Fade}>
                  <View style={{ flexDirection: 'row-reverse', overflow: 'hidden' }}>
                    <PlaceholderLine
                      width={24}
                      height={70}
                      style={{ marginRight: 10, marginBottom: 5 }}
                    />
                    <Placeholder style={{ paddingVertical: 10 }}>
                      <PlaceholderLine width={60} height={10} />
                      <PlaceholderLine width={50} height={10} />
                      <PlaceholderLine width={70} height={10} />
                    </Placeholder>
                  </View>
                </Placeholder>
              </View>
            ),
          )}
        </>
      )}
    </>
  )
}
