import React from 'react'
import { Image, Platform } from 'react-native'
import Svg, { Defs, LinearGradient, Stop, Path, Filter, FeGaussianBlur, G, Text } from 'react-native-svg'
import styled from 'styled-components/native'

const androidBorderColor = 'rgba(0, 0, 0, 0.1)';

export const OrderDetailsContainer = styled.ScrollView`
  flex: 1;
`

export const Header = styled.View`
  position: relative;
  border-radius: 20px;
  padding: ${({ theme }: any) => theme.utils.margins.horizontal}px;
  margin-horizontal: ${({ theme }: any) => theme.utils.margins.horizontal}px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  margin-bottom: 20px;
`

export const Separator = styled.View`
  height: 1px;
  background-color: ${(props: any) => props.theme.colors.border};
  margin-vertical: 20px;
`

export const WrapperPaymethods = styled.View`
  width: 100%;
  margin-top: 20px;
  border-width: 1px;
  border-radius: 10px;
  border-color: ${(props: any) => props.theme.colors.white};
`

export const PaymentMethodItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

export const PaymentMethodItemInfo = styled.View`
  flex-direction: row;
  align-items: center;
  padding-right: 40px;
  width: 60%;
`

export const PaymentMethodItemAmount = styled.View`
  width: 40%;
  justify-content: flex-end;
  flex-direction: row;
`

export const HeaderTitle = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

export const HelpBtn = styled.TouchableOpacity`
  padding: 5px;
  background-color: ${(props: any) => props.theme.colors.white};
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;

  /* iOS Shadow */
  ${Platform.OS === 'ios' ? `
    shadow-color: #000;
    shadow-offset: 0px 2px; /* x, y */
    shadow-opacity: 0.15;
    shadow-radius: 4px;
  ` : ''}

  /* Android Shadow */
  ${Platform.OS === 'android' ? `
    border-width: 1px;
    border-color: ${androidBorderColor};
  ` : ''}
`

export const Logo = styled.View`
  margin-right: 20px;
`

export const ProgressInfo = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const OrderContent = styled.View`
  margin-bottom: 150px;
`

export const WrapperOptions = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const WrapperActionBtns = styled.View`
  padding: 0 ${({ theme }: any) => theme.utils.margins.horizontal}px;
  flex-direction: column;
`

export const WrapperPhoto = styled.View`
  border-radius: 50px;
  background-color: ${({ theme }: any) => theme.colors.white};
  margin-right: 14px;
`

export const OrderBusiness = styled.View`
  position: relative;
  padding-vertical: 10px;
  padding-horizontal: 20px;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  align-items: flex-start;
`
export const Icons = styled.View`
  flex-direction: row;
  align-items: center;
  position: absolute;
  right: 0px;
  top: 0px;
  gap: 10px;
`

export const IconContainer = styled.TouchableOpacity`
  padding: 5px;
  background-color: ${(props: any) => props.theme.colors.white};
  border-radius: 10px;

  /* iOS Shadow */
  ${Platform.OS === 'ios' ? `
    shadow-color: #000;
    shadow-offset: 0px 2px; /* x, y */
    shadow-opacity: 0.15;
    shadow-radius: 4px;
  ` : ''}

  /* Android Shadow */
  ${Platform.OS === 'android' ? `
    border-width: 1px;
    border-color: ${androidBorderColor};
  ` : ''}
`

export const OrderInfo = styled.View`
  padding: 10px 0;
  flex: 1;
`

export const OrderData = styled.View``

export const OrderStatus = styled.View`
  padding: 20px;
  align-items: center;
  width: 35%;
  flex-wrap: wrap;
`

export const StaturBar = styled.View`
  margin: 20px 0;
`

export const StatusImage = styled.View``

export const SectionTitle = styled.View``

export const OrderSection = styled.View`
  padding-horizontal: ${({ noPadding, theme }: any) => noPadding ? 0 : theme.utils.margins.horizontal}px;
`

