import styled, { css } from 'styled-components/native'

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`

export const HeaderWrapper = styled.View`
  margin-bottom: 20px;
`

export const DayTabsRow = styled.View`
  flex-direction: row;
  padding-bottom: 4px;
`

export const DayTabCard = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-width: 120px;
  margin-right: 10px;
  padding: 12px 16px;
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  border-width: 1px;
  border-color: ${({ theme, active }: any) => (active ? theme.colors.primary : theme.colors.border)};
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`

export const DayTabLabels = styled.View`
  margin-right: 12px;
`

export const SectionWrapper = styled.View`
  margin-top: 28px;
`

export const OptionRow = styled.View`
  flex-direction: row;
  align-items: center;
  min-height: 56px;
  padding-vertical: 8px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
  ${({ disabled }: any) => disabled && css`
    opacity: 0.5;
  `}
`

export const OptionLabels = styled.View`
  flex: 1;
`

export const EmptyWrapper = styled.View`
  padding-vertical: 48px;
  align-items: center;
`

export const CancelButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  padding-vertical: 6px;
`
