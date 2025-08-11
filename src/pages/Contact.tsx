import React from 'react';
import { Phone, Mail, MapPin, Clock, Instagram, MessageCircle, Home, Building, Navigation } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { Link } from 'react-router-dom';

const Contact = () => {
  const contactInfo = [
    {
      icon: <Phone size={24} />,
      title: 'お電話でのお問い合わせ',
      content: '090-7882-2827',
      description: '営業時間内にお気軽にお電話ください',
      color: 'from-primary-purple to-purple-700'
    },
    {
      icon: <Mail size={24} />,
      title: 'メールでのお問い合わせ',
      content: 'naokan.buddhaflower@icloud.com',
      description: '24時間受付（返信は営業時間内）',
      color: 'from-primary-gold to-yellow-700'
    },
    {
      icon: <MapPin size={24} />,
      title: '店舗所在地',
      content: '〒544-0003',
      description: '大阪市生野区小路東6-7-27',
      color: 'from-preserved-rose to-pink-700'
    }
  ];

  const accessRoutes = [
    {
      icon: <Home size={24} />,
      title: '電車でのアクセス',
      routes: [
        'JR大阪環状線「寺田町駅」より徒歩約8分',
        '近鉄大阪線「今里駅」より徒歩約10分',
        '大阪メトロ千日前線「小路駅」より徒歩約5分'
      ],
      color: 'from-blue-500 to-blue-700'
    },
    {
      icon: <Building size={24} />,
      title: 'お車でのアクセス',
      routes: [
        '阪神高速14号松原線「文の里IC」より約5分',
        '国道25号線「小路交差点」より南へ約2分',
        '中央大通りより「小路東6丁目」交差点を東へ'
      ],
      color: 'from-green-500 to-green-700'
    },
    {
      icon: <Navigation size={24} />,
      title: 'バスでのアクセス',
      routes: [
        '小路東六丁目80（オンデマンドバス・市バス停車）',
        '近鉄バス「生野区役所前」より徒歩約3分',
        '大阪市営バス「寺田町駅前」より徒歩約8分'
      ],
      color: 'from-orange-500 to-orange-700'
    }
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      handle: '@naokan.buddhaflower',
      url: 'https://instagram.com/naokan.buddhaflower',
      icon: <Instagram size={24} />,
      color: 'from-pink-500 to-purple-600',
      description: '最新情報・出店スケジュール'
    },
    {
      name: 'LINE公式アカウント',
      handle: '@naocan',
      url: 'https://line.me/R/ti/p/@994limqd',
      icon: <MessageCircle size={24} />,
      color: 'from-green-500 to-green-600',
      description: 'お気軽にお問い合わせ'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-primary-dark-green text-white py-20 border-b border-primary-gold/30">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-wider">お問い合わせ</h1>
          <p className="text-xl mb-4 tracking-wider">なおかん (naocan)</p>
          <p className="text-lg mb-8 max-w-2xl mx-auto tracking-wide">
            ご不明な点やご相談など、プリザーブドフラワーのことなら何でもお気軽にお聞かせください。
            代表 挾間 健二が丁寧にお答えいたします。
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-primary-dark-green flex items-center justify-center text-white mx-auto mb-6">
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-4">{info.title}</h3>
                <p className="text-lg font-bold text-primary-purple mb-2 break-all">{info.content}</p>
                <p className="text-gray-600">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal mb-4">SNS・公式アカウント</h2>
            <p className="text-lg text-gray-600">
              最新情報やお問い合わせは公式SNSアカウントからもどうぞ
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {socialLinks.map((social, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative"
              >
                {/* SNS Icon positioned at top of card */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-16 h-16 bg-primary-navy hover:bg-primary-gold/20 border border-primary-gold/30 rounded-full transition-colors duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-gold/20 flex items-center justify-center">
                      {social.name === 'Instagram' ? (
                        <Instagram size={24} className="text-primary-gold" />
                      ) : (
                        <i className="ri-line-line text-2xl text-primary-gold"></i>
                      )}
                    </div>
                  </a>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-charcoal mb-2">{social.name}</h3>
                  <p className="text-lg font-semibold text-primary-purple mb-2">{social.handle}</p>
                  <p className="text-gray-600">{social.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map and Access Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal mb-4">アクセス・地図</h2>
            <p className="text-lg text-gray-600">
              お車でも電車でもアクセス便利な立地です。お気軽にお越しください。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Google Map */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 bg-primary-dark-green text-white">
                  <h3 className="text-xl font-bold mb-2">お問い合わせ</h3>
                  <p className="text-gray-200 mb-4">
                    商品についてのご質問やご相談がございましたら、お気軽にお問い合わせください。
                  </p>
                  <Link
                    to="/contact"
                    className="inline-block bg-white text-primary-dark-green px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
                  >
                    お問い合わせフォーム
                  </Link>
                </div>
                <div className="relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.5234567890123!2d135.5234567890123!3d34.6234567890123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e0e0e0e0e0e0%3A0x1234567890123456!2z5aSn6Ziq5bqc5aSn6Ziq5biC55Sf6YeO5Yy65bCP6Lev5p2x77yW5LiB55uu77yX4oiS77yX77yX!5e0!3m2!1sja!2sjp!4v1234567890123!5m2!1sja!2sjp"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full"
                    title="なおかん 店舗位置"
                  ></iframe>
                  
                  {/* Fallback for when Google Maps doesn't load */}
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="text-center">
                      <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">地図を読み込み中...</p>
                    </div>
                  </div>
                </div>
                
                {/* Map Controls */}
                <div className="p-4 bg-gray-50 border-t">
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="https://www.google.com/maps/dir//大阪市生野区小路東6-7-27"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-primary-dark-green text-white rounded-full hover:bg-primary-navy transition-colors duration-200 text-sm"
                    >
                      <MapPin size={16} className="mr-2" />
                      ルート検索
                    </a>
                    <a
                      href="https://www.google.com/maps/place/大阪市生野区小路東6-7-27"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors duration-200 text-sm"
                    >
                      大きな地図で見る
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Access Routes */}
            <div className="order-1 lg:order-2">
              <div className="space-y-6">
                {accessRoutes.map((route, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary-navy border border-primary-gold/30 flex items-center justify-center mr-4">
                        <div className="w-8 h-8 rounded-full bg-primary-gold/20 flex items-center justify-center">
                          {React.cloneElement(route.icon, { className: "text-primary-gold", size: 20 })}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-charcoal">{route.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {route.routes.map((routeInfo, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-2 h-2 bg-primary-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">{routeInfo}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Parking Information */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 mb-16">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-navy border border-primary-gold/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-gold/20 flex items-center justify-center">
                  <Building size={32} className="text-primary-gold" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-charcoal mb-2">駐車場のご案内</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6">
                <h4 className="font-bold text-charcoal mb-3">専用駐車場</h4>
                <p className="text-gray-700 mb-2">店舗前に2台分の駐車スペースをご用意しております。</p>
                <p className="text-sm text-gray-600">※満車の場合は近隣のコインパーキングをご利用ください。</p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h4 className="font-bold text-charcoal mb-3">近隣駐車場</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• タイムズ小路東6丁目（徒歩1分）</li>
                  <li>• パークジャパン生野店（徒歩2分）</li>
                  <li>• コインパーク小路（徒歩3分）</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal mb-4">お問い合わせフォーム</h2>
            <p className="text-lg text-gray-600">
              下記フォームにご記入いただき、送信ボタンを押してください。
            </p>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-navy border border-primary-gold/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-gold/20 flex items-center justify-center">
                  <Clock size={32} className="text-primary-gold" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-charcoal mb-4">営業時間・事業概要</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-charcoal mb-4">営業時間</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>自動販売機</span>
                    <span className="font-semibold text-primary-gold">24時間営業</span>
                  </div>
                  <div className="flex justify-between">
                    <span>店舗ガイド</span>
                    <span className="font-semibold">要予約・不定期</span>
                  </div>
                  <div className="flex justify-between">
                    <span>神社・仏閣出店</span>
                    <span className="font-semibold">Instagram告知</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-charcoal mb-4">事業概要</h3>
                <div className="space-y-2">
                  <p><strong>設立:</strong> 2016年8月</p>
                  <p><strong>代表:</strong> 挾間 健二</p>
                  <p><strong>専門:</strong> プリザーブドフラワー</p>
                  <p><strong>特徴:</strong> 日本初の仏花自販機</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;