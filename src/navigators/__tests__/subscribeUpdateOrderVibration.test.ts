import { subscribeUpdateOrderVibration } from '../subscribeUpdateOrderVibration'

function createFakeSocket () {
  const listeners: Record<string, Array<(value?: unknown) => void>> = {}

  return {
    on (event: string, fn: (value?: unknown) => void) {
      listeners[event] = listeners[event] || []
      listeners[event].push(fn)
    },
    off (event: string, fn: (value?: unknown) => void) {
      listeners[event] = (listeners[event] || []).filter((listener) => listener !== fn)
    },
    emit (event: string, value?: unknown) {
      ;(listeners[event] || []).forEach((fn) => fn(value))
    }
  }
}

describe('subscribeUpdateOrderVibration', () => {
  it('passes the same listener to socket.on and socket.off', () => {
    const socket = {
      on: jest.fn(),
      off: jest.fn()
    }

    const unsubscribe = subscribeUpdateOrderVibration(socket)
    unsubscribe()

    expect(socket.on).toHaveBeenCalledWith('update_order', expect.any(Function))
    expect(socket.off).toHaveBeenCalledWith('update_order', socket.on.mock.calls[0][1])
  })

  it('does not stack vibrations after unsubscribe and resubscribe', () => {
    const socket = createFakeSocket()
    const vibrate = jest.fn()

    const firstUnsubscribe = subscribeUpdateOrderVibration(socket, vibrate)
    firstUnsubscribe()
    subscribeUpdateOrderVibration(socket, vibrate)

    socket.emit('update_order', { status: 7 })

    expect(vibrate).toHaveBeenCalledTimes(1)
  })

  it('vibrates for delivered, driver almost arrived, and driver on the way', () => {
    const socket = createFakeSocket()
    const vibrate = jest.fn()
    subscribeUpdateOrderVibration(socket, vibrate)

    socket.emit('update_order', { status: 7 })
    socket.emit('update_order', { status: 11 })
    socket.emit('update_order', { status: 19 })
    socket.emit('update_order', { status: 4 })

    expect(vibrate).toHaveBeenCalledTimes(3)
  })
})
