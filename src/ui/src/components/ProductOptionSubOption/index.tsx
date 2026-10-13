import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { InView } from 'react-native-intersection-observer'
import { useTheme } from 'styled-components/native';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';

import {
  Container,
  IconControl,
  QuantityControl,
  Checkbox,
  PositionControl,
  Circle,
  Logo,
  WrapperOptionName,
  LeftContent
} from './styles'
import { OIcon, OText } from '../shared'

import {
  useUtils,
  useLanguage,
  ProductOptionSuboption as ProductSubOptionController
} from '@components'

const halfOptions = ['left', 'whole', 'right']

export const ProductOptionSubOptionUI = (props: any) => {
  const {
    state,
    increment,
    decrement,
    balance,
    option,
    suboption,
    toggleSelect,
    changePosition,
    disabled,
    setIsScrollAvailable,
    image,
    enableIntersection,
    usePizzaValidation,
    pizzaState
  } = props

  const maxByPosition = state.position === 'whole'
    ? suboption?.max
    : suboption?.max * 2

  const shouldApplyHalfLogic = option?.with_half_option && option?.allow_suboption_quantity && option?.limit_suboptions_by_max

  const wouldExceedMaxInWhole = shouldApplyHalfLogic && state.position === 'whole' && option?.max != null
    ? (balance - state.quantity + (state.quantity + 1)) > option?.max
    : false

  const pizzaAtOrOverMax = option?.max != null && pizzaState?.[`option:${option?.id}`]?.value >= option?.max

  const disableIncrement =
    option?.with_half_option
      ? shouldApplyHalfLogic
        ? state.quantity === maxByPosition || pizzaAtOrOverMax || wouldExceedMaxInWhole
        : pizzaAtOrOverMax
      : option?.limit_suboptions_by_max
        ? (balance === option?.max || state.quantity === suboption.max)
        : state.quantity === suboption?.max || (!state.selected && balance === option?.max)
  const price = option?.with_half_option && suboption?.half_price && state.position !== 'whole' ? suboption?.half_price : suboption?.price

  const theme = useTheme();
  const [, t] = useLanguage()
  const [{ parsePrice, optimizeImage }] = useUtils()
  const [showMessage, setShowMessage] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [isIntersectionObserver, setIsIntersectionObserver] = useState(!enableIntersection)

  const iconsSize = 20

  const styles = StyleSheet.create({
    icon: {
      borderRadius: theme.utils.radius.l,
      width: 35,
      height: 35
    },
    inverse: {
      transform: [{ rotateY: '180deg' }]
    }
  });

  const handleSuboptionClick = () => {
    toggleSelect()
    setIsDirty(true)
    const minMaxValidation = option?.with_half_option ? usePizzaValidation : (balance === option?.max && option?.suboptions?.length > balance && !(option?.min === 1 && option?.max === 1))

    if (!state.selected && minMaxValidation) {
      setShowMessage(true)
    }
  }

  const handleChangeInterSection = (inView: boolean) => {
    setIsIntersectionObserver(inView)
  }

  useEffect(() => {
    if (balance === option?.max && state?.selected && isDirty) {
      setIsDirty(false)
      setIsScrollAvailable(option?.id)
    }
  }, [state?.selected])

  useEffect(() => {
    if (!(balance === option?.max && option?.suboptions?.length > balance && !(option?.min === 1 && option?.max === 1))) {
      setShowMessage(false)
    }
  }, [balance, pizzaState?.[`option:${option?.id}`]?.value])

  return (
    <InView onChange={(inView: boolean) => handleChangeInterSection(inView)} triggerOnce={true}>
      <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Container
          activeOpacity={0.7}
          onPress={!((option?.with_half_option || option?.allow_suboption_quantity) && state?.selected) ? () => handleSuboptionClick() : null}
        >
          <LeftContent>
            <IconControl activeOpacity={0.7} disabled={disabled} onPress={() => handleSuboptionClick()}>
              {image && (
                <Logo>
                  <FastImage
                    style={styles.icon}
                    source={{
                      uri: optimizeImage(image, 'h_100,c_limit'),
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </Logo>
              )}
              <WrapperOptionName>
                <OText size={12} lineHeight={18} mLeft={5} style={{ flex: 1 }}>
                  {suboption?.name}
                </OText>
                {price > 0 && (
                  <OText size={12} lineHeight={18}>
                    {'+ '}{parsePrice(price)}
                  </OText>
                )}
              </WrapperOptionName>
            </IconControl>
          </LeftContent>
          <View style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 10, marginRight: 13 }}>
            {((option?.min === 0 && option?.max === 1) || option?.max > 1 || option?.max == null) ? (
              state?.selected ? (
                <>
                  {option?.allow_suboption_quantity && !(option?.max === 1 && option?.min === 1) ? (
                    <QuantityControl>
                      <Checkbox disabled={disabled || state.quantity === 0} onPress={decrement}>
                        <IconAntDesign
                          name='minuscircleo'
                          size={iconsSize}
                          color={state.quantity === 0 || disabled ? theme.colors.black : theme.colors.active}
                        />
                      </Checkbox>
                      <OText size={12}>
                        {state.quantity}
                      </OText>
                      <Checkbox disabled={disabled || disableIncrement || usePizzaValidation} onPress={increment}>
                        <IconAntDesign
                          name='pluscircleo'
                          size={iconsSize}
                          color={disableIncrement || disabled || usePizzaValidation ? theme.colors.black : theme.colors.active}
                        />
                      </Checkbox>
                    </QuantityControl>
                  ) : (
                    <OIcon
                      src={theme.images.general.check_act}
                      color={theme.colors.active}
                      width={16}
                    />
                  )}
                </>
              ) : (
                option?.max > 1 && option?.allow_suboption_quantity && !(option?.max === 1 && option?.min === 1)
                  ? <IconAntDesign
                    name='pluscircleo'
                    size={iconsSize}
                    color={theme.colors.black}
                  />
                  : <OIcon
                    color={theme.colors.active}
                    width={16}
                    src={theme.images.general.check_nor}
                  />
              )
            ) : (
              state?.selected ? (
                <OIcon src={theme.images.general.radio_act} color={theme.colors.active} width={16} />
              ) : (
                <OIcon src={theme.images.general.radio_nor} color={theme.colors.black} width={16} />
              )
            )}

          </View>
        </Container>
        {option?.with_half_option && state?.selected && (
          <PositionControl>
            {halfOptions.map((position, idx) => (
              <Circle
                key={position}
                active={state.selected && state.position === position}
                disabled={disabled || (position === 'whole' && pizzaAtOrOverMax)}
                idx={idx}
                onPress={() => changePosition(position)}
              >
                <OIcon
                  src={theme.images.general[`half_${position === 'whole' ? 'f' : position[0]}`]}
                  color={state.selected && state.position === position ? theme.colors.active : theme.colors.black}
                  width={15}
                  height={15}
                />
                <OText
                  weight={'600'}
                  style={{ textTransform: 'capitalize' }}
                  color={state.selected && state.position === position ? theme.colors.active : theme.colors.black}
                >
                  {` ${t(position.toUpperCase(), position)}`}
                </OText>
              </Circle>
            ))}
          </PositionControl>
        )}
      </View>
      {showMessage && (
        <OText
          size={10}
          mLeft={4}
          mRight={4}
          style={{ flex: 1, textAlign: 'center' }}
          color={theme.colors.primary}
        >
          {`${t('OPTIONS_MAX_LIMIT', 'Maximum options to choose')}: ${option?.max}`}
        </OText>
      )}
    </InView>
  )
}

export const ProductOptionSubOption = (props: any) => {
  const productOptionSubOptionProps = {
    ...props,
    UIComponent: ProductOptionSubOptionUI,
    isOrigin: true,
    disableDeselection: true
  }

  return (
    <ProductSubOptionController {...productOptionSubOptionProps} />
  )
}
