module.exports = {
  websocketStatusDefaults: {
    socketStatus: 1,
    connectedDate: '2026-01-01T12:00:00Z',
    reconnectAttemptCount: 0
  },

  pageBannerDefaults: {
    position: 'app_home_page',
    pageBannerState: {
      loading: false,
      banner: {
        items: [{
          banner_id: 1,
          url: 'https://cdn.test/banner.jpg',
          action: { type: 'business', url: 'https://site/store/demo-store' }
        }]
      },
      result: [{ id: 1, name: 'Promo' }],
      error: null
    },
    navigation: { push: jest.fn() }
  },

  notificationsListDefaults: {
    singleNotifications: {
      loading: false,
      changes: {},
      result: {
        error: false,
        result: {
          settings: {
            email: { newsletter: true },
            sms: { newsletter: false },
            notification: { newsletter: true }
          }
        }
      }
    },
    handleChangePromotions: jest.fn(),
    userData: {
      settings: {
        email: { newsletter: true },
        sms: { newsletter: false },
        notification: { newsletter: true }
      }
    }
  },

  helpCmsDefaults: {
    cmsState: {
      loading: false,
      error: null,
      items: [
        { id: 1, name: 'Orders' },
        { id: 2, name: 'Delivery' }
      ],
      pages: [
        { id: 1, body: '<p>Orders help</p>' },
        { id: 2, body: '<p>Delivery help</p>' }
      ]
    },
    onRedirect: jest.fn(),
    navigation: {}
  }
}
