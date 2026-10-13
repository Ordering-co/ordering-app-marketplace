import React, { useState } from 'react'
import { RefreshControl, View } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { useTheme } from 'styled-components/native'

import { HelpParams } from '../../types'
import { CmsContent } from './functions'
import { Container, HelpSubItem, LastOrdersContainer } from './styles'

import { useLanguage } from '@components'
import { AnimatedItem, OText, OIcon, NotFoundSource, LastOrders } from '@ui'

const HelpUI = (props: HelpParams) => {
  const { cmsState, onRedirect } = props

  const { items, loading, error, pages } = cmsState

  const [, t] = useLanguage()
  const theme = useTheme()

  const [refreshing] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const HelpItem = ({ item }: any) => {
    const currentItem = pages.find((p: any) => p.id === item.id)
    return (
      <HelpSubItem
        activeOpacity={0.7}
        onPress={() => onRedirect('HelpOptions', { item: currentItem })}
      >
        <OText size={14} style={{ width: '90%' }}>
          {item.name}
        </OText>
        <OIcon
          width={15}
          src={theme.images.general.chevron_right}
        />
      </HelpSubItem>
    )
  }

  return (
    <Container
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => setRefresh(true)}
        />
      }
    >
      <OText
        size={theme.utils.tsize.l}
        weight={'bold'}
        style={{ marginBottom: 20 }}
      >
        {t('ALL_THE_THEMES', 'All the themes')}
      </OText>
      {!loading && !error && items.map((item: any, idx: number) => (
        <AnimatedItem
          key={item.id}
          index={idx}
          item={<HelpItem item={item} />}
        />
      ))}
      {loading && (
        <Placeholder Animation={Fade}>
          <View style={{ flexDirection: 'column' }}>
            {[...Array(5)].map((_, i) => (
              <HelpSubItem key={i}>
                <PlaceholderLine key={i} height={30} width={100} noMargin />
              </HelpSubItem>
            ))}
          </View>
        </Placeholder>
      )}
      {!loading && !!error && (
        <NotFoundSource
          simple
          content={error}
        />
      )}
      <LastOrdersContainer>
        <OText size={18} weight={600}>{t('LAST_ORDERS', 'Last Orders')}</OText>
        <LastOrders {...props} onRedirect={onRedirect} refresh={refresh} setRefresh={setRefresh} />
      </LastOrdersContainer>
    </Container>
  )
}

export const Help = (props: HelpParams) => {
  const helpProps = {
    ...props,
    UIComponent: HelpUI
  }
  return (
    <CmsContent {...helpProps} />
  )
}
