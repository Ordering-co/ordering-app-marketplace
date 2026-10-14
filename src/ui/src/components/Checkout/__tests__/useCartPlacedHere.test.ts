import { AppState } from 'react-native'
import { act, renderHook } from '@testing-library/react-native'

import { useCartPlacedHere } from '../useCartPlacedHere'

describe('useCartPlacedHere', () => {
  let emitAppState: (state: string) => void
  const remove = jest.fn()

  beforeEach(() => {
    remove.mockClear()
    jest.spyOn(AppState, 'addEventListener').mockImplementation((_type: any, listener: any) => {
      emitAppState = listener
      return { remove } as any
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('is false for a cart that was already pending when the checkout opened', () => {
    const { result } = renderHook(() => useCartPlacedHere(false))
    expect(result.current).toBe(false)
  })

  it('stays true after the place ends, while the customer has not left the app', () => {
    const { result, rerender } = renderHook(({ placing }: { placing: boolean }) => useCartPlacedHere(placing), {
      initialProps: { placing: false }
    })

    rerender({ placing: true })
    expect(result.current).toBe(true)

    rerender({ placing: false })
    expect(result.current).toBe(true)

    act(() => emitAppState('inactive'))
    act(() => emitAppState('active'))
    expect(result.current).toBe(true)
  })

  it('ends when the customer comes back to the app from the gateway', () => {
    const { result, rerender } = renderHook(({ placing }: { placing: boolean }) => useCartPlacedHere(placing), {
      initialProps: { placing: true }
    })
    rerender({ placing: false })

    act(() => emitAppState('inactive'))
    act(() => emitAppState('background'))
    expect(result.current).toBe(true)

    act(() => emitAppState('active'))
    expect(result.current).toBe(false)
  })

  it('starts over when the cart is placed again from the same screen', () => {
    const { result, rerender } = renderHook(({ placing }: { placing: boolean }) => useCartPlacedHere(placing), {
      initialProps: { placing: true }
    })
    rerender({ placing: false })
    act(() => emitAppState('background'))
    act(() => emitAppState('active'))
    expect(result.current).toBe(false)

    rerender({ placing: true })
    rerender({ placing: false })
    expect(result.current).toBe(true)
  })

  it('stops listening to the app state on unmount', () => {
    const { unmount } = renderHook(() => useCartPlacedHere(false))
    unmount()
    expect(remove).toHaveBeenCalled()
  })
})
