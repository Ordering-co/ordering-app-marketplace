import styled from 'styled-components/native'

import { themeBrandColor } from '@/utils/themeBrandColor'

const cardColor = (props: any) => props.theme.colors.backgroundCard || props.theme.colors.white

export const TrackCard = styled.View`
  margin: 0 20px 12px;
  border-radius: 18px;
  background-color: ${cardColor};
  overflow: hidden;
`

export const Hero = styled.View`
  margin: 0 20px 12px;
  border-radius: 22px;
  padding: 22px 18px 20px;
  background-color: ${(props: any) => props.$tone === 'success'
    ? (props.theme.colors.success || props.theme.colors.green)
    : themeBrandColor(props.theme)};
`

export const StepRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`

export const StepItem = styled.View`
  width: 72px;
  align-items: center;
`

export const StepCircle = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
`

export const Caption = styled.View`
  margin-top: 16px;
  padding-top: 12px;
  align-items: center;
  border-top-width: 1px;
  border-top-color: ${(props: any) => props.theme.colors.backgroundGray200 || props.theme.colors.border};
`
