import React, { useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { useTheme } from 'styled-components/native';
import RNPickerSelect from 'react-native-picker-select'
import CountryFlag from "react-native-country-flag";

import langCountries from './lang_country.json';
import { LanguageSelectorParams } from '../../types'
import { Container, DummyContainer } from './styles'
import { LanguageSelector as LanguageSelectorController, useOrder, useLanguage } from '@components'
import { OIcon } from '../shared'

const LanguageSelectorUI = (props: LanguageSelectorParams) => {
  const {
    languagesState,
    currentLanguage,
    handleChangeLanguage,
    pickerStyle,
    iconLeft: IconLeft,
    hideIconFlag,
    hideIconDropdown,
    containerStyle,
    onNavigationRedirect
  } = props

  const [orderState] = useOrder()
  const [state] = useLanguage()
  const [languagePressed, setLanguagePressed] = useState<any>(currentLanguage)
  const theme = useTheme();
  const width = Dimensions.get('window').width

  const inputStyle = {
    color: theme.colors.white,
    backgroundColor: '#003B2C',
    height: 40,
    borderRadius: 50,
    paddingRight: 30,
    paddingLeft: 15 + (width * 0.04)
  }

  const _pickerStyle = StyleSheet.create({
    inputAndroid: inputStyle,
    inputIOS: inputStyle,
    icon: {
      width: 15,
      height: 40,
      marginRight: 10,
      justifyContent: 'center'
    }
  })

  const changeLanguage = (lang: string) => {
    setLanguagePressed(lang)
    handleChangeLanguage(lang)
  }

  const _languages = languagesState?.languages?.map((language: any) => {
    return {
      value: language?.code,
      label: language?.name,
      inputLabel: language?.name,
      flagCode: langCountries.find(item => item.value == language?.code)?.countryCode,
    }
  })

  _languages && _languages.sort((a: any, b: any) => (a.content > b.content) ? 1 : ((b.content > a.content) ? -1 : 0))

  const currentLanguageData = _languages?.find((item: any) => item.value == currentLanguage)

  return (
    <Container style={containerStyle} onPress={() => onNavigationRedirect('Languages')}>
      {languagesState?.languages ? (
        <>
          {!hideIconFlag && currentLanguageData?.flagCode && (
            <CountryFlag
              isoCode={currentLanguageData?.flagCode?.toLowerCase()}
              size={11}
              style={{ position: 'absolute', zIndex: 1000, left: 10 }}
            />
          )}
          <RNPickerSelect
            placeholder={{}}
            items={_languages || []}
            value={currentLanguage}
            style={pickerStyle ?? _pickerStyle}
            touchableWrapperProps={{ disabled: true }}
            useNativeAndroidPickerStyle={false}
            disabled={true}
            onValueChange={changeLanguage}
            {...(!hideIconDropdown && {
              Icon: () => (
                <View style={pickerStyle?.icon ?? _pickerStyle.icon}>
                  <OIcon src={theme.images.general.arrow_down} color={theme.colors.white} style={{ width: '100%' }} />
                </View>
              )
            })}
          />
        </>
      ) : <DummyContainer />}
    </Container>
  )
}

export const LanguageSelector = (props: LanguageSelectorParams) => {
  const LanguageProps = {
    ...props,
    UIComponent: LanguageSelectorUI
  }

  return <LanguageSelectorController {...LanguageProps} />
}
