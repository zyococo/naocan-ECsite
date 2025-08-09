import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle, AlertCircle, Palette, Heart, Flower } from 'lucide-react';
import ReservationCalendar from '../components/ReservationCalendar';
import { useAvailableSlots, useReservations } from '../hooks/useSupabase';
import { supabase } from '../lib/supabase';
import { sendReservationNotification, sendReservationConfirmation } from '../services/emailService';

const Reservation = () => {
  const { slots, loading: slotsLoading, refetch: refetchSlots } = useAvailableSlots();
  const { addReservation } = useReservations();
  const [showCalendar, setShowCalendar] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    participants: '1',
    flowerType: '',
    colorPreference: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // リアルタイムで予約枠の変更を監視
  useEffect(() => {
    const channel = supabase
      .channel('available_slots_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'available_slots'
        },
        (payload) => {
          console.log('Slot changed:', payload);
          refetchSlots();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchSlots]);

  const flowerTypes = [
    { value: 'rose', label: 'ローズ', meaning: '愛情・美・情熱' },
    { value: 'carnation', label: 'カーネーション', meaning: '母の愛・感謝' },
    { value: 'lily', label: 'ユリ', meaning: '純粋・威厳・高貴' },
    { value: 'hydrangea', label: 'あじさい', meaning: '移り気・辛抱強い愛情' },
    { value: 'chrysanthemum', label: '菊', meaning: '高貴・長寿・誠実' },
    { value: 'mixed', label: 'ミックス', meaning: 'お任せ・調和' }
  ];

  const colorOptions = [
    { value: 'red', label: 'レッド系', description: '情熱・愛情・力強さ' },
    { value: 'pink', label: 'ピンク系', description: '優しさ・感謝・幸福' },
    { value: 'white', label: 'ホワイト系', description: '純粋・清楚・平和' },
    { value: 'purple', label: 'パープル系', description: '高貴・神秘・尊敬' },
    { value: 'blue', label: 'ブルー系', description: '信頼・冷静・希望' },
    { value: 'yellow', label: 'イエロー系', description: '明るさ・友情・希望' },
    { value: 'mixed', label: 'ミックス', description: 'お任せ・調和' }
  ];

  const handleSlotClick = (date: string, timeSlot: any) => {
    console.log('Slot clicked:', { date, timeSlot });

    // 満席チェック
    if (timeSlot.currentReservations >= timeSlot.maxParticipants) {
      alert('この時間帯は満席です。他の時間帯をお選びください。');
      return;
    }

    // 無効な枠チェック
    if (!timeSlot.isActive) {
      alert('この時間帯は現在受付を停止しています。他の時間帯をお選びください。');
      return;
    }

    // 選択された枠を設定
    setSelectedSlot({ date, timeSlot });
    setFormData(prev => ({
      ...prev,
      preferredDate: date,
      preferredTime: timeSlot.time
    }));
    
    // フォーム画面に切り替え
    setShowCalendar(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setErrorMessage('お名前を入力してください。');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('有効なメールアドレスを入力してください。');
      return false;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('電話番号を入力してください。');
      return false;
    }
    if (!formData.preferredDate || !formData.preferredTime) {
      setErrorMessage('予約日時を選択してください。');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    try {
      // 選択された予約枠を再取得して最新状態を確認
      const { data: currentSlot, error: slotError } = await supabase
        .from('available_slots')
        .select('*')
        .eq('date', formData.preferredDate)
        .eq('time', formData.preferredTime)
        .single();

      if (slotError) {
        throw new Error('選択された予約枠が見つかりません。');
      }

      // 満席チェック
      if (currentSlot.current_reservations >= currentSlot.max_participants) {
        throw new Error('申し訳ございません。この時間帯は既に満席となっております。他の時間帯をお選びください。');
      }

      // 予約を作成（認証なしでも可能）
      const { data: reservation, error: reservationError } = await supabase
        .from('reservations')
        .insert({
          user_id: null, // ゲスト予約として作成
          slot_id: currentSlot.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          participants: parseInt(formData.participants),
          flower_type: formData.flowerType || null,
          color_preference: formData.colorPreference || null,
          message: formData.message || null,
          status: 'pending'
        })
        .select()
        .single();

      if (reservationError) {
        console.error('Reservation error details:', reservationError);
        throw new Error('予約の作成に失敗しました: ' + reservationError.message);
      }

      // メール通知を送信
      try {
        // 管理者への通知メール
        await sendReservationNotification({
          reservationId: reservation.id,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          date: formData.preferredDate,
          time: formData.preferredTime,
          participants: parseInt(formData.participants),
          flowerType: formData.flowerType,
          colorPreference: formData.colorPreference,
          message: formData.message
        });

        // 顧客への確認メール
        await sendReservationConfirmation({
          customerName: formData.name,
          customerEmail: formData.email,
          date: formData.preferredDate,
          time: formData.preferredTime,
          participants: parseInt(formData.participants),
          flowerType: formData.flowerType,
          colorPreference: formData.colorPreference
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // メール送信失敗でも予約は成功として扱う
      }

      setStatus('success');
      // 予約枠データを再取得
      refetchSlots();

    } catch (error) {
      console.error('Reservation error:', error);
      setErrorMessage(error instanceof Error ? error.message : '予約送信中にエラーが発生しました。お電話でお問い合わせください。');
      setStatus('error');
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setShowCalendar(true);
    setSelectedSlot(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      preferredDate: '',
      preferredTime: '',
      participants: '1',
      flowerType: '',
      colorPreference: '',
      message: ''
    });
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-white">
        <section className="bg-gradient-to-r from-preserved-rose to-pink-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">予約完了</h1>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
            <h2 className="text-2xl font-bold text-charcoal mb-4">ガイド予約を承りました</h2>
            <p className="text-lg text-gray-600 mb-8">
              ご予約ありがとうございます。<br />
              代表 挾間 健二より確認のご連絡をいたします。<br />
              確認メールをお送りしましたのでご確認ください。
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-green-800 mb-4">予約内容</h3>
              <div className="space-y-2 text-sm text-green-700">
                <p><strong>お名前:</strong> {formData.name}</p>
                <p><strong>メールアドレス:</strong> {formData.email}</p>
                <p><strong>電話番号:</strong> {formData.phone}</p>
                <p><strong>希望日時:</strong> {new Date(formData.preferredDate).toLocaleDateString('ja-JP', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'long'
                })} {formData.preferredTime}</p>
                <p><strong>参加人数:</strong> {formData.participants}名</p>
                {formData.flowerType && (
                  <p><strong>希望の花:</strong> {flowerTypes.find(f => f.value === formData.flowerType)?.label}</p>
                )}
                {formData.colorPreference && (
                  <p><strong>希望の色:</strong> {colorOptions.find(c => c.value === formData.colorPreference)?.label}</p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-blue-800 mb-2">次のステップ</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>1. 24時間以内に確認のお電話をいたします</p>
                <p>2. 詳細な打ち合わせを行います</p>
                <p>3. 当日は店舗にてガイド体験をお楽しみください</p>
                <p>4. 確認メールをお客様のメールアドレスに送信いたしました</p>
              </div>
            </div>

            <button
              onClick={resetForm}
              className="bg-primary-dark-green hover:bg-primary-navy text-white px-8 py-3 font-semibold transition-colors duration-300 tracking-wider border border-primary-gold/30"
            >
              新しい予約
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (slotsLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-dark-green border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">予約枠を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-primary-dark-green text-white py-20 border-b border-primary-gold/30">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-wider">ガイド予約</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto tracking-wide">
            花器から花言葉まで、お客様の好みに合わせたオリジナルプリザーブドフラワー制作体験をご予約いただけます。
          </p>
        </div>
      </section>

      {/* Service Description */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <Palette size={48} className="mx-auto text-preserved-rose mb-6" />
              <h3 className="text-xl font-bold text-charcoal mb-4">花器選び</h3>
              <p className="text-gray-600">
                有田焼などの上質な花器から、お客様の好みに合わせてお選びいただけます。
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <Heart size={48} className="mx-auto text-primary-purple mb-6" />
              <h3 className="text-xl font-bold text-charcoal mb-4">花言葉コンサルティング</h3>
              <p className="text-gray-600">
                それぞれの花が持つ意味や花言葉をご説明し、想いに合った花をお選びいただけます。
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <Flower size={48} className="mx-auto text-primary-gold mb-6" />
              <h3 className="text-xl font-bold text-charcoal mb-4">オリジナル制作</h3>
              <p className="text-gray-600">
                世界に一つだけのオリジナルプリザーブドフラワーを一緒にお作りします。
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {showCalendar ? (
          /* Calendar View */
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-charcoal mb-4">予約可能日時を選択</h2>
              <p className="text-lg text-gray-600 mb-4">
                カレンダーから希望の日時をクリックしてください。
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
                    <span>◯ 空きあり（予約可能）</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></div>
                    <span>× 満席（予約不可）</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                    <span>- 受付停止</span>
                  </div>
                </div>
              </div>
            </div>
            
            <ReservationCalendar
              isAdmin={false}
              onSlotClick={handleSlotClick}
              availableSlots={slots}
            />
          </div>
        ) : (
          /* Form View */
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-charcoal">予約フォーム</h2>
              <button
                onClick={() => setShowCalendar(true)}
                className="text-primary-purple hover:text-purple-700 font-medium transition-colors duration-200 flex items-center"
              >
                ← カレンダーに戻る
              </button>
            </div>

            {/* Selected Slot Info */}
            {selectedSlot && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-blue-800 mb-2">選択された予約枠</h3>
                <div className="text-blue-700">
                  <p><strong>日付:</strong> {new Date(selectedSlot.date).toLocaleDateString('ja-JP', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                  })}</p>
                  <p><strong>時間:</strong> {selectedSlot.timeSlot.time}</p>
                  <p><strong>空き状況:</strong> {selectedSlot.timeSlot.maxParticipants - selectedSlot.timeSlot.currentReservations}名空きあり（定員{selectedSlot.timeSlot.maxParticipants}名）</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                    <AlertCircle size={20} className="mr-3 mt-0.5 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* 基本情報 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      お名前 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-preserved-rose focus:border-transparent"
                        placeholder="山田 太郎"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      メールアドレス <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-preserved-rose focus:border-transparent"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      電話番号 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-preserved-rose focus:border-transparent"
                        placeholder="090-1234-5678"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-2">
                      参加人数
                    </label>
                    <select
                      id="participants"
                      name="participants"
                      value={formData.participants}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-preserved-rose focus:border-transparent"
                    >
                      <option value="1">1名</option>
                      <option value="2">2名</option>
                      <option value="3">3名</option>
                    </select>
                  </div>
                </div>

                {/* 花の希望 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="flowerType" className="block text-sm font-medium text-gray-700 mb-2">
                      希望の花
                    </label>
                    <select
                      id="flowerType"
                      name="flowerType"
                      value={formData.flowerType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-preserved-rose focus:border-transparent"
                    >
                      <option value="">お任せ</option>
                      {flowerTypes.map(flower => (
                        <option key={flower.value} value={flower.value}>
                          {flower.label} ({flower.meaning})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="colorPreference" className="block text-sm font-medium text-gray-700 mb-2">
                      希望の色
                    </label>
                    <select
                      id="colorPreference"
                      name="colorPreference"
                      value={formData.colorPreference}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-preserved-rose focus:border-transparent"
                    >
                      <option value="">お任せ</option>
                      {colorOptions.map(color => (
                        <option key={color.value} value={color.value}>
                          {color.label} ({color.description})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* メッセージ */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    ご要望・メッセージ
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 text-gray-400" size={20} />
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-preserved-rose focus:border-transparent resize-none"
                      placeholder="特別なご要望やメッセージがございましたらご記入ください..."
                    />
                  </div>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="bg-primary-dark-green hover:bg-primary-navy text-white px-12 py-4 font-semibold transition-all duration-300 flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed tracking-wider border border-primary-gold/30"
                  >
                    {status === 'sending' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin" />
                        予約送信中...
                      </>
                    ) : (
                      <>
                        <Calendar size={20} />
                        予約を送信
                      </>
                    )}
                  </button>
                </div>

                {/* 注意事項 */}
                <div className="text-center text-sm text-gray-500 mt-4">
                  <p>※ 予約確認のため、24時間以内にお電話でご連絡いたします</p>
                  <p>※ 体験時間は約2時間を予定しております</p>
                  <p>※ 材料費別途（¥3,000〜¥8,000程度）</p>
                  <p>※ 予約完了後、確認メールをお送りいたします</p>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-charcoal mb-8">お急ぎの場合はお電話でも承ります</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <Phone size={48} className="mx-auto text-preserved-rose mb-4" />
            <p className="text-2xl font-bold text-primary-purple mb-2">090-7882-2827</p>
            <p className="text-gray-600">代表: 挾間 健二</p>
            <p className="text-sm text-gray-500 mt-2">営業時間: 不定期（Instagram告知）</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reservation;