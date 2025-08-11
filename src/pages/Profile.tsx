import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit3, Save, X, ArrowLeft, LogOut, ShoppingBag, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const Profile = () => {
  const { state, updateProfile, logout } = useAuth();
  const { state: cartState } = useCart();
  const { state: favoritesState } = useFavorites();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: state.user?.name || '',
    email: state.user?.email || '',
    phone: state.user?.phone || '',
    address: state.user?.address || ''
  });

  // Redirect if not logged in
  React.useEffect(() => {
    if (!state.isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [state.isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: state.user?.name || '',
      email: state.user?.email || '',
      phone: state.user?.phone || '',
      address: state.user?.address || ''
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  if (!state.user) {
    return null;
  }

  const stats = [
    {
      label: 'カート内商品',
      value: cartState.itemCount,
      icon: <ShoppingBag size={24} />,
      color: 'from-primary-purple to-purple-700',
      link: '/cart'
    },
    {
      label: 'お気に入り',
      value: favoritesState.itemCount,
      icon: <Heart size={24} />,
      color: 'from-red-500 to-pink-600',
      link: '/favorites'
    },
    {
      label: '注文履歴',
      value: 12,
      icon: <ShoppingBag size={24} />,
      color: 'from-primary-gold to-yellow-700',
      link: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-primary-dark-green text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center text-white hover:text-yellow-200 transition-colors duration-200 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            ホームに戻る
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">プロフィール</h1>
          <p className="text-lg opacity-90">
            アカウント情報の確認・編集ができます。
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center">
                  <img
                    src={state.user.avatar}
                    alt={state.user.name}
                    className="w-20 h-20 rounded-full mr-6 object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-charcoal mb-2">{state.user.name}</h2>
                    <p className="text-gray-600">{state.user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 text-primary-dark-green hover:bg-purple-50 rounded-full transition-colors duration-200"
                >
                  {isEditing ? <X size={20} /> : <Edit3 size={20} />}
                </button>
              </div>

              {/* Profile Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    お名前
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <p className="text-charcoal bg-gray-50 px-4 py-3 rounded-lg">{state.user.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <p className="text-charcoal bg-gray-50 px-4 py-3 rounded-lg">{state.user.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    電話番号
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                        placeholder="電話番号を入力"
                      />
                    </div>
                  ) : (
                    <p className="text-charcoal bg-gray-50 px-4 py-3 rounded-lg">
                      {state.user.phone || '未設定'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    住所
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent resize-none"
                        placeholder="住所を入力"
                      />
                    </div>
                  ) : (
                    <p className="text-charcoal bg-gray-50 px-4 py-3 rounded-lg">
                      {state.user.address || '未設定'}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-4">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-primary-dark-green hover:bg-primary-navy text-white py-3 px-4 rounded-full font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <Save size={20} />
                      保存
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-full font-semibold transition-colors duration-200"
                    >
                      キャンセル
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats and Actions */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <Link
                  key={index}
                  to={stat.link}
                  className="block bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary-dark-green rounded-full flex items-center justify-center text-white">
                      {stat.icon}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-charcoal mb-4">クイックアクション</h3>
              <div className="space-y-3">
                <Link
                  to="/cart"
                  className="block w-full text-left px-4 py-3 text-primary-dark-green hover:bg-purple-50 rounded-full transition-colors duration-200"
                >
                  カートを確認
                </Link>
                <Link
                  to="/favorites"
                  className="block w-full text-left px-4 py-3 text-primary-dark-green hover:bg-purple-50 rounded-full transition-colors duration-200"
                >
                  お気に入りを見る
                </Link>
                <Link
                  to="/contact"
                  className="block w-full text-left px-4 py-3 text-primary-dark-green hover:bg-purple-50 rounded-full transition-colors duration-200"
                >
                  お問い合わせ
                </Link>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-full font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <LogOut size={20} />
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;