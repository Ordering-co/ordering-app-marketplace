import React, { useEffect, useState, useRef, useCallback } from 'react'
import { KeyboardAvoidingView, Keyboard, Platform, RefreshControl, ScrollView, StyleSheet, View, TextInput as RNTextInput } from 'react-native'
import { useTheme } from 'styled-components/native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

export const SafeAreaViewWrapper = (props: any) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const scrollRef = useRef<ScrollView>(null)
  const scrollOffsetY = useRef(0)

  useEffect(() => {
    if (Platform.OS !== 'android') return

    const showListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height)

      try {
        const focusedInput = (RNTextInput as any).State?.currentlyFocusedInput?.()
        if (!focusedInput || !scrollRef.current) return

        focusedInput.measureInWindow((_x: number, y: number, _w: number, h: number) => {
          const keyboardTop = e.endCoordinates.screenY
          const inputBottom = y + h

          if (inputBottom > keyboardTop - 20) {
            const scrollAmount = inputBottom - keyboardTop + 80
            scrollRef.current?.scrollTo?.({
              y: scrollOffsetY.current + scrollAmount,
              animated: true,
            })
          }
        })
      } catch {}
    })

    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0)
    })

    return () => {
      showListener.remove()
      hideListener.remove()
    }
  }, [])

  const handleScroll = useCallback((event: any) => {
    scrollOffsetY.current = event.nativeEvent.contentOffset.y
  }, [])

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.backgroundPage,
      paddingTop: props.pt ? insets.top : 0,
      paddingBottom: props.pb ? insets.bottom : 0
    }
  })

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: props.backgroundColor ?? theme.colors.backgroundPage }} edges={['left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {props.disableScrollView ? (
          <View style={[styles.container, { flex: 1 }]}>
            {props.children}
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps='handled'
            {...props.onRefresh && {
              refreshControl: (
                <RefreshControl
                  refreshing={props.refreshing}
                  onRefresh={props.onRefresh}
                />
              )
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              backgroundColor: theme.colors.backgroundPage,
              paddingTop: props.pt ? insets.top : 0,
              paddingBottom: props.pb ? insets.bottom : 0
            }}
          >
            {props.children}
            {Platform.OS === 'android' && keyboardHeight > 0 && (
              <View style={{ height: keyboardHeight }} />
            )}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
