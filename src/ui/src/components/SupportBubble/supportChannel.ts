export const whatsappUrl = (phone: unknown): string | null => {
  const digits = String(phone ?? '').replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : null
}

export type SupportAction = 'whatsapp' | 'intercom'

export const resolveSupportAction = ({
  whatsappEnabled,
  phone,
  intercomEnabled,
  hasConsented
}: {
  whatsappEnabled: boolean
  phone: unknown
  intercomEnabled: boolean
  hasConsented: boolean
}): SupportAction | null => {
  if (whatsappEnabled && whatsappUrl(phone)) return 'whatsapp'
  if (intercomEnabled && hasConsented) return 'intercom'
  return null
}
