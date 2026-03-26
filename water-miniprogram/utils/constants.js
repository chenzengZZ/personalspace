const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  DELIVERING: 'delivering',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING]: '待支付',
  [ORDER_STATUS.PAID]: '待配送',
  [ORDER_STATUS.DELIVERING]: '配送中',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消'
}

const ORDER_STATUS_DESC = {
  [ORDER_STATUS.PENDING]: '请在30分钟内完成支付',
  [ORDER_STATUS.PAID]: '等待配送',
  [ORDER_STATUS.DELIVERING]: '预计今日送达',
  [ORDER_STATUS.COMPLETED]: '订单已完成',
  [ORDER_STATUS.CANCELLED]: '订单已取消'
}

function getStatusText(status) {
  return ORDER_STATUS_TEXT[status] || status
}

function getStatusDesc(status) {
  return ORDER_STATUS_DESC[status] || ''
}

function isValidStatus(status) {
  return Object.values(ORDER_STATUS).indexOf(status) > -1
}

const STORAGE_KEYS = {
  CART: 'cart',
  ORDERS: 'orders',
  ADDRESSES: 'addresses',
  USER_INFO: 'userInfo',
  CHECKOUT_ITEMS: 'checkoutItems',
  SELECTED_ADDRESS: 'selectedAddress',
  ORDER_TAB: 'orderTab'
}

const DELIVERY_FEE_THRESHOLD = 50
const DELIVERY_FEE = 5

module.exports = {
  ORDER_STATUS,
  ORDER_STATUS_TEXT,
  ORDER_STATUS_DESC,
  STORAGE_KEYS,
  DELIVERY_FEE_THRESHOLD,
  DELIVERY_FEE,
  getStatusText,
  getStatusDesc,
  isValidStatus
}
