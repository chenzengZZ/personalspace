const PRODUCTS = [
  {
    _id: '1',
    name: '农夫山泉 18.9L',
    price: 22,
    originalPrice: 28,
    image: '/assets/images/product-19l.jpg',
    category: 'big',
    categoryText: '大桶水',
    sales: 1680,
    stock: 100,
    description: '天然矿泉水，源自千岛湖深层水，口感甘甜，富含多种矿物质。适合家庭日常饮用，品质保证。'
  },
  {
    _id: '2',
    name: '农夫山泉 12L',
    price: 18,
    originalPrice: 22,
    image: '/assets/images/product-19l.jpg',
    category: 'big',
    categoryText: '大桶水',
    sales: 980,
    stock: 80,
    description: '天然矿泉水，适合家庭日常饮用。'
  },
  {
    _id: '3',
    name: '农夫山泉 550ml×24',
    price: 35,
    originalPrice: 45,
    image: '/assets/images/product-550ml.jpg',
    category: 'small',
    categoryText: '小瓶水',
    sales: 3200,
    stock: 200,
    description: '便携装，随时随地补水。整箱24瓶，家庭必备。'
  },
  {
    _id: '4',
    name: '农夫山泉 4L×6',
    price: 42,
    originalPrice: 52,
    image: '/assets/images/product-550ml.jpg',
    category: 'small',
    categoryText: '小瓶水',
    sales: 1560,
    stock: 150,
    description: '家庭装，经济实惠。适合家庭日常饮用。'
  }
]

const CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'big', name: '大桶水' },
  { id: 'small', name: '小瓶水' }
]

function getProductById(id) {
  return PRODUCTS.find(p => p._id === id) || null
}

function getProductsByCategory(category) {
  if (category === 'all') {
    return PRODUCTS
  }
  return PRODUCTS.filter(p => p.category === category)
}

function searchProducts(keyword) {
  if (!keyword) return PRODUCTS
  return PRODUCTS.filter(p => p.name.indexOf(keyword) > -1)
}

module.exports = {
  PRODUCTS,
  CATEGORIES,
  getProductById,
  getProductsByCategory,
  searchProducts
}
