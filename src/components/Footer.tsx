import React from 'react';
import { Phone, Mail, MapPin, Clock, Instagram, MessageCircle, Shield } from 'lucide-react';

const Footer = () => {
  const companyInfo = {
    name: 'なおかん (naocan)',
    representative: '挾間 健二',
    established: '2016年8月',
    address: '〒544-0003 大阪市生野区小路東6-7-27',
    phone: '090-7882-2827',
    email: 'naokan.buddhaflower@icloud.com',
    hours: '自動販売機 (24時間営業) / 店舗 (不定期・Instagram告知)',
    concept: '家族のカタチは人それぞれ。そばに寄り添う気持ちをカタチに。'
  };

  const menuItems = {
    products: [
      { name: 'プリザーブド仏花（S・M・L）', href: '/buddhist-flowers' },
      { name: 'ウエディングフラワー', href: '/preserved-flowers' },
      { name: 'Mother\'s Day特別商品', href: '/preserved-flowers' },
      { name: 'Baby誕生祝い用', href: '/preserved-flowers' },
      { name: 'オーダーメイド商品', href: '/reservation' }
    ],
    services: [
      { name: '日本初プリザーブド仏花自販機', href: '/about' },
      { name: '神社・仏閣出店', href: '/about' },
      { name: '手づくり市出店', href: '/about' },
      { name: 'オリジナル花器制作', href: '/reservation' },
      { name: '花言葉コンサルティング', href: '/reservation' }
    ],
    support: [
      { name: 'よくある質問', href: '/guide' },
      { name: 'お問い合わせ', href: '/contact' },
      { name: '予約・ガイド', href: '/reservation' },
      { name: 'SDGs取り組み', href: '/about' }
    ]
  };

  const locations = [
    '京都・東寺 弘法市',
    '京都・百万遍 手づくり市',
    '京都・東本願寺 お東さん門前市',
    '大阪・河内長野市「道の駅くろまろの郷」'
  ];

  return (
    <footer className="bg-charcoal text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                <img 
                  src="/naocan-logo-copy.jpeg" 
                  alt="なおかん logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="ml-3 text-xl font-bold">なおかん</span>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed text-sm italic">
              "{companyInfo.concept}"
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              日本初のプリザーブド仏花自動販売機を運営。従来の仏花の常識にとらわれない、
              "かわいい"を追求した唯一無二のプリザーブド仏花を制作しています。
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <MapPin size={16} className="mr-3 text-primary-gold" />
                <span className="text-sm">{companyInfo.address}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone size={16} className="mr-3 text-primary-gold" />
                <span className="text-sm">{companyInfo.phone}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail size={16} className="mr-3 text-primary-gold" />
                <span className="text-sm">{companyInfo.email}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Clock size={16} className="mr-3 text-primary-gold" />
                <span className="text-sm">{companyInfo.hours}</span>
              </div>
            </div>
          </div>

          {/* Products Menu */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-primary-gold">商品ラインナップ</h3>
            <ul className="space-y-3">
              {menuItems.products.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">価格帯</p>
              <p className="text-sm text-primary-gold font-semibold">¥2,600 〜 ¥10,000（税込）</p>
            </div>
          </div>

          {/* Services Menu */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-primary-gold">サービス</h3>
            <ul className="space-y-3">
              {menuItems.services.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Menu */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-primary-gold">サポート</h3>
            <ul className="space-y-3">
              {menuItems.support.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Admin Access */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">管理者専用</h4>
              <a
                href="/admin/login"
                className="inline-flex items-center text-red-400 hover:text-red-300 transition-colors duration-200 text-sm"
              >
                <Shield size={14} className="mr-2" />
                管理者ログイン
              </a>
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="mt-16 pt-12 border-t border-gray-700">
          <h3 className="text-xl font-bold mb-6 text-primary-gold text-center">定期出店場所</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {locations.map((location, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-300">{location}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media & Contact */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-6 md:mb-0">
              <a
                href="https://instagram.com/naokan.buddhaflower"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-700 hover:bg-primary-purple rounded-full transition-colors duration-300"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://line.me/R/ti/p/@994limqd"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-700 hover:bg-green-500 rounded-full transition-colors duration-300"
              >
                <MessageCircle size={20} />
              </a>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm mb-2">
                お電話・LINE・Instagramでお気軽にお問い合わせください
              </p>
              <p className="text-2xl font-bold text-primary-gold">
                {companyInfo.phone}
              </p>
              <p className="text-sm text-gray-400">
                Instagram: @naokan.buddhaflower
              </p>
              <p className="text-sm text-gray-400">
                LINE: @naocan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2016-2025 なおかん (naocan). All rights reserved. | 代表: 挾間 健二
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
                お問い合わせ
              </a>
              <a href="/reservation" className="text-gray-400 hover:text-white transition-colors duration-200">
                予約・ガイド
              </a>
              <a href="/admin/login" className="text-red-400 hover:text-red-300 transition-colors duration-200 flex items-center">
                <Shield size={12} className="mr-1" />
                管理者
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;