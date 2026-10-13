/**
 * Stable @components hook mocks for page/UI tests.
 * Import and pass to jest.mock('@components', () => mockOrdering) in test files,
 * or rely on the default mock registered in jest/setupAfterEnv.js.
 */
const t = (_key, fallback) => fallback ?? _key

const languageState = { loading: false, dictionary: {} }
const configState = { loading: false, configs: {} }
const sessionState = { auth: false, user: null, token: null }
const orderState = { loading: false, carts: [], options: {} }
const toastFns = { showToast: jest.fn() }
const eventFns = { emit: jest.fn() }

const mockOrdering = {
  ToastType: { Info: 'info', Success: 'success', Warning: 'warning', Error: 'error' },
  OrderingProvider: ({ children }) => children,
  useLanguage: jest.fn(() => [languageState, t]),
  useConfig: jest.fn(() => [configState]),
  useSession: jest.fn(() => [sessionState, {}]),
  useOrder: jest.fn(() => [orderState, {}]),
  useApi: jest.fn(() => [{}, {}]),
  useEvent: jest.fn(() => [eventFns]),
  useToast: jest.fn(() => [, toastFns]),
  useUtils: jest.fn(() => [{
    parseDate: (v) => v || '',
    parseTime: (v) => v || '',
    parsePrice: (v) => `$${v}`,
    timeFormat: 'HH:mm',
    is12Hours: false,
    preorderDateFormat: 'MM/DD',
    getMaxPreorderDays: () => 7,
    isWalletEnabled: () => true
  }, {}]),
  useWebsocket: jest.fn(() => [{ socket: null }]),
  useBusiness: jest.fn(() => [{}, {}]),
  useCustomer: jest.fn(() => [{}, {}]),
  useValidationFields: jest.fn(() => [{}, {}]),
  useSite: jest.fn(() => [{}]),
  useOrderingTheme: jest.fn(() => [{ theme: {} }]),
  useSchools: jest.fn(() => [{ schools: [] }]),
  useSchoolStudents: jest.fn(() => [{ students: [] }]),
  useSelectedStudent: jest.fn(() => [{ selectedStudent: null }, {}]),
  useCartStudent: jest.fn(() => [{}, {}])
}

module.exports = mockOrdering
