import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import type { Product } from '../context/AdminContext';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, addProduct, updateProduct } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = Boolean(id);
  const existingProduct = isEdit ? state.products.find(p => p.id === parseInt(id!)) : null;

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    image: '',
    category: 'buddhist' as 'buddhist' | 'preserved',
    description: '',
    tags: '',
    rating: '4.5',
    reviews: '0',
    color: '',
    size: 'medium',
    flower: '',
    isNew: false,
    isSale: false
  });

  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate('/admin/login', { replace: true });
      return;
    }

    if (isEdit && existingProduct) {
      setFormData({
        name: existingProduct.name,
        price: existingProduct.price.toString(),
        originalPrice: existingProduct.originalPrice?.toString() || '',
        image: existingProduct.image,
        category: existingProduct.category,
        description: existingProduct.description,
        tags: existingProduct.tags.join(', '),
        rating: existingProduct.rating.toString(),
        reviews: existingProduct.reviews.toString(),
        color: existingProduct.color,
        size: existingProduct.size,
        flower: existingProduct.flower,
        isNew: existingProduct.isNew,
        isSale: existingProduct.isSale
      });
    }
  }, [state.isAuthenticated, navigate, isEdit, existingProduct]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('商品名を入力してください。');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('有効な価格を入力してください。');
      return false;
    }
    if (!formData.image.trim()) {
      setError('商品画像URLを入力してください。');
      return false;
    }
    if (!formData.description.trim()) {
      setError('商品説明を入力してください。');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const productData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        image: formData.image.trim(),
        category: formData.category,
        description: formData.description.trim(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        rating: parseFloat(formData.rating),
        reviews: parseInt(formData.reviews),
        color: formData.color,
        size: formData.size,
        flower: formData.flower,
        isNew: formData.isNew,
        isSale: formData.isSale
      };

      let success = false;
      if (isEdit && existingProduct) {
        success = await updateProduct({
          ...existingProduct,
          ...productData
        });
      } else {
        success = await addProduct(productData);
      }

      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('商品の保存に失敗しました。');
      }
    } catch (error) {
      setError('エラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  if (!state.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft size={20} />
              管理画面に戻る
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              {isEdit ? '商品編集' : '新規商品追加'}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  商品名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  placeholder="商品名を入力"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  カテゴリ <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                >
                  <option value="buddhist">プリザーブド仏花</option>
                  <option value="preserved">プリザーブドフラワー</option>
                </select>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  価格（円） <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="100"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  placeholder="4800"
                />
              </div>

              <div>
                <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  元価格（円）
                </label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  min="0"
                  step="100"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  placeholder="5200"
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                商品画像URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="image"
                name="image"
                required
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                placeholder="https://images.pexels.com/..."
              />
              {formData.image && (
                <div className="mt-4">
                  <img
                    src={formData.image}
                    alt="プレビュー"
                    className="w-32 h-32 object-cover rounded-lg border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                商品説明 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent resize-none"
                placeholder="商品の詳細説明を入力してください..."
              />
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                  色
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  placeholder="white, red, mixed など"
                />
              </div>

              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                  サイズ
                </label>
                <select
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                >
                  <option value="small">小</option>
                  <option value="medium">中</option>
                  <option value="large">大</option>
                </select>
              </div>

              <div>
                <label htmlFor="flower" className="block text-sm font-medium text-gray-700 mb-2">
                  花の種類
                </label>
                <input
                  type="text"
                  id="flower"
                  name="flower"
                  value={formData.flower}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  placeholder="rose, chrysanthemum など"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                タグ（カンマ区切り）
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                placeholder="人気, 法事, 新作"
              />
            </div>

            {/* Rating and Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                  評価（1-5）
                </label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="reviews" className="block text-sm font-medium text-gray-700 mb-2">
                  レビュー数
                </label>
                <input
                  type="number"
                  id="reviews"
                  name="reviews"
                  min="0"
                  value={formData.reviews}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Flags */}
            <div className="flex gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isNew"
                  name="isNew"
                  checked={formData.isNew}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-purple focus:ring-primary-purple border-gray-300 rounded"
                />
                <label htmlFor="isNew" className="ml-2 text-sm text-gray-700">
                  新作商品
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isSale"
                  name="isSale"
                  checked={formData.isSale}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-purple focus:ring-primary-purple border-gray-300 rounded"
                />
                <label htmlFor="isSale" className="ml-2 text-sm text-gray-700">
                  セール商品
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary-purple hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                {isEdit ? '更新' : '追加'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductForm;