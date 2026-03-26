const { ORDER_STATUS, STORAGE_KEYS } = require('../../utils/constants')
const { showToast } = require('../../utils/util')

Page({
  data: {
    userInfo: {},
    orderCounts: {
      pending: 0,
      delivering: 0,
      completed: 0
    }
  },

  onLoad() {
    this.loadUserInfo()
  },

  onShow() {
    this.getTabBar().setData({
      selected: 3
    })
    this.loadUserInfo()
    this.loadOrderCounts()
  },

  loadUserInfo() {
    try {
      const userInfo = wx.getStorageSync(STORAGE_KEYS.USER_INFO) || {}
      this.setData({ userInfo })
    } catch (e) {
      console.error('加载用户信息失败:', e)
    }
  },

  loadOrderCounts() {
    try {
      const orders = wx.getStorageSync(STORAGE_KEYS.ORDERS) || []

      let pending = 0
      let delivering = 0
      let completed = 0

      orders.forEach(order => {
        if (order.status === ORDER_STATUS.PENDING) pending++
        else if (order.status === ORDER_STATUS.DELIVERING || order.status === ORDER_STATUS.PAID) delivering++
        else if (order.status === ORDER_STATUS.COMPLETED) completed++
      })

      this.setData({
        orderCounts: { pending, delivering, completed }
      })
    } catch (e) {
      console.error('加载订单统计失败:', e)
    }
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const userInfo = {
      ...this.data.userInfo,
      avatar: avatarUrl
    }
    this.setData({ userInfo })
    wx.setStorageSync(STORAGE_KEYS.USER_INFO, userInfo)
  },

  onNicknameInput(e) {
    const nickName = e.detail.value
    this.setData({
      'userInfo.nickName': nickName
    })
  },

  onNicknameChange(e) {
    const nickName = e.detail.value
    if (nickName) {
      const userInfo = {
        ...this.data.userInfo,
        nickName: nickName
      }
      this.setData({ userInfo })
      wx.setStorageSync(STORAGE_KEYS.USER_INFO, userInfo)
    }
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync(STORAGE_KEYS.USER_INFO)
          this.setData({ userInfo: {} })
          showToast('已退出登录', 'success')
        }
      }
    })
  },

  goToOrders(e) {
    const tab = e.currentTarget.dataset.tab || 0
    wx.setStorageSync(STORAGE_KEYS.ORDER_TAB, tab)
    wx.switchTab({
      url: '/pages/order/list/list'
    })
  },

  goToAddress() {
    wx.navigateTo({
      url: '/pages/address/list/list?mode=manage&source=user'
    })
  },

  goToFeedback() {
    showToast('功能开发中')
  },

  goToAbout() {
    showToast('功能开发中')
  },

  contactService() {
    showToast('客服功能开发中')
  },

  clearTestData() {
    wx.showModal({
      title: '清除测试数据',
      content: '确定要清除所有测试数据吗？这将删除所有订单、购物车和地址数据。',
      confirmText: '确定清除',
      confirmColor: '#DC143C',
      success: (res) => {
        if (res.confirm) {
          const app = getApp()
          app.clearAllTestData()
          this.setData({
            orderCounts: { pending: 0, delivering: 0, completed: 0 }
          })
          showToast('已清除', 'success')
        }
      }
    })
  }
})
