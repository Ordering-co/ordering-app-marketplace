import { useState, useEffect } from 'react'
import { useApi, useSession, useWebsocket } from '@components'

const cache: any = {}

const gatewayOf = (pm: any) => pm?.gateway || pm?.paymethod?.gateway
const featuredOf = (pm: any) => pm?.featured || pm?.paymethod?.featured || []
const isEnabled = (pm: any) => (pm?.enabled ?? pm?.paymethod?.enabled ?? true) !== false

export const useSavedCardsGateway = () => {
  const [ordering] = useApi()
  const [{ token }] = useSession()
  const socket = useWebsocket()
  const [state, setState] = useState<any>({ loading: true, gateway: null, paymethodId: null })

  useEffect(() => {
    let mounted = true
    const resolve = async () => {
      if (!token || !ordering?.project) return
      const key = `${ordering.project}_${token}`
      if (!cache[key]) {
        cache[key] = (async () => {
          try {
            const response = await fetch(`${ordering.root}/paymethods`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'X-App-X': ordering.appId,
                'X-INTERNAL-PRODUCT-X': ordering.appInternalName,
                'X-Socket-Id-X': socket?.getId()
              }
            })
            const { error, result } = await response.json()
            if (error || !Array.isArray(result)) return { gateway: null, paymethodId: null }
            const braintree = result.find((pm: any) => gatewayOf(pm) === 'braintree' && featuredOf(pm).includes('get_cards') && isEnabled(pm))
            if (braintree) return { gateway: 'braintree', paymethodId: braintree.id ?? braintree?.paymethod?.id }
            // Stripe hidden until we can verify it's configured at the project level
            // const stripe = result.find((pm: any) => gatewayOf(pm) === 'stripe' && isEnabled(pm))
            // if (stripe) return { gateway: 'stripe', paymethodId: stripe.id ?? stripe?.paymethod?.id }
            return { gateway: null, paymethodId: null }
          } catch (err) {
            return { gateway: null, paymethodId: null }
          }
        })()
      }
      const resolved = await cache[key]
      if (mounted) setState({ loading: false, ...resolved })
    }
    resolve()
    return () => { mounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordering?.project, token])

  return { ...state, isAvailable: !!state.gateway }
}
