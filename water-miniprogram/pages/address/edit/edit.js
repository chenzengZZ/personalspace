const { STORAGE_KEYS } = require('../../../utils/constants')
const { showToast, validatePhone, generateId } = require('../../../utils/util')
const {
  normalizeAddress,
  normalizeAddressList,
  getAddressById,
  saveAddressToList
} = require('../../../utils/address')

Page({
  data: {
    mode: 'create',
    source: 'user',
    addressId: '',
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    region: [],
    detail: '',
    pageTitle: '新增地址'
  },

  onLoad(options = {}) {
    const mode = options.mode === 'edit' ? 'edit' : 'create'
    const source = options.source || 'user'
    const addressId = options.id || ''
    const pageTitle = mode === 'edit' ? '编辑地址' : '新增地址'

    this.setData({
      mode,
      source,
      addressId,
      pageTitle
    })

    wx.setNavigationBarTitle({ title: pageTitle })

    if (mode === 'edit' && addressId) {
      this.loadAddress(addressId)
    }
  },

  loadAddress(addressId) {
    try {
      const addresses = normalizeAddressList(wx.getStorageSync(STORAGE_KEYS.ADDRESSES) || [])
      const currentAddress = getAddressById(addresses, addressId)

      if (!currentAddress) {
        showToast('地址不存在')
        setTimeout(() => wx.navigateBack(), 1200)
        return
      }

      this.setData({
        name: currentAddress.name,
        phone: currentAddress.phone,
        province: currentAddress.province,
        city: currentAddress.city,
        district: currentAddress.district,
        region: currentAddress.region,
        detail: currentAddress.detail
      })
    } catch (e) {
      console.error('加载地址失败:', e)
      showToast('加载失败，请重试')
    }
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value })
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value })
  },

  onRegionChange(e) {
    const region = e.detail.value
    this.setData({
      region: region,
      province: region[0],
      city: region[1],
      district: region[2]
    })
  },

  onDetailInput(e) {
    this.setData({ detail: e.detail.value })
  },

  saveAddress() {
    const { name, phone, province, city, district, region, detail, mode, source, addressId } = this.data

    if (!name.trim()) {
      showToast('请输入姓名')
      return
    }

    if (!phone.trim()) {
      showToast('请输入手机号')
      return
    }

    if (!validatePhone(phone)) {
      showToast('手机号格式不正确')
      return
    }

    if (!province || !city || !district) {
      showToast('请选择省市区')
      return
    }

    if (!detail.trim()) {
      showToast('请输入详细地址')
      return
    }

    try {
      const addresses = normalizeAddressList(wx.getStorageSync(STORAGE_KEYS.ADDRESSES) || [])
      const currentAddress = mode === 'edit' ? getAddressById(addresses, addressId) : null
      const address = normalizeAddress({
        _id: currentAddress ? currentAddress._id : generateId(),
        name: name.trim(),
        phone: phone.trim(),
        region: region.length === 3 ? region : [province, city, district],
        province,
        city,
        district,
        detail: detail.trim(),
        isDefault: currentAddress ? currentAddress.isDefault : addresses.length === 0,
        tag: currentAddress ? currentAddress.tag || '' : ''
      })

      const nextAddresses = saveAddressToList(addresses, address)
      const savedAddress = getAddressById(nextAddresses, address._id) || address

      wx.setStorageSync(STORAGE_KEYS.ADDRESSES, nextAddresses)

      showToast('保存成功', 'success')

      setTimeout(() => {
        if (source === 'confirm' && mode === 'create') {
          wx.setStorageSync(STORAGE_KEYS.SELECTED_ADDRESS, savedAddress)
          wx.navigateBack({ delta: 2 })
        } else {
          wx.navigateBack()
        }
      }, 1200)
    } catch (e) {
      console.error('保存地址失败:', e)
      showToast('保存失败，请重试')
    }
  }
})
