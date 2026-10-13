import React from 'react';
import { StyleSheet, View } from 'react-native';
import uuid from 'react-native-uuid';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useLanguage, useSession, useOrder, useToast, useApi, ToastType, useConfig } from '@components';
import { OButton, OText, LanguageSelector } from '@ui';

import { resolveAppDesign } from '@/utils/appDesign'
import { BackgroundImage, SafeContainer, Title, TopContent, WrapperBtn } from './styles';
import { useUtilsHome } from './utils';
import { MawejaHome } from './layouts/Maweja';


export const Home = (props: any) => {
  const { onNavigationRedirect } = props;

  const theme = useTheme();
  const insets = useSafeAreaInsets()
  const [, t] = useLanguage();
  const [orderState, { handleOrderStateLoading }] = useOrder();
  const [ordering] = useApi()
  const [, { login }] = useSession()
  const [, { showToast }] = useToast()
  const [{ configs }] = useConfig()

  const isGuestCheckoutEnabled = configs?.guest_checkout_enabled?.value === '1'

  // Join fragments in code — never rely on spaces inside translated strings.
  const homeLead = t('HOME_TITLE', 'Shop').trim()
  const homeEasily = t('EASILY_QUICKLY', 'easily, quickly').trim()
  const homeAnd = t('AND', 'and').trim()
  const homeSecurely = t('SECURELY', 'securely').trim()
  const homePeriod = t('PERIOD', '.')
  const homeTitleLength = [homeLead, homeEasily, homeAnd, homeSecurely].join(' ').length

  const { fontSize, titleMarginTop, lineHeight } = useUtilsHome().getResponsiveSizes(homeTitleLength);

  const url = theme?.homepage_view?.components?.homepage_header?.components?.image

  const handleCreateGuestUser = async (values: any) => {
    try {
      await handleOrderStateLoading(true)
      const { content: { error, result } } = await ordering.users().save(values)
      if (!error) {
        await login({
          user: result,
          token: result.session?.access_token
        })
        onNavigationRedirect?.('BottomTab', { screen: 'Home' })
      } else {
        showToast(ToastType.Error, t('ERROR_CREATING_GUEST_USER', 'Error creating guest users'))
      }
      await handleOrderStateLoading(false)
    } catch (err) {
      await handleOrderStateLoading(false)
      showToast(ToastType.Error, t('ERROR_CREATING_GUEST_USER', 'Error creating guest users'))
    }
  }

  const handleUpdateGuest = async () => {
    const guestToken = uuid.v4()
    if (guestToken) await handleCreateGuestUser({ guest_token: guestToken })
  }

  if (resolveAppDesign(theme) === 'maweja') {
    return (
      <MawejaHome
        onGuest={handleUpdateGuest}
        guestEnabled={isGuestCheckoutEnabled}
        loading={orderState?.loading}
        onNavigationRedirect={onNavigationRedirect}
        handleSuccessLogin={props.handleSuccessLogin}
        handleSuccessSignup={props.handleSuccessSignup}
        notificationState={props.notificationState}
      />
    )
  }

  return (
    <BackgroundImage
      source={url ? { uri: url } : theme.images.general.homeHero}
      resizeMode="cover"
    >
      <SafeContainer pt={insets.top || 20} pb={insets.bottom || 10}>
        <TopContent>
          <View style={{ width: '100%' }}>
            <LanguageSelector onNavigationRedirect={onNavigationRedirect} />
          </View>
          <Title
            color={theme.colors.white}
            size={fontSize}
            marginTop={titleMarginTop}
            style={{ lineHeight, width: '100%', paddingHorizontal: 4 }}
          >
            {`${homeLead} `}
            <OText color={theme.colors.white} size={fontSize} weight="bold" style={{ lineHeight }}>
              {homeEasily}
            </OText>
            {`\n${homeAnd} `}
            <OText color={theme.colors.white} size={fontSize} weight="bold" style={{ lineHeight }}>
              {homeSecurely}
            </OText>
            {homePeriod}
          </Title>
        </TopContent>

        {!orderState?.loading && (
          <WrapperBtn>
            <OButton
              text={t('LOG_IN', 'Log in')}
              style={styles.buttons}
              disabled={orderState?.loading}
              onClick={() => onNavigationRedirect('BottomTab', { screen: 'Home', params: { target: 'LOGIN' } })}
            />
            <OButton
              text={t('SIGN_UP', 'Sign up')}
              class='secondary'
              style={[styles.buttons, { borderColor: theme.colors.white }]}
              disabled={orderState?.loading}
              onClick={() => onNavigationRedirect('BottomTab', { screen: 'Home', params: { target: 'SIGNUP' } })}
            />
            {isGuestCheckoutEnabled && (
              <OButton
                text={t('GUEST', 'Guest')}
                class='third'
                style={styles.buttons}
                disabled={orderState?.loading}
                onClick={handleUpdateGuest}
              />
            )}
          </WrapperBtn>
        )}
      </SafeContainer>
    </BackgroundImage>
  );
};

const styles = StyleSheet.create({
  buttons: { marginVertical: 5 }
})

