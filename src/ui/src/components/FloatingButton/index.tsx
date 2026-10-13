import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native'

import { Container } from './styles'
import { FloatingButtonParams } from '../../types'
import { OButton } from '../shared'

export const FloatingButton = (props: FloatingButtonParams) => {
  const {
    text,
    loading,
    disabled,
    handleClick,
    hideBtn,
    text2nd,
    loading2nd,
    disabled2nd,
    classBtn,
    classBtn2,
    btnProps,
    secondElement,
    flexDirection = 'column',
    reverseOrder = false,
    handle2ndClick
  } = props

  const { bottom } = useSafeAreaInsets()
  const theme = useTheme()

  const isRow = flexDirection === 'row'
  const finalDirection: any = `${flexDirection}${reverseOrder ? '-reverse' : 'column'}`

  const buttonStyle = { flex: isRow ? 1 : 0, ...btnProps?.style }

  return (
    <Container
      style={{
        paddingBottom: bottom || 20,
        ...props.containerStyle
      }}>
      <View style={{
        width: '100%',
        ...(isRow && {
          flexDirection: finalDirection,
          gap: 10,
          alignItems: 'center'
        })
      }}>
        {!hideBtn && (
          <View style={{ flex: isRow ? 1 : 0, marginRight: isRow ? 5 : 0 }}>
            {!loading && (
              <OButton
                text={text}
                class={classBtn}
                style={buttonStyle}
                disabled={disabled}
                onClick={handleClick}
              />
            )}
            {loading && (
              <OButton loading={loading} text={text} class={classBtn} style={buttonStyle} />
            )}
          </View>
        )}
        {(text2nd || secondElement) && (
          <View style={{
            flex: isRow ? 1 : 0,
            marginLeft: isRow ? 5 : 0,
            paddingTop: isRow ? 0 : 10,
            width: isRow ? 'auto' : '100%'
          }}>
            {secondElement}
            {!loading2nd && !secondElement && (
              <OButton
                text={text2nd}
                class={classBtn2}
                disabled={disabled2nd}
                onClick={handle2ndClick}
              />
            )}
            {loading2nd && (
              <View
                style={{
                  height: 50,
                  justifyContent: 'center',
                  backgroundColor: theme.colors.red,
                  borderRadius: theme.utils.radius.l
                }}
              >
                <ActivityIndicator size='small' color={theme.colors.white} />
              </View>
            )}
          </View>
        )}
      </View>
    </Container>
  )
}
