function hasDefaultAddress (addresses: unknown[]) {
  return addresses.some((address) => {
    if (!address || typeof address !== 'object') return false
    return !!(address as { default?: unknown }).default
  })
}

export function getPostAuthAddressScreen (addresses: unknown) {
  if (!Array.isArray(addresses)) return null
  return hasDefaultAddress(addresses) ? 'Home' : 'AddressList'
}

export async function resolvePostAuthAddressScreen ({
  addresses,
  fetchAddresses
}: {
  addresses?: unknown
  fetchAddresses?: () => Promise<unknown>
}) {
  const known = getPostAuthAddressScreen(addresses)
  if (known) return known

  if (!fetchAddresses) return 'Home'

  try {
    return getPostAuthAddressScreen(await fetchAddresses()) ?? 'Home'
  } catch {
    return 'Home'
  }
}

export function getPostAuthNavigateArgs (screen: 'Home' | 'AddressList') {
  if (screen === 'AddressList') {
    return { name: 'AddressList' as const }
  }

  return {
    name: 'BottomTab' as const,
    params: { screen: 'Home' }
  }
}

export async function fetchUserAddressesList ({
  ordering,
  accessToken,
  userId
}: {
  ordering: {
    setAccessToken: (token: string) => {
      users: (id: unknown) => {
        addresses: () => {
          get: () => Promise<{ content?: { error?: unknown, result?: unknown } }>
        }
      }
    }
  }
  accessToken?: unknown
  userId?: unknown
}) {
  if (typeof accessToken !== 'string' || !accessToken || userId == null) return null
  const { content } = await ordering.setAccessToken(accessToken).users(userId).addresses().get()
  if (content?.error) return null
  return content?.result
}
