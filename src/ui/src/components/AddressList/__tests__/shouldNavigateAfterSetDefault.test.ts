import {
  runSetDefaultThenNavigate,
  shouldNavigateAfterSetDefault
} from '../shouldNavigateAfterSetDefault'

describe('shouldNavigateAfterSetDefault', () => {
  it('navigates when set-default returns nothing', () => {
    expect(shouldNavigateAfterSetDefault(undefined)).toBe(true)
    expect(shouldNavigateAfterSetDefault(null)).toBe(true)
  })

  it('stays on AddressList when set-default reports an error', () => {
    expect(shouldNavigateAfterSetDefault({ error: true })).toBe(false)
    expect(shouldNavigateAfterSetDefault({ error: ['failed'] })).toBe(false)
    expect(shouldNavigateAfterSetDefault(false)).toBe(false)
  })
})

describe('runSetDefaultThenNavigate', () => {
  it('waits for set-default before navigating', async () => {
    let resolveDefault: ((value?: unknown) => void) | undefined
    const setDefault = jest.fn(() => new Promise((resolve) => {
      resolveDefault = resolve
    }))
    const navigate = jest.fn()

    const pending = runSetDefaultThenNavigate({ setDefault, navigate })
    expect(navigate).not.toHaveBeenCalled()

    resolveDefault?.()
    await expect(pending).resolves.toBe(true)
    expect(navigate).toHaveBeenCalledTimes(1)
  })

  it('does not navigate when set-default throws', async () => {
    const navigate = jest.fn()

    await expect(runSetDefaultThenNavigate({
      setDefault: async () => {
        throw new Error('network')
      },
      navigate
    })).resolves.toBe(false)

    expect(navigate).not.toHaveBeenCalled()
  })

  it('does not navigate when set-default returns an error', async () => {
    const navigate = jest.fn()

    await expect(runSetDefaultThenNavigate({
      setDefault: async () => ({ error: true }),
      navigate
    })).resolves.toBe(false)

    expect(navigate).not.toHaveBeenCalled()
  })
})
