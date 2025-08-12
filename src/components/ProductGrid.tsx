import React, { useState } from 'react';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useProducts } from '../hooks/useSupabase';

const ProductGrid = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const { addItem } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { products, loading, error } = useProducts();

  const filters = [
    { id: 'all', name: 'すべて', count: products.length },
    { id: 'buddhist', name: '仏花', count: products.filter(p => p.category === 'buddhist').length },
    { id: 'preserved', name: 'プリザーブド', count: products.filter(p => p.category === 'preserved').length }
  ];

  const filteredProducts = activeFilter === 'all' 
    ? products 
    : products.filter(product => product.category === activeFilter);

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

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price,
      image: product.image_url,
      category: product.category
    });
  };

  const handleToggleFavorite = (product: typeof products[0]) => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.original_price,
        image: product.image_url,
        category: product.category,
        rating: product.rating,
        reviews: product.reviews
      });
    }
  };

  // ローディング状態
  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg 
                  className="w-12 h-12 text-primary-dark-green animate-pulse" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 18C13.1 18 14 18.9 14 20C14 21.1 13.1 22 12 22C10.9 22 10 21.1 10 20C10 18.9 10.9 18 12 18ZM4 12C4 10.9 4.9 10 6 10C7.1 10 8 10.9 8 12C8 13.1 7.1 14 6 14C4.9 14 4 13.1 4 12ZM18 12C18 10.9 18.9 10 20 10C21.1 10 22 10.9 22 12C22 13.1 21.1 14 20 14C18.9 14 18 13.1 18 12ZM7.05 7.05C7.05 5.95 7.95 5.05 9.05 5.05C10.15 5.05 11.05 5.95 11.05 7.05C11.05 8.15 10.15 9.05 9.05 9.05C7.95 9.05 7.05 8.15 7.05 7.05ZM14.95 7.05C14.95 5.95 15.85 5.05 16.95 5.05C18.05 5.05 18.95 5.95 18.95 7.05C18.95 8.15 18.05 9.05 16.95 9.05C15.85 9.05 14.95 8.15 14.95 7.05ZM7.05 16.95C7.05 15.85 7.95 14.95 9.05 14.95C10.15 14.95 11.05 15.85 11.05 16.95C11.05 18.05 10.15 18.95 9.05 18.95C7.95 18.95 7.05 18.05 7.05 16.95ZM14.95 16.95C14.95 15.85 15.85 14.95 16.95 14.95C18.05 14.95 18.95 15.85 18.95 16.95C18.95 18.05 18.05 18.95 16.95 18.95C15.85 9.05 14.95 18.05 14.95 16.95Z"/>
                </svg>
              </div>
              <div className="absolute inset-0 border-4 border-primary-gold/30 border-t-primary-gold rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 text-lg">商品を読み込み中...</p>
          </div>
        </div>
      </section>
    );
  }

  // エラー状態
  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-red-800 mb-2">エラーが発生しました</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                再読み込み
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-charcoal mb-4">おすすめ商品</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            心を込めて作られた美しいお花たちから、お客様にぴったりの一品をお選びください。
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-medium transition-colors duration-300 border-2 ${
                activeFilter === filter.id
                  ? 'bg-primary-dark-green text-white border-primary-dark-green'
                  : 'bg-white text-charcoal border-border-light hover:border-primary-dark-green hover:text-primary-dark-green'
              }`}
            >
              {filter.name}
              <span className="ml-2 text-sm opacity-70">({filter.count})</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Image Container */}
              <div className="relative">
                {/* Product Image - Now clickable */}
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                      onError={(e) => {
                        console.error("Image load error for:", product.image_url);
                        e.currentTarget.src = '/header.png'; // フォールバック画像
                      }}
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.isNew && (
                        <span className="px-2 py-1 bg-primary-gold text-white text-xs font-bold rounded-full">
                          新作
                        </span>
                      )}
                      {product.isSale && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                          セール
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Action Buttons */}
                <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
                  hoveredProduct === product.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}>
                  <button 
                    onClick={() => handleToggleFavorite(product)}
                    className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-300"
                  >
                    <Heart 
                      size={16} 
                      className={`transition-colors duration-300 ${
                        isFavorite(product.id) 
                          ? 'text-primary-sakura fill-primary-sakura' 
                          : 'text-text-gray hover:text-primary-sakura'
                      }`} 
                    />
                  </button>
                  <Link
                    to={`/product/${product.id}`}
                    className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-300"
                  >
                    <Eye size={16} className="text-text-gray hover:text-primary-dark-green" />
                  </Link>
                </div>

                {/* Quick Add to Cart - Positioned at bottom of image */}
                <div className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 ${
                  hoveredProduct === product.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-primary-dark-green hover:bg-primary-navy text-white py-3 px-4 font-medium transition-colors duration-300 flex items-center justify-center gap-2 tracking-wide"
                  >
                    <ShoppingCart size={16} />
                    カートに追加
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-bg-cream text-charcoal text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Product Name - Also clickable */}
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-lg font-semibold text-charcoal mb-2 line-clamp-2 group-hover:text-primary-purple transition-colors duration-200 cursor-pointer">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-charcoal">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-16">
          <button className="bg-primary-dark-green hover:bg-primary-navy text-white px-12 py-4 font-semibold transition-colors duration-300 tracking-wider border border-primary-gold/30 rounded-full">
            さらに商品を見る
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;