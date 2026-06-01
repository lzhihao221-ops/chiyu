import { useState } from 'react'

const PRODUCTS = [
  { id: 1, name: '智能运动手环 Pro', price: 199, original: 399, sales: 32000, emoji: '⌚', category: '装备', desc: '心率监测/睡眠追踪/50米防水' },
  { id: 2, name: '天然橡胶瑜伽垫', price: 89, original: 159, sales: 18000, emoji: '🧘', category: '装备', desc: '6mm加厚/防滑双面/送收纳袋' },
  { id: 3, name: '运动蓝牙耳机 Air', price: 129, original: 299, sales: 56000, emoji: '🎧', category: '装备', desc: 'IPX7防水/30小时续航/降噪' },
  { id: 4, name: '乳清蛋白粉 2.27kg', price: 158, original: 268, sales: 21000, emoji: '🥤', category: '营养', desc: '分离乳清/每份25g蛋白' },
  { id: 5, name: '速干运动T恤', price: 69, original: 129, sales: 45000, emoji: '👕', category: '服饰', desc: '冰丝面料/透气速干/多色可选' },
  { id: 6, name: '专业跑鞋 飞影', price: 299, original: 599, sales: 15000, emoji: '👟', category: '服饰', desc: '碳板科技/超轻回弹' },
  { id: 7, name: '筋膜枪 迷你版', price: 179, original: 359, sales: 28000, emoji: '🔫', category: '装备', desc: '4个按摩头/Type-C充电/静音' },
  { id: 8, name: 'BCAA支链氨基酸', price: 89, original: 168, sales: 12000, emoji: '💊', category: '营养', desc: '缓解肌肉疲劳/加速恢复' },
]

const SHOP_CATS = ['全部', '装备', '服饰', '营养']

export default function ShopPage() {
  const [selectedCat, setSelectedCat] = useState('全部')
  const [cart, setCart] = useState([])

  const filtered = selectedCat === '全部'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === selectedCat)

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === product.id)
      if (existing) return prev.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0)
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0)

  return (
    <div className="shop-page">
      <div className="shop-banner">
        <h2>🛒 运动好物</h2>
        <p>精选运动装备、营养补剂、服饰配件</p>
      </div>

      <div className="shop-categories">
        {SHOP_CATS.map(c => (
          <button
            key={c}
            className={`shop-cat-btn ${selectedCat === c ? 'active' : ''}`}
            onClick={() => setSelectedCat(c)}
          >{c}</button>
        ))}
      </div>

      <div className="shop-grid">
        {filtered.map(p => (
          <div key={p.id} className="shop-product">
            <div className="shop-product-img">{p.emoji}</div>
            <div className="shop-product-info">
              <h4>{p.name}</h4>
              <p className="shop-product-desc">{p.desc}</p>
              <div className="shop-product-bottom">
                <div className="shop-product-prices">
                  <span className="shop-price">¥{p.price}</span>
                  <span className="shop-original">¥{p.original}</span>
                </div>
                <button className="shop-add-btn" onClick={() => addToCart(p)}>+</button>
              </div>
              <span className="shop-sales">已售 {(p.sales / 10000).toFixed(1)}万</span>
            </div>
          </div>
        ))}
      </div>

      {cartCount > 0 && (
        <div className="shop-cart-bar">
          <div className="shop-cart-info">
            <span className="shop-cart-icon">🛒</span>
            <span className="shop-cart-count">{cartCount}</span>
            <span className="shop-cart-total">¥{cartTotal}</span>
          </div>
          <button className="shop-checkout-btn">去结算</button>
        </div>
      )}
    </div>
  )
}
