import {
  fetchUserAddressesList,
  getPostAuthAddressScreen,
  getPostAuthNavigateArgs,
  resolvePostAuthAddressScreen
} from '../getPostAuthAddressScreen'

describe('getPostAuthAddressScreen', () => {
  it('returns null when addresses are missing from the auth payload', () => {
    expect(getPostAuthAddressScreen(undefined)).toBeNull()
    expect(getPostAuthAddressScreen(null)).toBeNull()
  })

  it('sends users with a default address home', () => {
    expect(getPostAuthAddressScreen([{ default: true }])).toBe('Home')
  })

  it('sends users without a default address to AddressList', () => {
    expect(getPostAuthAddressScreen([])).toBe('AddressList')
    expect(getPostAuthAddressScreen([{ default: false }])).toBe('AddressList')
  })
})

describe('resolvePostAuthAddressScreen', () => {
  it('does not fetch when the auth payload already has addresses', async () => {
    const fetchAddresses = jest.fn()

    await expect(resolvePostAuthAddressScreen({
      addresses: [{ default: true }],
      fetchAddresses
    })).resolves.toBe('Home')

    await expect(resolvePostAuthAddressScreen({
      addresses: [],
      fetchAddresses
    })).resolves.toBe('AddressList')

    expect(fetchAddresses).not.toHaveBeenCalled()
  })

  it('goes home when a fetched address is default', async () => {
    await expect(resolvePostAuthAddressScreen({
      fetchAddresses: async () => [{ default: true }]
    })).resolves.toBe('Home')
  })

  it('opens AddressList when the fetched list has no default', async () => {
    await expect(resolvePostAuthAddressScreen({
      fetchAddresses: async () => []
    })).resolves.toBe('AddressList')
  })

  it('goes home when addresses are missing and the fetch fails', async () => {
    await expect(resolvePostAuthAddressScreen({
      fetchAddresses: async () => {
        throw new Error('network')
      }
    })).resolves.toBe('Home')
  })

  it('goes home when addresses are missing and there is no fetch', async () => {
    await expect(resolvePostAuthAddressScreen({})).resolves.toBe('Home')
  })
})

describe('fetchUserAddressesList', () => {
  const createOrdering = (content: { error?: unknown, result?: unknown }) => {
    const get = jest.fn().mockResolvedValue({ content })
    const addresses = jest.fn(() => ({ get }))
    const users = jest.fn(() => ({ addresses }))
    const setAccessToken = jest.fn(() => ({ users }))
    return { ordering: { setAccessToken }, setAccessToken, users, addresses, get }
  }

  it('returns the address list when the request succeeds', async () => {
    const { ordering, setAccessToken, users, get } = createOrdering({
      error: false,
      result: [{ default: true }]
    })

    await expect(fetchUserAddressesList({
      ordering,
      accessToken: 'token',
      userId: 9
    })).resolves.toEqual([{ default: true }])

    expect(setAccessToken).toHaveBeenCalledWith('token')
    expect(users).toHaveBeenCalledWith(9)
    expect(get).toHaveBeenCalled()
  })

  it('returns null when the token or user id is missing', async () => {
    const { ordering, setAccessToken } = createOrdering({ result: [] })

    await expect(fetchUserAddressesList({
      ordering,
      accessToken: undefined,
      userId: 9
    })).resolves.toBeNull()

    await expect(fetchUserAddressesList({
      ordering,
      accessToken: 'token',
      userId: undefined
    })).resolves.toBeNull()

    expect(setAccessToken).not.toHaveBeenCalled()
  })

  it('returns null when the API reports an error', async () => {
    const { ordering } = createOrdering({ error: true, result: 'boom' })

    await expect(fetchUserAddressesList({
      ordering,
      accessToken: 'token',
      userId: 9
    })).resolves.toBeNull()
  })
})

describe('getPostAuthNavigateArgs', () => {
  it('navigates to home tabs', () => {
    expect(getPostAuthNavigateArgs('Home')).toEqual({
      name: 'BottomTab',
      params: { screen: 'Home' }
    })
  })

  it('navigates to AddressList', () => {
    expect(getPostAuthNavigateArgs('AddressList')).toEqual({
      name: 'AddressList'
    })
  })
})
