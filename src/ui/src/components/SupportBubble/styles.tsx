import styled from 'styled-components/native'

export const SUPPORT_BUBBLE_SIZE = 50
export const SUPPORT_BUBBLE_CLEARANCE = 88
export const WHATSAPP_BUBBLE_COLOR = '#25D366'

export const Bubble = styled.TouchableOpacity<{ bottom: number, $whatsapp?: boolean }>`
  position: absolute;
  z-index: ${(props: any) => props.theme.utils.zi.xxl};
  right: ${(props: any) => props.theme.utils.margins.horizontal}px;
  bottom: ${(props: { bottom: number }) => props.bottom}px;
  width: ${SUPPORT_BUBBLE_SIZE}px;
  height: ${SUPPORT_BUBBLE_SIZE}px;
  border-radius: ${SUPPORT_BUBBLE_SIZE / 2}px;
  align-items: center;
  justify-content: center;
  background-color: ${(props: any) => props.$whatsapp ? WHATSAPP_BUBBLE_COLOR : props.theme.colors.primary};
`
