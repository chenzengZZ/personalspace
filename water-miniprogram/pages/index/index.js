const app = getApp()
const { PRODUCTS, CATEGORIES, getProductsByCategory, searchProducts } = require('../../utils/products')
const { showToast } = require('../../utils/util')

Page({
  data: {
    products: [],
    categories: CATEGORIES,
    currentCategory: 'all',
    loading: false,
    searchKeyword: '',
    statusBarHeight: 0
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight || 20
    })
    this.loadProducts()
  },

  onShow() {
    this.getTabBar().setData({
      selected: 0
    })
    this.updateCartBadge()
  },

  onPullDownRefresh() {
    this.loadProducts().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  loadProducts() {
    this.setData({ loading: true })

    return new Promise(resolve => {
      setTimeout(() => {
        try {
          let products = getProductsByCategory(this.data.currentCategory)
          
          if (this.data.searchKeyword) {
            products = searchProducts(this.data.searchKeyword)
          }

          this.setData({
            products: products,
            loading: false
          })
        } catch (e) {
          console.error('加载商品失败:', e)
          showToast('加载失败，请重试')
          this.setData({ loading: false })
        }
        resolve()
      }, 300)
    })
  },

  onCategoryChange(e) {
    const id = e.currentTarget.dataset.id
    this.setData({ currentCategory: id })
    this.loadProducts()
  },

  onSearch(e) {
    const keyword = e.detail.value
    this.setData({ searchKeyword: keyword })
    this.loadProducts()
  },

  clearSearch() {
    this.setData({ searchKeyword: '' })
    this.loadProducts()
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  },

  addToCart(e) {
    const id = e.currentTarget.dataset.id
    const item = PRODUCTS.find(p => p._id === id)
    if (item) {
      app.addToCart(item)
      this.getTabBar().updateCartCount()
      showToast('已加入购物车', 'success')
    }
  },

  updateCartBadge() {
    const cart = wx.getStorageSync('cart') || []
    const count = cart.reduce((sum, item) => sum + item.quantity, 0)
    this.getTabBar().setData({ cartCount: count })
  }
})
