import * as React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TemplateApp from './src/TemplateApp'
import { ProjectSetupGate } from './src/project-setup-gate'

const App = () => {
  return (
    <SafeAreaProvider>
      <ProjectSetupGate><TemplateApp /></ProjectSetupGate>
    </SafeAreaProvider>
  )
}

export default App
