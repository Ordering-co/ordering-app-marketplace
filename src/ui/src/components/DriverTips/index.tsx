import React, { useEffect, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

import {
  DTContainer,
  DTCard,
  DTWrapperTips,
  DTForm,
  DTLabel,
  DTWrapperInput,
  DTCardLoader
} from './styles'

import {
  DriverTips as DriverTipsController,
  useUtils,
  useLanguage,
  useConfig,
} from '@components';
import { OButton, OInput, OText } from '../shared';

const DriverTipsUI = (props: any) => {
  const {
    driverTip,
    driverTipsOptions,
    isMulti,
    isLoading,
    cart,
    carts,
    isDriverTipUseCustom,
    handlerChangeOption,
    isFixedPrice
  } = props;

  const [{ parsePrice }] = useUtils();
  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ configs }] = useConfig();
  const [customTip, setCustomTip] = useState((!isMulti && isDriverTipUseCustom && !driverTipsOptions.includes(driverTip)) ?? false)
  const currentTip = customTip ? parseFloat(driverTip || 0) > 0 : !!(!customTip && !driverTipsOptions.includes(driverTip) && parseFloat(driverTip || 0))
  const [value, setvalue] = useState('');
  const [pendingOption, setPendingOption] = useState<any>(null)

  useEffect(() => {
    if (!isLoading) setPendingOption(null)
  }, [isLoading])

  const style = StyleSheet.create({
    semicircle: {
      borderRadius: 8
    },
    inputStyle: {
      borderColor: theme.colors.border,
      borderRadius: 15,
      flex: 1,
      height: 44,
      minHeight: 44,
      marginBottom: 0
    }
  })

  const placeholderCurrency = !isFixedPrice ? `0%` : (configs?.currency_position?.value || 'left') === 'left'
    ? `${configs?.format_number_currency?.value}0`
    : `0${configs?.format_number_currency?.value}`

  const handleChangeDriverTip = (val: any) => {
    const tip = Number(val)
    if ((isNaN(tip) || tip < 0)) {
      setvalue(value)
      return
    }
    setvalue(val)
  }

  const multiCartTipsAmmout = carts?.reduce((total: any, cart: any) => {
    return total + parseFloat(cart?.driver_tip || 0)
  }, 0)

  return (
    <DTContainer>
      <DTLabel>
        {t('CUSTOM_DRIVER_TIP_MESSAGE', '100% of these tips go directly to your driver')}
      </DTLabel>
      <DTWrapperTips>
        {driverTipsOptions.map((option: any, i: number) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              if (isLoading || (option === driverTip && !customTip)) return
              setPendingOption(option)
              handlerChangeOption(option)
              setCustomTip(false)
            }}
          >
            <DTCard
              isActive={(option === driverTip && !customTip)}
            >
              <OText
                numberOfLines={2}
                weight={'600'}
                color={pendingOption === option ? 'transparent' : (option === driverTip && !customTip) ? theme.colors.active : theme.colors.black}
              >
                {`${isFixedPrice ? parsePrice(option) : `${option}%`}`}
              </OText>
              {pendingOption === option && (
                <DTCardLoader>
                  <ActivityIndicator size='small' color={theme.colors.active} />
                </DTCardLoader>
              )}
            </DTCard>
          </TouchableOpacity>
        ))}
        {isDriverTipUseCustom && (
          <TouchableOpacity
            onPress={() => { !isLoading && setCustomTip(true) }}
            style={{ marginTop: 10 }}
          >
            <DTCard
              isActive={customTip}
            >
              <OText
                size={12}
                numberOfLines={2}
                weight={'600'}
                color={pendingOption === 'custom' ? 'transparent' : customTip ? theme.colors.active : theme.colors.black}
              >
                {t('CUSTOM_TIP', 'Custom')}
              </OText>
              {pendingOption === 'custom' && (
                <DTCardLoader>
                  <ActivityIndicator size='small' color={theme.colors.active} />
                </DTCardLoader>
              )}
            </DTCard>
          </TouchableOpacity>
        )}
      </DTWrapperTips>
      {customTip && (
        <DTForm>
          <DTWrapperInput>
            <OInput
              placeholder={placeholderCurrency}
              style={style.inputStyle}
              value={value}
              type={'numeric'}
              onChange={handleChangeDriverTip}
              autoCapitalize='none'
              autoCorrect={false}
              maxLength={isFixedPrice ? 5 : 3}
            />
            <OButton
              textStyle={{ fontSize: 13, marginLeft: 8, marginRight: 8 }}
              text={t('APPLY_TIP', 'Apply Tip')}
              disabled={parseFloat(value || '0') < 0 || parseFloat(value || '0') === driverTip || value === ''}
              parentStyle={{ alignSelf: 'center' }}
              style={{ borderRadius: 15, height: 44, minHeight: 44, paddingTop: 0, paddingBottom: 0 }}
              onClick={() => {
                setPendingOption('custom')
                handlerChangeOption(value)
                setvalue('')
              }}
            />
          </DTWrapperInput>
        </DTForm>
      )}
      {currentTip && (
        <OText
          color={theme.colors.primary}
          size={16}
          style={{ marginTop: 10, textAlign: 'center' }}
        >
          {t('CURRENT_DRIVER_TIP_AMOUNT', 'Current driver tip amount')}{!isFixedPrice &&
            ` (${driverTip}%)`}: {isFixedPrice ? parsePrice(multiCartTipsAmmout ?? driverTip) : parsePrice(multiCartTipsAmmout ?? cart?.driver_tip)}
        </OText>
      )}
    </DTContainer>
  )
}


export const DriverTips = (props: any) => {
  const driverTipsProps = {
    ...props,
    UIComponent: DriverTipsUI
  }

  return <DriverTipsController {...driverTipsProps} />
}
