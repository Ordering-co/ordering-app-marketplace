import React, { useEffect } from 'react'
import { View, ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native'
import {
  Container,
  BalanceElement,
  SectionContent,
} from './styles'

import {
  WalletList,
  useLanguage,
  useUtils,
  useConfig
} from '@components'

import {
  OText,
  NotFoundSource,
  WalletTransactions,
} from '@ui'

const CashWalletUI = (props: any) => {
  const {
    navigation,
    walletList,
    userLoyaltyLevel,
    transactionsList,
    isWalletCashEnabled,
    isWalletPointsEnabled,
    getWallets,
    refreshWallets,
    setRefreshWallets
  } = props

  const [, t] = useLanguage()
  const [{ parsePrice, isWalletEnabled: isWalletConfigEnabled }] = useUtils()
  const [{ configs }] = useConfig()
  const theme = useTheme()

  const isWalletEnabled = configs?.cash_wallet?.value && isWalletConfigEnabled(configs) && (isWalletCashEnabled || isWalletPointsEnabled)

  const currentWalletSelected = walletList?.wallets?.find((w: any) => w.type === 'cash') ?? null

  useEffect(() => {
    if (!isWalletEnabled) {
      navigation.navigate('BottomTab', {
        screen: 'Profile'
      })
    }
  }, [configs])

  useEffect(() => {
    if (refreshWallets) {
      getWallets()
      setRefreshWallets && setRefreshWallets(false)
    }
  }, [refreshWallets])

  return (
    <>
      <Container>
        {!walletList.loading &&
          !userLoyaltyLevel.loading &&
          !walletList.error &&
          walletList.wallets?.length > 0 &&
          (
            <>
              <SectionContent>
                <BalanceElement>
                  <OText size={20} weight='bold'>
                    {t('AVAILABLE', 'Available')}
                  </OText>
                  <OText size={20} weight='bold'>
                    {parsePrice(currentWalletSelected?.balance)}
                  </OText>
                </BalanceElement>
              </SectionContent>
              <View style={{ height: 5, backgroundColor: theme.colors.backgroundGray100, marginBottom: 20 }} />
              <ScrollView>
                <WalletTransactions transactionsList={transactionsList} currentWalletSelected={currentWalletSelected} />
              </ScrollView>
            </>
          )}

        {!walletList?.loading && !userLoyaltyLevel.loading && (walletList?.error || !walletList?.wallets?.length) && (
          <NotFoundSource
            content={walletList?.error
              ? t('ERROR_NOT_FOUND_WALLETS', 'Sorry, an error has occurred')
              : t('NOT_FOUND_WALLETS', 'No wallets to show at this time.')
            }
          />
        )}
      </Container>
    </>
  )
}

export const CashWallet = (props: any) => {
  const [{ configs }] = useConfig()

  const isWalletCashEnabled = configs?.wallet_cash_enabled?.value === '1'
  const isWalletPointsEnabled = configs?.wallet_credit_point_enabled?.value === '1'

  const walletsProps = {
    ...props,
    UIComponent: CashWalletUI,
    isWalletCashEnabled,
    isWalletPointsEnabled
  }
  return (
    <WalletList {...walletsProps} />
  )
}
