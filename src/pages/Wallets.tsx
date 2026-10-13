import React, { useState } from 'react'
import { Platform, RefreshControl, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';
import { Wallets as WalletsController, Container } from '@ui';

interface Props {
  navigation: any;
  route: any;
}

const Wallets = (props: Props) => {
  const walletsProps = {  ...props  }

  const theme = useTheme()

  const [refreshing] = useState(false);
  const [refreshWallets, setRefreshWallets] = useState(false)

  const handleOnRefresh = () => {
    setRefreshWallets(true);
  }

  const styles = StyleSheet.create({
    container: {
      paddingVertical: Platform.OS === 'ios' ? 0 : 10
    }
  })

  return (
    <Container
      noPadding
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => handleOnRefresh()}
        />
      }
      style={styles.container}
    >
      <WalletsController
        {...walletsProps}
        refreshWallets={refreshWallets}
        setRefreshWallets={setRefreshWallets}
      />
    </Container>
  )
}

export default Wallets
