import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Success = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // 決済成功時にカートをクリア
    clearCart();

    // URLパラメータから決済情報を取得
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      // 実際の実装では、ここでサーバーから注文詳細を取得
      setOrderDetails({
        orderId: `ORDER-${Date.now()}`,
        sessionId: sessionId,
        amount: searchParams.get('amount'),
        date: new Date().toLocaleDateString('ja-JP')
      });
    }
  }, [searchParams, clearCart]);

  return (
    <div className="min-h-screen bg-white">
      {/* Success Header */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CheckCircle size={80} className="mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">ご注文ありがとうございます</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            お支払いが正常に完了しました。<br />
            ご注文の確認メールをお送りいたします。
          </p>
        </div>
      </section>

      {/* Order Details */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-charcoal mb-6">ご注文詳細</h2>
            
            {orderDetails ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">注文番号</span>
                  <span className="font-semibold">{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">注文日</span>
                  <span className="font-semibold">{orderDetails.date}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">お支払い金額</span>
                  <span className="font-semibold text-lg text-primary-purple">
                    ¥{orderDetails.amount ? parseInt(orderDetails.amount).toLocaleString() : '---'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">お支払い状況</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    完了
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">注文詳細を読み込み中...</p>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-bold text-charcoal mb-4">今後の流れ</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal">確認メールの送信</h4>
                  <p className="text-gray-600">ご注文の確認メールを24時間以内にお送りいたします。</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal">商品の制作</h4>
                  <p className="text-gray-600">熟練の職人が心を込めて商品をお作りいたします。</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal">商品の発送</h4>
                  <p className="text-gray-600">制作完了後、安全に包装して発送いたします。</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center bg-primary-dark-green hover:bg-primary-navy text-white px-8 py-4 rounded-full font-semibold transition-colors duration-300"
            >
              <Home size={20} className="mr-2" />
              ホームに戻る
            </Link>
            <Link
              to="/buddhist-flowers"
              className="inline-flex items-center justify-center bg-white border-2 border-primary-dark-green text-primary-dark-green hover:bg-primary-dark-green hover:text-white px-8 py-4 rounded-full font-semibold transition-colors duration-300"
            >
              <ArrowLeft size={20} className="mr-2" />
              お買い物を続ける
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Success;
