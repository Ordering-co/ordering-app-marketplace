import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';

export const ChContainer = styled.ScrollView`
  margin-bottom: 100px;
  padding-horizontal: 20px;
`

export const ChSection = styled.View`
	padding-top: 20px;
`

export const ChHeader = styled.View`
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  margin: 0px;
`

export const ChTotal = styled.View`
  background-color: ${(props: any) => props.theme.colors.inputDisabled};
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`

export const ChTotalWrap = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const ChAddress = styled.View`
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
  padding-bottom: 20px;
`

export const ChMoment = styled(ChAddress)`
  padding: 0 0 20px;
`

export const CHMomentWrapper = styled.TouchableOpacity`
	background-color: ${(props: any) => props.theme.colors.backgroundGray100};
	border-radius: 7.6px;
	font-size: 12px;
	max-width: 240px;
	height: 26px;
	align-items: center;
	justify-content: center;
	padding-horizontal: 8px;
	flex-direction: row;
	margin-end: 12px;
`

export const ChUserDetails = styled.View`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  padding-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
`

export const ChBusinessDetails = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
`

export const BusinessCopy = styled.View`
  flex: 1;
  margin-left: 10px;
`

export const ChPaymethods = styled.View`
  display: flex;
  flex-direction: column;
  padding: 0 0 20px;
`

export const ChDriverTips = styled(ChPaymethods)`
  padding-bottom: 0%;
`

export const ChCart = styled(ChPaymethods)``

export const WalletPaymentOptionContainer = styled(ChPaymethods)`
  padding-top: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
`

export const ChPlaceOrderBtn = styled.View`
  width: 100%;
  display: flex;
  justify-content: center;
`

export const ChErrors = styled.View`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`

export const DeliveryOptionsContainer = styled.View`
  padding-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
`

export const DeliveryOptionItem = styled.View`
  padding: 15px;
  border-radius: 15px;
  justify-content: ${(props: any) => props.center ? 'center' : 'space-between'};
  align-items: center;
  flex-direction: row;
  border-width: 1px;
  border-color: ${(props: any) => props?.active ? props.theme.colors.active : props.theme.colors.border};
  margin-bottom: 10px;
`;

export const CartHeader = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`

export const TopActions = styled.TouchableOpacity`
	height: 60px;
	justify-content: center;
  min-width: 30px;
  padding-right: 15px;
`;

export const TopHeader = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  height: 60px;
  min-height: 60px;
`

export const ProductImageIcon = styled(FastImage)`
  border-radius: 15px;
  width: 44px;
  height: 44px;
`

export const Divider = styled.View`
  height: 1px;
  background-color: ${(props: any) => props.theme.colors.border};
  margin-vertical: 16px;
`

export const DetailWrapper = styled.View`
  padding-horizontal: 20px;
  width: 100%;
`
