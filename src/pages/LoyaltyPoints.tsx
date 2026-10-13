import React, { useState } from 'react'

import { LoyaltyPoints as LoyaltyPointsController, SafeAreaViewWrapper, NavBar } from '@ui';
import { useLanguage } from '@components';

interface Props {
  navigation: any;
  route: any;
}

const LoyaltyPoints = (props: Props) => {
  const walletsProps = { ...props  }
  const [, t] = useLanguage()
  const [refreshWallets, setRefreshWallets] = useState(false)

  const handleOnRefresh = () => {
    setRefreshWallets(true);
  }

  return (
    <>
      <NavBar title={t('LOYALTY_POINTS', 'Loyalty Points')} onActionLeft={() => walletsProps.navigation.goBack()} />
      <SafeAreaViewWrapper disableScrollView onRefresh={handleOnRefresh}>
        <LoyaltyPointsController
          {...walletsProps}
          refreshWallets={refreshWallets}
          setRefreshWallets={setRefreshWallets}
        />
      </SafeAreaViewWrapper>
    </>
  )
}

    export default LoyaltyPoints
