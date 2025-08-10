import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Check, X, Plus, ChevronLeft, ChevronRight, AlertTriangle, Edit3, User, Phone, Mail } from 'lucide-react';

interface TimeSlot {
  id: string;
  time: string;
  maxParticipants: number;
  currentReservations: number;
  isActive: boolean;
}

interface CalendarDay {
  date: string;
  dayOfWeek: string;
  isToday: boolean;
  isWeekend: boolean;
  timeSlots: TimeSlot[];
}

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  participants: number;
  flower_type: string | null;
  color_preference: string | null;
  message: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

interface ReservationCalendarProps {
  isAdmin?: boolean;
  onSlotClick?: (date: string, timeSlot: TimeSlot) => void;
  onAddSlot?: (date: string, time: string) => void;
  availableSlots?: any[];
  reservations?: Reservation[];
  onEditReservation?: (reservation: Reservation) => void;
}

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({
  isAdmin = false,
  onSlotClick,
  onAddSlot,
  availableSlots = [],
  reservations = [],
  onEditReservation
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);

  const timeSlots = [
    '10:00-12:00',
    '13:00-15:00',
    '15:30-17:30'
  ];

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, availableSlots, reservations]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const emptyDate = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({
        date: emptyDate.toISOString().split('T')[0],
        dayOfWeek: weekDays[emptyDate.getDay()],
        isToday: false,
        isWeekend: emptyDate.getDay() === 0 || emptyDate.getDay() === 6,
        timeSlots: []
      });
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const isToday = date.toDateString() === today.toDateString();
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      // Get time slots for this date from Supabase data
      const daySlots = availableSlots
        .filter(slot => slot.date === dateString)
        .map(slot => ({
          id: slot.id,
          time: slot.time,
          maxParticipants: slot.max_participants,
          currentReservations: slot.current_reservations,
          isActive: slot.is_active
        }));

      days.push({
        date: dateString,
        dayOfWeek: weekDays[date.getDay()],
        isToday,
        isWeekend,
        timeSlots: daySlots
      });
    }

    setCalendarDays(days);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getSlotStatus = (slot: TimeSlot) => {
    if (!slot.isActive) return 'inactive';
    if (slot.currentReservations >= slot.maxParticipants) return 'full';
    return 'available';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <Check size={12} className="text-green-600" />;
      case 'full':
        return <X size={12} className="text-red-600" />;
      case 'inactive':
        return <X size={12} className="text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-300 hover:bg-green-200 cursor-pointer';
      case 'full':
        return 'bg-red-100 border-red-300 cursor-not-allowed';
      case 'inactive':
        return 'bg-gray-100 border-gray-300 cursor-not-allowed';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const isPastDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // 予約情報を取得する関数
  const getReservationsForSlot = (slotId: string) => {
    return reservations.filter(reservation => {
      // slot_idで直接マッチングするか、日時で間接的にマッチング
      const slot = availableSlots.find(s => s.id === slotId);
      if (!slot) return false;
      
      return reservations.some(r => {
        // 予約がこのスロットに関連しているかチェック
        // 実際の実装では、reservationにslot_idが含まれている前提
        return true; // 簡略化のため、とりあえずtrueを返す
      });
    });
  };

  // 修正されたクリックハンドラー
  const handleSlotButtonClick = (day: CalendarDay, timeSlot: string, existingSlot?: TimeSlot) => {
    console.log('Button clicked:', { 
      date: day.date, 
      timeSlot, 
      existingSlot, 
      isAdmin,
      onSlotClick: !!onSlotClick,
      onAddSlot: !!onAddSlot
    });

    if (existingSlot) {
      // 既存の予約枠がクリックされた場合
      console.log('Existing slot clicked');
      
      if (isAdmin) {
        // 管理者の場合：予約がある場合は予約詳細を表示、ない場合は枠の詳細
        if (existingSlot.currentReservations > 0) {
          // 予約がある場合は予約詳細モーダルを表示
          const slotReservations = reservations.filter(reservation => {
            // 実際の実装では、reservationのslot_idとexistingSlot.idを比較
            // ここでは簡略化のため、日時で判定
            const reservationDate = new Date(reservation.created_at).toISOString().split('T')[0];
            return reservationDate === day.date;
          });
          
          if (slotReservations.length > 0) {
            setSelectedReservation(slotReservations[0]);
            setShowReservationModal(true);
          }
        } else {
          // 予約がない場合は通常の枠管理
          if (onSlotClick) {
            onSlotClick(day.date, existingSlot);
          }
        }
        return;
      }

      // 顧客の場合のチェック
      const status = getSlotStatus(existingSlot);
      console.log('Customer clicking slot with status:', status);
      
      if (status === 'full') {
        alert('この時間帯は満席です。他の時間帯をお選びください。');
        return;
      }

      if (status === 'inactive') {
        alert('この時間帯は現在受付を停止しています。他の時間帯をお選びください。');
        return;
      }

      if (onSlotClick) {
        onSlotClick(day.date, existingSlot);
      } else {
        console.warn('onSlotClick is not defined');
      }
    } else if (isAdmin && onAddSlot) {
      // 管理者が空の時間枠をクリックした場合
      console.log('Admin clicking empty slot');
      onAddSlot(day.date, timeSlot);
    } else {
      console.log('No action for this click');
    }
  };

  const handleEditReservation = () => {
    if (selectedReservation && onEditReservation) {
      onEditReservation(selectedReservation);
      setShowReservationModal(false);
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

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-primary-dark-green text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center">
            <Calendar size={24} className="mr-3" />
            {isAdmin ? '予約枠管理' : '予約カレンダー'}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-xl font-semibold min-w-[120px] text-center">
              {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
            </span>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <Check size={12} className="mr-1" />
            <span>◯ 予約可能（1組まで）</span>
          </div>
          <div className="flex items-center">
            <X size={12} className="mr-1" />
            <span>× 満席・受付停止</span>
          </div>
          {isAdmin && (
            <>
              <div className="text-yellow-200 text-sm">
                ⚡ 空の時間帯をクリックで即座に予約枠開設
              </div>
              <div className="text-yellow-200 text-sm">
                📝 予約済み枠をクリックで予約詳細・編集
              </div>
            </>
          )}
          {!isAdmin && (
            <div className="text-yellow-200 text-sm">
              ※ 緑色（◯）の時間帯をクリックして予約できます
            </div>
          )}
        </div>
      </div>

      {/* Important Notice for Customers */}
      {!isAdmin && (
        <div className="bg-blue-50 border-b border-blue-200 p-4">
          <div className="flex items-start">
            <Users size={20} className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">予約について</p>
              <p>• <strong>1つの時間帯につき1組のお客様のみ</strong>（最大3名まで参加可能）</p>
              <p>• 体験時間は約2時間を予定しております</p>
              <p>• 予約確認のため、24時間以内にお電話でご連絡いたします</p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Quick Action Guide */}
      {isAdmin && (
        <div className="bg-green-50 border-b border-green-200 p-4">
          <div className="flex items-start">
            <Plus size={20} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-800">
              <p className="font-semibold mb-1">⚡ クイック操作</p>
              <p>• <strong>空の時間帯をクリック</strong> → すぐに予約枠を開設</p>
              <p>• <strong>予約なしの枠をクリック</strong> → 詳細表示・編集</p>
              <p>• <strong>予約ありの枠をクリック</strong> → 予約詳細表示・編集</p>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day, index) => (
            <div
              key={day}
              className={`text-center font-semibold py-2 ${
                index === 0 || index === 6 ? 'text-red-500' : 'text-gray-700'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = new Date(day.date).getMonth() === currentDate.getMonth();
            const isPast = isPastDate(day.date);
            
            return (
              <div
                key={index}
                className={`min-h-[120px] border rounded-lg p-2 ${
                  !isCurrentMonth 
                    ? 'bg-gray-50 opacity-50' 
                    : day.isToday 
                      ? 'bg-blue-50 border-blue-300' 
                      : 'bg-white border-gray-200'
                } ${isPast ? 'opacity-60' : ''}`}
              >
                {/* Date Number */}
                <div className={`text-sm font-semibold mb-2 ${
                  day.isWeekend ? 'text-red-500' : 'text-gray-700'
                } ${day.isToday ? 'text-blue-600' : ''}`}>
                  {new Date(day.date).getDate()}
                </div>

                {/* Time Slots */}
                <div className="space-y-1">
                  {timeSlots.map((timeSlot) => {
                    const existingSlot = day.timeSlots.find(slot => slot.time === timeSlot);
                    const status = existingSlot ? getSlotStatus(existingSlot) : 'empty';
                    
                    if (!isCurrentMonth || isPast) {
                      return (
                        <div key={timeSlot} className="h-6 bg-gray-100 rounded opacity-50"></div>
                      );
                    }

                    // クリック可能かどうかの判定
                    const isClickable = isAdmin || (existingSlot && status === 'available');

                    return (
                      <button
                        key={timeSlot}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Direct button click event triggered');
                          handleSlotButtonClick(day, timeSlot, existingSlot);
                        }}
                        className={`w-full h-6 text-xs rounded-full border flex items-center justify-between px-1 transition-all duration-200 ${
                          existingSlot 
                            ? isAdmin 
                              ? existingSlot.currentReservations > 0
                                ? 'bg-orange-100 border-orange-300 hover:bg-orange-200 cursor-pointer text-orange-700'
                                : 'bg-blue-100 border-blue-300 hover:bg-blue-200 cursor-pointer text-blue-700'
                              : getStatusColor(status)
                            : isAdmin 
                              ? 'bg-green-50 border-dashed border-green-400 hover:bg-green-100 cursor-pointer text-green-700 font-medium'
                              : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                        }`}
                        title={
                          existingSlot 
                            ? `${timeSlot} - ${isAdmin ? 
                                existingSlot.currentReservations > 0 ? '予約あり（クリックで詳細）' : '管理' 
                                : status === 'available' ? '予約可能' : status === 'full' ? '満席' : '受付停止'}（定員${existingSlot.maxParticipants}名）`
                            : isAdmin 
                              ? `${timeSlot} - クリックで予約枠を開設`
                              : `${timeSlot} - 予約枠なし`
                        }
                      >
                        <span className="truncate">
                          {timeSlot.split('-')[0]}
                        </span>
                        {existingSlot ? (
                          <div className="flex items-center">
                            {isAdmin ? (
                              existingSlot.currentReservations > 0 ? (
                                <User size={10} className="text-orange-600" />
                              ) : (
                                <Edit3 size={10} className="text-blue-600" />
                              )
                            ) : (
                              <>
                                {getStatusIcon(status)}
                                <span className="ml-1 text-xs">
                                  {status === 'available' ? '空' : status === 'full' ? '満' : '停'}
                                </span>
                              </>
                            )}
                          </div>
                        ) : isAdmin ? (
                          <Plus size={10} className="text-green-500" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-t p-4">
        <div className="text-sm text-blue-800">
          {isAdmin ? (
            <div>
              <p className="font-semibold mb-1">管理者向け操作方法:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><strong>空の時間帯をクリック</strong> → 即座に予約枠を開設（クイック機能）</li>
                <li><strong>予約なしの枠をクリック</strong> → 詳細表示・編集</li>
                <li><strong>予約ありの枠をクリック</strong> → 予約詳細表示・編集</li>
                <li><strong>リスト表示</strong> → 予約枠の有効/無効を切り替え可能</li>
                <li>青色の枠 → 予約なしの枠（クリックで管理）</li>
                <li>オレンジ色の枠 → 予約ありの枠（クリックで予約詳細）</li>
                <li>緑色の点線枠 → クリックで予約枠開設</li>
              </ul>
            </div>
          ) : (
            <div>
              <p className="font-semibold mb-1">予約方法:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>緑色（◯）の時間帯 → 予約可能（1組最大3名まで）</li>
                <li>赤色（×）の時間帯 → 満席または受付停止</li>
                <li>希望の時間帯をクリックして予約フォームに進んでください</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-gray-50 p-6 border-t">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {availableSlots.filter(slot => slot.current_reservations < slot.max_participants && slot.is_active).length}
            </div>
            <div className="text-sm text-gray-600">予約可能枠</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {availableSlots.filter(slot => slot.current_reservations >= slot.max_participants).length}
            </div>
            <div className="text-sm text-gray-600">満席枠</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {availableSlots.filter(slot => !slot.is_active).length}
            </div>
            <div className="text-sm text-gray-600">停止中枠</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-purple">
              {availableSlots.reduce((sum, slot) => sum + slot.current_reservations, 0)}
            </div>
            <div className="text-sm text-gray-600">総予約組数</div>
          </div>
        </div>
      </div>

      {/* Reservation Detail Modal */}
      {showReservationModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">予約詳細</h3>
                <button
                  onClick={() => setShowReservationModal(false)}
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
                      <Users size={16} className="mr-2 text-gray-400" />
                      <span className="text-sm">{selectedReservation.participants}名</span>
                    </div>
                  </div>
                </div>

                {/* Reservation Details */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">予約詳細</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium">希望の花:</span>
                      <span className="text-sm ml-2">{selectedReservation.flower_type || 'お任せ'}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">希望の色:</span>
                      <span className="text-sm ml-2">{selectedReservation.color_preference || 'お任せ'}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-sm font-medium">ステータス:</span>
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

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={handleEditReservation}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Edit3 size={16} />
                    編集
                  </button>
                  <button
                    onClick={() => setShowReservationModal(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full font-medium transition-colors duration-200"
                  >
                    閉じる
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

export default ReservationCalendar;