import React from 'react'
import { StyleSheet } from 'react-native'
import FIcon from 'react-native-vector-icons/Feather'
import { useTheme } from 'styled-components/native'
import { SubCategoriesContainer, ContainerButton } from './styles'

import { useLanguage } from '@components'
import { OButton, OText } from '../../shared'

function SubcategoriesComponentPropsAreEqual(prev: any, next: any) {
  return prev.subcategoriesSelected === next.subcategoriesSelected &&
    prev.category === next.category
}

interface SubcategoriesComponentParams {
  subcategoriesSelected?: any,
  category?: any,
  onClickSubcategory: any
}

const SubcategoriesComponent = (props: SubcategoriesComponentParams) => {
  const {
    subcategoriesSelected,
    category,
    onClickSubcategory
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const allsubcategorySelected = !subcategoriesSelected?.some((subcategory: any) => category?.id === subcategory?.parent_category_id)

  const bpStyles = StyleSheet.create({
    categoryButtonStyle: {
      borderWidth: 0,
      borderRadius: 8,
      height: 35,
      minHeight: 35,
      padding: 0,
      paddingHorizontal: 8,
    }
  });


  return (
    <SubCategoriesContainer>
      <ContainerButton
        isSelected={allsubcategorySelected}
      >
        <OButton
          onClick={() => onClickSubcategory(null, category)}
          text={
            allsubcategorySelected
              ? <OText color='#FFF'>
                  {t('ALL', 'All')}{' '}
                  <FIcon name='x-circle' size={16} color={theme.colors.white} />
                </OText>
              : t('ALL', 'All')
          }
          style={bpStyles.categoryButtonStyle}
          textStyle={{ fontSize: 12, marginLeft: 0, marginRight: 0 }}
        />
      </ContainerButton>
      {category?.subcategories?.map((subcategory: any) => {
        const isSubcategorySelected = subcategoriesSelected?.find((_subcategory: any) => _subcategory?.id === subcategory?.id)
        return (
          <ContainerButton
            key={subcategory?.id}
            isSelected={isSubcategorySelected}
          >
            <OButton
              onClick={() => onClickSubcategory(subcategory, category)}
              text={
                isSubcategorySelected
                  ? <OText color='#FFF'>
                      {subcategory?.name}{' '}
                      <FIcon name='x-circle' size={16} color={theme.colors.white} />
                    </OText>
                  : subcategory?.name
              }
              style={bpStyles.categoryButtonStyle}
              textStyle={{ fontSize: 12, marginLeft: 0, marginRight: 0 }}
            />
          </ContainerButton>
        )
      }
      )}
    </SubCategoriesContainer>
  )
}

export const SubcategoriesComponentMemoized = React.memo(SubcategoriesComponent, SubcategoriesComponentPropsAreEqual)
