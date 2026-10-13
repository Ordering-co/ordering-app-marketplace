import { renderHook, waitFor } from '@testing-library/react-native'
import { useBusinessVerticals } from '../useBusinessVerticals'

const mockApi: any = { verticals: {}, get: jest.fn() }

jest.mock('@components', () => ({
  useApi: () => [{
    businesses: (id: number) => ({
      select: () => ({
        get: () => {
          mockApi.get(id)
          const vertical = mockApi.verticals[id]
          return Promise.resolve({ content: { error: vertical === undefined, result: vertical === undefined ? ['NOT_FOUND'] : { id, vertical } } })
        }
      })
    })
  }]
}))

describe('useBusinessVerticals', () => {
  beforeEach(() => {
    mockApi.get.mockReset()
    mockApi.verticals = { 3169: 'school', 3103: 'school', 2: 'food' }
  })

  it('resolves the vertical of every requested business', async () => {
    const { result } = renderHook(() => useBusinessVerticals([3169, 2]))
    await waitFor(() => expect(result.current).toEqual({ 3169: 'school', 2: 'food' }))
  })

  it('does not request the same business twice', async () => {
    const { result, rerender } = renderHook(({ ids }: any) => useBusinessVerticals(ids), { initialProps: { ids: [3103] } })
    await waitFor(() => expect(result.current).toEqual({ 3103: 'school' }))
    rerender({ ids: [3103, 3169] })
    await waitFor(() => expect(result.current).toEqual({ 3103: 'school', 3169: 'school' }))
    expect(mockApi.get.mock.calls.filter(([id]: any) => id === 3103)).toHaveLength(1)
  })

  it('omits businesses the API cannot resolve', async () => {
    const { result } = renderHook(() => useBusinessVerticals([999, 2]))
    await waitFor(() => expect(result.current).toEqual({ 2: 'food' }))
  })

  it('returns an empty map without ids', () => {
    const { result } = renderHook(() => useBusinessVerticals([]))
    expect(result.current).toEqual({})
    expect(mockApi.get).not.toHaveBeenCalled()
  })
})
