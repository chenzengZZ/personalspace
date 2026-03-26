const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const addressesCollection = db.collection('addresses')

function normalizeRegion(region, province, city, district) {
  if (Array.isArray(region) && region.length === 3) {
    return region
  }

  const nextRegion = [province, city, district].filter(Boolean)
  return nextRegion.length === 3 ? nextRegion : []
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { _id, name, phone, region, province, city, district, detail, isDefault } = event
  const normalizedRegion = normalizeRegion(region, province, city, district)

  if (!name || !phone || normalizedRegion.length !== 3 || !detail) {
    return {
      code: -1,
      message: '地址信息不完整'
    }
  }

  try {
    if (isDefault) {
      await addressesCollection
        .where({ _openid: openid, isDefault: true })
        .update({ data: { isDefault: false } })
    }

    const addressData = {
      name,
      phone,
      region: normalizedRegion,
      province: normalizedRegion[0],
      city: normalizedRegion[1],
      district: normalizedRegion[2],
      detail,
      isDefault: isDefault || false,
      updateTime: db.serverDate()
    }

    if (_id) {
      await addressesCollection.doc(_id).update({
        data: addressData
      })
      return {
        code: 0,
        data: { _id, ...addressData },
        message: '更新成功'
      }
    } else {
      addressData._openid = openid
      addressData.createTime = db.serverDate()
      
      const result = await addressesCollection.add({ data: addressData })
      return {
        code: 0,
        data: { _id: result._id, ...addressData },
        message: '添加成功'
      }
    }
  } catch (e) {
    console.error('保存地址失败:', e)
    return {
      code: -1,
      message: e.message || '保存失败'
    }
  }
}
