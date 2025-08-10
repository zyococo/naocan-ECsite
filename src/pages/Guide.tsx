import React from 'react';
import { Truck, Package, Heart, Shield, Clock, HelpCircle } from 'lucide-react';

const Guide = () => {
  const deliverySteps = [
    {
      step: 1,
      title: 'ご注文',
      description: 'オンラインまたはお電話でご注文ください',
      icon: <Package size={32} />
    },
    {
      step: 2,
      title: '制作',
      description: '熟練の職人が心を込めてお作りします',
      icon: <Heart size={32} />
    },
    {
      step: 3,
      title: '品質チェック',
      description: '厳格な品質基準でチェックいたします',
      icon: <Shield size={32} />
    },
    {
      step: 4,
      title: 'お届け',
      description: '最適な状態でお客様のもとへお届けします',
      icon: <Truck size={32} />
    }
  ];

  const faqItems = [
    {
      question: 'プリザーブドフラワーはどのくらい持ちますか？',
      answer: '適切な環境で保管していただければ、2-3年は美しい状態を保つことができます。直射日光や高温多湿を避けて保管してください。'
    },
    {
      question: '仏花の配送は可能ですか？',
      answer: 'はい、全国配送承っております。お急ぎの場合は当日配送も可能です（地域により異なります）。配送料金については別途お問い合わせください。'
    },
    {
      question: 'カスタムオーダーは可能ですか？',
      answer: 'もちろん可能です。お客様のご要望に合わせてオリジナルのアレンジメントをお作りいたします。詳細はお電話またはメールでご相談ください。'
    },
    {
      question: '支払い方法は何がありますか？',
      answer: 'クレジットカード、銀行振込、代金引換、コンビニ決済をご利用いただけます。詳細は注文時にご確認ください。'
    },
    {
      question: 'ギフト包装はしてもらえますか？',
      answer: 'はい、無料でギフト包装を承っております。メッセージカードも無料でお付けできます。ご注文時にお申し付けください。'
    },
    {
      question: '返品・交換は可能ですか？',
      answer: '商品の性質上、お客様都合による返品・交換は承っておりません。ただし、配送中の破損や商品不良の場合は、到着後24時間以内にご連絡ください。'
    }
  ];

  const careInstructions = [
    {
      type: '仏花',
      instructions: [
        '毎日水を替えてください',
        '茎を斜めにカットして水の吸い上げを良くします',
        '直射日光を避けて涼しい場所に置いてください',
        '枯れた花や葉は早めに取り除いてください'
      ]
    },
    {
      type: 'プリザーブドフラワー',
      instructions: [
        '直射日光を避けて保管してください',
        '湿度の高い場所は避けてください',
        '水やりは不要です',
        'ほこりが付いた場合は柔らかいブラシで優しく払ってください'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-gold to-yellow-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">ご利用ガイド</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            naocanでのお買い物方法から、お花のお手入れ方法まで、
            お客様に安心してご利用いただくための情報をご案内いたします。
          </p>
        </div>
      </section>

      {/* Delivery Process */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal mb-4">ご注文からお届けまで</h2>
            <p className="text-lg text-gray-600">
              お客様のご注文から商品をお届けするまでの流れをご説明いたします。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {deliverySteps.map((step, index) => (
              <div key={step.step} className="text-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary-purple to-primary-gold rounded-full flex items-center justify-center text-white mx-auto mb-4">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-gold rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                  {index < deliverySteps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Care Instructions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal mb-4">お花のお手入れ方法</h2>
            <p className="text-lg text-gray-600">
              美しいお花を長くお楽しみいただくためのお手入れ方法をご紹介します。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {careInstructions.map((care, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-charcoal mb-6 text-center">{care.type}</h3>
                <ul className="space-y-4">
                  {care.instructions.map((instruction, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-2 h-2 bg-primary-purple rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <HelpCircle size={48} className="mx-auto text-primary-purple mb-4" />
            <h2 className="text-3xl font-bold text-charcoal mb-4">よくあるご質問</h2>
            <p className="text-lg text-gray-600">
              お客様からよくいただくご質問とその回答をまとめました。
            </p>
          </div>

          <div className="space-y-6">
            {faqItems.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-charcoal mb-3 flex items-start">
                  <span className="bg-primary-purple text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                    Q
                  </span>
                  {faq.question}
                </h3>
                <div className="ml-9">
                  <div className="flex items-start">
                    <span className="bg-primary-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                      A
                    </span>
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-primary-dark-green">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">その他ご不明な点がございましたら</h2>
          <p className="text-lg mb-8 opacity-90">
            お気軽にお問い合わせください。専門スタッフが丁寧にお答えいたします。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/reservation"
              className="bg-white text-primary-dark-green px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <Clock size={20} />
              ガイド予約
            </a>
            <a
              href="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary-dark-green transition-colors duration-300"
            >
              メールでのお問い合わせ
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Guide;