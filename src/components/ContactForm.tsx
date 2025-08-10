import React, { useState } from 'react';
import { Phone, Mail, User, MessageSquare, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { sendContactEmail, sendEmailFallback, ContactFormData } from '../services/emailService';

const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
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
    if (!formData.email.trim()) {
      setErrorMessage('メールアドレスを入力してください。');
      return false;
    }
    if (!formData.email.includes('@')) {
      setErrorMessage('有効なメールアドレスを入力してください。');
      return false;
    }
    if (!formData.subject) {
      setErrorMessage('お問い合わせ種別を選択してください。');
      return false;
    }
    if (!formData.message.trim()) {
      setErrorMessage('お問い合わせ内容を入力してください。');
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
      // EmailJSでメール送信を試行
      const success = await sendContactEmail(formData);
      
      if (success) {
        setStatus('success');
        // フォームをリセット
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        // EmailJSが失敗した場合、フォールバック（mailto）を使用
        setErrorMessage('メール送信サービスに接続できませんでした。代替方法でメールクライアントを開きます。');
        sendEmailFallback(formData);
        setStatus('success');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrorMessage('送信中にエラーが発生しました。しばらく時間をおいて再度お試しください。');
      setStatus('error');
    }
  };

  const getSubjectLabel = (value: string) => {
    const subjects = {
      'product': '商品について',
      'vending': '自販機について',
      'temple': '神社・仏閣販売について',
      'custom': 'カスタムオーダー',
      'guide': 'ガイド・予約について',
      'other': 'その他'
    };
    return subjects[value as keyof typeof subjects] || value;
  };

  if (status === 'success') {
    return (
      <div className="bg-white border border-border-light p-8">
        <div className="text-center">
          <CheckCircle size={64} className="mx-auto text-primary-dark-green mb-8" />
          <h3 className="text-2xl font-bold text-text-dark mb-4 tracking-wider">送信完了</h3>
          <p className="text-lg text-text-gray mb-8 tracking-wide">
            お問い合わせありがとうございます。<br />
            内容を確認の上、代表 挾間 健二より3営業日以内にご連絡いたします。
          </p>
          <div className="bg-soft-green border border-primary-dark-green/20 p-4 mb-8">
            <h4 className="font-semibold text-primary-dark-green mb-3 tracking-wide">送信内容</h4>
            <div className="text-sm text-text-dark space-y-2 tracking-wide">
              <p><strong>お名前:</strong> {formData.name}</p>
              <p><strong>メールアドレス:</strong> {formData.email}</p>
              {formData.phone && <p><strong>電話番号:</strong> {formData.phone}</p>}
              <p><strong>お問い合わせ種別:</strong> {getSubjectLabel(formData.subject)}</p>
            </div>
          </div>
          <button
            onClick={() => setStatus('idle')}
            className="bg-primary-dark-green hover:bg-primary-navy text-white px-8 py-3 font-semibold transition-colors duration-300 tracking-wider border border-primary-gold/30"
          >
            新しいお問い合わせ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border-light p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {status === 'error' && (
          <div className="bg-primary-sakura/20 border border-primary-sakura text-primary-dark-green px-4 py-3 flex items-start">
            <AlertCircle size={20} className="mr-3 mt-0.5 flex-shrink-0" />
            <span className="tracking-wide">{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-dark mb-2 tracking-wide">
              お名前 <span className="text-primary-sakura">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-text-gray" size={20} />
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                disabled={status === 'sending'}
                className="w-full pl-10 pr-4 py-3 border border-border-light focus:outline-none focus:ring-2 focus:ring-primary-dark-green focus:border-transparent disabled:bg-soft-green disabled:cursor-not-allowed tracking-wide"
                placeholder="山田 太郎"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-2 tracking-wide">
              メールアドレス <span className="text-primary-sakura">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-text-gray" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                disabled={status === 'sending'}
                className="w-full pl-10 pr-4 py-3 border border-border-light focus:outline-none focus:ring-2 focus:ring-primary-dark-green focus:border-transparent disabled:bg-soft-green disabled:cursor-not-allowed tracking-wide"
                placeholder="example@email.com"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-text-dark mb-2 tracking-wide">
              電話番号
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-text-gray" size={20} />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={status === 'sending'}
                className="w-full pl-10 pr-4 py-3 border border-border-light focus:outline-none focus:ring-2 focus:ring-primary-dark-green focus:border-transparent disabled:bg-soft-green disabled:cursor-not-allowed tracking-wide"
                placeholder="090-1234-5678"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-text-dark mb-2 tracking-wide">
              お問い合わせ種別 <span className="text-primary-sakura">*</span>
            </label>
            <select
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleInputChange}
              disabled={status === 'sending'}
              className="w-full px-4 py-3 border border-border-light focus:outline-none focus:ring-2 focus:ring-primary-dark-green focus:border-transparent disabled:bg-soft-green disabled:cursor-not-allowed tracking-wide"
            >
              <option value="">選択してください</option>
              <option value="product">商品について</option>
              <option value="vending">自販機について</option>
              <option value="temple">神社・仏閣販売について</option>
              <option value="custom">カスタムオーダー</option>
              <option value="guide">ガイド・予約について</option>
              <option value="other">その他</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-text-dark mb-2 tracking-wide">
            お問い合わせ内容 <span className="text-primary-sakura">*</span>
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 text-text-gray" size={20} />
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              value={formData.message}
              onChange={handleInputChange}
              disabled={status === 'sending'}
              className="w-full pl-10 pr-4 py-3 border border-border-light focus:outline-none focus:ring-2 focus:ring-primary-dark-green focus:border-transparent resize-none disabled:bg-soft-green disabled:cursor-not-allowed tracking-wide"
              placeholder="お問い合わせ内容をご記入ください..."
            />
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full bg-primary-dark-green hover:bg-primary-navy text-white py-4 px-6 rounded-full font-semibold transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed tracking-wider"
          >
            {status === 'sending' ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send size={20} />
                送信する
              </>
            )}
          </button>
        </div>

        {/* 注意事項 */}
        <div className="text-center text-sm text-text-gray mt-6 tracking-wide">
          <p>※ 送信いただいた内容は、naokan.buddhaflower@icloud.com に届きます</p>
          <p>※ 代表 挾間 健二より3営業日以内にご返信いたします</p>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;