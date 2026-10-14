import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import SplashScreen from 'react-native-splash-screen'
import { LocalProjectBanner } from './onboarding/local-project-banner'
import { isLocalSimulatorMode } from './onboarding/ios-local-mode'
import { selectedProjectSettings as settings, setRuntimeFranchise } from './config'
import { prepareTenant, tenantIdentity, shouldRunProjectSetup } from './onboarding/tenant'
import { LocalProjectSelectionContext } from './onboarding/local-project-selection'

// Change this text for your first visible edit, then save with Fast Refresh enabled.
const setupTitle = 'Connect your Ordering project'

export const ProjectSetupGate = ({ children }: { children: React.ReactNode }) => {
  // A separate wrapper keeps hook order stable and never validates Release.
  if (!shouldRunProjectSetup(settings, { isDev: __DEV__, localSimulator: isLocalSimulatorMode() })) return <>{children}</>
  return <ValidatedProjectSetupGate>{children}</ValidatedProjectSetupGate>
}

const ValidatedProjectSetupGate = ({ children }: { children: React.ReactNode }) => {
  const [franchiseSlug, setFranchiseSlug] = useState<string | null>(null)
  const [readyIdentity, setReadyIdentity] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const identity = tenantIdentity(settings)
  useEffect(() => { SplashScreen.hide() }, [])
  useEffect(() => {
    let active = true
    setError('')
    prepareTenant(settings, { storage: AsyncStorage, isDev: __DEV__, isCurrent: () => active, requireFranchise: false })
      .then(value => {
        if (active && value.identity) {
          if (value.franchiseId) setRuntimeFranchise(value.franchiseId)
          setFranchiseSlug(value.franchiseSlug || null)
          setReadyIdentity(value.identity)
        }
      })
      .catch(reason => { if (active) setError(reason.message || 'Project validation failed. Run onboarding doctor.') })
    return () => { active = false }
  }, [identity, attempt])
  if (readyIdentity === identity) {
    if (!settings.localSimulatorMode || !isLocalSimulatorMode()) return <>{children}</>
    return (
      <LocalProjectSelectionContext.Provider value={{ project: settings.project, franchiseSlug }}>
      <View style={styles.preview}>
        <LocalProjectBanner />
        <View style={styles.previewBody}>{children}</View>
      </View>
      </LocalProjectSelectionContext.Provider>
    )
  }
  return (
    <View style={styles.container} accessibilityLabel="Ordering project setup">
      <Text style={styles.title}>{setupTitle}</Text>
      <Text style={styles.description}>{error || 'Checking public project configuration…'}</Text>
      {error ? <Button title="Retry validation" onPress={() => setAttempt(value => value + 1)} /> : <ActivityIndicator />}
    </View>
  )
}

const styles = StyleSheet.create({
  preview: { flex: 1 },
  previewBody: { flex: 1 },
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#ffffff' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 16, color: '#111111' },
  description: { fontSize: 16, marginBottom: 24, color: '#333333' }
})
