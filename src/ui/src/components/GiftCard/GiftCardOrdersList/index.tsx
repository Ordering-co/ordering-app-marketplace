import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components/native';

import { VerticalGiftCardOrdersLayout } from '../VerticalGiftCardOrdersLayout'
import { Container, NoOrdersWrapper } from './styles'
import { useLanguage } from '@components';
import { NotFoundSource } from '@ui'

export const GiftCardOrdersList = (props: any) => {
  const {
    onNavigationRedirect,
    refreshOrders,
    setRefreshOrders
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [isEmptyPending, setIsEmptyPending] = useState(false);
  const [isEmptySent, setIsEmptySent] = useState(false);
  const [isEmptyRedeemed, setIsEmptyRedeemed] = useState(false);

  return (
    <Container>
      <VerticalGiftCardOrdersLayout
        title={t('PENDING', 'Pending')}
        defaultStatus='pending'
        setIsEmpty={setIsEmptyPending}
        onNavigationRedirect={onNavigationRedirect}
        refreshOrders={refreshOrders}
        setRefreshOrders={setRefreshOrders}
      />

      {!isEmptyPending && (
        <View
          style={{
            height: 8,
            backgroundColor: theme.colors.backgroundGray100,
            marginHorizontal: -40,
          }}
        />
      )}

      <VerticalGiftCardOrdersLayout
        title={t('SENT', 'Sent')}
        defaultStatus='sent'
        setIsEmpty={setIsEmptySent}
        onNavigationRedirect={onNavigationRedirect}
        refreshOrders={refreshOrders}
        setRefreshOrders={setRefreshOrders}
      />

      <VerticalGiftCardOrdersLayout
        title={t('REDEEMED', 'Redeemed')}
        defaultStatus='activated'
        setIsEmpty={setIsEmptyRedeemed}
        onNavigationRedirect={onNavigationRedirect}
        refreshOrders={refreshOrders}
        setRefreshOrders={setRefreshOrders}
      />

      {isEmptyPending && isEmptySent && isEmptyRedeemed && (
        <NoOrdersWrapper>
          <NotFoundSource
            srcImage={theme.images.general.notFound}
            content={t('YOU_DONT_HAVE_CARDS', 'You don\'t have cards')}
          />
        </NoOrdersWrapper>
      )}
    </Container>
  )
}
