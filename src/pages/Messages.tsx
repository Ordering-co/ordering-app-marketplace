import React, { useState } from 'react'
import settings from '../config.js'
interface Props {
  navigation: any;
  route: any;
}
import { MessageListing, NavBar, SafeAreaViewWrapper } from '@ui';
import { useLanguage } from '@components';

const Messages = (props: Props) => {
  const [, t] = useLanguage();
  const messagesProps = {
    ...props,
    franchiseId: settings?.franchiseSlug,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onNavigationRedirect: (route: string, params?: any) => {
      props.navigation.navigate(route, params)
    }
  }

  const [refreshOrders, setRefreshOrders] = useState(false)

  return (
    <>
      <NavBar
        title={t('MESSAGES', 'Messages')}
        onActionLeft={() => messagesProps.goToBack()}
      />
      <SafeAreaViewWrapper
        refreshing={refreshOrders}
        onRefresh={() => setRefreshOrders(true)}
      >
        <MessageListing
          {...messagesProps}
          refreshOrders={refreshOrders}
          setRefreshOrders={setRefreshOrders}
        />
      </SafeAreaViewWrapper>
    </>
  )
}

export default Messages
