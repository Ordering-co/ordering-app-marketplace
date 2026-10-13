import React, { useEffect, useRef, useState } from 'react'
import { View, Alert, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form'
import { useTheme } from 'styled-components/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Container, FormController } from './styles'
import { useLanguage, useUtils, RedeemGiftCard as RedeemGiftCardController } from '@components'
import { OText, OButton, OInput } from '@ui';

const RedeemGiftCardUI = (props: any) => {
  const {
    actionState,
    redeemedGiftCard,
    handleApply,
    onClose,
    setRedeemedGiftCard
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const { handleSubmit, control, errors } = useForm()
  const [{ parsePrice }] = useUtils()

  const [codeValue, setCodeValue] = useState('')
  const [passwordSee, setPasswordSee] = useState(false)
  const passwordRef = useRef<any>(null)

  const onSubmit = (values: any) => {
    handleApply(values)
  }

  const handleChangeCode = (string: any, onChange: any) => {
    string = string.replace(/-/g, '')
    if (!string) {
      setCodeValue('')
      onChange('')
      return
    }
    const codeSlices = string.match(/.{1,4}/g)
    const formattedCode = codeSlices.join('-')
    setCodeValue(formattedCode)
    onChange(formattedCode)
  }

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const list = Object.values(errors)
      let stringError = ''
      list.map((item: any, i: number) => {
        stringError += (i + 1) === list.length ? `- ${item.message}` : `- ${item.message}\n`
      })
      Alert.alert(
        t('ERROR', 'Error'),
        stringError,
        [
          { text: t('OK', 'oK'), onPress: () => { } }
        ]
      )
    }
  }, [errors])

  useEffect(() => {
    if (!actionState.error) return
    let stringError = ''
    if (typeof actionState.error === 'string') {
      stringError = actionState.error
    } else {
      actionState.error.map((item: any) => {
        stringError += `- ${item}\n`
      })
    }
    Alert.alert(
      t('ERROR', 'Error'),
      stringError,
      [
        { text: t('OK', 'oK'), onPress: () => { } }
      ]
    )
  }, [actionState.error])

  return (
    <Container>
      {!redeemedGiftCard ? (
        <View>
          <FormController>
            <Controller
              control={control}
              render={({ onChange }: any) => (
                <OInput
                  placeholder='XXXX-XXXX-XXXX-XXXX'
                  value={codeValue}
                  onChange={(val: any) => {
                    handleChangeCode(val, onChange)
                  }}
                  autoCapitalize='characters'
                  autoCorrect={false}
                  blurOnSubmit={false}
                />
              )}
              name='code'
              rules={{
                required: t('VALIDATION_ERROR_REQUIRED', 'Code is required').replace('_attribute_', t('CODE', 'Code'))
              }}
              defaultValue=""
            />
          </FormController>
          <FormController>
            <Controller
              control={control}
              render={({ onChange, value }: any) => (
                <OInput
                  isSecured={!passwordSee ? true : false}
                  placeholder={t('PASSWORD', 'Password')}
                  autoCapitalize='none'
                  value={value}
                  forwardRef={passwordRef}
                  returnKeyType="done"
                  blurOnSubmit
                  iconCustomRight={
                    <MaterialCommunityIcons
                      name={passwordSee ? "eye-off-outline" : "eye-outline"}
                      size={24}
                      onPress={() => setPasswordSee(!passwordSee)}
                      color={theme.colors.disabled}
                    />
                  }
                  borderColor={!!errors?.password ? theme.colors.danger5 : null}
                  onChange={(val: any) => onChange(val)}
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
              )}
              name="password"
              rules={{
                required: {
                  value: true,
                  message: t(
                    'VALIDATION_ERROR_PASSWORD_REQUIRED',
                    'The field Password is required',
                  ).replace('_attribute_', t('PASSWORD', 'Password'))
                }
              }}
              defaultValue=""
            />
          </FormController>
          <OButton
            onClick={handleSubmit(onSubmit)}
            text={actionState?.loading ? t('LOADING', 'Loading') : t('APPLY_TO_YOUR_BALANCE', 'Apply to your balance')}
            disabled={actionState.loading}
          />
        </View>
      ) : (
        <View style={{ paddingTop: 0, paddingBottom: 20 }}>
          <View style={{
            marginBottom: 10,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          }}>
            <OText color={theme.colors.textNormal} weight='bold' size={20} mBottom={5}>{t('GIFT_CARD', 'Gift card')}</OText>
            <OText color={theme.colors.textNormal} size={14}>{t('REDEEMED_SUCCESSFULLY', 'Redeemed successfully')}</OText>
          </View>
          <View>
            <OText color={theme.colors.textNormal} size={16} mBottom={12} weight='600'>{t('TYPE', 'Type')}: {redeemedGiftCard?.type}</OText>
            <OText color={theme.colors.textNormal} size={16} mBottom={12} weight='600'>{t('AMOUNT', 'Amount')}: {parsePrice(redeemedGiftCard?.amount)}</OText>
            <OText color={theme.colors.textNormal} size={16} mBottom={12}>{t('FROM', 'From')}: {redeemedGiftCard?.receiver?.name} {redeemedGiftCard?.receiver?.lastname}</OText>
            {!!redeemedGiftCard?.title && <OText color={theme.colors.textNormal} size={16} mBottom={12}>{t('TITLE', 'Title')}: {redeemedGiftCard?.title}</OText>}
            {!!redeemedGiftCard?.message && <OText color={theme.colors.textNormal} size={16} mBottom={20}>{t('MESSAGES', 'Messages')}: {redeemedGiftCard?.message} </OText>}
          </View>
          <OButton
            onClick={() => {
              setRedeemedGiftCard(null)
              onClose()
            }}
            text={t('OK', 'Ok')}
          />
        </View>
      )}
    </Container>
  )
}

export const RedeemGiftCard = (props: any) => {
  const redeemGiftCardProps = {
    ...props,
    UIComponent: RedeemGiftCardUI
  }
  return <RedeemGiftCardController {...redeemGiftCardProps} />
}
