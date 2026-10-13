export const USER_TYPE = {
  BUSINESS: 'business',
  CUSTOMER: 'customer',
  DRIVER: 'driver'
}

export const ORDER_TYPES = [
  {
    value: 1,
    content: 'DELIVERY',
    description: 'ORDERTYPE_DESCRIPTION_DELIVERY'
  },
  {
    value: 2,
    content: 'PICKUP',
    description: 'ORDERTYPE_DESCRIPTION_PICKUP',
  },
  {
    value: 3,
    content: 'EAT_IN',
    description: 'ORDERTYPE_DESCRIPTION_EATIN',
  },
  {
    value: 4,
    content: 'CURBSIDE',
    description: 'ORDERTYPE_DESCRIPTION_CURBSIDE',
  },
  {
    value: 5,
    content: 'DRIVE_THRU',
    description: 'ORDERTYPE_DESCRIPTION_DRIVETHRU',
  },
  // {
  //   value: 7,
  //   content: 'CATERING_DELIVERY',
  //   description: 'ORDERTYPE_DESCRIPTION_CATERING_DELIVERY',
  // },
  // {
  //   value: 8,
  //   content: 'CATERING_PICKUP',
  //   description: 'ORDERTYPE_DESCRIPTION_CATERING_PICKUP',
  // },
  {
    value: 9,
    content: 'RESERVATION',
    description: 'ORDERTYPE_DESCRIPTION_RESERVATION'
  }
]

export const ACCOUNT_VALUES = {
  ACCOUNT: 'account',
  LOGIN: 'login',
  SIGNUP: 'signup',
  FORGOT: 'forgot'
}

export const ORDER_STATUS: any = {
  0: 'PENDING',
  1: 'COMPLETED',
  2: 'REJECTED',
  3: 'DRIVER_IN_BUSINESS',
  4: 'PREPARATION_COMPLETED',
  5: 'REJECTED_BY_BUSINESS',
  6: 'REJECTED_BY_DRIVER',
  7: 'ACCEPTED_BY_BUSINESS',
  8: 'ACCEPTED_BY_DRIVER',
  9: 'PICK_UP_COMPLETED_BY_DRIVER',
  10: 'PICK_UP_FAILED_BY_DRIVER',
  11: 'DELIVERY_COMPLETED_BY_DRIVER',
  12: 'DELIVERY_FAILED_BY_DRIVER',
  13: 'PREORDER',
  14: 'ORDER_NOT_READY',
  15: 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
  16: 'CANCELLED_BY_CUSTOMER',
  17: 'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
  18: 'DRIVER_ALMOST_ARRIVED_TO_BUSINESS',
  19: 'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER',
  20: 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
  21: 'ORDER_CUSTOMER_ARRIVED_BUSINESS',
  22: 'ORDER_LOOKING_FOR_DRIVER',
  23: 'ORDER_DRIVER_ON_WAY',
  24: 'ORDER_DRIVER_WAITING_FOR_ORDER',
  25: 'ORDER_ACCEPTED_BY_DRIVER_COMPANY',
  26: 'ORDER_DRIVER_ARRIVED_CUSTOMER',
}

export const REVIEW_STATUS = [1, 2, 5, 6, 10, 11, 12, 15]

export const REORDER_STATUS = [1, 2, 5, 6, 10, 11, 12, 15, 16, 17]

export const MAX_AUTO_SCROLL_PRODUCT_SUBOPTIONS = 15

