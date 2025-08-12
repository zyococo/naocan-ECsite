import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Truck, Shield, ArrowLeft, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  // Mock product data - in a real app, this would come from an API
  const product = {
    id: parseInt(id || '1'),
    name: 'プリザーブドローズ・エレガント',
    price: 12800,
    originalPrice: null,
    images: [
      'https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1198264/pexels-photo-1198264.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    ],
    rating: 4.9,
    reviews: 89,
    tags: ['新作', 'ギフト'],
    description: 'エレガントなプリザーブドローズのアレンジメントです。特別な技術で処理された本物のバラが、長期間美しさを保ち続けます。',
    features: [
      '高品質なプリザーブドローズを使用',
      '2-3年間美しさを保持',
      '水やり不要でお手入れ簡単',
      '専用ボックス付きでギフトに最適'
    ],
    specifications: {
      size: '約15cm × 15cm × 20cm',
      weight: '約300g',
      materials: 'プリザーブドローズ、アーティフィシャルフラワー',
      origin: '日本製'
    },
    category: 'preserved',
    isNew: true,
    isSale: false
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
        size={16}
        className={`${
          i < Math.floor(rating) 
            ? 'fill-primary-gold text-primary-gold' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        category: product.category
      });
    }
    // Reset quantity after adding to cart
    setQuantity(1);
  };

  const handleToggleFavorite = () => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        category: product.category,
        rating: product.rating,
        reviews: product.reviews
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <section className="py-3 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary-purple">ホーム</Link>
            <span className="text-gray-300">/</span>
            <Link to="/preserved-flowers" className="text-gray-500 hover:text-primary-purple">プリザーブドフラワー</Link>
            <span className="text-gray-300">/</span>
            <span className="text-charcoal">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/preserved-flowers"
            className="inline-flex items-center text-primary-purple hover:text-purple-700 mb-8 transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            商品一覧に戻る
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="aspect-square mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index 
                        ? 'border-primary-purple' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-bg-cream text-charcoal text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-charcoal mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex">
                  {renderStars(product.rating)}
                </div>
                <span className="text-lg font-semibold">{product.rating}</span>
                <span className="text-gray-500">({product.reviews}件のレビュー)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl font-bold text-charcoal">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-charcoal mb-4">商品の特徴</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-primary-purple rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center">
                    <span className="text-gray-700 mr-4">数量:</span>
                    <div className="flex items-center border border-gray-300 rounded-full">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="p-2 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-2 font-semibold">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="p-2 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary-dark-green hover:bg-primary-navy text-white py-4 px-6 font-semibold transition-colors duration-300 flex items-center justify-center gap-2 tracking-wider border border-primary-gold/30 rounded-full"
                  >
                    <ShoppingCart size={20} />
                    カートに追加
                  </button>
                  <button 
                    onClick={handleToggleFavorite}
                    className={`p-4 border transition-all duration-300 ${
                      isFavorite(product.id)
                        ? 'border-primary-sakura bg-primary-sakura/20 hover:bg-primary-sakura/30'
                        : 'border-border-light hover:bg-soft-green'
                    }`}
                  >
                    <Heart 
                      size={20} 
                      className={`${
                        isFavorite(product.id) 
                          ? 'text-primary-sakura fill-primary-sakura' 
                          : 'text-text-gray'
                      }`} 
                    />
                  </button>
                </div>

                {/* Shipping Info */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Truck size={16} className="mr-2 text-primary-gold" />
                    全国配送対応（送料別途）
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield size={16} className="mr-2 text-primary-gold" />
                    品質保証付き
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="mt-20 bg-soft-green border border-primary-dark-green/20 p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-8 tracking-wider">商品仕様</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-text-dark mb-3 tracking-wide">サイズ</h3>
                <p className="text-text-gray tracking-wide">{product.specifications.size}</p>
              </div>
              <div>
                <h3 className="font-semibold text-text-dark mb-3 tracking-wide">重量</h3>
                <p className="text-text-gray tracking-wide">{product.specifications.weight}</p>
              </div>
              <div>
                <h3 className="font-semibold text-text-dark mb-3 tracking-wide">素材</h3>
                <p className="text-text-gray tracking-wide">{product.specifications.materials}</p>
              </div>
              <div>
                <h3 className="font-semibold text-text-dark mb-3 tracking-wide">製造国</h3>
                <p className="text-text-gray tracking-wide">{product.specifications.origin}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;