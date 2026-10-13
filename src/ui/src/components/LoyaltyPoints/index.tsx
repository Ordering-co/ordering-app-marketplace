import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components/native'
import FastImage from 'react-native-fast-image'

import {
  Container,
  BalanceElement,
  SectionContent,
  LoyaltyContent,
  LoyaltyWrapp
} from './styles'

import {
  WalletList,
  useLanguage,
  useConfig,
  useUtils
} from '@components'

import {
  OText,
  NotFoundSource,
  WalletTransactions,
  OBottomPopup
} from '@ui'

const LoyaltyPointsUI = (props: any) => {
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
  const theme = useTheme()
  const [{ configs }] = useConfig()
  const [{ isWalletEnabled: isWalletConfigEnabled }] = useUtils()


  const styles = StyleSheet.create({
    logoStyle: {
      width: 120,
      height: 120,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoHidden: {
      width: 0,
      height: 0,
      borderWidth: 0,
      marginVertical: 0,
      opacity: 0,
    },
    dividerStyle: {
      height: 8,
      backgroundColor: theme.colors.backgroundGray100,
      marginVertical: 25,
      marginHorizontal: -40,
      width: '100%'
    }
  });

  const [openHistory, setOpenHistory] = useState(false)
  const [levelImageError, setLevelImageError] = useState(false)
  const [levelImageLoaded, setLevelImageLoaded] = useState(false)

  const isWalletEnabled = configs?.cash_wallet?.value && isWalletConfigEnabled(configs) && (isWalletCashEnabled || isWalletPointsEnabled)

  const currentWalletSelected = walletList?.wallets?.find((w: any) => w.type === 'credit_point') ?? null

  const loyaltyLevel = Object.keys(userLoyaltyLevel.loyaltyLevel ?? {}).length > 0 && userLoyaltyLevel.loyaltyLevel

  const hasLevelImage = !!loyaltyLevel?.image?.trim() && !levelImageError

  useEffect(() => {
    setLevelImageError(false)
    setLevelImageLoaded(false)
  }, [loyaltyLevel?.image])

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
                <LoyaltyContent>
                  <LoyaltyWrapp>
                    <OText size={20}>
                      {`${t('LOYALTY_LEVEL_TITLE', 'Your level is')}`}
                    </OText>
                    {hasLevelImage && (
                      <FastImage
                        style={[styles.logoStyle, !levelImageLoaded && styles.logoHidden]}
                        source={{
                          uri: loyaltyLevel.image,
                          priority: FastImage.priority.high,
                          cache: FastImage.cacheControl.web
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                        onLoad={() => setLevelImageLoaded(true)}
                        onError={() => setLevelImageError(true)}
                      />
                    )}
                    <OText
                      size={22}
                      weight='bold'
                      style={{ textTransform: 'uppercase' }}
                      color={theme.colors.primary}
                    >
                      {loyaltyLevel.name}
                    </OText>
                  </LoyaltyWrapp>
                </LoyaltyContent>
                <SectionContent>
                  <BalanceElement>
                    <OText size={20} style={{ fontWeight: '600' }}>
                      {t('AVAILABLE', 'Available')}
                    </OText>
                    <OText size={20} style={{ fontWeight: '600' }}>
                      {currentWalletSelected?.balance} {t('POINTS', 'Points')}
                    </OText>
                  </BalanceElement>
                </SectionContent>
              </SectionContent>
              <View style={{ height: 5, backgroundColor: theme.colors.backgroundGray100, marginBottom: 20 }} />
              <ScrollView style={{ maxHeight: '55%' }} showsVerticalScrollIndicator={false}>
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

export const LoyaltyPoints = (props: any) => {
  const [{ configs }] = useConfig()

  const isWalletCashEnabled = configs?.wallet_cash_enabled?.value === '1'
  const isWalletPointsEnabled = configs?.wallet_credit_point_enabled?.value === '1'

  const walletsProps = {
    ...props,
    UIComponent: LoyaltyPointsUI,
    isWalletCashEnabled,
    isWalletPointsEnabled,
    walletType: 'credit_point'
  }
  return (
    <WalletList {...walletsProps} />
  )
}
