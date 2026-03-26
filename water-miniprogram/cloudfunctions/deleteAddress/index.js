const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const addressesCollection = db.collection('addresses')

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { addressId } = event

  if (!addressId) {
    return {
      code: -1,
      message: '地址ID不能为空'
    }
  }

  try {
    const addressRes = await addressesCollection.doc(addressId).get()

    if (!addressRes.data || addressRes.data._openid !== openid) {
      return {
        code: -1,
        message: '地址不存在或无权限'
      }
    }

    await addressesCollection.doc(addressId).remove()

    return {
      code: 0,
      message: '删除成功'
    }
  } catch (e) {
    console.error('删除地址失败:', e)
    return {
      code: -1,
      message: e.message || '删除失败'
    }
  }
}
