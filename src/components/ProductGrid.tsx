import React, { useState } from 'react';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const ProductGrid = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const { addItem } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const filters = [
    { id: 'all', name: 'すべて', count: 16 },
    { id: 'buddhist', name: '仏花', count: 8 },
    { id: 'preserved', name: 'プリザーブド', count: 8 }
  ];

  const products = [
    {
      id: 1,
      name: '白菊と紫蘭の仏花',
      category: 'buddhist',
      price: 4800,
      originalPrice: 5200,
      image: 'https://images.pexels.com/photos/1070357/pexels-photo-1070357.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.8,
      reviews: 156,
      tags: ['人気', '法事'],
      isNew: false,
      isSale: true
    },
    {
      id: 2,
      name: 'プリザーブドローズ・エレガント',
      category: 'preserved',
      price: 12800,
      originalPrice: null,
      image: 'https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.9,
      reviews: 89,
      tags: ['新作', 'ギフト'],
      isNew: true,
      isSale: false
    },
    {
      id: 4,
      name: '蓮の花・供養セット',
      category: 'buddhist',
      price: 7200,
      originalPrice: 8000,
      image: 'https://images.pexels.com/photos/1070360/pexels-photo-1070360.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.6,
      reviews: 78,
      tags: ['供養', '法要'],
      isNew: false,
      isSale: true
    },
    {
      id: 5,
      name: 'プリザーブド・ハートボックス',
      category: 'preserved',
      price: 9800,
      originalPrice: null,
      image: 'https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.8,
      reviews: 134,
      tags: ['記念日', '贈り物'],
      isNew: false,
      isSale: false
    },
    {
      id: 6,
      name: 'お悔やみの花・白ゆり',
      category: 'buddhist',
      price: 5400,
      originalPrice: null,
      image: 'https://images.pexels.com/photos/2072046/pexels-photo-2072046.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.7,
      reviews: 167,
      tags: ['お悔やみ'],
      isNew: false,
      isSale: false
    },
    {
      id: 7,
      name: 'プリザーブド・ガーデンドーム',
      category: 'preserved',
      price: 15800,
      originalPrice: null,
      image: 'https://images.pexels.com/photos/1198264/pexels-photo-1198264.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.9,
      reviews: 56,
      tags: ['高級', '新作'],
      isNew: true,
      isSale: false
    },
    {
      id: 9,
      name: '季節の仏花・春',
      category: 'buddhist',
      price: 3800,
      originalPrice: null,
      image: 'https://images.pexels.com/photos/1070357/pexels-photo-1070357.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.5,
      reviews: 92,
      tags: ['季節限定', '春'],
      isNew: false,
      isSale: false
    },
    {
      id: 10,
      name: 'プリザーブド・ブルーローズ',
      category: 'preserved',
      price: 8800,
      originalPrice: 9800,
      image: 'https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.7,
      reviews: 112,
      tags: ['希少', 'ブルー'],
      isNew: false,
      isSale: true
    }
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
      originalPrice: product.originalPrice,
      image: product.image,
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
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        rating: product.rating,
        reviews: product.reviews
      });
    }
  };

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
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 border-2 ${
                activeFilter === filter.id
                  ? 'bg-primary-purple text-white border-primary-purple shadow-lg'
                  : 'bg-white text-charcoal border-border-light hover:border-primary-purple hover:text-primary-purple'
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
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
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
                    className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200"
                  >
                    <Heart 
                      size={16} 
                      className={`transition-colors duration-200 ${
                        isFavorite(product.id) 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-gray-600 hover:text-red-500'
                      }`} 
                    />
                  </button>
                  <Link
                    to={`/product/${product.id}`}
                    className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200"
                  >
                    <Eye size={16} className="text-gray-600 hover:text-primary-purple" />
                  </Link>
                </div>

                {/* Quick Add to Cart - Positioned at bottom of image */}
                <div className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 ${
                  hoveredProduct === product.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-primary-purple hover:bg-purple-700 text-white py-2 px-4 rounded-full font-medium transition-colors duration-200 flex items-center justify-center gap-2"
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
                  <span className="text-xl font-bold text-primary-purple">
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
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-primary-purple to-primary-gold text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            さらに商品を見る
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;