import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const SpecifiedCommercialCode = () => {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">特定商取引法に基づく表記</h1>
          <p className="text-lg opacity-90">
            なおかん (naocan) の特定商取引法に基づく表記です。
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">事業者の名称</h2>
                <p className="text-gray-700">なおかん (naocan)</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">代表者</h2>
                <p className="text-gray-700">挾間 健二</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">所在地</h2>
                <p className="text-gray-700">〒544-0003 大阪市生野区小路東6-7-27</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">連絡先</h2>
                <div className="space-y-2">
                  <p className="text-gray-700">電話番号: 090-7882-2827</p>
                  <p className="text-gray-700">メールアドレス: naokan.buddhaflower@icloud.com</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">URL</h2>
                <p className="text-gray-700">https://naocan-flower-shop.vercel.app</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">商品代金</h2>
                <p className="text-gray-700">各商品ページに記載</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">商品代金以外の必要料金</h2>
                <p className="text-gray-700">送料: ¥1,000（10,000円以上のご注文で送料無料）</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">支払方法</h2>
                <div className="space-y-2">
                  <p className="text-gray-700">• クレジットカード決済</p>
                  <p className="text-gray-700">• 銀行振込</p>
                  <p className="text-gray-700">• 代金引換</p>
                  <p className="text-gray-700">• コンビニ決済</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">支払時期</h2>
                <p className="text-gray-700">商品発送時（代金引換の場合）または事前決済</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">商品の引渡し時期</h2>
                <p className="text-gray-700">ご注文後、3〜7営業日以内に発送いたします。</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">返品・交換について</h2>
                <div className="space-y-2">
                  <p className="text-gray-700">• 商品到着後7日以内に限り、不良品の返品・交換を承ります。</p>
                  <p className="text-gray-700">• お客様都合による返品はお受けできません。</p>
                  <p className="text-gray-700">• 返品・交換の送料は当社負担とします。</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">事業者の責任</h2>
                <p className="text-gray-700">商品の品質・安全性について適切な管理を行い、お客様に安心してご利用いただけるよう努めております。</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">最終更新日</h2>
                <p className="text-gray-700">2025年1月1日</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpecifiedCommercialCode;
