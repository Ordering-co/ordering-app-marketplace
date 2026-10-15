import { StyleSheet } from 'react-native'
import theme from '../theme.json'

// The setup gate mounts before TemplateApp's ThemeProvider, so use its existing source tokens.
export const localProjectBannerStyles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 10, backgroundColor: theme.colors.backgroundLight, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  title: { color: theme.colors.textNormal, fontSize: 14, fontWeight: '600' },
  detail: { color: theme.colors.textSecondary, fontSize: 12, marginTop: 4 }
})

export const projectSetupStyles = StyleSheet.create({
  preview: { flex: 1 },
  previewBody: { flex: 1 },
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: theme.colors.backgroundPage },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 16, color: theme.colors.textNormal },
  description: { fontSize: 16, marginBottom: 24, color: theme.colors.textSecondary }
})
