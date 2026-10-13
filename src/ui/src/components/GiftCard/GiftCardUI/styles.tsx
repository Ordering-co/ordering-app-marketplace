import styled from 'styled-components/native'
import LinearGradient from 'react-native-linear-gradient'

export const Container = styled.View`
  width: 100%;
  padding: 20px;
`

export const HeroCard = styled(LinearGradient).attrs((props: any) => ({
  colors: [props.theme.colors.active, props.theme.colors.green],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 }
}))`
  border-radius: 16px;
  padding: 22px;
  min-height: 210px;
  overflow: hidden;
  justify-content: space-between;
`

export const HeroChip = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 6px 14px;
  border-radius: 20px;
`

export const HeroWatermark = styled.View`
  position: absolute;
  right: -18px;
  bottom: -26px;
`

export const HeroTitleWrap = styled.View`
  margin-top: 12px;
`

export const Divider = styled.View`
  height: 1px;
  background-color: ${(props: any) => props.theme.colors.border};
  margin-vertical: 20px;
`
