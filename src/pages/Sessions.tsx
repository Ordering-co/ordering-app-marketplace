import React from 'react'
import { useLanguage } from '@components'
import { NavBar, SafeAreaViewWrapper, Sessions as SessionsController } from '@ui'

interface Props {
  navigation: any;
  route: any;
}

const Sessions = (props: Props) => {
  const [, t] = useLanguage()
  return (
    <>
      <NavBar
        title={t('SECURITY', 'Security')}
        onActionLeft={() => props.navigation.canGoBack() && props.navigation.goBack()}
      />
      <SafeAreaViewWrapper>
        <SessionsController {...props} />
      </SafeAreaViewWrapper>
    </>
  )
}

export default Sessions
