import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, Clock, Users } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const AdminSlotForm = () => {
  const navigate = useNavigate();
  const { state, addAvailableSlot } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    maxParticipants: '4',
    isActive: true
  });

  const timeSlots = [
    '10:00-12:00',
    '13:00-15:00',
    '15:30-17:30'
  ];

  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [state.isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.date) {
      setError('日付を選択してください。');
      return false;
    }
    if (!formData.time) {
      setError('時間を選択してください。');
      return false;
    }
    if (!formData.maxParticipants || parseInt(formData.maxParticipants) <= 0) {
      setError('有効な定員数を入力してください。');
      return false;
    }

    // Check if slot already exists
    const existingSlot = state.availableSlots.find(
      slot => slot.date === formData.date && slot.time === formData.time
    );
    if (existingSlot) {
      setError('この日時の予約枠は既に存在します。');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const slotData = {
        date: formData.date,
        time: formData.time,
        maxParticipants: parseInt(formData.maxParticipants),
        currentReservations: 0,
        isActive: formData.isActive
      };

      const success = await addAvailableSlot(slotData);

      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('予約枠の追加に失敗しました。');
      }
    } catch (error) {
      setError('エラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate available dates (next 60 days, excluding weekends)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Exclude weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  if (!state.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft size={20} />
              管理画面に戻る
            </button>
            <h1 className="text-xl font-bold text-gray-900">新規予約枠追加</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Date Selection */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                日付 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                <select
                  id="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                >
                  <option value="">日付を選択してください</option>
                  {generateAvailableDates().map(date => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString('ja-JP', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                時間 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
                <select
                  id="time"
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                >
                  <option value="">時間を選択してください</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Max Participants */}
            <div>
              <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">
                定員数 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="number"
                  id="maxParticipants"
                  name="maxParticipants"
                  required
                  min="1"
                  max="10"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  placeholder="4"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">推奨定員: 4名</p>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-purple focus:ring-primary-purple border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                予約受付を有効にする
              </label>
            </div>

            {/* Existing Slots for Selected Date */}
            {formData.date && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">
                  {new Date(formData.date).toLocaleDateString('ja-JP', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'short'
                  })} の既存予約枠
                </h4>
                <div className="space-y-1">
                  {state.availableSlots
                    .filter(slot => slot.date === formData.date)
                    .map(slot => (
                      <div key={slot.id} className="text-sm text-blue-700">
                        {slot.time} (定員: {slot.maxParticipants}名, 予約: {slot.currentReservations}名)
                      </div>
                    ))}
                  {state.availableSlots.filter(slot => slot.date === formData.date).length === 0 && (
                    <div className="text-sm text-blue-700">既存の予約枠はありません</div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary-purple hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                追加
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSlotForm;