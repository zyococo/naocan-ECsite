import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { state, removeItem, updateQuantity, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleQuantityChange = (id: number, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      handleRemoveItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: number) => {
    const result = window.confirm('この商品をカートから削除しますか？');
    if (result) {
      removeItem(id);
    }
  };

  const handleClearCart = () => {
    const result = window.confirm('カート内のすべての商品を削除しますか？');
    if (result) {
      clearCart();
    }
  };

  const shippingCost = state.total >= 10000 ? 0 : 800;
  const finalTotal = state.total + shippingCost;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-charcoal mb-4">カートは空です</h1>
            <p className="text-lg text-gray-600 mb-8">
              美しいお花をカートに追加して、お買い物をお楽しみください。
            </p>
            <Link
              to="/buddhist-flowers"
              className="inline-flex items-center bg-gradient-to-r from-primary-purple to-primary-gold text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft size={20} className="mr-2" />
              お買い物を続ける
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-purple to-purple-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">ショッピングカート</h1>
          <p className="text-lg opacity-90">
            選択された商品を確認し、お会計にお進みください。
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-charcoal">
                カート内商品 ({state.itemCount}点)
              </h2>
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
              >
                すべて削除
              </button>
            </div>

            <div className="space-y-6">
              {state.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full sm:w-32 h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-charcoal mb-2">
                            {item.name}
                          </h3>
                          <span className="inline-block px-2 py-1 bg-bg-cream text-charcoal text-xs rounded-full">
                            {item.category === 'buddhist' ? '仏花' : 'プリザーブド'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Price */}
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-primary-purple">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                              className="p-2 hover:bg-gray-100 transition-colors duration-200"
                              title={item.quantity === 1 ? "商品を削除" : "数量を減らす"}
                            >
                              {item.quantity === 1 ? (
                                <Trash2 size={16} className="text-red-500" />
                              ) : (
                                <Minus size={16} />
                              )}
                            </button>
                            <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                              className="p-2 hover:bg-gray-100 transition-colors duration-200"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <span className="text-lg font-bold text-charcoal">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-8">
              <Link
                to="/buddhist-flowers"
                className="inline-flex items-center text-primary-purple hover:text-purple-700 font-medium transition-colors duration-200"
              >
                <ArrowLeft size={20} className="mr-2" />
                お買い物を続ける
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-8 sticky top-24">
              <h3 className="text-xl font-bold text-charcoal mb-6">ご注文内容</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">小計</span>
                  <span className="font-semibold">{formatPrice(state.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">送料</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? '無料' : formatPrice(shippingCost)}
                  </span>
                </div>
                {state.total < 10000 && (
                  <p className="text-sm text-gray-500">
                    ¥10,000以上のご注文で送料無料
                  </p>
                )}
                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>合計</span>
                    <span className="text-primary-purple">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-primary-purple to-primary-gold text-white py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 mb-4">
                レジに進む
              </button>

              <div className="text-center text-sm text-gray-500">
                <p>安全な決済システムを使用しています</p>
              </div>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t border-gray-300">
                <h4 className="font-semibold text-charcoal mb-3">お支払い方法</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• クレジットカード</p>
                  <p>• 銀行振込</p>
                  <p>• 代金引換</p>
                  <p>• コンビニ決済</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;