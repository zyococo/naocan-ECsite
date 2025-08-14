import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Truck, Shield, ArrowLeft, Plus, Minus, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useProduct } from '../hooks/useProduct';

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  
  // Supabaseから商品データを取得
  const { product, loading, error } = useProduct(id || '');

  // ローディング状態
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-primary-dark-green" size={48} />
          <p className="text-gray-600">商品情報を読み込み中...</p>
          <p className="text-sm text-gray-500 mt-2">商品ID: {id}</p>
        </div>
      </div>
    );
  }

  // エラー状態
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || '商品が見つかりません'}</p>
          <p className="text-sm text-gray-500 mb-4">商品ID: {id}</p>
          <Link
            to="/"
            className="inline-flex items-center text-primary-dark-green hover:text-primary-navy transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

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
        id: parseInt(product.id),
        name: product.name,
        price: product.price,
        originalPrice: product.original_price,
        image: product.image_url,
        category: product.category
      });
    }
    // Reset quantity after adding to cart
    setQuantity(1);
  };

  const handleToggleFavorite = () => {
    if (isFavorite(parseInt(product.id))) {
      removeFavorite(parseInt(product.id));
    } else {
      addFavorite({
        id: parseInt(product.id),
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

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <section className="py-3 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary-purple">ホーム</Link>
            <span className="text-gray-300">/</span>
            <Link 
              to={product.category === 'buddhist' ? '/buddhist-flowers' : '/preserved-flowers'} 
              className="text-gray-500 hover:text-primary-purple"
            >
              {product.category === 'buddhist' ? 'プリザーブド仏花' : 'プリザーブドフラワー'}
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-charcoal">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to={product.category === 'buddhist' ? '/buddhist-flowers' : '/preserved-flowers'}
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
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-image.jpg'; // フォールバック画像
                  }}
                />
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags && product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-bg-cream text-charcoal text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {product.is_new && (
                  <span className="px-3 py-1 bg-primary-sakura text-white text-sm rounded-full">
                    新作
                  </span>
                )}
                {product.is_sale && (
                  <span className="px-3 py-1 bg-primary-gold text-white text-sm rounded-full">
                    セール
                  </span>
                )}
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-charcoal mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex">
                  {renderStars(product.rating || 0)}
                </div>
                <span className="text-lg font-semibold">{product.rating || 0}</span>
                <span className="text-gray-500">({product.reviews || 0}件のレビュー)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl font-bold text-charcoal">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.original_price)}
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
                  {product.features ? (
                    product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-primary-purple rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))
                  ) : (
                    // モックデータ用のデフォルト特徴
                    <>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary-purple rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">高品質な花材を使用</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary-purple rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">長期間美しさを保持</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary-purple rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">お手入れ簡単</span>
                      </li>
                    </>
                  )}
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
                      isFavorite(parseInt(product.id))
                        ? 'border-primary-sakura bg-primary-sakura/20 hover:bg-primary-sakura/30'
                        : 'border-border-light hover:bg-soft-green'
                    }`}
                  >
                    <Heart 
                      size={20} 
                      className={`${
                        isFavorite(parseInt(product.id)) 
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
                <h3 className="font-semibold text-text-dark mb-3 tracking-wide">カテゴリー</h3>
                <p className="text-text-gray tracking-wide">
                  {product.category === 'buddhist' ? 'プリザーブド仏花' : 'プリザーブドフラワー'}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-text-dark mb-3 tracking-wide">サイズ</h3>
                <p className="text-text-gray tracking-wide">{product.size || '標準サイズ'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-text-dark mb-3 tracking-wide">色</h3>
                <p className="text-text-gray tracking-wide">{product.color || 'ミックス'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-text-dark mb-3 tracking-wide">花材</h3>
                <p className="text-text-gray tracking-wide">{product.flower || 'ミックス'}</p>
              </div>
            </div>

            {/* 詳細仕様 */}
            {product.specifications && (
              <div className="mt-12">
                <h3 className="text-xl font-bold text-text-dark mb-6 tracking-wider">詳細仕様</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-text-dark mb-3 tracking-wide">サイズ・重量</h4>
                    <div className="space-y-2">
                      <p className="text-text-gray tracking-wide">
                        <span className="font-medium">寸法:</span> {product.specifications.dimensions}
                      </p>
                      <p className="text-text-gray tracking-wide">
                        <span className="font-medium">重量:</span> {product.specifications.weight}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark mb-3 tracking-wide">花器・素材</h4>
                    <div className="space-y-2">
                      <p className="text-text-gray tracking-wide">
                        <span className="font-medium">花器:</span> {product.specifications.vase_material}
                      </p>
                      <p className="text-text-gray tracking-wide">
                        <span className="font-medium">花材:</span> {product.specifications.flower_types}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark mb-3 tracking-wide">保存・お手入れ</h4>
                    <div className="space-y-2">
                      <p className="text-text-gray tracking-wide">
                        <span className="font-medium">保存方法:</span> {product.specifications.preservation_method}
                      </p>
                      <p className="text-text-gray tracking-wide">
                        <span className="font-medium">お手入れ:</span> {product.specifications.care_instructions}
                      </p>
                      <p className="text-text-gray tracking-wide">
                        <span className="font-medium">保存期間:</span> {product.specifications.lifespan}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark mb-3 tracking-wide">パッケージ</h4>
                    <div className="space-y-2">
                      <p className="text-text-gray tracking-wide">
                        <span className="font-medium">梱包:</span> {product.specifications.packaging}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;