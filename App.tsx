import * as React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TemplateApp from './src/TemplateApp'

const App = () => {
  return (
    <SafeAreaProvider>
      <TemplateApp />
    </SafeAreaProvider>
  )
}

export default App
