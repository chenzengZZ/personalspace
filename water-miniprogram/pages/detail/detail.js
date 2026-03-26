const app = getApp()
const { getProductById } = require('../../utils/products')
const { showToast } = require('../../utils/util')

Page({
  data: {
    product: {},
    quantity: 1
  },

  onLoad(options) {
    const id = options.id
    this.loadProduct(id)
  },

  loadProduct(id) {
    try {
      const product = getProductById(id)
      if (product) {
        this.setData({ product })
      } else {
        showToast('商品不存在')
        setTimeout(() => wx.navigateBack(), 1500)
      }
    } catch (e) {
      console.error('加载商品失败:', e)
      showToast('加载失败')
    }
  },

  decreaseQuantity() {
    if (this.data.quantity > 1) {
      this.setData({ quantity: this.data.quantity - 1 })
    }
  },

  increaseQuantity() {
    if (this.data.quantity < this.data.product.stock) {
      this.setData({ quantity: this.data.quantity + 1 })
    }
  },

  onQuantityInput(e) {
    let value = parseInt(e.detail.value) || 1
    if (value < 1) value = 1
    if (value > this.data.product.stock) value = this.data.product.stock
    this.setData({ quantity: value })
  },

  addToCart() {
    try {
      const product = {
        ...this.data.product,
        quantity: this.data.quantity
      }
      
      app.addToCart(product)
      showToast('已加入购物车', 'success')
    } catch (e) {
      console.error('加入购物车失败:', e)
      showToast('操作失败，请重试')
    }
  },

  buyNow() {
    try {
      const product = {
        ...this.data.product,
        quantity: this.data.quantity
      }
      
      wx.setStorageSync('checkoutItems', [product])
      
      wx.navigateTo({
        url: '/pages/confirm/confirm'
      })
    } catch (e) {
      console.error('立即购买失败:', e)
      showToast('操作失败，请重试')
    }
  }
})
