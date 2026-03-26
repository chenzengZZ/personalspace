function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

function formatDateTime(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

function generateOrderNo() {
  const dateStr = formatDate(new Date())
  const randomStr = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `WD${dateStr}${randomStr}`
}

function generateId() {
  return Date.now().toString()
}

function safeGetStorage(key) {
  try {
    return wx.getStorageSync(key)
  } catch (e) {
    console.error('获取存储失败:', key, e)
    return null
  }
}

function safeSetStorage(key, value) {
  try {
    wx.setStorageSync(key, value)
    return true
  } catch (e) {
    console.error('设置存储失败:', key, e)
    return false
  }
}

function safeRemoveStorage(key) {
  try {
    wx.removeStorageSync(key)
    return true
  } catch (e) {
    console.error('删除存储失败:', key, e)
    return false
  }
}

function validatePhone(phone) {
  const phoneReg = /^1[3-9]\d{9}$/
  return phoneReg.test(phone)
}

function maskPhone(phone) {
  if (!phone || phone.length !== 11) return phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

function showToast(title, icon = 'none', duration = 2000) {
  wx.showToast({ title, icon, duration })
}

function showLoading(title = '加载中...') {
  wx.showLoading({ title, mask: true })
}

function hideLoading() {
  wx.hideLoading()
}

function showConfirm(title, content, confirmText = '确定') {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      confirmText,
      confirmColor: '#DC143C',
      success: (res) => {
        resolve(res.confirm)
      }
    })
  })
}

module.exports = {
  formatDate,
  formatDateTime,
  generateOrderNo,
  generateId,
  safeGetStorage,
  safeSetStorage,
  safeRemoveStorage,
  validatePhone,
  maskPhone,
  showToast,
  showLoading,
  hideLoading,
  showConfirm
}
