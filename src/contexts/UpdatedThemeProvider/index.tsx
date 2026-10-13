import React, { useMemo } from 'react'
import { ThemeProvider } from 'styled-components/native'
import { useOrderingTheme, createMergedTheme } from '@components'

const UpdatedThemeProvider = ({ children, theme }: any) => {
  const [orderingTheme] = useOrderingTheme()

  const themeUpdated = useMemo(() =>
    createMergedTheme(theme, orderingTheme, { isApp: true })
    , [theme, orderingTheme])

  return (
    <ThemeProvider theme={themeUpdated}>
      {children}
    </ThemeProvider>

  )
}

export default UpdatedThemeProvider