export const ProfessionalBlock = styled.View`
  border-bottom-color: ${({ theme }: any) => theme.colors.border};
  border-bottom-width: 1px;
  margin-vertical: 10px;
  padding-vertical: 5px;
`

export const WrapperFullTotal = styled.View`
  flex: 1;
  padding: 20px 0;
  margin-horizontal: ${({ theme }: any) => theme.utils.margins.horizontal}px;
  border-bottom-width: 5px;
  border-bottom-color: ${(props: any) => props.theme.colors.backgroundGray200};
`

export const OrderDriver = styled(OrderSection)`
`

export const Customer = styled.View`
  flex-direction: row;
  align-items: center;
`

export const CustomerPhoto = styled.View`
  margin-right: 20px;
`

export const InfoBlock = styled.View`
  flex: 1;
`

export const HeaderInfo = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  padding: 20px 20px;
`

export const OrderProducts = styled(OrderSection)``

export const Table = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  align-items: center;
  padding-bottom: ${(props: any) => props.pb ?? 10}px;
  background-color: ${(props: any) => props.hideBackground ? 'transparent' : props.theme.colors.backgroundGray100};
`

export const OrderBill = styled.View`
  padding-horizontal: ${({ theme }: any) => theme.utils.margins.horizontal}px;
  flex: 1;
`

export const Map = styled.View`
  width: 100%;
  height: 250px;
  margin-bottom: 20px;
  border-radius: 20px;
`

export const Divider = styled.View`
  border-color: #EAEAEA;
  border-width: 1px;
  margin-top: 5px;
  margin-bottom: 5px;
`
export const OrderAction = styled.View`
  flex-direction: row;
`

export const PlaceSpotWrapper = styled.View`
  padding-horizontal: ${({ theme }: any) => theme.utils.margins.horizontal}px;
`

export const ProfessionalPhoto = styled.ImageBackground`
  width: 100%;
  position: relative;
  max-height: 80px;
  height: 80px;
  width: 80px;
  resize-mode: cover;
  margin-right: 10px;
`;

export const TopActions = styled.TouchableOpacity`
	height: 60px;
	justify-content: center;
  min-width: 30px;
  padding-right: 15px;
`;

export const TopHeader = styled.View`
  padding: 20px;
`

export const BlockInfo = styled.View`
  padding: 10px;
  margin: 20px;
  border-width: 1px;
  border-color: ${({ theme }: any) => theme.colors.backgroundGray200};
  border-radius: 10px;
  flex-direction: row;
  margin-bottom: 20px;
`

export const WrapperAddress = styled.View`
  padding: 10px 0px;
  border-width: 1px;
  border-color: ${({ theme }: any) => theme.colors.white};
  border-radius: ${({ theme }: any) => theme.utils.radius.l}px;
`

export const DynamicProgressBarContainer = styled.View`
  width: 100%;
  position: relative;
`

export const Progress = styled.View`
  position: absolute;
  height: 100%;
  width: ${({ progress }: { progress: number }) => progress}%;
`

export const Section = styled.View`
  position: absolute;
  width: ${({ width }: { width: number }) => width}%;
  height: 100%;
  left: ${({ left }: { left: number }) => left}%;
  background-color: ${({ isFilled }: { isFilled: boolean }) =>
    isFilled ? '#E31837' : '#016491'
  };
`

const ProgressBarContainer = styled.View`
  width: 100%;
  height: 54px;
  margin: 5px 0;
`;

