import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    {
      id: 1,
      title: '日本初！プリザーブド仏花自動販売機',
      subtitle: '24時間365日営業',
      description: '24時間365日、お好きな時間に高品質なプリザーブド仏花をお求めいただけます。従来の菊中心の仏花概念を覆す、"かわいい"を追求した唯一無二のデザインです。',
      image: 'https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      cta: '自販機について',
      link: '/contact'
    },
    {
      id: 2,
      title: 'プリザーブド仏花',
      subtitle: '関西圏の神社・仏閣で展開',
      description: '京都・東寺、百万遍、東本願寺など関西の名所で、心を込めて作られたプリザーブドフラワーをご提供しています。',
      image: 'https://images.pexels.com/photos/1070360/pexels-photo-1070360.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      cta: 'プリザーブド仏花を見る',
      link: '/buddhist-flowers'
    },
    {
      id: 3,
      title: 'オリジナル花器制作ガイド',
      subtitle: '花言葉から選ぶあなただけの一輪',
      description: '有田焼などの上質な花器から、花言葉やお客様の好みに合わせて、世界に一つだけのオリジナルプリザーブドフラワーをお作りします。',
      image: 'https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      cta: 'ガイド予約',
      link: '/reservation'
    },
    {
      id: 4,
      title: 'プリザーブドフラワーギフト',
      subtitle: 'ウエディング・誕生祝い・記念日に',
      description: 'ウエディングフラワー、Baby誕生祝い、Mother\'s Day特別商品など、特別な日を彩る美しいプリザーブドフラワーギフトをご用意しています。',
      image: 'https://images.pexels.com/photos/1198264/pexels-photo-1198264.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      cta: 'ギフトを見る',
      link: '/preserved-flowers'
    },
    {
      id: 5,
      title: 'SDGs貢献・環境への配慮',
      subtitle: '3-5年の長期保存で持続可能な美しさ',
      description: '年間約￥28,900の節約効果、年間90回分のゴミ削減を実現。環境に配慮した持続可能なフラワーアレンジメントです。',
      image: 'https://images.pexels.com/photos/2072046/pexels-photo-2072046.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      cta: 'SDGsについて',
      link: '/contact'
    }
  ];

  // 自動スライド機能
  const startAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }
    
    autoPlayTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
  }, [slides.length]);

  // 自動スライドを停止
  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

  // 手動操作時の処理（自動スライド停止 + 10秒後再開）
  const handleManualInteraction = useCallback(() => {
    // 自動スライドを停止
    setIsAutoPlaying(false);
    stopAutoPlay();

    // 既存の再開タイマーをクリア
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }

    // 10秒後に自動スライドを再開
    pauseTimerRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
      startAutoPlay();
    }, 10000);
  }, [startAutoPlay, stopAutoPlay]);

  // 初期化時とisAutoPlayingの変更時に自動スライドを制御
  useEffect(() => {
    if (isAutoPlaying) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }

    return () => {
      stopAutoPlay();
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, [isAutoPlaying, startAutoPlay, stopAutoPlay]);

  const nextSlide = () => {
    handleManualInteraction();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    handleManualInteraction();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    handleManualInteraction();
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 translate-x-0 z-10' 
                : index < currentSlide 
                  ? 'opacity-0 -translate-x-full z-0' 
                  : 'opacity-0 translate-x-full z-0'
            }`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transform transition-transform duration-1000"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
            
            {/* Content */}
            <div className="relative h-full flex items-center justify-center text-center z-20">
              <div className="max-w-4xl mx-auto px-6 text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                  {slide.title}
                </h1>
                <h2 className="text-xl md:text-2xl mb-8 font-light opacity-90">
                  {slide.subtitle}
                </h2>
                <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed opacity-80">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to={slide.link}
                    className="inline-block bg-gradient-to-r from-primary-purple to-primary-gold text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    {slide.cta}
                  </Link>
                  {slide.id !== 3 && (
                    <Link
                      to="/reservation"
                      className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-primary-purple transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Calendar size={20} />
                      ガイド予約
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 z-30 backdrop-blur-sm"
        aria-label="前のスライド"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 z-30 backdrop-blur-sm"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`スライド ${index + 1} に移動`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;