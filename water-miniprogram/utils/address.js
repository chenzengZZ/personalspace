function normalizeRegion(address = {}) {
  if (Array.isArray(address.region) && address.region.length === 3) {
    return address.region
  }

  const region = [address.province, address.city, address.district].filter(Boolean)
  return region.length === 3 ? region : []
}

function formatAddressText(address = {}) {
  const region = normalizeRegion(address)
  const detail = address.detail || ''
  return `${region.join('')}${detail}`
}

function normalizeAddress(address = {}) {
  const region = normalizeRegion(address)
  const [province = '', city = '', district = ''] = region

  return {
    ...address,
    region,
    province: address.province || province,
    city: address.city || city,
    district: address.district || district,
    fullAddress: formatAddressText({
      ...address,
      region,
      province: address.province || province,
      city: address.city || city,
      district: address.district || district
    })
  }
}

function normalizeAddressList(addresses = []) {
  const rawList = Array.isArray(addresses)
    ? addresses
    : addresses && typeof addresses === 'object'
      ? [addresses]
      : []

  const normalizedList = rawList
    .map(item => normalizeAddress(item))
    .filter(item => item && (item._id || item.name || item.phone || item.detail))

  if (normalizedList.length === 0) {
    return []
  }

  const defaultAddress = normalizedList.find(item => item.isDefault) || normalizedList[0]
  return normalizedList.map(item => ({
    ...item,
    isDefault: item._id === defaultAddress._id
  }))
}

function getDefaultAddress(addresses = []) {
  const normalizedList = normalizeAddressList(addresses)
  return normalizedList.find(item => item.isDefault) || normalizedList[0] || null
}

function getAddressById(addresses = [], addressId = '') {
  const normalizedList = normalizeAddressList(addresses)
  return normalizedList.find(item => item._id === addressId) || null
}

function setDefaultAddress(addresses = [], addressId = '') {
  const normalizedList = normalizeAddressList(addresses)

  if (!addressId || normalizedList.length === 0) {
    return normalizedList
  }

  const targetExists = normalizedList.some(item => item._id === addressId)
  if (!targetExists) {
    return normalizedList
  }

  return normalizedList.map(item => ({
    ...item,
    isDefault: item._id === addressId
  }))
}

function saveAddressToList(addresses = [], address = {}) {
  const normalizedList = normalizeAddressList(addresses)
  const normalizedAddress = normalizeAddress(address)
  const exists = normalizedList.some(item => item._id === normalizedAddress._id)
  const previousDefault = normalizedList.find(item => item.isDefault)

  const nextList = exists
    ? normalizedList.map(item => (item._id === normalizedAddress._id ? normalizedAddress : item))
    : [normalizedAddress, ...normalizedList]

  const preferredDefaultId = normalizedAddress.isDefault
    ? normalizedAddress._id
    : previousDefault
      ? previousDefault._id
      : normalizedAddress._id

  return setDefaultAddress(nextList, preferredDefaultId)
}

function deleteAddressById(addresses = [], addressId = '') {
  const normalizedList = normalizeAddressList(addresses)
  const nextList = normalizedList.filter(item => item._id !== addressId)

  if (nextList.length === 0) {
    return []
  }

  const defaultAddress = nextList.find(item => item.isDefault) || nextList[0]
  return setDefaultAddress(nextList, defaultAddress._id)
}

module.exports = {
  normalizeRegion,
  formatAddressText,
  normalizeAddress,
  normalizeAddressList,
  getDefaultAddress,
  getAddressById,
  setDefaultAddress,
  saveAddressToList,
  deleteAddressById
}
