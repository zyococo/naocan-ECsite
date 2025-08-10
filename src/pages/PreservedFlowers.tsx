import React, { useState, useMemo } from 'react';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const PreservedFlowers = () => {
  const [filters, setFilters] = useState({
    budget: 'all',
    color: 'all',
    size: 'all',
    flower: 'all'
  });
  const [sortBy, setSortBy] = useState('popular');
  const { addItem } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const products = [
    {
      id: 2,
      name: 'プリザーブドローズ・エレガント',
      price: 12800,
      originalPrice: null,
      image: 'https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.9,
      reviews: 89,
      tags: ['新作', 'ギフト'],
      description: 'エレガントなプリザーブドローズのアレンジメントです。',
      color: 'red',
      size: 'medium',
      flower: 'rose',
      isNew: true
    },
    {
      id: 5,
      name: 'プリザーブド・ハートボックス',
      price: 9800,
      originalPrice: null,
      image: 'https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.8,
      reviews: 134,
      tags: ['記念日', '贈り物'],
      description: 'ハート型のボックスに入ったロマンチックなプリザーブドフラワーです。',
      color: 'pink',
      size: 'small',
      flower: 'mixed',
      isNew: false
    },
    {
      id: 7,
      name: 'プリザーブド・ガーデンドーム',
      price: 15800,
      originalPrice: null,
      image: 'https://images.pexels.com/photos/1198264/pexels-photo-1198264.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.9,
      reviews: 56,
      tags: ['高級', '新作'],
      description: 'ガラスドームに入った美しいプリザーブドフラワーガーデンです。',
      color: 'mixed',
      size: 'large',
      flower: 'mixed',
      isNew: true
    },
    {
      id: 12,
      name: 'プリザーブド・ブルーローズ',
      price: 8800,
      originalPrice: 9800,
      image: 'https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.7,
      reviews: 112,
      tags: ['希少', 'ブルー'],
      description: '珍しいブルーのプリザーブドローズです。',
      color: 'blue',
      size: 'medium',
      flower: 'rose',
      isNew: false
    },
    {
      id: 13,
      name: 'プリザーブド・ホワイトブーケ',
      price: 11200,
      originalPrice: null,
      image: 'https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.8,
      reviews: 78,
      tags: ['ウェディング', '純白'],
      description: '純白のプリザーブドフラワーブーケです。',
      color: 'white',
      size: 'large',
      flower: 'mixed',
      isNew: false
    },
    {
      id: 14,
      name: 'プリザーブド・レインボー',
      price: 13500,
      originalPrice: null,
      image: 'https://images.pexels.com/photos/1198264/pexels-photo-1198264.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.6,
      reviews: 95,
      tags: ['カラフル', '特別'],
      description: '虹色に輝くカラフルなプリザーブドフラワーです。',
      color: 'mixed',
      size: 'medium',
      flower: 'mixed',
      isNew: false
    },
    {
      id: 15,
      name: 'ミニプリザーブド・ローズ',
      price: 4800,
      originalPrice: null,
      image: 'https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.5,
      reviews: 156,
      tags: ['コンパクト', 'お手軽'],
      description: 'コンパクトサイズのプリザーブドローズです。',
      color: 'red',
      size: 'small',
      flower: 'rose',
      isNew: false
    },
    {
      id: 16,
      name: 'プリザーブド・カーネーション',
      price: 6800,
      originalPrice: 7500,
      image: 'https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.6,
      reviews: 89,
      tags: ['母の日', 'ギフト'],
      description: '母の日にぴったりなプリザーブドカーネーションです。',
      color: 'pink',
      size: 'medium',
      flower: 'carnation',
      isNew: false
    }
  ];

  const filterOptions = {
    budget: [
      { value: 'all', label: 'すべて' },
      { value: 'low', label: '8,000円以下' },
      { value: 'mid', label: '8,000円 - 12,000円' },
      { value: 'high', label: '12,000円以上' }
    ],
    color: [
      { value: 'all', label: 'すべて' },
      { value: 'red', label: 'レッド' },
      { value: 'pink', label: 'ピンク' },
      { value: 'blue', label: 'ブルー' },
      { value: 'white', label: 'ホワイト' },
      { value: 'mixed', label: 'ミックス' }
    ],
    size: [
      { value: 'all', label: 'すべて' },
      { value: 'small', label: 'コンパクト' },
      { value: 'medium', label: 'レギュラー' },
      { value: 'large', label: 'ラージ' }
    ],
    flower: [
      { value: 'all', label: 'すべて' },
      { value: 'rose', label: 'ローズ' },
      { value: 'carnation', label: 'カーネーション' },
      { value: 'hydrangea', label: 'あじさい' },
      { value: 'mixed', label: 'ミックス' }
    ]
  };

  const sortOptions = [
    { value: 'popular', label: '人気順' },
    { value: 'price-low', label: '価格の安い順' },
    { value: 'price-high', label: '価格の高い順' },
    { value: 'rating', label: '評価の高い順' }
  ];

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Budget filter
      if (filters.budget !== 'all') {
        if (filters.budget === 'low' && product.price > 8000) return false;
        if (filters.budget === 'mid' && (product.price <= 8000 || product.price > 12000)) return false;
        if (filters.budget === 'high' && product.price <= 12000) return false;
      }

      // Color filter
      if (filters.color !== 'all' && product.color !== filters.color) return false;

      // Size filter
      if (filters.size !== 'all' && product.size !== filters.size) return false;

      // Flower filter
      if (filters.flower !== 'all' && product.flower !== filters.flower) return false;

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          // First sort by rating (descending), then by number of reviews (descending) as tiebreaker
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          return b.reviews - a.reviews;
        case 'popular':
        default:
          return b.reviews - a.reviews;
      }
    });

    return filtered;
  }, [filters, sortBy]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

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
      category: 'preserved'
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
        category: 'preserved',
        rating: product.rating,
        reviews: product.reviews
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-primary-dark-green text-white py-20 border-b border-primary-gold/30">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-wider">プリザーブドフラワー</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto tracking-wide">
            特別な技術で処理された本物のお花が、長期間美しさを保ち続けます。永遠の美しさをお楽しみください。
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-charcoal mb-6">絞り込み</h3>
              
              {/* Budget Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-charcoal mb-3">予算で選ぶ</h4>
                <div className="space-y-2">
                  {filterOptions.budget.map(option => (
                    <label key={option.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="budget"
                        value={option.value}
                        checked={filters.budget === option.value}
                        onChange={(e) => handleFilterChange('budget', e.target.value)}
                        className="w-4 h-4 text-preserved-rose focus:ring-preserved-rose border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-charcoal mb-3">カラーで選ぶ</h4>
                <div className="space-y-2">
                  {filterOptions.color.map(option => (
                    <label key={option.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="color"
                        value={option.value}
                        checked={filters.color === option.value}
                        onChange={(e) => handleFilterChange('color', e.target.value)}
                        className="w-4 h-4 text-preserved-rose focus:ring-preserved-rose border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-charcoal mb-3">大きさで選ぶ</h4>
                <div className="space-y-2">
                  {filterOptions.size.map(option => (
                    <label key={option.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="size"
                        value={option.value}
                        checked={filters.size === option.value}
                        onChange={(e) => handleFilterChange('size', e.target.value)}
                        className="w-4 h-4 text-preserved-rose focus:ring-preserved-rose border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Flower Filter */}
              <div>
                <h4 className="font-semibold text-charcoal mb-3">花で選ぶ</h4>
                <div className="space-y-2">
                  {filterOptions.flower.map(option => (
                    <label key={option.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="flower"
                        value={option.value}
                        checked={filters.flower === option.value}
                        onChange={(e) => handleFilterChange('flower', e.target.value)}
                        className="w-4 h-4 text-preserved-rose focus:ring-preserved-rose border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header with Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <p className="text-gray-600">
                {filteredAndSortedProducts.length}件の商品が見つかりました
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-gray-700 whitespace-nowrap">
                  並び替え:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-preserved-rose text-sm min-w-[140px]"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105"
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
                            <span className="px-3 py-1 bg-primary-gold text-text-dark text-xs font-bold">
                              新作
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                        <Eye size={16} className="text-gray-600 hover:text-preserved-rose" />
                      </Link>
                    </div>

                    {/* Quick Add to Cart - Positioned at bottom of image */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-primary-dark-green hover:bg-primary-navy text-white py-2 px-4 rounded-full font-medium transition-colors duration-200 flex items-center justify-center gap-2"
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
                      <h3 className="text-lg font-semibold text-charcoal mb-2 line-clamp-2 group-hover:text-preserved-rose transition-colors duration-200 cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>

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
                      <span className="text-xl font-bold text-preserved-rose">
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

            {/* No Results */}
            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">条件に合う商品が見つかりませんでした。</p>
                <p className="text-gray-400 mt-2">フィルターを変更してお試しください。</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreservedFlowers;