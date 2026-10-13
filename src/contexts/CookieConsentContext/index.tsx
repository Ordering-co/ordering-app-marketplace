import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { _retrieveStoreData, _setStoreData } from '@ui'
import settings from '../../config'

const CONSENT_STORAGE_KEY = 'cookie_consent'
export const CURRENT_CONSENT_VERSION = '1.0'

const CookieConsentContext = createContext<any>(undefined)

const getStoredConsent = async () => {
  try {
    const data = await _retrieveStoreData(CONSENT_STORAGE_KEY)
    if (!data) return null
    if (data.version === CURRENT_CONSENT_VERSION && (data.status === 'accepted' || data.status === 'opted_out')) {
      return data
    }
  } catch (e) {}
  return null
}

const saveConsent = async (status: string) => {
  try {
    const data = {
      status,
      version: CURRENT_CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      acknowledged: true
    }
    await _setStoreData(CONSENT_STORAGE_KEY, data)
  } catch (e) {}
}

export const CookieConsentProvider = ({ children }: { children: React.ReactNode }) => {
  const [consentStatus, setConsentStatus] = useState('unknown')
  const [consentTimestamp, setConsentTimestamp] = useState<string | null>(null)
  const [isConsentEnabled, setIsConsentEnabled] = useState(() => !!(settings as any)?.cookie_consent_enabled)
  const [loading, setLoading] = useState(true)

  const fromServerRef = useRef(false)

  const hasConsented = !isConsentEnabled || consentStatus === 'accepted'

  useEffect(() => {
    const loadConsent = async () => {
      const data = await getStoredConsent()
      if (data) {
        setConsentStatus(data.status)
        setConsentTimestamp(data.timestamp || null)
      }
      setLoading(false)
    }
    loadConsent()
  }, [])

  const acceptConsent = useCallback(async () => {
    fromServerRef.current = false
    await saveConsent('accepted')
    setConsentStatus('accepted')
    setConsentTimestamp(new Date().toISOString())
  }, [])

  const optOutConsent = useCallback(async () => {
    fromServerRef.current = false
    await saveConsent('opted_out')
    setConsentStatus('opted_out')
    setConsentTimestamp(new Date().toISOString())
  }, [])

  const setConsentFromServer = useCallback(async (consentData: { status: string }) => {
    fromServerRef.current = true
    await saveConsent(consentData.status)
    setConsentStatus(consentData.status)
    setConsentTimestamp(new Date().toISOString())
  }, [])

  return (
    <CookieConsentContext.Provider value={{ consentStatus, consentTimestamp, hasConsented, acceptConsent, optOutConsent, isConsentEnabled, setIsConsentEnabled, loading, setConsentFromServer, isFromServer: fromServerRef }}>
      {children}
    </CookieConsentContext.Provider>
  )
}

export const useCookieConsent = () => {
  const ctx = useContext(CookieConsentContext)
  if (!ctx) {
    return { consentStatus: 'unknown', consentTimestamp: null, hasConsented: true, acceptConsent: () => {}, optOutConsent: () => {}, isConsentEnabled: false, setIsConsentEnabled: () => {}, loading: false, setConsentFromServer: () => {}, isFromServer: { current: false } }
  }
  return ctx
}
