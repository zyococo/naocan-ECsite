import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-primary-dark-green text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center text-white hover:text-yellow-200 transition-colors duration-200 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            ホームに戻る
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">プライバシーポリシー</h1>
          <p className="text-lg opacity-90">
            なおかん (naocan) のプライバシーポリシーです。
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">1. 基本方針</h2>
                <p className="text-gray-700">
                  なおかん (naocan) は、お客様の個人情報の重要性を認識し、適切な収集、利用、管理を行うことが社会的責務であると考えています。
                  当社は、個人情報の保護に関する法律（個人情報保護法）を遵守し、以下の方針に基づいて個人情報の保護に努めます。
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">2. 収集する個人情報</h2>
                <div className="space-y-2">
                  <p className="text-gray-700">当社は、以下の個人情報を収集いたします：</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>氏名</li>
                    <li>メールアドレス</li>
                    <li>電話番号</li>
                    <li>住所</li>
                    <li>決済情報</li>
                    <li>購入履歴</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">3. 個人情報の利用目的</h2>
                <div className="space-y-2">
                  <p className="text-gray-700">収集した個人情報は、以下の目的で利用いたします：</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>商品の配送</li>
                    <li>お客様サポートの提供</li>
                    <li>注文状況の確認</li>
                    <li>新商品・サービスのご案内</li>
                    <li>アンケートの実施</li>
                    <li>法令に基づく対応</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">4. 個人情報の管理</h2>
                <p className="text-gray-700">
                  当社は、お客様の個人情報を正確かつ最新の状態に保ち、個人情報への不正アクセス、紛失、漏洩、改ざん、破壊などを防ぐため、
                  セキュリティ対策を実施し、個人情報の厳重な管理を行います。
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">5. 個人情報の第三者提供</h2>
                <p className="text-gray-700">
                  当社は、お客様の個人情報を、お客様の同意がある場合、または法令に基づく場合を除き、第三者に提供いたしません。
                  ただし、商品配送のため、配送業者に必要な情報を提供する場合があります。
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">6. 個人情報の開示・訂正・削除</h2>
                <p className="text-gray-700">
                  お客様は、当社が保有するお客様の個人情報について、開示、訂正、削除を求めることができます。
                  これらのご要望については、下記の連絡先までお問い合わせください。
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">7. クッキー（Cookie）の使用</h2>
                <p className="text-gray-700">
                  当社のウェブサイトでは、お客様により良いサービスを提供するため、クッキーを使用することがあります。
                  クッキーの使用を望まない場合は、ブラウザの設定でクッキーを無効にすることができます。
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">8. お問い合わせ</h2>
                <div className="space-y-2">
                  <p className="text-gray-700">個人情報に関するお問い合わせは、以下までご連絡ください：</p>
                  <p className="text-gray-700">なおかん (naocan)</p>
                  <p className="text-gray-700">代表: 挾間 健二</p>
                  <p className="text-gray-700">住所: 〒544-0003 大阪市生野区小路東6-7-27</p>
                  <p className="text-gray-700">電話: 090-7882-2827</p>
                  <p className="text-gray-700">メール: naokan.buddhaflower@icloud.com</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">9. プライバシーポリシーの変更</h2>
                <p className="text-gray-700">
                  当社は、必要に応じてこのプライバシーポリシーを変更することがあります。
                  重要な変更がある場合は、ウェブサイト上でお知らせいたします。
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">10. 最終更新日</h2>
                <p className="text-gray-700">2025年1月1日</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
