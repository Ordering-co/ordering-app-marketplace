import { Vibration } from 'react-native'

const UPDATE_ORDER_VIBRATE_STATUSES = [7, 11, 19]

export function shouldVibrateOnOrderUpdate (value: unknown) {
  const status = value && typeof value === 'object'
    ? (value as { status?: unknown }).status
    : undefined
  return UPDATE_ORDER_VIBRATE_STATUSES.includes(status as number)
}

export function subscribeUpdateOrderVibration (
  socket: { on?: Function, off?: Function } | null | undefined,
  vibrate: () => void = () => Vibration.vibrate()
) {
  if (!socket || typeof socket.on !== 'function') return () => {}

  const onUpdateOrder = (value: unknown) => {
    if (shouldVibrateOnOrderUpdate(value)) vibrate()
  }
  socket.on('update_order', onUpdateOrder)

  return () => {
    if (typeof socket.off === 'function') {
      socket.off('update_order', onUpdateOrder)
    }
  }
}
