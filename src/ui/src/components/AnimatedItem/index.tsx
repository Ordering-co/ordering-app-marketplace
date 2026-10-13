import React, { useEffect, useRef } from 'react'
import { Animated } from 'react-native'

export const AnimatedItem = (props: any) => {
  const { index, item } = props
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 350,
      delay: index * 350,
      useNativeDriver: true
    }).start()
  }, [opacity])

  return (
    <Animated.View style={{ opacity }}>
      {item}
    </Animated.View>
  )
}
