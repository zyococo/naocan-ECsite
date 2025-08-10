import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Calendar, 
  Users, 
  TrendingUp, 
  LogOut, 
  Plus,
  Edit3,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import type { Product, Reservation } from '../context/AdminContext';

const AdminDashboard = () => {
  const { state, logout, deleteProduct, updateReservationStatus, deleteAvailableSlot } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'reservations' | 'slots'>('overview');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [state.isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('この商品を削除しますか？')) {
      await deleteProduct(id);
    }
  };

  const handleUpdateReservationStatus = async (id: number, status: Reservation['status']) => {
    await updateReservationStatus(id, status);
  };

  const handleDeleteSlot = async (id: number) => {
    if (window.confirm('この予約枠を削除しますか？')) {
      await deleteAvailableSlot(id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: Reservation['status']) => {
    switch (status) {
      case 'pending': return '保留中';
      case 'confirmed': return '確認済み';
      case 'completed': return '完了';
      case 'cancelled': return 'キャンセル';
      default: return status;
    }
  };

  if (!state.isAuthenticated) {
    return null;
  }

  const stats = [
    {
      title: '総商品数',
      value: state.products.length,
      icon: <Package size={24} />,
      color: 'from-blue-500 to-blue-700'
    },
    {
      title: '予約件数',
      value: state.reservations.length,
      icon: <Calendar size={24} />,
      color: 'from-green-500 to-green-700'
    },
    {
      title: '予約枠数',
      value: state.availableSlots.length,
      icon: <Clock size={24} />,
      color: 'from-purple-500 to-purple-700'
    },
    {
      title: '保留中予約',
      value: state.reservations.filter(r => r.status === 'pending').length,
      icon: <AlertCircle size={24} />,
      color: 'from-yellow-500 to-yellow-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                <img 
                  src="/naocan-logo-copy.jpeg" 
                  alt="なおかん logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-xl font-bold text-gray-900">なおかん 管理システム</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
            >
              <LogOut size={20} />
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: '概要', icon: <TrendingUp size={20} /> },
              { id: 'products', label: '商品管理', icon: <Package size={20} /> },
              { id: 'reservations', label: '予約管理', icon: <Calendar size={20} /> },
              { id: 'slots', label: '予約枠管理', icon: <Clock size={20} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-dark-green text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full bg-primary-dark-green flex items-center justify-center text-white`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Reservations */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">最新の予約</h3>
                <div className="space-y-4">
                  {state.reservations.slice(0, 5).map((reservation) => (
                    <div key={reservation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{reservation.name}</p>
                        <p className="text-sm text-gray-600">{reservation.preferredDate} {reservation.preferredTime}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                        {getStatusLabel(reservation.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Products */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">最新の商品</h3>
                <div className="space-y-4">
                  {state.products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">商品管理</h2>
              <button
                onClick={() => navigate('/admin/products/new')}
                className="bg-primary-purple hover:bg-purple-700 text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 transition-colors duration-200"
              >
                <Plus size={20} />
                新規商品追加
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">カテゴリ</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">価格</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">評価</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {state.products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg mr-4"
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedProduct(product)}
                              className="bg-primary-dark-green hover:bg-primary-navy text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 transition-colors duration-200"
                            >
                              <Eye size={16} />
                              詳細を見る
                            </button>
                            <button
                              onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
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
            </div>
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">予約管理</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">予約者</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日時</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">人数</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">希望</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {state.reservations.map((reservation) => (
                      <tr key={reservation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{reservation.name}</div>
                            <div className="text-sm text-gray-500">{reservation.email}</div>
                            <div className="text-sm text-gray-500">{reservation.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{reservation.preferredDate}</div>
                          <div className="text-sm text-gray-500">{reservation.preferredTime}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{reservation.participants}名</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {reservation.flowerType && `花: ${reservation.flowerType}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {reservation.colorPreference && `色: ${reservation.colorPreference}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                            {getStatusLabel(reservation.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedReservation(reservation)}
                              className="bg-primary-dark-green hover:bg-primary-navy text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 transition-colors duration-200"
                            >
                              <Eye size={16} />
                              詳細を見る
                            </button>
                            {reservation.status === 'pending' && (
                              <button
                                onClick={() => handleUpdateReservationStatus(reservation.id, 'confirmed')}
                                className="text-green-600 hover:text-green-900"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            {reservation.status !== 'cancelled' && (
                              <button
                                onClick={() => handleUpdateReservationStatus(reservation.id, 'cancelled')}
                                className="text-red-600 hover:text-red-900"
                              >
                                <XCircle size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Available Slots Tab */}
        {activeTab === 'slots' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">予約枠管理</h2>
              <button
                onClick={() => navigate('/admin/slots/new')}
                className="bg-primary-purple hover:bg-purple-700 text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 transition-colors duration-200"
              >
                <Plus size={20} />
                新規予約枠追加
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日付</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">時間</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">定員</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">予約数</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {state.availableSlots.map((slot) => (
                      <tr key={slot.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(slot.date).toLocaleDateString('ja-JP', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric',
                              weekday: 'short'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{slot.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{slot.maxParticipants}名</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {slot.currentReservations}/{slot.maxParticipants}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            slot.isActive 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {slot.isActive ? '有効' : '無効'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteSlot(slot.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
                  <XCircle size={24} />
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
                    {selectedProduct.tags.map((tag, index) => (
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

      {/* Reservation Detail Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">予約詳細</h3>
                <button
                  onClick={() => setSelectedReservation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">お名前:</span> {selectedReservation.name}
                  </div>
                  <div>
                    <span className="font-medium">メール:</span> {selectedReservation.email}
                  </div>
                  <div>
                    <span className="font-medium">電話:</span> {selectedReservation.phone}
                  </div>
                  <div>
                    <span className="font-medium">参加人数:</span> {selectedReservation.participants}名
                  </div>
                  <div>
                    <span className="font-medium">希望日:</span> {selectedReservation.preferredDate}
                  </div>
                  <div>
                    <span className="font-medium">希望時間:</span> {selectedReservation.preferredTime}
                  </div>
                  <div>
                    <span className="font-medium">希望の花:</span> {selectedReservation.flowerType || 'お任せ'}
                  </div>
                  <div>
                    <span className="font-medium">希望の色:</span> {selectedReservation.colorPreference || 'お任せ'}
                  </div>
                </div>
                {selectedReservation.message && (
                  <div>
                    <span className="font-medium">メッセージ:</span>
                    <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedReservation.message}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => handleUpdateReservationStatus(selectedReservation.id, 'confirmed')}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-medium transition-colors duration-200"
                  >
                    確認済みにする
                  </button>
                  <button
                    onClick={() => handleUpdateReservationStatus(selectedReservation.id, 'completed')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium transition-colors duration-200"
                  >
                    完了にする
                  </button>
                  <button
                    onClick={() => handleUpdateReservationStatus(selectedReservation.id, 'cancelled')}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium transition-colors duration-200"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;