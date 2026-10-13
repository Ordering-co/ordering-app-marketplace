import styled from 'styled-components/native'

export const BannerContainer = styled.View`
  position: absolute;
  bottom: 90px;
  right: 10px;
  left: 10px;
  z-index: 99999;
  elevation: 99999;
  background-color: ${(props: any) => props.theme?.colors?.primary || '#2C7BE5'};
  padding: 24px;
  border-radius: 12px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 10px;
`

export const BannerContent = styled.View`
  align-items: center;
`

export const BannerText = styled.Text`
  color: ${(props: any) => props.theme?.colors?.primaryContrast || '#FFF'};
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  margin-bottom: 16px;
`

export const BannerLink = styled.Text`
  color: ${(props: any) => props.theme?.colors?.primaryContrast || '#FFF'};
  text-decoration-line: underline;
`

export const BannerActions = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
`

export const OptOutButton = styled.TouchableOpacity`
  padding: 10px 16px;
`

export const AcceptButton = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme?.colors?.primaryContrast || '#FFF'};
  border-radius: 8px;
  padding: 10px 28px;
`

export const OptOutButtonText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${(props: any) => props.theme?.colors?.primaryContrast || '#FFF'};
  text-decoration-line: underline;
`

export const AcceptButtonText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${(props: any) => props.theme?.colors?.primary || '#2C7BE5'};
`
