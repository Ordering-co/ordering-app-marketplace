import React from 'react'
import { Text } from 'react-native'
import { render, screen, userEvent } from '@testing-library/react-native'
import { ProjectSetupGate } from '../../project-setup-gate'
import { prepareTenant } from '../tenant'
import { setRuntimeFranchise, selectedProjectSettings } from '../../config'
import { isLocalSimulatorMode } from '../ios-local-mode'
import SplashScreen from 'react-native-splash-screen'

jest.mock('react-native-splash-screen', () => ({ hide: jest.fn() }))

jest.mock('../ios-local-mode', () => ({ isLocalSimulatorMode: jest.fn(() => false) }))
jest.mock('react-native-safe-area-context', () => ({ SafeAreaView: require('react-native').View }))

jest.mock('../../config', () => ({
  selectedProjectSettings: { project: 'my_project', franchiseSlug: 'chosen', api: { url: 'https://api.example.test', version: 'v400', language: 'en' } },
  setRuntimeFranchise: jest.fn()
}))
jest.mock('../tenant', () => ({
  tenantIdentity: () => 'my-project-identity',
  shouldRunProjectSetup: (_settings: any, options: any) => options.isDev === true,
  prepareTenant: jest.fn()
}))

const prepare = prepareTenant as jest.Mock
const Child = jest.fn(() => <Text>Consumer app</Text>)

beforeEach(() => {
  jest.clearAllMocks()
  ;(isLocalSimulatorMode as jest.Mock).mockReturnValue(false)
  selectedProjectSettings.localSimulatorMode = false
})

it('does not mount consumer providers until public validation and storage migration finish', async () => {
  let complete: (value: any) => void = () => {}
  prepare.mockReturnValue(new Promise(resolve => { complete = resolve }))
  render(<ProjectSetupGate><Child /></ProjectSetupGate>)
  expect(screen.getByText('Checking public project configuration…')).toBeOnTheScreen()
  expect(screen.queryByText('Consumer app')).not.toBeOnTheScreen()
  expect(Child).not.toHaveBeenCalled()
  expect(SplashScreen.hide).toHaveBeenCalled()
  complete({ identity: 'my-project-identity', franchiseId: 34, franchiseSlug: 'chosen' })
  expect(await screen.findByText('Consumer app')).toBeOnTheScreen()
  expect(setRuntimeFranchise).toHaveBeenCalledWith(34)
})

it('keeps the consumer app unmounted on failure and supports retry', async () => {
  prepare.mockRejectedValueOnce(new Error('The project does not match'))
    .mockResolvedValueOnce({ identity: 'my-project-identity', franchiseId: 34, franchiseSlug: 'chosen' })
  render(<ProjectSetupGate><Child /></ProjectSetupGate>)
  expect(await screen.findByText('The project does not match')).toBeOnTheScreen()
  expect(Child).not.toHaveBeenCalled()
  const user = userEvent.setup()
  await user.press(screen.getByRole('button', { name: 'Retry validation' }))
  expect(await screen.findByText('Consumer app')).toBeOnTheScreen()
  expect(prepare).toHaveBeenCalledTimes(2)
})


it('shows only public selected project and slug in the explicit local preview banner', async () => {
  ;(isLocalSimulatorMode as jest.Mock).mockReturnValue(true)
  selectedProjectSettings.localSimulatorMode = true
  prepare.mockResolvedValue({ identity: 'my-project-identity', franchiseId: 34, franchiseSlug: 'chosen' })
  render(<ProjectSetupGate><Child /></ProjectSetupGate>)
  expect(await screen.findByText('Local simulator · my_project')).toBeOnTheScreen()
  expect(screen.getByText('Franchise: chosen')).toBeOnTheScreen()
  expect(setRuntimeFranchise).toHaveBeenCalledWith(34)
  expect(selectedProjectSettings.franchiseSlug).toBe('chosen')
})

it('returns the normal app directly in Release without validation or migration', () => {
  const previous = global.__DEV__
  global.__DEV__ = false
  try {
    render(<ProjectSetupGate><Child /></ProjectSetupGate>)
    expect(screen.getByText('Consumer app')).toBeOnTheScreen()
    expect(prepare).not.toHaveBeenCalled()
    expect(SplashScreen.hide).not.toHaveBeenCalled()
  } finally { global.__DEV__ = previous }
})
