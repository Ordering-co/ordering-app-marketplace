import styled from 'styled-components/native';

export const CContainer = styled.View`
  /* border-bottom: 1px solid #F0F0F0; */
`

export const OrderBill = styled.View`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 10px;
  background-color: #FFF;
`

export const CouponContainer = styled.View`
  width: 100%;
  margin: 10px;
`

export const CheckoutAction = styled.View`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`

export const Divider = styled.View`
  border-color: #EAEAEA;
  border-width: 1px;
  margin-top: 5px;
  margin-bottom: 10px;
`

export const DriverTipsContainer = styled.View`
  padding: 5px 0;
`

export const BillLabel = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  margin-right: 8px;
`

export const BillLabelText = styled.View`
  flex-shrink: 1;
`

export const BillAmount = styled.View`
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
`

export const BillToggle = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  margin-right: 8px;
`

export const BillToggleIcon = styled.View`
  margin-left: 6px;
  transform: ${(props: any) => props.open ? 'rotate(180deg)' : 'rotate(0deg)'};
`

export const BillInfoButton = styled.TouchableOpacity`
  margin-left: 3px;
  flex-shrink: 0;
`

export const BillStrikethrough = styled.View`
  margin-right: 6px;
`
