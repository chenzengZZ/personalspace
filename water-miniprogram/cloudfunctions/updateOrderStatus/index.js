const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const ordersCollection = db.collection('orders')

const STATUS_TEXT = {
  pending: '待支付',
  paid: '待配送',
  delivering: '配送中',
  completed: '已完成',
  cancelled: '已取消'
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

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { orderId, status } = event

  if (!orderId || !status) {
    return {
      code: -1,
      message: '参数不完整'
    }
  }

  if (!STATUS_TEXT[status]) {
    return {
      code: -1,
      message: '无效的订单状态'
    }
  }

  try {
    const orderRes = await ordersCollection.doc(orderId).get()

    if (!orderRes.data || orderRes.data._openid !== openid) {
      return {
        code: -1,
        message: '订单不存在或无权限'
      }
    }

    const updateData = {
      status,
      statusText: STATUS_TEXT[status]
    }

    if (status === 'paid') {
      updateData.payTime = formatDateTime(new Date())
    } else if (status === 'delivering') {
      updateData.deliverTime = formatDateTime(new Date())
    } else if (status === 'completed') {
      updateData.completeTime = formatDateTime(new Date())
    }

    await ordersCollection.doc(orderId).update({
      data: updateData
    })

    return {
      code: 0,
      message: '更新成功'
    }
  } catch (e) {
    console.error('更新订单状态失败:', e)
    return {
      code: -1,
      message: e.message || '更新失败'
    }
  }
}
