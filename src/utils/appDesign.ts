export const APP_DESIGNS = ['original', 'maweja'] as const

export type AppDesign = typeof APP_DESIGNS[number]

type AppDesignTheme = {
  app_design?: {
    components?: {
      layout?: {
        type?: string
      }
    }
  }
} | null | undefined

export const resolveAppDesign = (theme: AppDesignTheme): AppDesign => {
  const value = theme?.app_design?.components?.layout?.type
  if (value === 'original' || value === 'maweja') {
    return value
  }
  return 'original'
}
