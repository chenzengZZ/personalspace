const USE_CLOUD = false
const { normalizeAddress } = require('./address')

async function callFunction(name, data = {}) {
  if (!USE_CLOUD) {
    console.log(`[Mock] 调用云函数: ${name}`, data)
    return mockCloudFunction(name, data)
  }

  try {
    const result = await wx.cloud.callFunction({
      name,
      data
    })

    if (result.result.code === 0) {
      return {
        success: true,
        data: result.result.data
      }
    } else {
      return {
        success: false,
        message: result.result.message
      }
    }
  } catch (e) {
    console.error(`云函数调用失败: ${name}`, e)
    return {
      success: false,
      message: e.message || '网络错误'
    }
  }
}

function mockCloudFunction(name, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (name) {
        case 'getProducts':
          resolve({
            success: true,
            data: require('./products').PRODUCTS
          })
          break
        case 'getOrders':
          resolve({
            success: true,
            data: wx.getStorageSync('orders') || []
          })
          break
        case 'createOrder':
          const orders = wx.getStorageSync('orders') || []
          orders.unshift(data)
          wx.setStorageSync('orders', orders)
          resolve({
            success: true,
            data: { _id: Date.now().toString() }
          })
          break
        case 'getAddresses':
          resolve({
            success: true,
            data: (wx.getStorageSync('addresses') || []).map(normalizeAddress)
          })
          break
        case 'saveAddress':
          const addresses = wx.getStorageSync('addresses') || []
          const nextAddress = normalizeAddress(data)
          let savedAddress = null
          if (data._id) {
            const index = addresses.findIndex(a => a._id === data._id)
            if (index > -1) {
              addresses[index] = normalizeAddress({ ...addresses[index], ...nextAddress })
              savedAddress = addresses[index]
            }
          } else {
            savedAddress = normalizeAddress({ _id: Date.now().toString(), ...nextAddress })
            addresses.push(savedAddress)
          }
          wx.setStorageSync('addresses', addresses)
          resolve({ success: true, data: savedAddress || nextAddress })
          break
        default:
          resolve({ success: true })
      }
    }, 200)
  })
}

module.exports = {
  callFunction,
  USE_CLOUD
}
