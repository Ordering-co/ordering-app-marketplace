import styled from 'styled-components/native';

export const CContainer = styled.View`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding: 5px 0px;
`

export const CCWrapper = styled.View`
  gap: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export const CCButton = styled.View`
  width: 100%;
  background-color: ${(props: any) => props.theme.colors.backgroundGray};
  padding: 10px;
  border-radius: 50px;
`

export const CouponEntryButton = styled.TouchableOpacity`
  align-items: center;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  border-color: ${(props: any) => props.theme.colors.border};
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  border-width: 1px;
  flex-direction: row;
  min-height: 64px;
  padding: 12px 14px;
  width: 100%;
`

export const CouponEntryIcon = styled.View`
  align-items: center;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  height: 40px;
  justify-content: center;
  margin-right: 12px;
  width: 40px;
`

export const CouponEntryContent = styled.View`
  flex: 1;
`
