import React from 'react'
import { View } from 'react-native'
import { OText } from '@ui'
import { AddressSuggestContainer } from './styles'

export const AddressMapBoxList = (props) => {
  const {
    mapBoxSuggests,
    retrieveSuggestResult,
    handleChangeAddressMapbox,
    onBlurInput,
    handleChangeInputAddress
  } = props

  const handleClick = (suggest: any) => {
    retrieveSuggestResult(suggest?.mapbox_id, handleChangeAddressMapbox)
    handleChangeInputAddress(suggest?.full_address || suggest?.name)
    onBlurInput()
  }

  return (
    <View>
      {mapBoxSuggests?.map((suggest: any) => (
        <AddressSuggestContainer
          key={suggest?.mapbox_id}
          onPress={() => handleClick(suggest)}
        >
          <OText
            color='#959595'
          >
            {suggest?.full_address || suggest?.name}
          </OText>
        </AddressSuggestContainer>
      ))}
    </View>
  )
}
