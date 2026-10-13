import React, { useEffect, useState } from 'react';
import { useApi, useSession, useToast, ToastType, useWebsocket } from '@components';

export const StripeElementsForm = (props: any) => {
  const {
    UIComponent,
    toSave,
    setCardsList,
    handleCardClick
  } = props;

  const [ordering] = useApi();
  const [{ token }] = useSession();
  const socket = useWebsocket();
  const [, { showToast }] = useToast();
  const [state, setState] = useState<any>({ loading: false, loadingAdd: false, error: null, requirements: null });
  const [publicKeyState, setPublicKeyState] = useState({ key: props.publicKey, loading: true, error: null })

  const getRequirements = async () => {
    if (!toSave) return
    const url = `${ordering.root}/payments/stripe/requirements?type=add_card`
    try {
      setState((prev: any) => ({ ...prev, loading: true }))
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-App-X': ordering.appId,
          'X-INTERNAL-PRODUCT-X': ordering.appInternalName,
          ...(socket?.getId?.() ? { 'X-Socket-Id-X': socket.getId() } : {})
        }
      }
      const response = await fetch(url, requestOptions)
      const json = await response.json();
      setState((prev: any) => ({
        ...prev,
        loading: false,
        requirements: json?.result ?? null,
        error: json?.error ? json.result : null
      }))
    } catch (error) {
      setState((prev: any) => ({
        ...prev,
        loading: false,
        error
      }))
    }
  }

  const stripeTokenHandler = async (tokenId: string, user: any, targetBusinessId: string, isNewCard: any = true) => {
    const body = {
      business_id: targetBusinessId,
      gateway: 'stripe',
      token_id: tokenId,
      user_id: user?.id
    }
    try {
      setState((prev: any) => ({ ...prev, loadingAdd: true }))
      const result = await fetch(`${ordering.root}/payments/stripe/cards`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-App-X': ordering.appId,
          'X-INTERNAL-PRODUCT-X': ordering.appInternalName,
          ...(socket?.getId?.() ? { 'X-Socket-Id-X': socket.getId() } : {})
        },
        body: JSON.stringify(body)
      })
      const response = await result.json();
      if (response.error) {
        const errorMessage = Array.isArray(response.result)
          ? response.result[0]?.message || response.result[0]
          : response.result?.message || response.result
        showToast(ToastType.Error, errorMessage || 'Error saving card')
        setState((prev: any) => ({
          ...prev,
          loadingAdd: false,
          error: response.result
        }))
        return
      }
      isNewCard && props.onSelectCard && props.onSelectCard(response.result);
      setCardsList && setCardsList((prev: any) => {
        const cards = prev?.cards || []
        if (cards.some((existing: any) => existing?.id === response.result?.id)) {
          return prev
        }
        return {
          ...prev,
          cards: [...cards, response.result]
        }
      })
      handleCardClick && handleCardClick(response.result)
      setState((prev: any) => ({
        ...prev,
        loadingAdd: false
      }))
    } catch (error) {
      setState((prev: any) => ({
        ...prev,
        loadingAdd: false,
        error
      }))
    }
  }

  /**
   * Method to get stripe credentials from API
   */
  const getCredentials = async () => {
    try {
      setPublicKeyState((prev: any) => ({ ...prev, loading: true }))
      const { content: { result, error } } = await ordering.setAccessToken(token).paymentCards().getCredentials()
      if (!error) {
        setPublicKeyState({
          loading: false,
          key: result.publishable,
          error: null
        })
      } else {
        setPublicKeyState((prev: any) => ({
          ...prev,
          loading: false,
          error: result
        }))
      }
    } catch (error: any) {
      setPublicKeyState((prev: any) => ({
        ...prev,
        loading: false,
        error: error.message
      }))
    }
  }

  useEffect(() => {
    if (!token) return
    if (props.publicKey) {
      setPublicKeyState({
        loading: false,
        key: props.publicKey,
        error: null
      })
    } else {
      getCredentials()
    }
  }, [token, props.publicKey])

  useEffect(() => {
    if (!token || state.requirements) return
    getRequirements()
  }, [token])

  return (
    <UIComponent
      {...props}
      values={state}
      requirements={state.requirements}
      stripeTokenHandler={stripeTokenHandler}
      publicKeyState={publicKeyState}
    />
  )
}
