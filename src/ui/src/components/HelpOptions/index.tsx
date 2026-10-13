import React from 'react'
import { Dimensions } from 'react-native'
import { WebView } from 'react-native-webview'

import { Container } from './styles'
import { NotFoundSource } from '@ui'
import { useLanguage } from '@components'

const HEIGHT_SCREEN = Dimensions.get('screen').height

export const HelpOptions = (props: any) => {
  const { item } = props
  const [, t] = useLanguage()

  return (
    <Container showsVerticalScrollIndicator={false}>
      {!!item?.body && (
        <WebView
          originWhitelist={['*']}
          automaticallyAdjustContentInsets={false}
          source={{ html: item.body }}
          style={{ flex: 1, height: HEIGHT_SCREEN }}
        />
      )}
      {!item?.body && (
        <NotFoundSource
          simple
          content={t('NO_CONTENT_TO_SHOW', 'Nothing to show')}
        />
      )}
    </Container>
  )
}
