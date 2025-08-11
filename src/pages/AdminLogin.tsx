import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowLeft, Home } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { Link } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, state } = useAdmin();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('メールアドレスとパスワードを入力してください。');
      return;
    }

    const success = await login(formData.email, formData.password);
    
    if (success) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError('認証に失敗しました。管理者のメールアドレスとパスワードを確認してください。');
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [state.isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Navigation Links */}
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="inline-flex items-center text-gray-300 hover:text-white transition-colors duration-200"
          >
            <Home size={20} className="mr-2" />
            ホーム
          </Link>
          <div className="text-gray-400 text-sm">
            管理者専用エリア
          </div>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
              <Shield size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">管理者ログイン</h2>
          <p className="text-gray-300">
            なおかん (naocan) 管理システム
          </p>
          <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm font-medium">
              ⚠️ 管理者専用エリアです
            </p>
            <p className="text-red-400 text-xs mt-1">
              認証されたスタッフのみアクセス可能
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary-dark-green mb-2">管理者ログイン</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                管理者メールアドレス
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="メールアドレスを入力"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="パスワードを入力"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={state.isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-full font-semibold transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Shield size={20} />
                  管理者ログイン
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;