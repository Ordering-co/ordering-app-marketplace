import React from 'react'
import { Platform, View } from 'react-native'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { ToastType, useConfig, useToast, useSession } from '@components'
import { FacebookLogin, GoogleLogin, AppleLogin } from '@ui'

import { UIButton } from './UIButton'
import { SkeletonWrapper } from './styles'

export const SocialButtons = (props: any) => {
  const {
    notificationState,
    setIsFBLoading,
    onHandleSuccess
  } = props

  const [{ configs }] = useConfig()
  const [, { showToast }] = useToast()
  const [, { login }] = useSession()

  const googleLoginEnabled = configs?.google_login_enabled?.value === '1' &&
    !!configs?.google_login_client_id?.value &&
    (Platform.OS === 'ios' ? !!configs?.google_login_ios_client_id?.value : true)

  const facebookLoginEnabled =
    configs?.facebook_login_enabled?.value === '1' &&
    configs?.facebook_id?.value

  const appleLoginEnabled = Platform.OS === 'ios' &&
    configs?.apple_login_enabled?.value === '1' &&
    !!configs?.apple_login_client_id?.value

  const handleSuccess = (user: any) => {
    login({ user, token: user.session.access_token })
    onHandleSuccess?.(user)
  }

  const vibrateApp = (impact?: any) => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    };
    ReactNativeHapticFeedback.trigger(impact || "impactLight", options);
  }

  return (
    <>
      {configs && Object.keys(configs).length > 0 ? (
        ((facebookLoginEnabled) ||
          (googleLoginEnabled) ||
          (appleLoginEnabled)) &&
        (
          <View style={{ marginTop: 10 }}>
            {facebookLoginEnabled && (
              <FacebookLogin
                UIButton={UIButton}
                notificationState={notificationState}
                handleErrors={(err: any) => { showToast(ToastType.Error, err), vibrateApp() }}
                handleLoading={(val: boolean) => setIsFBLoading(val)}
                handleSuccessFacebookLogin={handleSuccess}
              />
            )}
            {googleLoginEnabled && (
              <GoogleLogin
                UIButton={UIButton}
                notificationState={notificationState}
                webClientId={configs?.google_login_client_id?.value}
                iosClientId={configs?.google_login_ios_client_id?.value}
                handleErrors={(err: any) => { showToast(ToastType.Error, err), vibrateApp() }}
                handleLoading={(val: boolean) => setIsFBLoading(val)}
                handleSuccessGoogleLogin={handleSuccess}
              />
            )}
            {appleLoginEnabled && (
              <AppleLogin
                UIButton={UIButton}
                notificationState={notificationState}
                handleErrors={(err: any) => { showToast(ToastType.Error, err), vibrateApp() }}
                handleLoading={(val: boolean) => setIsFBLoading(val)}
                handleSuccessAppleLogin={handleSuccess}
              />
            )}
          </View>
        )
      ) : (
        <SkeletonWrapper>
          <Placeholder Animation={Fade}>
            <PlaceholderLine
              height={20}
              style={{ marginBottom: 15, marginTop: 10 }}
            />
            <PlaceholderLine
              height={50}
              style={{ borderRadius: 25, marginBottom: 25 }}
            />
          </Placeholder>
        </SkeletonWrapper>
      )}
    </>
  )
}
