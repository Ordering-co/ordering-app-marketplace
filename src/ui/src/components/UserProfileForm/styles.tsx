import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native'

export const Container = styled.ScrollView`
  position: relative;
  flex: 1;
  padding-top: ${(props: any) => props.pdng};
  margin-bottom: 40px;
  padding-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
`

export const ProfileHeader = styled.View`
  margin-top: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  border-radius: 14px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  padding: 10px 15px;
`;

export const ProfilePictureContainer = styled.TouchableOpacity`
  position: relative;
`; ``

export const ProfileImage = styled(FastImage)`
  width: 60px;
  height: 60px;
  border-radius: 10px;
`;

export const EditIconWrapper = styled.View`
  position: absolute;
  bottom: 5px;
  right: 5px;
  border-radius: 12px;
`;

