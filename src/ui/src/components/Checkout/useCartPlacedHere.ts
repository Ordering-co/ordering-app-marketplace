import { useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'

/**
 * True for a cart placed from this screen until the customer leaves the app.
 * A redirect gateway opens outside the app, so the cart is already pending while
 * the customer is still on their way to pay: releasing it is only for someone who came back.
 */
export const useCartPlacedHere = (placing: boolean) => {
  const [isPlacedHere, setIsPlacedHere] = useState(!!placing)
  const wasInBackground = useRef(false)

  useEffect(() => {
    if (!placing) return
    wasInBackground.current = false
    setIsPlacedHere(true)
  }, [placing])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background') {
        wasInBackground.current = true
        return
      }
      if (nextAppState === 'active' && wasInBackground.current) {
        wasInBackground.current = false
        setIsPlacedHere(false)
      }
    })
    return () => subscription.remove()
  }, [])

  return isPlacedHere
}
