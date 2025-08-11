import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/login?error=auth_failed');
          return;
        }

        if (data.session) {
          // 認証成功、ホームページにリダイレクト
          navigate('/', { replace: true });
        } else {
          // セッションがない場合、ログインページにリダイレクト
          navigate('/login?error=no_session');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login?error=unknown');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-dark-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-charcoal mb-2">認証中...</h2>
        <p className="text-gray-600">ログイン処理中です。しばらくお待ちください。</p>
      </div>
    </div>
  );
};

export default AuthCallback;
