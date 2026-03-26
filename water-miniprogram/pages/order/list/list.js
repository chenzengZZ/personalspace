const app = getApp()
const { ORDER_STATUS, STORAGE_KEYS } = require('../../../utils/constants')
const { showToast } = require('../../../utils/util')

Page({
  data: {
    tabs: ['待支付', '配送中', '已完成'],
    currentTab: 0,
    searchKeyword: '',
    allOrders: [],
    orders: [],
    loading: false,
    emptyState: {
      title: '还没有待支付订单',
      desc: '挑好商品后提交订单，这里会显示待支付记录。'
    }
  },

  onLoad() {
    this.loadOrders()
  },

  onShow() {
    this.getTabBar().setData({
      selected: 2
    })
    const tab = wx.getStorageSync(STORAGE_KEYS.ORDER_TAB) || 0
    wx.removeStorageSync(STORAGE_KEYS.ORDER_TAB)
    this.setData({ currentTab: tab })
    this.loadOrders()
  },

  onPullDownRefresh() {
    this.loadOrders().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  switchTab(e) {
    const index = e.currentTarget.dataset.index
    this.setData({ currentTab: index })
    this.applyFilters()
  },

  getEmptyStateCopy() {
    if (this.data.searchKeyword.trim()) {
      return {
        title: '没有找到相关订单',
        desc: '试试订单号，或商品名称里的关键词。'
      }
    }

    if (this.data.currentTab === 0) {
      return {
        title: '还没有待支付订单',
        desc: '挑好商品后提交订单，这里会显示待支付记录。'
      }
    }

    if (this.data.currentTab === 1) {
      return {
        title: '还没有配送中的订单',
        desc: '付款后的订单开始配送后，会出现在这里。'
      }
    }

    return {
      title: '还没有已完成订单',
      desc: '完成收货后的订单，会沉淀在这里方便回看。'
    }
  },

  getOrdersByTab(orders = []) {
    if (this.data.currentTab === 0) {
      return orders.filter(order => order.status === ORDER_STATUS.PENDING)
    }

    if (this.data.currentTab === 1) {
      return orders.filter(order => order.status === ORDER_STATUS.DELIVERING || order.status === ORDER_STATUS.PAID)
    }

    if (this.data.currentTab === 2) {
      return orders.filter(order => order.status === ORDER_STATUS.COMPLETED)
    }

    return orders
  },

  matchOrderKeyword(order, keyword) {
    const normalizedKeyword = keyword.trim().toLowerCase()
    if (!normalizedKeyword) return true

    const orderNo = String(order.orderNo || '').toLowerCase()
    const productNames = (order.products || [])
      .map(product => String(product.name || '').toLowerCase())
      .join(' ')

    return orderNo.indexOf(normalizedKeyword) > -1 || productNames.indexOf(normalizedKeyword) > -1
  },

  applyFilters() {
    const tabFilteredOrders = this.getOrdersByTab(this.data.allOrders)
    const keyword = this.data.searchKeyword.trim()
    const orders = keyword
      ? tabFilteredOrders.filter(order => this.matchOrderKeyword(order, keyword))
      : tabFilteredOrders

    this.setData({
      orders,
      emptyState: this.getEmptyStateCopy()
    })
  },

  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    })
    this.applyFilters()
  },

  clearSearch() {
    this.setData({
      searchKeyword: ''
    })
    this.applyFilters()
  },

  onEmptyAction() {
    if (this.data.searchKeyword.trim()) {
      this.clearSearch()
      return
    }

    this.goToIndex()
  },

  loadOrders() {
    this.setData({ loading: true })

    return new Promise(resolve => {
      setTimeout(() => {
        try {
          const orders = wx.getStorageSync(STORAGE_KEYS.ORDERS) || []
          this.setData({
            allOrders: orders,
            loading: false
          })
          this.applyFilters()
        } catch (e) {
          console.error('加载订单失败:', e)
          showToast('加载失败')
          this.setData({ loading: false })
        }
        resolve()
      }, 300)
    })
  },

  goToOrderDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/order/detail/detail?id=${id}`
    })
  },

  cancelOrder(e) {
    const id = e.currentTarget.dataset.id

    wx.showModal({
      title: '提示',
      content: '确定要取消这个订单吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            const orders = wx.getStorageSync(STORAGE_KEYS.ORDERS) || []
            const updatedOrders = orders.filter(order => order._id !== id)
            wx.setStorageSync(STORAGE_KEYS.ORDERS, updatedOrders)
            this.setData({ allOrders: updatedOrders })
            this.applyFilters()
            showToast('订单已取消', 'success')
          } catch (e) {
            console.error('取消订单失败:', e)
            showToast('操作失败')
          }
        }
      }
    })
  },

  payOrder(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/order/detail/detail?id=${id}`
    })
  },

  reorder(e) {
    const id = e.currentTarget.dataset.id
    
    try {
      const orders = wx.getStorageSync(STORAGE_KEYS.ORDERS) || []
      const order = orders.find(o => o._id === id)
      
      if (!order || !order.products || order.products.length === 0) {
        showToast('订单商品不存在')
        return
      }

      const cart = wx.getStorageSync(STORAGE_KEYS.CART) || []
      let addedCount = 0

      order.products.forEach(product => {
        const existIndex = cart.findIndex(item => item._id === product._id)
        if (existIndex > -1) {
          cart[existIndex].quantity += product.quantity
        } else {
          cart.push({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: product.quantity,
            stock: product.stock || 100
          })
        }
        addedCount++
      })

      wx.setStorageSync(STORAGE_KEYS.CART, cart)
      app.updateCartCount()

      showToast(`已添加${addedCount}种商品`, 'success')
    } catch (e) {
      console.error('再来一单失败:', e)
      showToast('操作失败')
    }
  },

  goToIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})
