import React from 'react';
import { 
  Package, 
  Calendar, 
  Users, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { Link } from 'react-router-dom';

const AdminOverview = () => {
  const { state } = useAdmin();

  const stats = [
    {
      title: '総商品数',
      value: state.products.length,
      change: '+2',
      changeType: 'increase',
      icon: <Package size={24} />,
      color: 'from-blue-500 to-blue-700',
      link: '/admin/products'
    },
    {
      title: '今月の予約',
      value: state.reservations.length,
      change: '+5',
      changeType: 'increase',
      icon: <Calendar size={24} />,
      color: 'from-green-500 to-green-700',
      link: '/admin/reservations'
    },
    {
      title: '予約枠数',
      value: state.availableSlots.length,
      change: '0',
      changeType: 'neutral',
      icon: <Clock size={24} />,
      color: 'from-purple-500 to-purple-700',
      link: '/admin/slots'
    },
    {
      title: '保留中予約',
      value: state.reservations.filter(r => r.status === 'pending').length,
      change: '+1',
      changeType: 'increase',
      icon: <AlertCircle size={24} />,
      color: 'from-yellow-500 to-yellow-700',
      link: '/admin/reservations'
    }
  ];

  const recentActivities = [
    {
      type: 'reservation',
      title: '新しい予約',
      description: '田中 花子様からガイド予約',
      time: '2時間前',
      status: 'pending'
    },
    {
      type: 'product',
      title: '商品追加',
      description: 'プリザーブドローズ・エレガント',
      time: '5時間前',
      status: 'completed'
    },
    {
      type: 'reservation',
      title: '予約確認',
      description: '佐藤 太郎様の予約を確認済み',
      time: '1日前',
      status: 'confirmed'
    }
  ];

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <ArrowUp size={16} className="text-green-500" />;
      case 'decrease':
        return <ArrowDown size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">管理者ダッシュボード</h1>
        <p className="text-gray-600">なおかん (naocan) システム管理画面</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
              <div className="flex items-center space-x-1">
                {getChangeIcon(stat.changeType)}
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-500' : 
                  stat.changeType === 'decrease' ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Reservations */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">最新の予約</h3>
            <Link
              to="/admin/reservations"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              すべて見る
            </Link>
          </div>
          <div className="space-y-4">
            {state.reservations.slice(0, 5).map((reservation) => (
              <div key={reservation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white mr-3">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{reservation.name}</p>
                    <p className="text-sm text-gray-600">{reservation.preferredDate} {reservation.preferredTime}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                  {reservation.status === 'pending' ? '保留中' : 
                   reservation.status === 'confirmed' ? '確認済み' : 
                   reservation.status === 'completed' ? '完了' : 'キャンセル'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">最新の商品</h3>
            <Link
              to="/admin/products"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              すべて見る
            </Link>
          </div>
          <div className="space-y-4">
            {state.products.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">¥{product.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star size={14} className="text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">最近のアクティビティ</h3>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white mr-4 ${
                activity.type === 'reservation' ? 'bg-blue-500' : 'bg-green-500'
              }`}>
                {activity.type === 'reservation' ? <Calendar size={16} /> : <Package size={16} />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{activity.time}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                  {activity.status === 'pending' ? '保留中' : 
                   activity.status === 'confirmed' ? '確認済み' : '完了'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">クイックアクション</h3>
        <p className="text-blue-100 mb-6">よく使用される管理機能に素早くアクセスできます</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/products/new"
            className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white p-4 rounded-lg transition-all duration-200 text-center"
          >
            <Package size={24} className="mx-auto mb-2" />
            <span className="font-medium">新規商品追加</span>
          </Link>
          <Link
            to="/admin/slots/new"
            className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white p-4 rounded-lg transition-all duration-200 text-center"
          >
            <Clock size={24} className="mx-auto mb-2" />
            <span className="font-medium">予約枠追加</span>
          </Link>
          <Link
            to="/admin/reservations"
            className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white p-4 rounded-lg transition-all duration-200 text-center"
          >
            <Calendar size={24} className="mx-auto mb-2" />
            <span className="font-medium">予約管理</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;