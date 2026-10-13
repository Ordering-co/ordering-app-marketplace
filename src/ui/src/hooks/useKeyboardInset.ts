import { useEffect, useState } from 'react'
import { Keyboard, Platform } from 'react-native'

export const useKeyboardInset = () => {
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (Platform.OS !== 'ios') return undefined

    const showListener = Keyboard.addListener('keyboardWillShow', (event) => {
      setHeight(event.endCoordinates.height)
    })
    const hideListener = Keyboard.addListener('keyboardWillHide', () => {
      setHeight(0)
    })

    return () => {
      showListener.remove()
      hideListener.remove()
    }
  }, [])

  return height
}
