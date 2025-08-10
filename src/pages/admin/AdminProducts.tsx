import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit3, Trash2, Eye, Search, Filter } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const AdminProducts = () => {
  const { state, deleteProduct } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('この商品を削除しますか？')) {
      await deleteProduct(id);
    }
  };

  const filteredProducts = state.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">商品管理</h1>
          <p className="text-gray-600 mt-2">商品の追加、編集、削除を行えます</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center bg-primary-dark-green hover:bg-primary-navy text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300"
        >
          <Plus size={20} className="mr-2" />
          新規商品追加
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="商品名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
            >
              <option value="all">すべてのカテゴリ</option>
              <option value="buddhist">プリザーブド仏花</option>
              <option value="preserved">プリザーブドフラワー</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">カテゴリ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">価格</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">評価</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成日</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.description.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.category === 'buddhist' 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-pink-100 text-pink-600'
                    }`}>
                      {product.category === 'buddhist' ? '仏花' : 'プリザーブド'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatPrice(product.price)}</div>
                    {product.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">★ {product.rating}</div>
                    <div className="text-sm text-gray-500">({product.reviews}件)</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-1">
                      {product.isNew && (
                        <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                          新作
                        </span>
                      )}
                      {product.isSale && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                          セール
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="詳細表示"
                      >
                        <Eye size={16} />
                      </button>
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="編集"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="削除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">条件に合う商品が見つかりませんでした。</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">商品詳細</h3>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedProduct.name}</h4>
                  <p className="text-gray-600">{selectedProduct.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">価格:</span> {formatPrice(selectedProduct.price)}
                  </div>
                  <div>
                    <span className="font-medium">カテゴリ:</span> {selectedProduct.category === 'buddhist' ? '仏花' : 'プリザーブド'}
                  </div>
                  <div>
                    <span className="font-medium">評価:</span> ★ {selectedProduct.rating} ({selectedProduct.reviews}件)
                  </div>
                  <div>
                    <span className="font-medium">色:</span> {selectedProduct.color}
                  </div>
                </div>
                <div>
                  <span className="font-medium">タグ:</span>
                  <div className="flex gap-2 mt-1">
                    {selectedProduct.tags.map((tag: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;