import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, state } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state, default to home
  const from = (location.state as any)?.from?.pathname || '/';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
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
      navigate(from, { replace: true });
    } else {
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
    }
  };

  // Redirect if already logged in
  React.useEffect(() => {
    if (state.isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [state.isAuthenticated, navigate, from]);

  return (
    <div className="min-h-screen bg-bg-cream flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Home */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center text-primary-dark-green hover:text-primary-navy transition-colors duration-300 tracking-wide"
          >
            <ArrowLeft size={20} className="mr-2" />
            ホームに戻る
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 overflow-hidden flex items-center justify-center">
              <img 
                src="/naocan-logo-copy.jpeg" 
                alt="naocan logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-text-dark mb-3 tracking-wider">ログイン</h2>
          <p className="text-text-gray tracking-wide">
            アカウントにログインして、お買い物をお楽しみください
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white border border-border-light p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-primary-sakura/20 border border-primary-sakura text-primary-dark-green px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-2 tracking-wide">
                メールアドレス
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-text-gray" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-border-light focus:outline-none focus:ring-2 focus:ring-primary-dark-green focus:border-transparent tracking-wide"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-dark mb-2 tracking-wide">
                パスワード
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-text-gray" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-border-light focus:outline-none focus:ring-2 focus:ring-primary-dark-green focus:border-transparent tracking-wide"
                  placeholder="パスワードを入力"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-text-gray hover:text-text-dark transition-colors duration-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-dark-green focus:ring-primary-dark-green border-border-light"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-dark tracking-wide">
                  ログイン状態を保持
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="text-primary-dark-green hover:text-primary-navy transition-colors duration-300 tracking-wide">
                  パスワードを忘れた方
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={state.isLoading}
              className="w-full bg-primary-dark-green hover:bg-primary-navy text-white py-4 px-4 font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed tracking-wider border border-primary-gold/30"
            >
              {state.isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  ログイン
                </>
              )}
            </button>
          </form>

          {/* Demo Account Info */}
          <div className="mt-8 p-4 bg-soft-green border border-primary-dark-green/20">
            <h4 className="text-sm font-semibold text-primary-dark-green mb-2 tracking-wide">デモアカウント</h4>
            <p className="text-xs text-text-gray mb-2 tracking-wide">
              任意のメールアドレスと6文字以上のパスワードでログインできます
            </p>
            <div className="text-xs text-text-gray">
              <p>例: demo@example.com / password123</p>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-text-gray tracking-wide">
              アカウントをお持ちでない方は{' '}
              <Link
                to="/register"
                className="text-primary-dark-green hover:text-primary-navy font-semibold transition-colors duration-300 tracking-wide"
              >
                新規登録
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;