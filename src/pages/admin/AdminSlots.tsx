import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Calendar, Clock, Users, Search, Edit3, ToggleLeft, ToggleRight, Zap, ZapOff } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import ReservationCalendar from '../../components/ReservationCalendar';

const AdminSlots = () => {
  const { state, deleteAvailableSlot, addAvailableSlot, toggleSlotStatus, loadData, updateReservationStatus } = useAdmin();
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [searchTerm, setSearchTerm] = useState('');
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [showEditReservationModal, setShowEditReservationModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [quickMode, setQuickMode] = useState(false);
  const [quickAddData, setQuickAddData] = useState({
    date: '',
    time: '',
    maxParticipants: 3,
    isActive: true
  });

  // データを定期的に更新
  useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, 30000); // 30秒ごと

    return () => clearInterval(interval);
  }, [loadData]);

  const timeSlots = [
    '10:00-12:00',
    '13:00-15:00',
    '15:30-17:30'
  ];

  const handleDeleteSlot = async (id: string) => {
    if (window.confirm('この予約枠を削除しますか？予約済みのお客様がいる場合は事前にご連絡ください。')) {
      const success = await deleteAvailableSlot(id);
      if (success) {
        // データを再読み込み
        loadData();
      }
    }
  };

  const handleToggleSlotStatus = async (id: string) => {
    const success = await toggleSlotStatus(id);
    if (success) {
      // データを再読み込み
      loadData();
    }
  };

  // クイックモード用のスロットクリックハンドラー
  const handleQuickSlotAction = async (date: string, timeSlot: any) => {
    if (!quickMode) {
      // 通常モードの場合は既存の処理
      handleSlotClick(date, timeSlot);
      return;
    }

    try {
      if (timeSlot.currentReservations > 0) {
        // 予約済み枠 → 予約をオープン（予約数を0にリセット）
        const success = await updateAvailableSlot({
          ...timeSlot,
          currentReservations: 0,
          isActive: true
        });
        
        if (success) {
          // 関連する予約をキャンセル状態に更新
          const relatedReservations = state.reservations.filter(r => 
            r.preferredDate === date && r.preferredTime === timeSlot.time
          );
          
          for (const reservation of relatedReservations) {
            await updateReservationStatus(reservation.id, 'cancelled');
          }
          
          loadData();
          showQuickModeNotification(`${date} ${timeSlot.time} の予約をオープンしました`, 'success');
        } else {
          showQuickModeNotification('予約のオープンに失敗しました', 'error');
        }
      } else {
        // 空き枠 → 予約をクローズ（満席にする）
        const success = await updateAvailableSlot({
          ...timeSlot,
          currentReservations: timeSlot.maxParticipants,
          isActive: false
        });
        
        if (success) {
          loadData();
          showQuickModeNotification(`${date} ${timeSlot.time} の予約をクローズしました`, 'success');
        } else {
          showQuickModeNotification('予約のクローズに失敗しました', 'error');
        }
      }
    } catch (error) {
      console.error('Quick mode action failed:', error);
      showQuickModeNotification('操作に失敗しました。再度お試しください。', 'error');
    }
  };

  // クイックモード通知表示
  const showQuickModeNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // アニメーション
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
      notification.style.opacity = '1';
    }, 100);
    
    // 3秒後に削除
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  // updateAvailableSlot関数（AdminContextに追加する必要がある場合の代替実装）
  const updateAvailableSlot = async (slotData: any) => {
    try {
      // 直接Supabaseを使用してスロットを更新
      const { supabase } = await import('../../lib/supabase');
      const { error } = await supabase
        .from('available_slots')
        .update({
          current_reservations: slotData.currentReservations,
          is_active: slotData.isActive
        })
        .eq('id', slotData.id);

      return !error;
    } catch (error) {
      console.error('Update slot error:', error);
      return false;
    }
  };

  const handleSlotClick = (date: string, timeSlot: any) => {
    if (quickMode) {
      handleQuickSlotAction(date, timeSlot);
      return;
    }

    // 通常モードの処理
    const statusText = timeSlot.isActive ? '受付中' : '受付停止';
    const availabilityText = timeSlot.currentReservations >= timeSlot.maxParticipants ? '満席' : '空きあり';
    
    alert(`予約枠詳細
    
日付: ${new Date(date).toLocaleDateString('ja-JP', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  weekday: 'long'
})}
時間: ${timeSlot.time}
予約状況: ${timeSlot.currentReservations}/${timeSlot.maxParticipants}名
ステータス: ${statusText}
空き状況: ${availabilityText}

※ 予約枠の編集・削除はリスト表示から行えます`);
  };

  // 空の時間帯をクリックした時の処理（クイック予約枠開設）
  const handleQuickAddSlot = (date: string, time: string) => {
    if (quickMode) {
      // クイックモードでは即座に予約枠を作成
      handleQuickCreateSlot(date, time);
      return;
    }

    // 通常モードの処理
    console.log('Quick add slot:', { date, time });
    
    // 既存の予約枠をチェック
    const existingSlot = state.availableSlots.find(
      slot => slot.date === date && slot.time === time
    );

    if (existingSlot) {
      alert('この日時の予約枠は既に存在します。');
      return;
    }

    // クイック追加データを設定
    setQuickAddData({
      date,
      time,
      maxParticipants: 3,
      isActive: true
    });
    setShowQuickAddModal(true);
  };

  // クイックモードでの予約枠作成
  const handleQuickCreateSlot = async (date: string, time: string) => {
    try {
      const success = await addAvailableSlot({
        date,
        time,
        maxParticipants: 3,
        currentReservations: 0,
        isActive: true
      });

      if (success) {
        loadData();
        showQuickModeNotification(`${date} ${time} の予約枠を開設しました`, 'success');
      } else {
        showQuickModeNotification('予約枠の開設に失敗しました', 'error');
      }
    } catch (error) {
      console.error('Quick create slot error:', error);
      showQuickModeNotification('予約枠の開設に失敗しました', 'error');
    }
  };

  const handleConfirmQuickAdd = async () => {
    const success = await addAvailableSlot({
      date: quickAddData.date,
      time: quickAddData.time,
      maxParticipants: quickAddData.maxParticipants,
      currentReservations: 0,
      isActive: quickAddData.isActive
    });

    if (success) {
      setShowQuickAddModal(false);
      // データを再読み込み
      loadData();
      
      // 成功メッセージ
      alert(`予約枠を開設しました！

日付: ${new Date(quickAddData.date).toLocaleDateString('ja-JP', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  weekday: 'long'
})}
時間: ${quickAddData.time}
定員: ${quickAddData.maxParticipants}名（1組）
ステータス: ${quickAddData.isActive ? '受付中' : '受付停止'}

お客様からの予約をお待ちしています。`);
    } else {
      alert('予約枠の追加に失敗しました。');
    }
  };

  // 予約編集ハンドラー
  const handleEditReservation = (reservation: any) => {
    setSelectedReservation(reservation);
    setShowEditReservationModal(true);
  };

  const handleUpdateReservationStatus = async (status: string) => {
    if (selectedReservation) {
      const success = await updateReservationStatus(selectedReservation.id, status as any);
      if (success) {
        setShowEditReservationModal(false);
        setSelectedReservation(null);
        loadData();
        alert(`予約ステータスを「${getStatusLabel(status)}」に更新しました。`);
      } else {
        alert('予約ステータスの更新に失敗しました。');
      }
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '保留中';
      case 'confirmed': return '確認済み';
      case 'completed': return '完了';
      case 'cancelled': return 'キャンセル';
      default: return status;
    }
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredSlots = state.availableSlots.filter(slot => {
    const searchDate = new Date(slot.date).toLocaleDateString('ja-JP');
    return searchDate.includes(searchTerm) || slot.time.includes(searchTerm);
  });

  const sortedSlots = filteredSlots.sort((a, b) => {
    const dateA = new Date(a.date + ' ' + a.time.split('-')[0]);
    const dateB = new Date(b.date + ' ' + b.time.split('-')[0]);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">予約枠管理</h1>
          <p className="text-gray-600 mt-2">ガイド予約の受付可能枠を管理できます（1枠につき最大3名まで）</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                viewMode === 'calendar'
                  ? 'bg-primary-dark-green text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              カレンダー表示
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                viewMode === 'list'
                  ? 'bg-primary-dark-green text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              リスト表示
            </button>
          </div>
          <Link
            to="/admin/slots/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-colors duration-200"
          >
            <Plus size={20} />
            新規予約枠追加
          </Link>
        </div>
      </div>

      {/* Quick Mode Toggle */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                quickMode ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {quickMode ? <Zap size={24} /> : <ZapOff size={24} />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  クイックモード {quickMode ? 'ON' : 'OFF'}
                </h3>
                <p className="text-sm text-gray-600">
                  {quickMode 
                    ? '確認なしで予約枠の開閉を瞬時に切り替えできます' 
                    : '通常モード：クリックで詳細表示・編集'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => setQuickMode(!quickMode)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 ${
                quickMode ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${
                  quickMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {quickMode && (
            <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">⚡ クイックモード操作方法</h4>
              <div className="text-sm text-orange-700 space-y-1">
                <p>• <strong>空き枠をクリック</strong> → 即座に満席（クローズ）</p>
                <p>• <strong>予約済み枠をクリック</strong> → 即座に空き（オープン）</p>
                <p>• <strong>空の時間帯をクリック</strong> → 即座に予約枠開設</p>
                <p>• 確認ポップアップは表示されません</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Important Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">予約システムについて</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• <strong>1つの時間帯につき1組のお客様</strong>（最大3名まで参加可能）</p>
          <p>• 体験時間は約2時間を予定</p>
          <p>• 材料費別途（¥3,000〜¥8,000程度）</p>
          <p>• 予約確認は24時間以内にお電話でご連絡</p>
        </div>
      </div>

      {/* Quick Action Guide */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-2">🚀 操作ガイド</h3>
        <div className="text-sm text-green-700 space-y-1">
          {quickMode ? (
            <>
              <p>• <strong>クイックモード有効中</strong> - 確認なしで瞬時に操作</p>
              <p>• <strong>空き枠クリック</strong> → 即座にクローズ（満席）</p>
              <p>• <strong>予約済み枠クリック</strong> → 即座にオープン（空き）</p>
              <p>• <strong>空の時間帯クリック</strong> → 即座に予約枠開設</p>
            </>
          ) : (
            <>
              <p>• <strong>空の時間帯をクリック</strong> → すぐに予約枠を開設（クイック機能）</p>
              <p>• <strong>予約なしの枠をクリック</strong> → 詳細表示・編集</p>
              <p>• <strong>予約ありの枠をクリック</strong> → 予約詳細表示・編集</p>
              <p>• <strong>リスト表示</strong> → 予約枠の有効/無効を切り替え可能</p>
            </>
          )}
        </div>
      </div>

      {viewMode === 'calendar' ? (
        /* Calendar View */
        <ReservationCalendar
          isAdmin={true}
          onSlotClick={quickMode ? handleQuickSlotAction : handleSlotClick}
          onAddSlot={handleQuickAddSlot}
          availableSlots={state.availableSlots}
          reservations={state.reservations}
          onEditReservation={handleEditReservation}
        />
      ) : (
        /* List View */
        <div>
          {/* Search */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="日付または時間で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Slots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSlots.map((slot) => (
              <div key={slot.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-dark-green rounded-full flex items-center justify-center text-white mr-3">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {new Date(slot.date).toLocaleDateString('ja-JP', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          weekday: 'short'
                        })}
                      </h3>
                      <p className="text-sm text-gray-500">{slot.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSlotClick(slot.date, slot)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="詳細"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="削除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users size={16} className="mr-2 text-gray-400" />
                      <span className="text-sm text-gray-600">定員</span>
                    </div>
                    <span className="text-sm font-medium">{slot.maxParticipants}名（1組）</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-gray-400" />
                      <span className="text-sm text-gray-600">予約状況</span>
                    </div>
                    <span className="text-sm font-medium">
                      {slot.currentReservations > 0 ? '予約済み' : '空き'}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-dark-green h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${slot.currentReservations > 0 ? 100 : 0}%` 
                      }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleToggleSlotStatus(slot.id)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                        slot.isActive 
                          ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {slot.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                      {slot.isActive ? '受付中' : '停止中'}
                    </button>
                    <span className={`text-sm font-medium ${
                      slot.currentReservations > 0
                        ? 'text-blue-600' 
                        : 'text-green-600'
                    }`}>
                      {slot.currentReservations > 0 ? '予約あり' : '予約可能'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    作成日: {new Date(slot.createdAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {sortedSlots.length === 0 && (
            <div className="text-center py-12">
              <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">予約枠が見つかりませんでした。</p>
              <p className="text-gray-400 mt-2">新しい予約枠を追加してください。</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Add Slot Modal */}
      {showQuickAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🚀 クイック予約枠開設</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">選択された時間帯</h4>
                <div className="text-blue-700 space-y-1">
                  <p><strong>日付:</strong> {new Date(quickAddData.date).toLocaleDateString('ja-JP', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                  })}</p>
                  <p><strong>時間:</strong> {quickAddData.time}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  定員数（1組あたりの最大人数）
                </label>
                <select
                  value={quickAddData.maxParticipants}
                  onChange={(e) => setQuickAddData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1名</option>
                  <option value={2}>2名</option>
                  <option value={3}>3名（推奨）</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">※ 1つの時間帯につき1組のお客様のみ</p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="quickIsActive"
                  checked={quickAddData.isActive}
                  onChange={(e) => setQuickAddData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="quickIsActive" className="ml-2 text-sm text-gray-700">
                  すぐに予約受付を開始する
                </label>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  <strong>✅ 予約枠を開設すると:</strong><br />
                  • お客様がこの時間帯を予約できるようになります<br />
                  • カレンダーに緑色（◯）で表示されます<br />
                  • 予約が入ると自動的に赤色（×）に変わります
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowQuickAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors duration-200"
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirmQuickAdd}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200 font-semibold"
              >
                🚀 予約枠を開設
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Reservation Modal */}
      {showEditReservationModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">予約編集</h3>
                <button
                  onClick={() => setShowEditReservationModal(false)}
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
                    <div>
                      <span className="text-sm font-medium">お名前:</span>
                      <span className="text-sm ml-2">{selectedReservation.name}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">メール:</span>
                      <span className="text-sm ml-2">{selectedReservation.email}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">電話:</span>
                      <span className="text-sm ml-2">{selectedReservation.phone}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">参加人数:</span>
                      <span className="text-sm ml-2">{selectedReservation.participants}名</span>
                    </div>
                  </div>
                </div>

                {/* Reservation Details */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">予約詳細</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium">希望の花:</span>
                      <span className="text-sm ml-2">{selectedReservation.flowerType || 'お任せ'}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">希望の色:</span>
                      <span className="text-sm ml-2">{selectedReservation.colorPreference || 'お任せ'}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-sm font-medium">現在のステータス:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClass(selectedReservation.status)}`}>
                        {getStatusLabel(selectedReservation.status)}
                      </span>
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

                {/* Status Update Buttons */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">ステータス変更</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <button
                      onClick={() => handleUpdateReservationStatus('pending')}
                      className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors duration-200 text-sm font-medium"
                    >
                      保留中
                    </button>
                    <button
                      onClick={() => handleUpdateReservationStatus('confirmed')}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200 text-sm font-medium"
                    >
                      確認済み
                    </button>
                    <button
                      onClick={() => handleUpdateReservationStatus('completed')}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors duration-200 text-sm font-medium"
                    >
                      完了
                    </button>
                    <button
                      onClick={() => handleUpdateReservationStatus('cancelled')}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-end pt-4 border-t">
                  <button
                    onClick={() => setShowEditReservationModal(false)}
                    className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-medium transition-colors duration-200"
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-primary-dark-green rounded-lg p-6 text-white">
        <h3 className="text-lg font-bold mb-4">予約枠統計</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{state.availableSlots.length}</div>
            <div className="text-sm opacity-90">総予約枠数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {state.availableSlots.filter(slot => slot.isActive).length}
            </div>
            <div className="text-sm opacity-90">受付中</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {state.availableSlots.filter(slot => slot.currentReservations > 0).length}
            </div>
            <div className="text-sm opacity-90">予約済み枠</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {state.availableSlots.filter(slot => slot.isActive && slot.currentReservations === 0).length}
            </div>
            <div className="text-sm opacity-90">予約可能枠</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSlots;