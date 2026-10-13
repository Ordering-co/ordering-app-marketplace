import React from 'react'
import { useLanguage } from '@components'
import { BusinessPreorder as BusinessPreorderController, NavBar, SafeAreaViewWrapper } from '@ui'

const BusinessPreorder = (props: any) => {
  const [, t] = useLanguage()
  const business = props.route.params?.business
  const handleBusinessClick = props.route.params?.handleBusinessClick

  const businessPreorderProps = {
    ...props,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    business,
    handleBusinessClick
  }

  return (
    <>
      <NavBar
        title={t('PREORDER', 'Preorder')}
        onActionLeft={() => props.navigation?.canGoBack() && props.navigation.goBack()}
      />
      <SafeAreaViewWrapper disableScrollView>
        <BusinessPreorderController {...businessPreorderProps} />
      </SafeAreaViewWrapper>
    </>
  )
}

export default BusinessPreorder
