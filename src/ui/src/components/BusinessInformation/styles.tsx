import styled from 'styled-components/native'
import { OText } from '@ui';

export const BusinessInformationContainer = styled.View`
  width: 100%;
  height: 100%;
`
export const GrayBackground = styled.View`
  margin-top: 27px;
`
export const WrapMainContent = styled.ScrollView``

export const MediaWrapper = styled.ScrollView`
  margin-top: 10px;
  height: 127px;
`
export const InnerContent = styled.View`
  padding: 20px;
`
export const WrapScheduleBlock = styled.View`
  margin: 20px 0;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  border-radius: 20px;
`
export const ScheduleBlock = styled.View`
	flex-direction: row;
	align-items: center;
`
export const WrapBusinessMap = styled.View`
  flex: 1;
  height: 135px;
  border-radius: 30px;
  margin-top: 20px;
  overflow: hidden;
`
export const DivideView = styled.View`
	height: 2px;
  margin-vertical: 20px;
	background-color: ${(props: any) => props.theme.colors.backgroundGray100};
`;

export const ScheduleContainer = styled.View``;

export const ScheduleCard = styled.View`
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  border-radius: 20px;
  padding: 20px;
  margin-top: 20px;
`;

export const DayRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding-vertical: 10px;
`;

export const DayText = styled(OText)`
  font-family: ${(props: any) => (props.isCurrentDay ? 'Poppins-Bold' : 'Poppins-Regular')};
`;

export const HoursText = styled(OText)`
  font-family: ${(props: any) => (props.isCurrentDay ? 'Poppins-Bold' : 'Poppins-Regular')};
`;
