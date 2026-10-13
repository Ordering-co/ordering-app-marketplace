import React, { useEffect } from 'react';
import { useTheme } from 'styled-components/native';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';

import { SingleGiftCard } from '../SingleGiftCard';
import { ProductsListContainer, SingleGiftCardWrapper, WrappButton } from './styles'

import { useLanguage, GiftCardOrdersList as GiftCardOrdersListController } from '@components';
import { OButton, OText } from '../../shared';

const VerticalGiftCardOrdersLayoutUI = (props: any) => {
  const {
    giftCards,
    paginationProps,
    loadMoreOrders,
    title,
    setIsEmpty,
    onNavigationRedirect
  } = props

  const theme = useTheme();
  const [, t] = useLanguage()

  useEffect(() => {
    if (giftCards.loading) return
    if (giftCards.list?.length === 0) setIsEmpty(true)
  }, [giftCards])

  return (
    <ProductsListContainer>
      {
        giftCards.loading ? (
          <Placeholder Animation={Fade} style={{ marginVertical: 16 }}>
            <PlaceholderLine width={30} height={16} />
          </Placeholder>
        ) : giftCards.list?.length > 0 && (
          <OText size={16} lineHeight={24} weight={'bold'} mBottom={20} style={{ marginTop: 24 }}>{title}</OText>
        )}
      {giftCards.list.map((card: any) => (
        <SingleGiftCardWrapper key={card.id}>
          <SingleGiftCard
            card={card}
            onNavigationRedirect={onNavigationRedirect}
          />
        </SingleGiftCardWrapper>
      ))}
      {giftCards.loading && (
        [...Array(10).keys()].map(i => (
          <SingleGiftCardWrapper key={i}>
            <SingleGiftCard
              isSkeleton
            />
          </SingleGiftCardWrapper>
        ))
      )}
      {paginationProps.totalPages && paginationProps.currentPage < paginationProps.totalPages && (
        <WrappButton>
          <OButton
            onClick={loadMoreOrders}
            text={t('LOAD_MORE_ORDERS', 'Load more orders')}
            style={{ borderRadius: 7.6, shadowOpacity: 0 }}
          />
        </WrappButton>
      )}
    </ProductsListContainer>
  )
}

export const VerticalGiftCardOrdersLayout = (props: any) => {
  const giftCardsProps = {
    ...props,
    UIComponent: VerticalGiftCardOrdersLayoutUI
  }
  return <GiftCardOrdersListController {...giftCardsProps} />
}
