import styled from 'styled-components/native'

export const Container = styled.View`
  display: flex;
  flex-direction: column;
`
export const ModalContainer = styled.ScrollView`
  padding: 0px 30px;
`
export const ContentWrapper = styled.View`
  align-items: center;
  width: 100%;
`
export const ModalTitle = styled.Text`
  font-family: Poppins;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  color: ${(props: any) => props.theme.colors.textGray};
  margin-bottom: 10px;
  text-align: center;
`
export const CurrentStatusRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
`
export const CurrentStatusText = styled.Text`
  font-family: Poppins;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  margin-left: 8px;
  color: ${(props: any) => props.theme.colors.textGray};
`
export const LastUpdate = styled.Text`
  font-family: Poppins;
  font-style: normal;
  font-size: 14px;
  color: ${(props: any) => props.theme.colors.textGray};
  margin-bottom: 20px;
  text-align: center;
`
export const LegendWrapper = styled.View`
  align-self: center;
`
export const StatusItemWrapper = styled.View`
  flex-direction: row;
  margin-bottom: 16px;
`
export const StatusText = styled.Text`
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  color: ${(props: any) => props.theme.colors.textGray};
`
export const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: center;
  width: 100%;
  margin-top: 30px;
`
export const ReloadButtonWrapper = styled.View`
  width: 60%;
`
export const connectionButtonStyle = { borderRadius: 8 }
