const { STORAGE_KEYS } = require('../../../utils/constants')
const { showToast, showConfirm } = require('../../../utils/util')
const {
  normalizeAddressList,
  setDefaultAddress,
  deleteAddressById
} = require('../../../utils/address')

Page({
  data: {
    mode: 'manage',
    source: 'user',
    currentId: '',
    addresses: [],
    isSelectMode: false
  },

  onLoad(options = {}) {
    const mode = options.mode === 'select' ? 'select' : 'manage'
    const source = options.source || 'user'
    const currentId = options.currentId || ''

    this.setData({
      mode,
      source,
      currentId,
      isSelectMode: mode === 'select'
    })

    wx.setNavigationBarTitle({
      title: mode === 'select' ? '选择地址' : '地址管理'
    })
  },

  onShow() {
    this.loadAddresses()
  },

  loadAddresses() {
    try {
      const addresses = normalizeAddressList(wx.getStorageSync(STORAGE_KEYS.ADDRESSES) || [])
      const currentId = this.data.currentId || (this.data.isSelectMode && addresses[0] ? addresses.find(item => item.isDefault)?._id || '' : '')

      this.setData({
        addresses,
        currentId
      })
    } catch (error) {
      console.error('加载地址列表失败:', error)
      showToast('加载地址失败')
    }
  },

  goToCreateAddress() {
    const source = this.data.isSelectMode ? 'confirm' : 'user'
    wx.navigateTo({
      url: `/pages/address/edit/edit?mode=create&source=${source}`
    })
  },

  selectAddress(event) {
    if (!this.data.isSelectMode) {
      return
    }

    const { id } = event.currentTarget.dataset
    const address = this.data.addresses.find(item => item._id === id)

    if (!address) {
      showToast('地址不存在')
      return
    }

    wx.setStorageSync(STORAGE_KEYS.SELECTED_ADDRESS, address)
    this.setData({ currentId: id })
    wx.navigateBack()
  },

  goToEditAddress(event) {
    const { id } = event.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/address/edit/edit?mode=edit&id=${id}&source=user`
    })
  },

  setAsDefault(event) {
    const { id } = event.currentTarget.dataset

    try {
      const addresses = setDefaultAddress(this.data.addresses, id)
      wx.setStorageSync(STORAGE_KEYS.ADDRESSES, addresses)
      this.setData({
        addresses,
        currentId: this.data.isSelectMode ? id : this.data.currentId
      })
      showToast('已设为默认', 'success')
    } catch (error) {
      console.error('设置默认地址失败:', error)
      showToast('设置失败，请重试')
    }
  },

  async deleteAddress(event) {
    const { id } = event.currentTarget.dataset
    const confirmed = await showConfirm('删除地址', '确定删除这个地址吗？', '删除')

    if (!confirmed) {
      return
    }

    try {
      const addresses = deleteAddressById(this.data.addresses, id)
      wx.setStorageSync(STORAGE_KEYS.ADDRESSES, addresses)

      let currentId = this.data.currentId
      if (currentId === id) {
        currentId = addresses.find(item => item.isDefault)?._id || ''
      }

      this.setData({
        addresses,
        currentId
      })

      showToast('删除成功', 'success')
    } catch (error) {
      console.error('删除地址失败:', error)
      showToast('删除失败，请重试')
    }
  }
})
