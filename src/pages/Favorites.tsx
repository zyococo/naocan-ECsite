import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Star, ArrowLeft, Trash2 } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';

const Favorites = () => {
  const { state, removeFavorite, clearFavorites } = useFavorites();
  const { addItem } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < Math.floor(rating) 
            ? 'fill-primary-gold text-primary-gold' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleAddToCart = (item: typeof state.items[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      category: item.category
    });
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Heart size={64} className="mx-auto text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-charcoal mb-4">お気に入りは空です</h1>
            <p className="text-lg text-gray-600 mb-8">
              気に入った商品をお気に入りに追加して、後で簡単にアクセスできます。
            </p>
            <Link
              to="/"
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
      <section className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">お気に入り</h1>
          <p className="text-lg opacity-90">
            お気に入りに追加した商品を確認し、カートに追加できます。
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-charcoal">
            お気に入り商品 ({state.itemCount}点)
          </h2>
          <button
            onClick={clearFavorites}
            className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
          >
            すべて削除
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {state.items.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Remove from Favorites Button */}
                <button
                  onClick={() => removeFavorite(item.id)}
                  className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>

                {/* Action Buttons */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link
                    to={`/product/${item.id}`}
                    className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200"
                  >
                    <Eye size={16} className="text-gray-600 hover:text-primary-purple" />
                  </Link>
                </div>

                {/* Quick Add to Cart */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-primary-purple hover:bg-purple-700 text-white py-2 px-4 rounded-full font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    カートに追加
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-block px-2 py-1 bg-bg-cream text-charcoal text-xs rounded-full">
                    {item.category === 'buddhist' ? '仏花' : 'プリザーブド'}
                  </span>
                </div>

                {/* Product Name */}
                <h3 className="text-lg font-semibold text-charcoal mb-2 line-clamp-2 group-hover:text-primary-purple transition-colors duration-200">
                  {item.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {renderStars(item.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({item.reviews})
                  </span>
                </div>

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
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-primary-purple hover:text-purple-700 font-medium transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            お買い物を続ける
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Favorites;