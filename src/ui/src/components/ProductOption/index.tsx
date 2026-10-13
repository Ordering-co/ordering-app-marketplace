import React, { useCallback, useImperativeHandle, useState } from 'react'
import { Animated, LayoutAnimation, Platform, TouchableWithoutFeedback, UIManager, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { ProductOption as ProductOptionController, useLanguage } from '@components'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import { OText } from '../shared'
import { AccordionTitle, Container, RequiredWrap, WrapHeader, WrappAction } from './styles'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ProductOptionUI = (props: any) => {
  const {
    children,
    option,
    ref,
    error
  } = props

  const theme = useTheme();
  const [, t] = useLanguage()

  const min = option.min ?? 0
  const max = option.max ?? 0
  let maxMin = ''
  if (min === 1 && max === 1) {
    maxMin = t('REQUIRED', 'Required')
  } else if (min > 0 && max > 0 && min === max) {
    maxMin = `(${t('CHOOSE', 'Choose')}: ${min})`
  } else if (min === 0 && max > 0) {
    maxMin = `(${t('MAX', 'Max')}: ${max})`
  } else if (min > 0 && max === 0) {
    maxMin = `(${t('MIN', 'Min')}: ${min})`
  } else if (min > 0 && max > 0) {
    maxMin = `(${t('MIN', 'Min')}: ${min} / ${t('MAX', 'Max')}: ${max})`
  }

  const [isOpen, setIsOpen] = useState(option?.min > 0);

  const toggleOpen = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  }, [isOpen]);

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        if (isOpen) {
          return;
        }
        return toggleOpen();
      },
    }),
    [toggleOpen, isOpen],
  );

  return (
    <Container style={{ color: error ? 'orange' : theme.colors.white }}>
      <TouchableWithoutFeedback
        onPress={toggleOpen}
        accessibilityRole='button'
        accessibilityLabel='Toggle Accordion'
      >
        <AccordionTitle>
          <WrapHeader>
            <OText size={theme.utils.tsize.m} weight={'600'} style={{ flex: 1 }}>{option.name}</OText>
            {maxMin ? (
              min === 1 && max === 1 ? (
                <RequiredWrap>
                  <OText size={theme.utils.tsize.xs} color={theme.colors.active}>{maxMin}</OText>
                </RequiredWrap>
              ) : (
                <OText size={theme.utils.tsize.xs} color={theme.colors.primary}>{maxMin}</OText>
              )
            ) : null}
          </WrapHeader>
          <WrappAction>
            <AntDesignIcon
              name={isOpen ? 'up' : 'down'}
              color={theme.colors.black}
              size={18}
            />
          </WrappAction>
        </AccordionTitle>
      </TouchableWithoutFeedback>
      <Animated.View>
        {isOpen && <View>{children}</View>}
      </Animated.View>
    </Container>
  )
}

export const ProductOption = (props: any) => {
  const productOptionProps = {
    ...props,
    UIComponent: ProductOptionUI
  }

  return (
    <ProductOptionController {...productOptionProps} />
  )
}