const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <ProgressBarContainer>
      <Svg width="100%" height="100%" viewBox="0 0 500 54">
        <Defs>
          {/* Red Gradient */}
          <LinearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" />
            <Stop offset="0.07" stopColor="#950D01" />
            <Stop offset="0.875" stopColor="#E31837" />
            <Stop offset="1" stopColor="#A95241" />
          </LinearGradient>

          {/* Blue Gradient */}
          <LinearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="-0.02" stopColor="#FFFFFF" />
            <Stop offset="0.085" stopColor="#377BAD" />
            <Stop offset="0.179" stopColor="#016491" />
            <Stop offset="0.767" stopColor="#016491" />
            <Stop offset="0.990" stopColor="#377BAD" />
            <Stop offset="1.02" stopColor="#FFFFFF" />
          </LinearGradient>

          {/* Glow Effect */}
          <Filter id="glow" x="-20%" y="-20%" width="120%" height="120%">
            <FeGaussianBlur in="SourceAlpha" stdDeviation="2" />
          </Filter>
        </Defs>

        {/* Background (rounded rectangle) */}
        <Path
          d="M27 0H473C487.912 0 500 12.088 500 27C500 41.912 487.912 54 473 54H27C12.088 54 0 41.912 0 27C0 12.088 12.088 0 27 0Z"
          fill="white"
          filter="url(#glow)"
        />

        {/* Sections */}
        <G>
          {/* Section 1 (Red) */}
          <Path
            d="M27 0H112L100 54H27C12.088 54 0 41.912 0 27C0 12.088 12.088 0 27 0Z"
            fill={`url(#${progress >= 0 ? 'redGradient' : 'blueGradient'})`}
          />

          {/* Section 2 */}
          <Path
            d="M100 0H212L200 54H103L115 0Z"
            fill={`url(#${progress >= 1 ? 'redGradient' : 'blueGradient'})`}
          />

          {/* Section 3 */}
          <Path
            d="M200 0H312L300 54H203L215 0Z"
            fill={`url(#${progress >= 2 ? 'redGradient' : 'blueGradient'})`}
          />

          {/* Section 4 */}
          <Path
            d="M300 0H412L400 54H303L315 0Z"
            fill={`url(#${progress >= 3 ? 'redGradient' : 'blueGradient'})`}
          />

          {/* Section 5 */}
          <Path
            d="M400 0H473C487.912 0 500 12.088 500 27C500 41.912 487.912 54 473 54H403L415 0Z"
            fill={`url(#${progress >= 4 ? 'redGradient' : 'blueGradient'})`}
          />

          {/* Numbers */}
          <Text x="50" y="34" fill="white" fontSize="24" textAnchor="middle">1</Text>
          <Text x="155" y="34" fill="white" fontSize="24" textAnchor="middle">2</Text>
          <Text x="255" y="34" fill="white" fontSize="24" textAnchor="middle">3</Text>
          <Text x="355" y="34" fill="white" fontSize="24" textAnchor="middle">4</Text>
          <Text x="450" y="34" fill="white" fontSize="24" textAnchor="middle">5</Text>
        </G>
      </Svg>
    </ProgressBarContainer>
  );
};

// Styled component for the number label (if you want to use regular Text instead of SVG Text)
const NumberLabel = styled.Text`
  color: white;
  font-size: 20px;
  text-align: center;
  text-shadow-color: rgba(0, 0, 0, 0.12);
  text-shadow-offset: 0px 4px;
  text-shadow-radius: 10px;
`;

export default ProgressBar;


// NEW STYLES ---------------------------------------

export const BusinessInfoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  padding: 16px;
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  margin-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const BusinessLogo = styled(Image)`
  width: 44px;
  height: 44px;
  margin-right: 12px;
  border-radius: 15px;
`;

export const BusinessTextContainer = styled.View`
  flex: 1;
`;

export const StatusCheckmark = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${(props: any) => props.theme.colors.active};
  justify-content: center;
  align-items: center;
  margin-left: 12px;
`;

export const ReviewSection = styled.View`
  padding-horizontal: ${({ theme }: any) => theme.utils.margins.horizontal}px;
`;

export const ReviewContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

export const StarsContainer = styled.View`
  flex-direction: row;
`;

export const StarButton = styled.TouchableOpacity`
  padding: 4px;
`;
