import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  Package, 
  Calendar, 
  Users, 
  TrendingUp, 
  Settings,
  Shield,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const AdminLayout = () => {
  const { state, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const navigationItems = [
    { 
      id: 'overview', 
      label: '概要', 
      icon: <TrendingUp size={20} />, 
      path: '/admin/dashboard',
      description: 'システム全体の統計情報'
    },
    { 
      id: 'products', 
      label: '商品管理', 
      icon: <Package size={20} />, 
      path: '/admin/products',
      description: '商品の追加・編集・削除'
    },
    { 
      id: 'reservations', 
      label: '予約管理', 
      icon: <Calendar size={20} />, 
      path: '/admin/reservations',
      description: '予約状況の確認・管理'
    },
    { 
      id: 'slots', 
      label: '予約枠管理', 
      icon: <Clock size={20} />, 
      path: '/admin/slots',
      description: '予約可能枠の設定'
    },
    { 
      id: 'customers', 
      label: '顧客管理', 
      icon: <Users size={20} />, 
      path: '/admin/customers',
      description: '顧客情報の管理'
    },
    { 
      id: 'settings', 
      label: 'システム設定', 
      icon: <Settings size={20} />, 
      path: '/admin/settings',
      description: 'システム全般の設定'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  const stats = [
    {
      title: '総商品数',
      value: state.products.length,
      icon: <Package size={24} />,
      color: 'from-blue-500 to-blue-700'
    },
    {
      title: '予約件数',
      value: state.reservations.length,
      icon: <Calendar size={24} />,
      color: 'from-green-500 to-green-700'
    },
    {
      title: '予約枠数',
      value: state.availableSlots.length,
      icon: <Clock size={24} />,
      color: 'from-purple-500 to-purple-700'
    },
    {
      title: '保留中予約',
      value: state.reservations.filter(r => r.status === 'pending').length,
      icon: <AlertCircle size={24} />,
      color: 'from-yellow-500 to-yellow-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center mr-8">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center mr-3">
                  <Shield size={16} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">なおかん 管理システム</h1>
                  <p className="text-xs text-gray-500">Administrator Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">管理者</p>
                <p className="text-xs text-gray-500">g1348032@gmail.com</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
              >
                <LogOut size={20} />
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="w-80 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <div className="p-6">
            {/* Quick Stats */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                システム状況
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white`}>
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <nav>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                管理機能
              </h3>
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-start p-3 rounded-lg transition-all duration-200 text-left ${
                      isActive(item.path)
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="mr-3 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;