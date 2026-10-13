import React, { useRef } from 'react'
import { Animated, Pressable, StyleProp, ViewStyle } from 'react-native'

type PressableScaleProps = {
  children: React.ReactNode
  onPress?: () => void
  testID?: string
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}

export const PressableScale = (props: PressableScaleProps) => {
  const { children, onPress, testID, disabled, style } = props
  const scale = useRef(new Animated.Value(1)).current

  const animateTo = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 50,
      bounciness: toValue === 1 ? 4 : 0
    }).start()
  }

  return (
    <Pressable
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => animateTo(0.97)}
      onPressOut={() => animateTo(1)}
      style={style}
    >
      {({ pressed }) => (
        <Animated.View style={{ transform: [{ scale }], opacity: pressed ? 0.82 : 1 }}>
          {children}
        </Animated.View>
      )}
    </Pressable>
  )
}
