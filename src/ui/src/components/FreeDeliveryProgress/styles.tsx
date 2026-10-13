import styled from 'styled-components/native'

export const ProgressContainer = styled.View<{ variant: 'compact' | 'full' }>`
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  border-color: ${(props: any) => props.theme.colors.border};
  border-radius: 8px;
  border-width: 1px;
  margin: ${(props: any) => props.variant === 'compact' ? '0 20px 8px' : '12px 20px'};
  padding: ${(props: any) => props.variant === 'compact' ? '8px 12px' : '12px'};
`

export const MessageRow = styled.View`
  align-items: center;
  flex-direction: row;
`

export const MessageContent = styled.View`
  flex: 1;
`

export const ProgressTrack = styled.View`
  background-color: ${(props: any) => props.theme.colors.backgroundGray200};
  border-radius: 4px;
  height: 8px;
  margin-top: 8px;
  overflow: hidden;
  width: 100%;
`

export const ProgressFill = styled.View<{ progressPercent: number }>`
  background-color: ${(props: any) => props.theme.colors.active};
  border-radius: 4px;
  height: 8px;
  width: ${(props: any) => `${Math.max(0, Math.min(100, props.progressPercent))}%`};
`
