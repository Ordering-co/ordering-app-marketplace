import React from 'react'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'

import { BContainer } from './styles'
import { BusinessesFilters } from './BusinessesFilters'
import { useLanguage } from '@components'
import {
  OText,
  SearchBar,
  NotFoundSource,
  BusinessTypeFilter
} from '@ui'

export const BusinessSearchHeader = (props: any) => {
  const {
    businessesSearchList,
    onChangeTermValue,
    termValue,
    handleChangeFilters
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const noResults = (!businessesSearchList.loading && !businessesSearchList.lengthError && businessesSearchList?.businesses?.length === 0)

  return (
    <BContainer>
      <SearchBar
        lazyLoad
        inputStyle={{ fontSize: 12, height: 44 }}
        placeholder={t('SEARCH_BUSINESSES', 'Search Businesses')}
        onSearch={(val: string) => onChangeTermValue(val)}
        searchValue={termValue}
        isCancelXButtonShow={termValue.length > 0}
      />
      <OText size={12} lineHeight={20} color={theme.colors.textThird} mLeft={5}>
        {t('TYPE_AT_LEAST_2_CHARACTERS', 'Type at least 2 characters')}
      </OText>

      <BusinessTypeFilter
        handleChangeBusinessType={(type: string) => handleChangeFilters('business_types', type ? [type] : [])}
      />

      <BusinessesFilters {...props} />

      {noResults && (
        <View>
          <NotFoundSource
            content={t('NOT_FOUND_BUSINESSES', 'No businesses to delivery / pick up at this address, please change filters or change address.')}
          />
        </View>
      )}
    </BContainer>
  )
}
