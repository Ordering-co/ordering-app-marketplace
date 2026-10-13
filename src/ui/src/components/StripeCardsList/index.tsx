import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { PlaceholderLine } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';
import {
  PaymentOptionStripe,
  useSession,
  useLanguage,
  useValidationFields
} from '@components';
import { getIconCard } from '../../utils';
import {
  OSItem,
  OSItemContent,
  OSItemActions,
} from '../PaymentOptionStripe/styles';
import {
  OAlert,
  OIcon,
  OText,
  NotFoundSource,
  OButton,
  StripeElementsForm
} from '@ui';

const paymethodsWithoutStripeForm = ['credomatic', 'izipay', 'globalpay', 'hitpay', 'braintree', 'cybersource']

export const StripeCardsListUI = (props: any) => {
  const {
    onSelectCard,
    deleteCard,
    cardsList,
    handleCardClick,
    onOpen,
    gateway,
    paySelected,
    newCardAdded,
    addNewCardAsDefault,
    setUserHasCards,
    cardSelected,
    paymethodV2Featured,
    deleteUserCard,
    deleteBusinessUserPaymethod
  } = props

  const theme = useTheme()
  const [{ token }] = useSession()
  const [, t] = useLanguage()
  const [validationFields] = useValidationFields()
  const validateZipcodeCard =
    validationFields?.fields?.card?.zipcode?.enabled && validationFields?.fields?.card?.zipcode?.required

  const [openStripeForm, setOpenStripeForm] = useState(false)

  const handleCardSelected = (card: any) => {
    if (!card?.zipcode && validateZipcodeCard) return
    handleCardClick(card);
    onSelectCard(card);
  }

  const handleDeleteCard = (card: any) => {
    paymethodV2Featured
      ? ['izipay'].includes(gateway)
        ? deleteUserCard(card)
        : deleteBusinessUserPaymethod(card)
      : deleteCard(card)
  }

  useEffect(() => {
    if (!cardsList?.loading && cardsList?.cards?.length === 0 && !paymethodsWithoutStripeForm.includes(gateway)) {
      onOpen && onOpen();
    }
  }, [cardsList?.loading])

  useEffect(() => {
    if (newCardAdded && addNewCardAsDefault) {
      handleCardSelected(newCardAdded)
    }
  }, [JSON.stringify(newCardAdded)])

  useEffect(() => {
    const hasCardSelected = cardsList?.cards?.some?.((card: any) => card?.id === paySelected?.data?.id)
    setUserHasCards && setUserHasCards(cardsList?.cards?.length > 0 && hasCardSelected)
  }, [cardsList?.cards?.length, paySelected])

  return (
    <View style={{ marginTop: 20 }}>
      {token && cardsList.error && cardsList.error.length > 0 && (
        <NotFoundSource
          content={cardsList?.error[0]?.message || cardsList?.error[0]}
        />
      )}

      {token && cardsList.loading && (
        <View style={{ width: '100%' }}>
          {[...Array(2)].map((_, i) => (
            <PlaceholderLine
              key={i}
              height={44}
              noMargin
              style={{ marginBottom: 20 }}
            />
          ))}
        </View>
      )}

      {token && !cardsList.loading && cardsList.cards && cardsList.cards.length > 0 && (
        <ScrollView
          horizontal={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
          style={styles.cardsList}
        >
          {cardsList.cards.map((card: any) => (
            <OSItem key={card.id} isUnique={cardsList.cards.length} isInvalid={!card?.zipcode && validateZipcodeCard}>
              <OSItemContent onPress={() => handleCardSelected(card)}>
                <View style={styles.viewStyle}>
                  {(card.id === (paySelected?.data?.id || cardSelected?.id)) ? (
                    <OIcon
                      src={theme.images.general.radio_act}
                      width={16}
                      color={theme.colors.primary}
                    />
                  ) : (
                    <OIcon
                      src={theme.images.general.radio_nor}
                      width={16}
                      color={theme.colors.disabled}
                    />
                  )}
                </View>
                <View style={styles.viewStyle}>
                  {getIconCard(card.brand, 20)}
                </View>
                <View style={styles.viewStyle}>
                  <OText size={12} color={theme.colors.textNormal}>
                    XXXX-XXXX-XXXX-{card.last4 || '****'}
                  </OText>
                </View>
                {!card?.zipcode && validateZipcodeCard && (
                  <View style={styles.viewStyle}>
                    <OText size={10} color={theme?.colors?.danger5}>
                      ({t('MISSING_ZIPCODE', 'Missing zipcode')})
                    </OText>
                  </View>
                )}
              </OSItemContent>
              {(paymethodV2Featured?.includes('delete_cards') || !paymethodV2Featured) && (
                <OSItemActions>
                  <OAlert
                    title={t('CARD', 'Card')}
                    message={t('QUESTION_DELETE_CARD', 'Are you sure that you want to delete the card?')}
                    onAccept={() => handleDeleteCard(card)}
                  >
                    <OIcon
                      src={theme.images.general.trash}
                      width={16}
                      color={theme.colors.disabled}
                    />
                  </OAlert>
                </OSItemActions>
              )}
            </OSItem>
          ))}
        </ScrollView>
      )}

      {token && !cardsList.loading && !openStripeForm && !paymethodsWithoutStripeForm.includes(gateway) && (
        <OButton
          text={t('ADD_PAYMENT_CARD', 'Add New Payment Card')}
          style={styles.btnAddStyle}
          textStyle={{ fontSize: 12 }}
          onClick={() => setOpenStripeForm(!openStripeForm)}
        />
      )}
      {openStripeForm && (
        <View style={{ marginTop: 20 }}>
          <StripeElementsForm
            toSave={props.toSave}
            gateway={gateway}
            openCarts={props.openCarts}
            businessId={props.businessId}
            businessIds={props.businessIds}
            publicKey={props.publicKey}
            publicKeyAddCard={props.publicKeyAddCard}
            accountId={props.accountId}
            requirements={props.clientSecret}
            onSelectCard={onSelectCard}
            setNewCardAdded={props.handleNewCard}
            setCardsList={props.setCardsList}
            cardsList={cardsList}
            handleCardClick={handleCardClick}
            onCancel={() => setOpenStripeForm(!openStripeForm)}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  viewStyle: {
    marginRight: 7
  },
  cardsList: {
    width: '100%',
    maxHeight: 150
  },
  btnAddStyle: {
    borderRadius: 7.6,
    shadowOpacity: 0,
    height: 44,
    borderWidth: 1
  }
})

export const StripeCardsList = (props: any) => {
  const stripeCardsListProps = {
    ...props,
    UIComponent: StripeCardsListUI
  }
  return (
    <PaymentOptionStripe {...stripeCardsListProps} />
  )
}
