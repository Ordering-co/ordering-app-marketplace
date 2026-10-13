import React, { useState, useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { useTheme } from 'styled-components/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Container,
  SectionLeft,
} from './styles'

import {
  PaymentOptionWallet as PaymentOptionWalletController,
  useLanguage,
  useUtils,
  useOrder,
  useConfig
} from '@components'

import { OText } from '../shared'
import FastImage from 'react-native-fast-image';

type wallet = {
  id: string
  type: string
  balance: number
  redemption_rate: number
  valid: boolean
}

const PaymentOptionWalletUI = (props: any) => {
  const {
    businessConfigs,
    businessId,
    walletsState,
    selectWallet,
    deletetWalletSelected,
    loading
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [{ carts }] = useOrder()
  const [{ parsePrice }] = useUtils()

  const cart = carts?.[`businessId:${businessId}`] ?? {}

  const isWalletCashEnabled = configs?.wallet_cash_enabled?.value === '1'
  const isWalletPointsEnabled = configs?.wallet_credit_point_enabled?.value === '1'

  const isBusinessWalletCashEnabled = businessConfigs.find((config: any) => config.key === 'wallet_cash_enabled')?.value === '1'
  const isBusinessWalletPointsEnabled = businessConfigs.find((config: any) => config.key === 'wallet_credit_point_enabled')?.value === '1'

  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});

  const creditBalance: any = (wallet: any) => ` = ${parsePrice(wallet.balance / wallet.redemption_rate, { isTruncable: true })}`

  const walletName: any = {
    cash: {
      name: t('PAY_WITH_CASH_WALLET', 'Pay with Cash Wallet'),
      isActive: isWalletCashEnabled && isBusinessWalletCashEnabled
    },
    credit_point: {
      name: t('PAY_WITH_CREDITS_POINTS_WALLET', 'Pay with Credit Points Wallet'),
      isActive: isWalletPointsEnabled && isBusinessWalletPointsEnabled
    }
  }

  const handleOnChange = (wallet: wallet) => {
    if (!checkedState[wallet.id]) {
      selectWallet(wallet)
    } else {
      deletetWalletSelected(wallet)
    }

    setCheckedState({ ...checkedState, [wallet.id]: !checkedState[wallet.id] });
  };

  useEffect(() => {
    if (!walletsState.loading && walletsState.result?.length) {
      const updatedCheckedState: { [key: string]: boolean } = {}
      walletsState.result?.forEach((wallet: any) => {
        updatedCheckedState[wallet.id] = !!cart?.payment_events?.find((w: any) => w.wallet_id === wallet.id)
      })
      setCheckedState(updatedCheckedState)
    }
  }, [walletsState.result?.length])

  return (
    <>
      {!walletsState.loading &&
        !walletsState.error &&
        walletsState.result?.length > 0 &&
        (
          <>
            {walletsState.result?.map((wallet: wallet) => wallet.valid && wallet.balance >= 0 && walletName[wallet.type]?.isActive && (
              <Container
                key={wallet.id}
                onPress={() => handleOnChange(wallet)}
                disabled={(cart?.balance === 0 && !checkedState[wallet.id]) || wallet.balance === 0}
              >
                <SectionLeft>
                  <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                    <FastImage
                      style={{ width: 44, height: 44, marginRight: 10, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border }}
                      source={wallet.type === 'cash' ? theme.images.general.wallet_cash : theme.images.general.wallet_credit_point}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <OText
                      style={((cart?.balance === 0 && !checkedState[wallet.id]) || wallet.balance === 0)
                        ? { color: theme.colors.disabled } : {}}
                      numberOfLines={2}
                      ellipsizeMode='tail'
                    >
                      {walletName[wallet.type]?.name}

                      {wallet.type === 'cash' && (
                        <OText>
                          {' '}{parsePrice(wallet?.balance, { isTruncable: true })}
                        </OText>
                      )}
                      {wallet.type === 'credit_point' && (
                        <OText>
                          <OText color={theme.colors.primary} weight='bold'>
                            {` ${wallet?.balance} ${t('POINTS', 'Points')}`}
                          </OText>
                          <OText>
                            {wallet?.balance > 0
                              ? creditBalance(wallet)
                              : null}
                          </OText>
                        </OText>
                      )}
                    </OText>
                  </View>
                </SectionLeft>
                <View style={{ width: '10%', alignItems: 'flex-end', opacity: (cart?.balance === 0 && !checkedState[wallet.id]) || wallet.balance === 0 ? 0.5 : 1 }}>
                  {loading && checkedState[wallet.id] ? (
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                  ) : (
                    <MaterialCommunityIcons
                      name={checkedState[wallet.id] ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={25}
                      color={checkedState[wallet.id] ? theme.colors.primary : theme.colors.disabled}
                    />
                  )}
                </View>
              </Container>
            ))}
          </>
        )}

      {walletsState?.loading && (
        <View>
          {[...Array(2).keys()].map(i => (
            <View style={{ marginBottom: 10 }} key={i}>
              <Placeholder Animation={Fade}>
                <PlaceholderLine width={100} height={40} style={{ marginBottom: 0, borderRadius: 8 }} />
              </Placeholder>
            </View>
          ))}
        </View>
      )}
    </>
  )
}

export const PaymentOptionWallet = (props: any) => {
  const paymentWalletProps = {
    ...props,
    UIComponent: PaymentOptionWalletUI
  }

  return (
    <PaymentOptionWalletController {...paymentWalletProps} />
  )
}
