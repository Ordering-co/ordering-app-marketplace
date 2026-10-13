import React from 'react'
import { View } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { useTheme } from 'styled-components/native'

import { Container, TransactionsWrapper } from './styles'
import { useLanguage } from '@components'
import { WalletTransactionItem, OText } from '@ui'

export const WalletTransactions = (props: any) => {
  const {
    transactionsList,
    currentWalletSelected
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()

  return (
    <Container>
      <View style={{ width: '100%', paddingHorizontal: 1, paddingBottom: 10 }}>
        {!transactionsList?.loading &&
          !transactionsList?.error &&
          transactionsList.list?.[`wallet:${currentWalletSelected?.id}`]?.length > 0 &&
        (
          <>
            <TransactionsWrapper>
              {transactionsList.list?.[`wallet:${currentWalletSelected?.id}`]?.map((transaction: any, i: number) =>(
                <WalletTransactionItem
                  idx={i}
                  type={currentWalletSelected?.type}
                  key={transaction.id}
                  item={transaction}
                  withFormatPrice={currentWalletSelected?.type === 'cash'}
                  isLast={i === transactionsList.list?.[`wallet:${currentWalletSelected?.id}`]?.length - 1}
                />
              ))}
            </TransactionsWrapper>
          </>
        )}

        {(transactionsList?.loading) && (
          <View>
            {[...Array(4).keys()].map(i => (
              <View style={{ marginBottom: 10 }} key={i}>
                <Placeholder Animation={Fade}>
                  <PlaceholderLine width={100} height={100} style={{ marginBottom: 0, borderRadius: 8 }} />
                </Placeholder>
              </View>
            ))}
          </View>
        )}

        {!transactionsList?.loading &&
          !transactionsList.list?.[`wallet:${currentWalletSelected?.id}`]?.length &&
        (
          <OText color={theme.colors.disabled} size={16} style={{ textAlign: 'center' }}>
            {transactionsList?.error
              ? t('ERROR_NOT_FOUND_TRANSACTIONS', 'Sorry, an error has occurred')
              : t('NOT_FOUND_TRANSACTIONS', 'No transactions to show at this time.')
            }
          </OText>
        )}
      </View>
    </Container>
  )
}
