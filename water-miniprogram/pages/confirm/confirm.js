const app = getApp()
const { ORDER_STATUS, STORAGE_KEYS, DELIVERY_FEE_THRESHOLD, DELIVERY_FEE, getStatusText } = require('../../utils/constants')
const { formatDateTime, generateOrderNo, generateId, showToast, showLoading, hideLoading } = require('../../utils/util')
const { normalizeAddress, normalizeAddressList, getDefaultAddress } = require('../../utils/address')

Page({
  data: {
    products: [],
    hasCheckoutItems: true,
    address: null,
    remark: '',
    remarkPresets: ['尽快送达', '放门口即可', '到货请电话联系'],
    deliveryFee: 0,
    productTotal: 0,
    totalPrice: 0,
    totalCount: 0,
    deliveryFeeTip: '',
    submitting: false
  },

  onLoad() {
    this.loadCheckoutData()
    this.loadDefaultAddress()
  },

  onShow() {
    const selectedAddress = wx.getStorageSync(STORAGE_KEYS.SELECTED_ADDRESS)
    if (selectedAddress) {
      this.setData({ address: normalizeAddress(selectedAddress) })
      wx.removeStorageSync(STORAGE_KEYS.SELECTED_ADDRESS)
    }
  },

  loadCheckoutData() {
    try {
      const products = wx.getStorageSync(STORAGE_KEYS.CHECKOUT_ITEMS) || []
      
      if (products.length === 0) {
        this.setData({
          hasCheckoutItems: false,
          products: [],
          totalCount: 0,
          productTotal: '0.00',
          deliveryFee: '0.00',
          totalPrice: '0.00'
        })
        return
      }

      const totalCount = products.reduce((sum, p) => sum + p.quantity, 0)
      const productTotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0)
      const deliveryFee = productTotal >= DELIVERY_FEE_THRESHOLD ? 0 : DELIVERY_FEE
      const totalPrice = productTotal + deliveryFee
      const deliveryFeeTip = deliveryFee === 0
        ? `已满足满¥${DELIVERY_FEE_THRESHOLD}免配送费`
        : `再购¥${(DELIVERY_FEE_THRESHOLD - productTotal).toFixed(2)}即可免配送费`

      this.setData({
        hasCheckoutItems: true,
        products,
        totalCount,
        productTotal: productTotal.toFixed(2),
        deliveryFee: deliveryFee.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
        deliveryFeeTip
      })
    } catch (e) {
      console.error('加载结算数据失败:', e)
      showToast('加载失败，请重试')
    }
  },

  loadDefaultAddress() {
    try {
      const addresses = normalizeAddressList(wx.getStorageSync(STORAGE_KEYS.ADDRESSES) || [])
      const defaultAddress = getDefaultAddress(addresses)
      
      if (defaultAddress && (defaultAddress._id || defaultAddress.name)) {
        this.setData({ address: defaultAddress })
      }
    } catch (e) {
      console.error('加载地址失败:', e)
    }
  },

  selectAddress() {
    const currentId = this.data.address ? this.data.address._id : ''
    wx.navigateTo({
      url: `/pages/address/list/list?mode=select&source=confirm${currentId ? `&currentId=${currentId}` : ''}`
    })
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value })
  },

  useRemarkPreset(e) {
    const { value } = e.currentTarget.dataset
    this.setData({ remark: value })
  },

  goToCart() {
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  },

  submitOrder() {
    if (this.data.submitting) return

    if (!this.data.address) {
      showToast('请选择收货地址')
      return
    }

    this.setData({ submitting: true })
    showLoading('提交中...')

    try {
      const order = this.createOrderData()
      this.saveOrder(order)
      this.clearCartItems()
      
      hideLoading()
      wx.redirectTo({
        url: `/pages/order/detail/detail?id=${order._id}`
      })
    } catch (e) {
      console.error('提交订单失败:', e)
      hideLoading()
      showToast('提交失败，请重试')
      this.setData({ submitting: false })
    }
  },

  createOrderData() {
    const now = new Date()
    
    return {
      _id: generateId(),
      orderNo: generateOrderNo(),
      status: ORDER_STATUS.PENDING,
      statusText: getStatusText(ORDER_STATUS.PENDING),
      products: this.data.products,
      totalCount: this.data.totalCount,
      productTotal: parseFloat(this.data.productTotal),
      deliveryFee: parseFloat(this.data.deliveryFee),
      totalPrice: parseFloat(this.data.totalPrice),
      address: normalizeAddress(this.data.address),
      remark: this.data.remark,
      createTime: formatDateTime(now),
      payTime: '',
      deliverTime: '',
      completeTime: ''
    }
  },

  saveOrder(order) {
    const orders = wx.getStorageSync(STORAGE_KEYS.ORDERS) || []
    orders.unshift(order)
    wx.setStorageSync(STORAGE_KEYS.ORDERS, orders)
  },

  clearCartItems() {
    const cart = wx.getStorageSync(STORAGE_KEYS.CART) || []
    const productIds = this.data.products.map(p => p._id)
    const newCart = cart.filter(item => productIds.indexOf(item._id) === -1)
    
    wx.setStorageSync(STORAGE_KEYS.CART, newCart)
    app.updateCartCount()
  }
})
