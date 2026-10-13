import styled from 'styled-components/native'

import { themeBrandColor } from '@/utils/themeBrandColor'

export const Screen = styled.View`
  flex: 1;
  background-color: ${(props: any) => themeBrandColor(props.theme)};
`

export const Body = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  keyboardShouldPersistTaps: 'handled'
})`
  flex: 1;
`

export const Brand = styled.View`
  align-items: center;
  margin-top: 12px;
  margin-bottom: 20px;
`

export const LogoFrame = styled.View`
  width: 84px;
  height: 84px;
  border-radius: 22px;
  align-items: center;
  justify-content: center;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const Logo = styled.Image`
  width: 56px;
  height: 56px;
`

export const Card = styled.View`
  width: 100%;
  padding: 16px;
  border-radius: 28px;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const TabRow = styled.View`
  flex-direction: row;
  margin-bottom: 16px;
`

export const TabButton = styled.TouchableOpacity`
  flex: 1;
  height: 40px;
  margin-horizontal: 4px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background-color: ${(props: any) => props.$active ? themeBrandColor(props.theme) : props.theme.colors.backgroundGray200};
`

export const FieldWrap = styled.View`
  margin-bottom: 12px;
`

export const SwitchRow = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 18px;
`

export const GuestButton = styled.TouchableOpacity`
  height: 48px;
  width: 100%;
  margin-top: 28px;
  border-radius: 24px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.white};
`

export const GuestFill = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0.18;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const GuestLabel = styled.View`
  flex-direction: row;
  align-items: center;
`
