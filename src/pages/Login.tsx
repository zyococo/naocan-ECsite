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
  const { login, loginWithGoogle, state } = useAuth();
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

    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('ログイン中にエラーが発生しました。しばらく時間をおいて再度お試しください。');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const success = await loginWithGoogle();
      if (!success) {
        setError('Googleログインに失敗しました。しばらく時間をおいて再度お試しください。');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError('Googleログイン中にエラーが発生しました。しばらく時間をおいて再度お試しください。');
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
      <div className="max-w-md w-full space-y-6">
        {/* Back to Home */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center text-primary-dark-green hover:text-primary-navy transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            ホームに戻る
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center">
              <img 
                src="/naocan-logo-copy.jpeg" 
                alt="naocan logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-charcoal mb-2">ログイン</h2>
          <p className="text-gray-600">
            アカウントにログインして、特別なサービスをご利用ください
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス <span className="text-red-500">*</span>
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                パスワード <span className="text-red-500">*</span>
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
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
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
                className="w-full bg-primary-dark-green hover:bg-primary-navy text-white py-4 px-4 font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed tracking-wider border border-primary-gold/30 rounded-full"
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

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">または</span>
                </div>
              </div>

              {/* Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={state.isLoading}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 py-4 px-4 font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed tracking-wider border border-gray-300 rounded-full shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Googleでログイン
              </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-text-gray">
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