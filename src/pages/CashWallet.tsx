import React, { useState } from 'react'
import { CashWallet as CashWalletController, SafeAreaViewWrapper, NavBar } from '@ui';
import { useLanguage } from '@components';

interface Props {
  navigation: any;
  route: any;
}

const CashWallet = (props: Props) => {
  const walletsProps = { ...props  }
  const [, t] = useLanguage()

  const [refreshing] = useState(false);
  const [refreshWallets, setRefreshWallets] = useState(false)

  const handleOnRefresh = () => {
    setRefreshWallets(true);
  }

  return (
    <>
      <NavBar title={t('CASH_WALLET', 'Cash Wallet')} onActionLeft={() => walletsProps.navigation.goBack()} />
      <SafeAreaViewWrapper onRefresh={handleOnRefresh} refreshing={refreshing}>
        <CashWalletController
          {...walletsProps}
          refreshWallets={refreshWallets}
          setRefreshWallets={setRefreshWallets}
        />
      </SafeAreaViewWrapper>
    </>
  )
}

export default CashWallet
