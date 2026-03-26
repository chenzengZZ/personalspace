Component({
  data: {
    selected: 0,
    cartCount: 0,
    list: [
      {
        pagePath: "/pages/index/index",
        iconPath: "/assets/icons/home.png",
        selectedIconPath: "/assets/icons/home-active.png"
      },
      {
        pagePath: "/pages/cart/cart",
        iconPath: "/assets/icons/cart.png",
        selectedIconPath: "/assets/icons/cart-active.png"
      },
      {
        pagePath: "/pages/order/list/list",
        iconPath: "/assets/icons/order.png",
        selectedIconPath: "/assets/icons/order-active.png"
      },
      {
        pagePath: "/pages/user/user",
        iconPath: "/assets/icons/user.png",
        selectedIconPath: "/assets/icons/user-active.png"
      }
    ]
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
    },
    updateCartCount() {
      const cart = wx.getStorageSync('cart') || []
      const count = cart.reduce((sum, item) => sum + item.quantity, 0)
      this.setData({ cartCount: count })
    }
  }
})
