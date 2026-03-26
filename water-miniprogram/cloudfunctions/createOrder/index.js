const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const ordersCollection = db.collection('orders')

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

function generateOrderNo() {
  const dateStr = formatDate(new Date())
  const randomStr = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `WD${dateStr}${randomStr}`
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
  const { products, address, remark, totalPrice, deliveryFee, productTotal, totalCount } = event

  if (!products || products.length === 0) {
    return {
      code: -1,
      message: '商品不能为空'
    }
  }

  if (!address) {
    return {
      code: -1,
      message: '地址不能为空'
    }
  }

  try {
    const now = new Date()
    const order = {
      _openid: openid,
      orderNo: generateOrderNo(),
      status: 'pending',
      statusText: '待支付',
      products,
      totalCount,
      productTotal,
      deliveryFee,
      totalPrice,
      address,
      remark: remark || '',
      createTime: formatDateTime(now),
      payTime: '',
      deliverTime: '',
      completeTime: ''
    }

    const result = await ordersCollection.add({ data: order })

    return {
      code: 0,
      data: { _id: result._id, ...order },
      message: '创建成功'
    }
  } catch (e) {
    console.error('创建订单失败:', e)
    return {
      code: -1,
      message: e.message || '创建订单失败'
    }
  }
}
