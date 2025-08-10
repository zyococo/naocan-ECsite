import React from 'react';
import { Phone, Mail, MapPin, Clock, Instagram, Shield } from 'lucide-react';

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
    services: [
      { name: '花専用自販機', href: '/about' },
      { name: '神社・仏閣出店', href: '/about' },
      { name: '花言葉相談', href: '/reservation' }
    ],
    support: [
      { name: 'よくある質問', href: '/guide' },
      { name: 'お問い合わせ', href: '/contact' },
      { name: '予約・ガイド', href: '/reservation' }
    ]
  };

  const locations = [
    '京都・東寺 弘法市',
    '京都・百万遍 手づくり市',
    '京都・東本願寺 お東さん門前市',
    '大阪・河内長野市「道の駅くろまろの郷」'
  ];

  return (
    <footer className="bg-primary-dark-green text-white border-t border-primary-navy">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <div className="w-16 h-16 overflow-hidden flex items-center justify-center mb-3">
                <img 
                  src="/naocan-logo-copy.jpeg" 
                  alt="なおかん logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold tracking-wider mb-1">なおかん</h3>
              <p className="text-primary-sakura text-sm tracking-wider">プリザーブド仏花専門店</p>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed text-sm font-light tracking-wide">
              "{companyInfo.concept}"
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed text-sm">
              日本初のプリザーブド仏花自動販売機を運営。
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Mail size={16} className="mr-3 text-primary-gold" />
                <span className="text-sm">{companyInfo.email}</span>
              </div>
              <div className="flex items-start text-gray-300">
                <MapPin size={16} className="mr-3 text-primary-gold mt-1 flex-shrink-0" />
                <span className="text-sm leading-relaxed">{companyInfo.address}</span>
              </div>
              <div className="flex items-start text-gray-300">
                <Clock size={16} className="mr-3 text-primary-gold mt-1 flex-shrink-0" />
                <span className="text-sm leading-relaxed">{companyInfo.hours}</span>
              </div>
            </div>
          </div>

          {/* Services & Support Menu */}
          <div className="lg:col-span-1 lg:flex lg:justify-center lg:pl-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Services Menu */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary-gold tracking-wider">サービス</h3>
                <ul className="space-y-2">
                  {menuItems.services.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-gray-300 hover:text-white transition-colors duration-300 text-sm tracking-wide"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support Menu */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary-gold tracking-wider">サポート</h3>
                <ul className="space-y-2">
                  {menuItems.support.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-gray-300 hover:text-white transition-colors duration-300 text-sm tracking-wide"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="mt-12 pt-8 border-t border-primary-navy/60">
          <h3 className="text-lg font-semibold mb-4 text-primary-gold text-center tracking-wider">定期出店場所</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {locations.map((location, index) => (
              <div key={index} className="bg-primary-navy border border-primary-gold/20 px-3 py-2 text-center rounded-full">
                <p className="text-sm text-gray-300 tracking-wide">{location}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media & Contact */}
        <div className="mt-8 pt-6 border-t border-primary-navy/60">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a
                href="https://instagram.com/naokan.buddhaflower"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-16 h-16 bg-primary-navy hover:bg-primary-gold/20 border border-primary-gold/30 rounded-full transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-primary-gold/20 flex items-center justify-center">
                  <Instagram size={24} className="text-primary-gold" />
                </div>
              </a>
              <a
                href="https://line.me/R/ti/p/@994limqd"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-16 h-16 bg-primary-navy hover:bg-primary-gold/20 border border-primary-gold/30 rounded-full transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-primary-gold/20 flex items-center justify-center">
                  <i className="ri-line-line text-2xl text-primary-gold"></i>
                </div>
              </a>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-300 text-sm mb-2 tracking-wide">
                お電話・Instagram・LINEでお気軽にお問い合わせください
              </p>
              <p className="text-2xl font-bold text-primary-gold tracking-wider">
                {companyInfo.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-primary-navy border-t border-primary-gold/20 py-4">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-300 mb-3 md:mb-0 tracking-wide">
              © 2025 なおかん (naocan). All rights reserved. | 代表: 挾間 健二
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/contact" className="text-gray-300 hover:text-primary-gold transition-colors duration-300 tracking-wide">
                お問い合わせ
              </a>
              <a href="/reservation" className="text-gray-300 hover:text-primary-gold transition-colors duration-300 tracking-wide">
                予約・ガイド
              </a>
              <a href="/admin/login" className="text-primary-sakura hover:text-white transition-colors duration-300 flex items-center tracking-wide">
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