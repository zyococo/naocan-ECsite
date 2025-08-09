import React from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const categories = [
    {
      id: 1,
      title: 'プリザーブド仏花',
      description: '神社・仏閣での店頭販売、自販機で24時間購入可能',
      image: 'https://images.pexels.com/photos/1070357/pexels-photo-1070357.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      color: 'from-primary-purple to-purple-700',
      link: '/buddhist-flowers'
    },
    {
      id: 2,
      title: 'プリザーブドフラワー',
      description: '長期間美しさを保つ特別なお花、ギフトに最適',
      image: 'https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      color: 'from-preserved-rose to-pink-700',
      link: '/preserved-flowers'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-charcoal mb-4">商品カテゴリー</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            神社・仏閣での店頭販売から24時間営業の自販機まで、お客様の様々なニーズにお応えする
            厳選されたプリザーブドフラワーコレクションをご覧ください。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
            >
              <div className="aspect-w-16 aspect-h-12 relative">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-primary-dark-green/70 group-hover:bg-primary-dark-green/80 transition-colors duration-300"></div>
              </div>
              
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-yellow-200 transition-colors duration-300">
                  {category.title}
                </h3>
                <p className="text-sm opacity-90 mb-6 leading-relaxed">
                  {category.description}
                </p>
                <span className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 border border-white border-opacity-30 self-start">
                  詳細を見る
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;