const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const addressesCollection = db.collection('addresses')

function normalizeAddress(address = {}) {
  const region = Array.isArray(address.region) && address.region.length === 3
    ? address.region
    : [address.province, address.city, address.district].filter(Boolean)

  const [province = '', city = '', district = ''] = region

  return {
    ...address,
    region,
    province: address.province || province,
    city: address.city || city,
    district: address.district || district
  }
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    const result = await addressesCollection
      .where({ _openid: openid })
      .orderBy('isDefault', 'desc')
      .orderBy('createTime', 'desc')
      .get()

    return {
      code: 0,
      data: result.data.map(normalizeAddress),
      message: 'success'
    }
  } catch (e) {
    console.error('获取地址失败:', e)
    return {
      code: -1,
      data: [],
      message: e.message || '获取地址失败'
    }
  }
}
