import React from 'react'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { useTheme } from 'styled-components/native';
import Foundation from 'react-native-vector-icons/Foundation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { NotFoundSourceParams } from '../../types'
import {
  NotFound,
  NotFoundImage,
  IconBadge
} from './styles'

import { OButton, OText } from '../shared'
import FastImage from 'react-native-fast-image';

export const NotFoundSource = (props: NotFoundSourceParams) => {
  const {
    hideImage,
    srcImage,
    content,
    subContent,
    iconName,
    btnTitle,
    btnStyle,
    conditioned,
    onClickButton,
    simple
  } = props

  const theme = useTheme();
  const { height } = useWindowDimensions();

  const styles = StyleSheet.create({
    productStyle: {
      width: '100%',
      height: height * 0.5
    }
  })

  return (
    <>
      <NotFound>
        {iconName && (
          <IconBadge>
            <Ionicons
              name={iconName}
              color={theme.colors.textSecondary}
              size={40}
            />
          </IconBadge>
        )}
        {!hideImage && !simple && !srcImage && !iconName && (
          <NotFoundImage>
            <Foundation
              name='page-search'
              color={theme.colors.primary}
              size={60}
              style={{ marginBottom: 10 }}
            />
          </NotFoundImage>
        )}
        {srcImage && (
          <FastImage
            style={styles.productStyle}
            source={srcImage}
            resizeMode={FastImage.resizeMode.contain}
          />
        )}
        {content && conditioned && <OText color={theme.colors.disabled} size={16} style={{ textAlign: 'center' }}>{content}</OText>}
        {content && !conditioned && (
          <OText
            color={theme.colors.black}
            size={iconName ? 18 : 16}
            weight={iconName ? '600' : 'normal'}
            style={{ textAlign: 'center' }}
          >
            {content}
          </OText>
        )}
        {subContent && (
          <OText color={theme.colors.textSecondary} size={14} style={{ textAlign: 'center', marginTop: 6 }}>
            {subContent}
          </OText>
        )}
        {!onClickButton && props.children && (
          props.children
        )}
        {onClickButton && (
          <View style={{ marginTop: 10, width: '100%' }}>
            <OButton
              style={{ width: '100%', height: 50, ...btnStyle }}
              onClick={() => onClickButton()}
              text={btnTitle}
            />
          </View>
        )}
      </NotFound>
    </>
  )
}
