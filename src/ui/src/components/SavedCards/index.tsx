import React, { useState, useEffect, useCallback } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import WebView from 'react-native-webview'
import { useTheme } from 'styled-components/native'
import Icon from 'react-native-vector-icons/Ionicons'

import { useApi, useSession, useWebsocket, useLanguage } from '@components'
import { OText, OButton, OModal, OAlert, StripeElementsForm } from '@ui'

import { useSavedCardsGateway } from './useSavedCardsGateway'
import { Container, AddButtonWrapper, CardRow, CardInfo, EmptyWrapper, WebViewWrapper, ModalBody } from './styles'

const DUMMY_BUSINESS_ID = -1

const styles = StyleSheet.create({
  brand: { marginLeft: 10, textTransform: 'capitalize' },
  last4: { marginLeft: 8 },
  webview: { flex: 1 }
})

export const SavedCards = (_props: any) => {
  const [, t] = useLanguage()
  const [ordering] = useApi()
  const [{ token, user }] = useSession()
  const socket = useWebsocket()
  const theme: any = useTheme()
  const { gateway, paymethodId, isAvailable, loading: gatewayLoading } = useSavedCardsGateway()

  const [cardsState, setCardsState] = useState<any>({ loading: true, cards: [], error: null })
  const [addModalOpen, setAddModalOpen] = useState(false)

  const buildHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'X-App-X': ordering.appId,
    'X-INTERNAL-PRODUCT-X': ordering.appInternalName,
    'X-Socket-Id-X': socket?.getId()
  })

  const loadCards = useCallback(async () => {
    if (!isAvailable) return
    setCardsState((prev: any) => ({ ...prev, loading: true, error: null }))
    try {
      if (gateway === 'braintree') {
        const response = await fetch(`${ordering.root}/users/${user.id}/paymethods/${paymethodId}/paymethods`, { headers: buildHeaders(), method: 'GET' })
        const content = await response.json()
        if (content.error) throw new Error(Array.isArray(content.result) ? content.result[0] : content.result)
        const cards = content.result.map((card: any) => ({ ...card, ...card.type_data, id: card.id, card_token: card.external_id }))
        setCardsState({ loading: false, cards, error: null })
      } else {
        const { content: { error, result } } = await ordering.setAccessToken(token).paymentCards(DUMMY_BUSINESS_ID, user.id).get()
        if (error) throw new Error(Array.isArray(result) ? result[0] : result)
        setCardsState({ loading: false, cards: result || [], error: null })
      }
    } catch (err: any) {
      setCardsState({ loading: false, cards: [], error: err.message })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAvailable, gateway, paymethodId, ordering, token, user])

  useEffect(() => {
    if (gatewayLoading) return
    if (isAvailable) loadCards()
    else setCardsState({ loading: false, cards: [], error: null })
  }, [gatewayLoading, isAvailable, loadCards])

  const handleDelete = async (card: any) => {
    try {
      if (gateway === 'braintree') {
        const response = await fetch(`${ordering.root}/users/${user.id}/paymethods/${paymethodId}/paymethods/${card.id}`, { method: 'DELETE', headers: buildHeaders() })
        const { error } = await response.json()
        if (error) return
      } else {
        const { content: { error } } = await ordering.paymentCards(DUMMY_BUSINESS_ID, user.id, card.id).delete()
        if (error) return
      }
      setCardsState((prev: any) => ({ ...prev, cards: prev.cards.filter((c: any) => c.id !== card.id) }))
    } catch (err) {
    }
  }

  const onBraintreeMessage = (e: any) => {
    let payment
    try {
      payment = JSON.parse(e?.nativeEvent?.data)
    } catch (parseError) {
      return
    }
    if (payment?.action === 'card' && !payment?.data?.transient_token) {
      setAddModalOpen(false)
      loadCards()
    }
  }

  const onStripeCardSaved = () => {
    setAddModalOpen(false)
    loadCards()
  }

  const braintreeIframeUrl = `https://paypal-braintree.plugins.orderingplus.com/${ordering.project}/views/card_form/user/${user?.id}/business/${DUMMY_BUSINESS_ID}?access_token=${token}&language=${ordering.language}`
  const showLoading = gatewayLoading || cardsState.loading

  if (showLoading) {
    return (
      <Container>
        <ActivityIndicator size='large' color={theme?.colors?.primary} />
      </Container>
    )
  }

  if (!isAvailable) {
    return (
      <Container>
        <EmptyWrapper>
          <OText>{t('SAVED_CARDS_NOT_AVAILABLE', 'Saved cards are not available for this store.')}</OText>
        </EmptyWrapper>
      </Container>
    )
  }

  return (
    <Container>
      <AddButtonWrapper>
        <OButton text={t('ADD_CARD', 'Add card')} onClick={() => setAddModalOpen(true)} />
      </AddButtonWrapper>

      {cardsState.error
        ? (
        <EmptyWrapper>
          <OText>{t('SAVED_CARDS_LOAD_ERROR', 'We could not load your cards. Please try again later.')}</OText>
        </EmptyWrapper>
          )
        : cardsState.cards.length === 0
          ? (
          <EmptyWrapper>
            <OText>{t('NO_SAVED_CARDS', 'You have no saved cards yet.')}</OText>
          </EmptyWrapper>
            )
          : (
              cardsState.cards.map((card: any) => (
                <CardRow key={card.id}>
                  <CardInfo>
                    <Icon name='card-outline' size={22} color={theme?.colors?.primary} />
                    <OText style={styles.brand}>{card.brand}</OText>
                    <OText style={styles.last4}>•••• {card.last4}</OText>
                  </CardInfo>
                  <OAlert
                    title={t('DELETE_CARD', 'Delete card')}
                    message={t('QUESTION_DELETE_CARD', 'Are you sure you want to delete this card?')}
                    onAccept={() => handleDelete(card)}
                  >
                    <Icon name='trash-outline' size={20} color={theme?.colors?.danger || '#d9534f'} />
                  </OAlert>
                </CardRow>
              ))
            )}

      <OModal open={addModalOpen} title={t('ADD_CARD', 'Add card')} onClose={() => setAddModalOpen(false)}>
        <ModalBody>
          {gateway === 'braintree'
            ? (
            <WebViewWrapper>
              <WebView source={{ uri: braintreeIframeUrl }} onMessage={onBraintreeMessage} javaScriptEnabled style={styles.webview} />
            </WebViewWrapper>
              )
            : (
            <StripeElementsForm
              businessId={DUMMY_BUSINESS_ID}
              toSave
              onSelectCard={onStripeCardSaved}
              onCancel={() => setAddModalOpen(false)}
            />
              )}
        </ModalBody>
      </OModal>
    </Container>
  )
}
