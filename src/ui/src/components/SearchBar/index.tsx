import React, { useRef } from 'react'
import { StyleSheet, TouchableOpacity, Platform, Pressable, TextInput } from 'react-native'
import { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather'

import { useLanguage } from '@components'
import { OInput, OButton } from '../shared'

export const SearchBar = (props: any) => {
  const {
    searchValue,
    placeholder,
    onSearch,
    onCancel,
    lazyLoad,
    isCancelButtonShow,
    isCancelXButtonShow,
    height,
    inputStyle,
    onPress,
    isDisabled,
    iconCustomRight,
    onSubmitEditing,
    inputContainerStyles,
    containerStyles,
    hideIcon,
    autoFocus
  } = props

  const theme = useTheme();
  const InputRef = useRef<TextInput>(null)

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 1,
      maxHeight: 44,
      height: 44,
      borderColor: theme.colors.clear
    },
    buttonStyle: {
      maxHeight: 40,
      paddingRight: 5,
      backgroundColor: 'red'
    }
  })


  const [, t] = useLanguage()

  const handleClear = () => {
    onSearch('')
    InputRef.current?.clear()
  }

  let timeout: null | any = null
  const onChangeSearch = (e: any) => {
    if (!lazyLoad) {
      onSearch(e)
    } else {
      clearTimeout(timeout)
      timeout = setTimeout(function () {
        onSearch(e)
      }, 750)
    }
  }

  return (
    <Pressable style={[styles.container, containerStyles, { height: height }]}>
      <OInput
        autoFocus={autoFocus}
        value={searchValue}
        placeholder={placeholder}
        icon={!hideIcon && theme.images.general.search}
        isDisabled={isDisabled}
        iconStyle={{ width: 16 }}
        returnKeyType='done'
        clearButtonMode={!isCancelXButtonShow ? "while-editing" : "never"}
        onPress={() => onPress && onPress()}
        inputStyle={{ marginRight: isCancelXButtonShow ? 10 : 0 }}
        iconCustomRight={iconCustomRight}
        onSubmitEditing={() => onSubmitEditing && onSubmitEditing()}
        onChange={onChangeSearch}
        forwardRef={InputRef}
      />
      {isCancelButtonShow && (
        <OButton
          text={t('CANCEL', 'Cancel')}
          style={styles.buttonStyle}
          onClick={onCancel || handleClear}
        />
      )}
      {isCancelXButtonShow && (
        <TouchableOpacity
          onPress={onCancel || handleClear}
          style={{ position: 'absolute', end: 10, top: 5 }}
        >
          <Icon
            name='x-circle'
            color={theme.colors.backgroundGray300}
            size={16}
          />
        </TouchableOpacity>
      )}
    </Pressable>
  )
}
