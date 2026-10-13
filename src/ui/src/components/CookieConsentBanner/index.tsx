import React from 'react'
import { Linking } from 'react-native'
import { useCookieConsent } from '../../../../contexts/CookieConsentContext'
import { useLanguage } from '@components'
import {
  BannerContainer,
  BannerContent,
  BannerText,
  BannerLink,
  BannerActions,
  OptOutButton,
  AcceptButton,
  OptOutButtonText,
  AcceptButtonText
} from './styles'

export const CookieConsentBanner = () => {
  const { consentStatus, acceptConsent, optOutConsent, isConsentEnabled, loading } = useCookieConsent()
  const [, t] = useLanguage()

  if (loading || !isConsentEnabled || consentStatus !== 'unknown') return null

  const termsUrl = t('COOKIE_TERMS_URL', '/pages/terms_of_use')
  const privacyUrl = t('COOKIE_PRIVACY_URL', '/pages/privacy_policy')

  const handleLink = (url: string) => {
    if (/^https?:\/\//.test(url)) {
      Linking.openURL(url)
    }
  }

  return (
    <BannerContainer>
      <BannerContent>
        <BannerText>
          {t('COOKIE_CONSENT_MESSAGE', 'We use cookies and other tracking technologies to enhance your experience on our site. By continuing to use our site, you agree to our')}
          {' '}
          <BannerLink onPress={() => handleLink(termsUrl)}>
            {t('TERMS_OF_USE', 'Terms of Use')}
          </BannerLink>
          {' '}{t('AND', 'and')}{' '}
          <BannerLink onPress={() => handleLink(privacyUrl)}>
            {t('PRIVACY_POLICY', 'Privacy Policy')}
          </BannerLink>
        </BannerText>
        <BannerActions>
          <OptOutButton onPress={optOutConsent}>
            <OptOutButtonText>
              {t('COOKIE_OPT_OUT', 'Opt Out')}
            </OptOutButtonText>
          </OptOutButton>
          <AcceptButton onPress={acceptConsent}>
            <AcceptButtonText>
              {t('COOKIE_GOT_IT', 'Got it')}
            </AcceptButtonText>
          </AcceptButton>
        </BannerActions>
      </BannerContent>
    </BannerContainer>
  )
}
