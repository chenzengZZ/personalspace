const { ORDER_STATUS, STORAGE_KEYS, getStatusText } = require('../../../utils/constants')
const { formatDateTime, showToast, showLoading, hideLoading, showConfirm } = require('../../../utils/util')
const { normalizeAddress } = require('../../../utils/address')

Page({
  data: {
    order: {}
  },

  onLoad(options) {
    if (options.id) {
      this.loadOrder(options.id)
    } else {
      showToast('订单不存在')
      setTimeout(() => wx.navigateBack(), 1500)
    }
  },

  loadOrder(id) {
    try {
      const orders = wx.getStorageSync(STORAGE_KEYS.ORDERS) || []
      const order = orders.find(o => o._id === id)

      if (order) {
        this.setData({
          order: {
            ...order,
            address: order.address ? normalizeAddress(order.address) : null
          }
        })
      } else {
        showToast('订单不存在')
        setTimeout(() => wx.navigateBack(), 1500)
      }
    } catch (e) {
      console.error('加载订单失败:', e)
      showToast('加载失败')
      setTimeout(() => wx.navigateBack(), 1500)
    }
  },

  cancelOrder() {
    const orderId = this.data.order._id

    showConfirm('提示', '确定要取消这个订单吗？').then(confirm => {
      if (confirm) {
        try {
          const orders = wx.getStorageSync(STORAGE_KEYS.ORDERS) || []
          const updatedOrders = orders.filter(order => order._id !== orderId)
          wx.setStorageSync(STORAGE_KEYS.ORDERS, updatedOrders)

          showToast('订单已取消', 'success')
          setTimeout(() => wx.navigateBack(), 1500)
        } catch (e) {
          console.error('取消订单失败:', e)
          showToast('操作失败，请重试')
        }
      }
    })
  },

  payOrder() {
    const order = this.data.order

    showConfirm('确认支付', `订单金额：¥${order.totalPrice}`, '立即支付').then(confirm => {
      if (confirm) {
        this.processPayment()
      }
    })
  },

  processPayment() {
    showLoading('支付中...')

    setTimeout(() => {
      try {
        hideLoading()
        this.updateOrderStatus(ORDER_STATUS.PAID)
        showToast('支付成功，请开始配送', 'success', 2000)
      } catch (e) {
        console.error('支付失败:', e)
        hideLoading()
        showToast('支付失败，请重试')
      }
    }, 1500)
  },

  updateOrderStatus(newStatus) {
    const orderId = this.data.order._id
    const orders = wx.getStorageSync(STORAGE_KEYS.ORDERS) || []
    const currentTime = formatDateTime(new Date())

    const updatedOrders = orders.map(order => {
      if (order._id === orderId) {
        return {
          ...order,
          status: newStatus,
          statusText: getStatusText(newStatus),
          payTime: newStatus === ORDER_STATUS.PAID ? currentTime : order.payTime,
          deliverTime: newStatus === ORDER_STATUS.DELIVERING ? currentTime : order.deliverTime,
          completeTime: newStatus === ORDER_STATUS.COMPLETED ? currentTime : order.completeTime
        }
      }
      return order
    })

    wx.setStorageSync(STORAGE_KEYS.ORDERS, updatedOrders)

    const updatedOrder = updatedOrders.find(o => o._id === orderId)
    if (updatedOrder) {
      this.setData({ order: updatedOrder })
    }
  },

  startDelivery() {
    showConfirm('开始配送', '本地模式下，是否将订单更新为配送中？', '开始配送').then(confirm => {
      if (confirm) {
        this.updateOrderStatus(ORDER_STATUS.DELIVERING)
        showToast('订单已进入配送中', 'success')
      }
    })
  },

  confirmReceipt() {
    showConfirm('确认收货', '确认已收到商品吗？', '确认收货').then(confirm => {
      if (confirm) {
        this.updateOrderStatus(ORDER_STATUS.COMPLETED)
        showToast('确认收货成功', 'success')
      }
    })
  }
})
