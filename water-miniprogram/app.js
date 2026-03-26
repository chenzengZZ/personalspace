const { STORAGE_KEYS } = require('./utils/constants')

const CLOUD_ENV_ID = 'your-env-id'

App({
  globalData: {
    userInfo: null,
    cart: [],
    cartCount: 0
  },

  onLaunch() {
    this.initCloud()
    this.checkLogin()
    this.initCart()
  },

  clearAllTestData() {
    wx.removeStorageSync(STORAGE_KEYS.ORDERS)
    wx.removeStorageSync(STORAGE_KEYS.CART)
    wx.removeStorageSync(STORAGE_KEYS.ADDRESSES)
    wx.removeStorageSync(STORAGE_KEYS.CHECKOUT_ITEMS)
    wx.removeStorageSync(STORAGE_KEYS.SELECTED_ADDRESS)
    wx.removeStorageSync('buyNowProduct')
    this.globalData.cart = []
    this.globalData.cartCount = 0
    wx.removeTabBarBadge({ index: 1 })
    console.log('测试数据已清除')
  },

  initCloud() {
    if (!wx.cloud) {
      console.warn('请使用 2.2.3 或以上的基础库以使用云能力')
      return
    }

    if (!CLOUD_ENV_ID || CLOUD_ENV_ID === 'your-env-id') {
      console.log('当前为本地模式，跳过云能力初始化')
      return
    }

    wx.cloud.init({
      env: CLOUD_ENV_ID,
      traceUser: true
    })
  },

  checkLogin() {
    const userInfo = wx.getStorageSync(STORAGE_KEYS.USER_INFO)
    if (userInfo) {
      this.globalData.userInfo = userInfo
    }
  },

  initCart() {
    const cart = wx.getStorageSync(STORAGE_KEYS.CART) || []
    this.globalData.cart = cart
    this.updateCartCount()
  },

  addToCart(product) {
    const cart = this.globalData.cart
    const existIndex = cart.findIndex(item => item._id === product._id)
    
    if (existIndex > -1) {
      cart[existIndex].quantity += product.quantity || 1
    } else {
      cart.push({
        ...product,
        quantity: product.quantity || 1
      })
    }
    
    this.globalData.cart = cart
    this.updateCartCount()
    wx.setStorageSync(STORAGE_KEYS.CART, cart)
  },

  updateCartCount() {
    const count = this.globalData.cart.reduce((sum, item) => sum + item.quantity, 0)
    this.globalData.cartCount = count
    
    if (count > 0) {
      wx.setTabBarBadge({
        index: 1,
        text: count > 99 ? '99+' : String(count)
      })
    } else {
      wx.removeTabBarBadge({
        index: 1
      })
    }
  },

  getCart() {
    return this.globalData.cart
  },

  clearCart() {
    this.globalData.cart = []
    this.globalData.cartCount = 0
    wx.removeStorageSync(STORAGE_KEYS.CART)
    wx.removeTabBarBadge({
      index: 1
    })
  }
})
