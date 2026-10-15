import React from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { selectedProjectSettings as settings } from '../config'
import { isLocalSimulatorMode } from './ios-local-mode'
import { useLocalProjectSelection } from './local-project-selection'
import { localProjectBannerStyles as styles } from './project-setup-styles'

export const LocalProjectBanner = () => {
  const selection = useLocalProjectSelection()
  if (!selection || !settings.localSimulatorMode || !isLocalSimulatorMode()) return null
  return (
    <SafeAreaView edges={['top']} style={styles.header}>
      <Text style={styles.title}>Local simulator · {selection.project}</Text>
      {selection.franchiseSlug ? <Text style={styles.detail}>Franchise: {selection.franchiseSlug}</Text> : null}
    </SafeAreaView>
  )
}
