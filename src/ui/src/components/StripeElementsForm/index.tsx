import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import {
  StripeProvider,
  CardField,
  useConfirmSetupIntent,
  createPaymentMethod
} from '@stripe/stripe-react-native';
import { useTheme } from 'styled-components/native';
import { Container, ErrorMessage } from './styles';
import { StripeElementsForm as StripeFormController } from './naked';

import { useLanguage, useSession, useValidationFields, useToast, ToastType } from '@components';
import {
  OButton,
  OText,
  StripeMethodForm
} from '@ui'

const StripeElementsFormUI = (props: any) => {
  const {
    publicKeyState,
    handleSource,
    values,
    businessId,
    requirements,
    stripeTokenHandler,
    methodsPay,
    paymethod,
    onCancel,
    cart,
    merchantId,
    businessIds,
    setMethodPaySupported,
    placeByMethodPay,
    methodPaySupported,
    setPlaceByMethodPay,
    cartTotal,
    publicKeyAddCard,
    urlscheme,
    androidAppId,
    businessNames,
    stripeAccountId,
    toSave,
    gateway
  } = props;

  const theme = useTheme();

  const [, t] = useLanguage();
  const [{ user }] = useSession();
  const [validationFields] = useValidationFields()
  const [, { showToast }] = useToast();
  const [card, setCard] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const { confirmSetupIntent, loading: confirmSetupLoading } = useConfirmSetupIntent();
  const [createPmLoading, setCreatePmLoading] = useState(false);
  const zipCodeEnabled = validationFields?.fields?.card?.zipcode?.enabled
  const zipCodeRequired = validationFields?.fields?.card?.zipcode?.required
  const platformPublishableKey = publicKeyState?.key
  const isConnectAddCard = gateway === 'stripe_connect' && toSave
  const publishableKeyForProvider = isConnectAddCard
    ? (publicKeyAddCard || platformPublishableKey)
    : methodsPay?.includes(paymethod)
      ? platformPublishableKey
      : (publicKeyAddCard || platformPublishableKey)
  const providerStripeAccountId = isConnectAddCard ? undefined : stripeAccountId
  const isRequirementsLoading = toSave && values.loading
  const isSaveReady = isCompleted && (!toSave || (!!requirements && !isRequirementsLoading))

  const resolveAddCardErrorMessage = (error: any) => {
    const rawMessage = (error?.message || error?.toString?.() || '').toLowerCase()
    const isStripeSetupError =
      error?.stripeErrorCode === 'resource_missing' ||
      rawMessage.includes('no such setupintent') ||
      rawMessage.includes('client_secret') ||
      rawMessage.includes('setupintent')

    if (isStripeSetupError) {
      return t(
        'ERROR_ADD_CARD_SETUP',
        'We couldn\'t save your card. Please try again or choose another payment method.'
      )
    }

    if (error?.code === 'Unknown' || !error?.message) {
      return t('ERROR_ADD_CARD', 'We couldn\'t save your card. Please check your card details and try again.')
    }

    return error.message
  }

  const showFormError = (error: any) => {
    const message = typeof error === 'string' ? error : resolveAddCardErrorMessage(error)
    showToast(ToastType.Error, message)
  }

  const styles = StyleSheet.create({
    btnAddStyle: {
      borderRadius: 8,
      shadowOpacity: 0,
      height: 44
    },
    cardField: {
      height: 44,
      marginBottom: 20
    }
  })
  const cardStyle = {
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: theme.colors.border
  }

  let billingDetails: any = {}

  if (user?.name || user?.lastname) {
    if (user?.name) {
      billingDetails.name = user?.name
    }
    if (user?.lastname) {
      billingDetails.name = `${billingDetails?.name} ${user?.lastname}`
    }
  }

  if (user?.email) {
    billingDetails.email = user?.email
  }

  if (user?.address) {
    billingDetails.address = {
      line1: user?.address
    }
  }

  const createPayMethod = async () => {
    const params: any = { paymentMethodType: 'Card', paymentMethodData: {} }
    if (Object.keys(billingDetails).length > 0) {
      params.paymentMethodData.billingDetails = { ...billingDetails, token: card?.last4 }
    }
    try {
      setCreatePmLoading(true)
      const { paymentMethod, error } = await createPaymentMethod(params);

      if (error) {
        showFormError(error);
        setCreatePmLoading(false)
        return
      }

      setCreatePmLoading(false)
      handleSource && handleSource({
        id: paymentMethod.id,
        type: 'card',
        card: {
          brand: paymentMethod.Card.brand,
          last4: paymentMethod.Card.last4
        }
      })
    } catch (error: any) {
      showFormError(error);
      setCreatePmLoading(false)
    }
  }

  const handleSaveCard = async () => {
    if (!requirements) {
      if (isRequirementsLoading) return
      if (toSave) {
        showFormError(t('ERROR_ADD_CARD_SETUP', 'We couldn\'t save your card. Please try again or choose another payment method.'))
        return
      }
      createPayMethod();
      return
    }
    const params: any = { paymentMethodType: 'Card', paymentMethodData: {} }
    if (Object.keys(billingDetails).length > 0) {
      params.paymentMethodData.billingDetails = { ...billingDetails, token: card?.last4 }
    }
    try {
      const { setupIntent, error } = await confirmSetupIntent(requirements, params);

      if (setupIntent?.status?.toLowerCase?.() === 'succeeded') {
        if (businessIds) {
          businessIds.forEach((_businessId: any, index: any) => {
            const _isNewCard = index === 0
            stripeTokenHandler(setupIntent?.paymentMethod?.id, user, _businessId, _isNewCard);
          })
        } else {
          stripeTokenHandler(setupIntent?.paymentMethod?.id, user, businessId);
        }
      }

      if (error) {
        showFormError(error);
      }
    } catch (error: any) {
      showFormError(error);
    }
  };

  useEffect(() => {
    if (card) {
      setIsCompleted(
        !!card?.last4 &&
        !!card?.expiryMonth &&
        !!card?.expiryYear &&
        !!card?.brand &&
        ((!zipCodeEnabled || !zipCodeRequired || !!card?.postalCode))
      )
    }
  }, [card])

  return (
    <Container>
      {!publicKeyState.loading && publicKeyState?.key ? (
        <View style={{ flex: 1 }}>
          <StripeProvider
            publishableKey={publishableKeyForProvider}
            merchantIdentifier={merchantId}
            {...(providerStripeAccountId ? { stripeAccountId: providerStripeAccountId } : {})}
            {...(urlscheme && {
              urlScheme: `${urlscheme}://checkout/${cart?.uuid}`
            })}
          >
            {methodsPay?.includes(paymethod) ? (
              <StripeMethodForm
                handleSource={handleSource}
                onCancel={onCancel}
                cart={cart}
                cartTotal={cartTotal}
                setErrors={showFormError}
                paymethod={paymethod}
                devMode={publicKeyState?.key?.includes('test')}
                setMethodPaySupported={setMethodPaySupported}
                placeByMethodPay={placeByMethodPay}
                methodPaySupported={methodPaySupported}
                setPlaceByMethodPay={setPlaceByMethodPay}
                androidAppId={androidAppId}
                businessNames={businessNames}
              />
            ) : (
              <CardField
                postalCodeEnabled={zipCodeEnabled}
                cardStyle={cardStyle}
                style={styles.cardField}
                onCardChange={(cardDetails: any) => setCard(cardDetails)}
              />
            )}
          </StripeProvider>
          {!methodsPay?.includes(paymethod) && (
            <OButton
              text={isCompleted ? t('SAVE_CARD', 'Save card') : t('CANCEL', 'Cancel')}
              style={styles.btnAddStyle}
              loading={confirmSetupLoading || values.loadingAdd || createPmLoading || isRequirementsLoading}
              disabled={isCompleted && !isSaveReady}
              onClick={() => isCompleted ? (isSaveReady ? handleSaveCard() : undefined) : onCancel()}
            />
          )}
        </View>
      ) : publicKeyState.loading ? (
        <Placeholder Animation={Fade}>
          <PlaceholderLine height={50} style={{ marginTop: 20 }} />
        </Placeholder>
      ) : (
        <ErrorMessage>
          <OText
            size={20}
            color={theme.colors.error}
            style={{ marginTop: 20 }}
          >
            {t('SOMETHING_WRONG', 'Something is wrong!')}
          </OText>
        </ErrorMessage>
      )}
    </Container>
  )
}

export const StripeElementsForm = (props: any) => {
  const stripeProps = {
    ...props,
    UIComponent: StripeElementsFormUI,
    onSelectCard: (card: any) => {
      props.onSelectCard(card);
      if (card) {
        props.onCancel && props.onCancel();
      }
    }
  }
  return <StripeFormController {...stripeProps} />
}
