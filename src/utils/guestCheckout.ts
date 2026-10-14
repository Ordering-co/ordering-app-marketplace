const guestOrderTypes: Record<string, string> = {
  1: 'delivery',
  2: 'pickup',
  3: 'eatin',
  4: 'curbside',
  5: 'drivethru',
  6: 'seatdelivery',
  7: 'catering_delivery',
  8: 'catering_pickup'
}

export const isGuestCheckoutEnabled = (configs: any) => {
  const value = configs?.guest_checkout_enabled?.value
  return value === true || value === 1 || value === '1'
}

export const isGuestOrderTypeAllowed = (configs: any, orderType: number | string | undefined) => {
  const token = guestOrderTypes[String(orderType)]
  const value = configs?.allowed_order_types_guest_checkout?.value
  const entries = Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[|,]/) : []
  return !!token && entries.some(entry => typeof entry === 'string' && entry.trim() === token)
}

export const isGuestCheckoutAllowed = (configs: any, orderType: number | string | undefined) => (
  isGuestCheckoutEnabled(configs) && isGuestOrderTypeAllowed(configs, orderType)
)
