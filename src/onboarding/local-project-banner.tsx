import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { selectedProjectSettings as settings } from '../config'
import { isLocalSimulatorMode } from './ios-local-mode'
import { useLocalProjectSelection } from './local-project-selection'

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

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 10, backgroundColor: '#f0f4ea', borderBottomWidth: 1, borderBottomColor: '#dbe7d3' },
  title: { color: '#243022', fontSize: 14, fontWeight: '600' },
  detail: { color: '#3d4a3b', fontSize: 12, marginTop: 4 }
})
