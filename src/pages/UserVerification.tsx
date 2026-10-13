import React from 'react'
import { Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { UserVerification as UserVerificationController } from '@ui';
interface Props {
  navigation: any;
  route: any;
}

const UserVerification = (props: Props) => {
  const theme = useTheme()

  const UserVerificationView = styled(SafeAreaView)`
    flex: 1;
    background-color: ${theme.colors.backgroundPage};
    padding-top: ${Platform.OS === 'ios' ? '0px' : '20px'};
  `;

  return (
    <UserVerificationView>
      <UserVerificationController {...props} />
    </UserVerificationView>
  )
}

export default UserVerification
