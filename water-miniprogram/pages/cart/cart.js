const app = getApp()
const { STORAGE_KEYS } = require('../../utils/constants')
const { showToast } = require('../../utils/util')

Page({
  data: {
    cartItems: [],
    isAllSelected: false,
    totalPrice: 0,
    selectedCount: 0
  },

  onShow() {
    this.getTabBar().setData({
      selected: 1
    })
    this.loadCart()
  },

  loadCart() {
    try {
      const cart = wx.getStorageSync(STORAGE_KEYS.CART) || []
      const cartItems = cart.map(item => ({
        ...item,
        selected: true
      }))
      
      this.setData({ cartItems })
      this.calculateTotal()
    } catch (e) {
      console.error('加载购物车失败:', e)
      showToast('加载失败')
    }
  },

  toggleSelect(e) {
    const id = e.currentTarget.dataset.id
    const cartItems = this.data.cartItems.map(item => {
      if (item._id === id) {
        return { ...item, selected: !item.selected }
      }
      return item
    })
    
    this.setData({ cartItems })
    this.calculateTotal()
    this.checkAllSelected()
  },

  toggleSelectAll() {
    const isAllSelected = !this.data.isAllSelected
    const cartItems = this.data.cartItems.map(item => ({
      ...item,
      selected: isAllSelected
    }))
    
    this.setData({ cartItems, isAllSelected })
    this.calculateTotal()
  },

  checkAllSelected() {
    const isAllSelected = this.data.cartItems.every(item => item.selected)
    this.setData({ isAllSelected })
  },

  calculateTotal() {
    const selectedItems = this.data.cartItems.filter(item => item.selected)
    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const selectedCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0)
    
    this.setData({ totalPrice: totalPrice.toFixed(2), selectedCount })
  },

  decreaseQuantity(e) {
    const id = e.currentTarget.dataset.id
    const cartItems = this.data.cartItems.map(item => {
      if (item._id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 }
      }
      return item
    })
    
    this.setData({ cartItems })
    this.calculateTotal()
    this.saveCart()
  },

  increaseQuantity(e) {
    const id = e.currentTarget.dataset.id
    const cartItems = this.data.cartItems.map(item => {
      if (item._id === id && item.quantity < item.stock) {
        return { ...item, quantity: item.quantity + 1 }
      }
      return item
    })
    
    this.setData({ cartItems })
    this.calculateTotal()
    this.saveCart()
  },

  deleteItem(e) {
    const id = e.currentTarget.dataset.id
    
    wx.showModal({
      title: '提示',
      content: '确定要删除这个商品吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            const cartItems = this.data.cartItems.filter(item => item._id !== id)
            this.setData({ cartItems })
            this.calculateTotal()
            this.saveCart()
            this.updateCartBadge()
          } catch (e) {
            console.error('删除商品失败:', e)
            showToast('操作失败')
          }
        }
      }
    })
  },

  saveCart() {
    try {
      const cart = this.data.cartItems.map(item => {
        const { selected, ...rest } = item
        return rest
      })
      wx.setStorageSync(STORAGE_KEYS.CART, cart)
    } catch (e) {
      console.error('保存购物车失败:', e)
    }
  },

  updateCartBadge() {
    const count = this.data.cartItems.reduce((sum, item) => sum + item.quantity, 0)
    
    if (count > 0) {
      wx.setTabBarBadge({
        index: 1,
        text: count > 99 ? '99+' : String(count)
      })
    } else {
      wx.removeTabBarBadge({ index: 1 })
    }
  },

  goToIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  checkout() {
    if (this.data.selectedCount === 0) {
      showToast('请选择商品')
      return
    }

    try {
      const selectedItems = this.data.cartItems.filter(item => item.selected)
      wx.setStorageSync(STORAGE_KEYS.CHECKOUT_ITEMS, selectedItems)

      wx.navigateTo({
        url: '/pages/confirm/confirm'
      })
    } catch (e) {
      console.error('结算失败:', e)
      showToast('操作失败')
    }
  }
})
