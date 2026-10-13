import styled, { css } from 'styled-components/native'

export const AddressFormContainer = styled.View`
  flex: 1;
  padding: ${(props: any) => props.theme.utils.margins.horizontal}px;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  justify-content: space-between;
`

export const TagContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`

export const TagItem = styled.TouchableOpacity`
  padding: 10px;
  border-radius: 15px;
  background-color: ${(props: any) => props.selected ? props.theme.colors.activeContrast : props.theme.colors.backgroundGray100};
`

export const AutocompleteInput = styled.View`
  z-index: 1000;
`

export const GoogleMapContainer = styled.View`
  flex: 1;
`

export const FormInput = styled.View`
  display: flex;
  flex-direction: column;
`
