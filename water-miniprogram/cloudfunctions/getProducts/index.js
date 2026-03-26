const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const productsCollection = db.collection('products')

exports.main = async (event, context) => {
  const { category, keyword } = event

  try {
    let query = productsCollection

    if (category && category !== 'all') {
      query = query.where({ category })
    }

    if (keyword) {
      query = query.where({
        name: db.RegExp({
          regexp: keyword,
          options: 'i'
        })
      })
    }

    const result = await query.get()

    return {
      code: 0,
      data: result.data,
      message: 'success'
    }
  } catch (e) {
    console.error('获取商品失败:', e)
    return {
      code: -1,
      data: [],
      message: e.message || '获取商品失败'
    }
  }
}
