import React, { useState } from 'react';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter,
  Calendar,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import type { Reservation } from '../../context/AdminContext';

const AdminReservations = () => {
  const { state, updateReservationStatus } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const handleUpdateStatus = async (id: number, status: Reservation['status']) => {
    await updateReservationStatus(id, status);
  };

  const filteredReservations = state.reservations.filter(reservation => {
    const matchesSearch = reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: Reservation['status']) => {
    switch (status) {
      case 'pending': return '保留中';
      case 'confirmed': return '確認済み';
      case 'completed': return '完了';
      case 'cancelled': return 'キャンセル';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">予約管理</h1>
        <p className="text-gray-600 mt-2">ガイド予約の確認・管理を行えます</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="名前、メール、電話番号で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
            >
              <option value="all">すべてのステータス</option>
              <option value="pending">保留中</option>
              <option value="confirmed">確認済み</option>
              <option value="completed">完了</option>
              <option value="cancelled">キャンセル</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">予約者</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日時</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">人数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">希望</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">予約日</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white mr-3">
                        <User size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{reservation.name}</div>
                        <div className="text-sm text-gray-500">{reservation.email}</div>
                        <div className="text-sm text-gray-500">{reservation.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.preferredDate}</div>
                    <div className="text-sm text-gray-500">{reservation.preferredTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.participants}名</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {reservation.flowerType && `花: ${reservation.flowerType}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {reservation.colorPreference && `色: ${reservation.colorPreference}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                      {getStatusLabel(reservation.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(reservation.createdAt).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedReservation(reservation)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="詳細表示"
                      >
                        <Eye size={16} />
                      </button>
                      {reservation.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(reservation.id, 'confirmed')}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="確認済みにする"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {reservation.status !== 'cancelled' && (
                        <button
                          onClick={() => handleUpdateStatus(reservation.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="キャンセル"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">条件に合う予約が見つかりませんでした。</p>
          </div>
        )}
      </div>

      {/* Reservation Detail Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">予約詳細</h3>
                <button
                  onClick={() => setSelectedReservation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">お客様情報</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <User size={16} className="mr-2 text-gray-400" />
                      <span className="text-sm">{selectedReservation.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail size={16} className="mr-2 text-gray-400" />
                      <span className="text-sm">{selectedReservation.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={16} className="mr-2 text-gray-400" />
                      <span className="text-sm">{selectedReservation.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <User size={16} className="mr-2 text-gray-400" />
                      <span className="text-sm">{selectedReservation.participants}名</span>
                    </div>
                  </div>
                </div>

                {/* Reservation Details */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">予約詳細</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-gray-400" />
                      <span className="text-sm">{selectedReservation.preferredDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-gray-400" />
                      <span className="text-sm">{selectedReservation.preferredTime}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">希望の花:</span>
                      <span className="text-sm ml-2">{selectedReservation.flowerType || 'お任せ'}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">希望の色:</span>
                      <span className="text-sm ml-2">{selectedReservation.colorPreference || 'お任せ'}</span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                {selectedReservation.message && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">メッセージ</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">{selectedReservation.message}</p>
                    </div>
                  </div>
                )}

                {/* Status Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleUpdateStatus(selectedReservation.id, 'confirmed')}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    確認済みにする
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedReservation.id, 'completed')}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    完了にする
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedReservation.id, 'cancelled')}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReservations;