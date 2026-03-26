const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const ordersCollection = db.collection('orders')

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { status } = event
  const openid = wxContext.OPENID

  try {
    let query = ordersCollection.where({ _openid: openid })

    if (status) {
      query = query.where({ status })
    }

    const result = await query.orderBy('createTime', 'desc').get()

    return {
      code: 0,
      data: result.data,
      message: 'success'
    }
  } catch (e) {
    console.error('获取订单失败:', e)
    return {
      code: -1,
      data: [],
      message: e.message || '获取订单失败'
    }
  }
}
