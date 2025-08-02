import emailjs from '@emailjs/browser';

// EmailJS設定
const EMAILJS_SERVICE_ID = 'service_id9tis2';
const EMAILJS_CONTACT_TEMPLATE_ID = 'none';
const EMAILJS_RESERVATION_NOTIFICATION_TEMPLATE_ID = 'template_reservation_notification';
const EMAILJS_RESERVATION_CONFIRMATION_TEMPLATE_ID = 'template_reservation_confirmation';
const EMAILJS_PUBLIC_KEY = 'zPTRVCpn9Uhbik_0S';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ReservationNotificationData {
  reservationId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  participants: number;
  flowerType?: string;
  colorPreference?: string;
  message?: string;
}

export interface ReservationConfirmationData {
  customerName: string;
  customerEmail: string;
  date: string;
  time: string;
  participants: number;
  flowerType?: string;
  colorPreference?: string;
}

export const sendContactEmail = async (formData: ContactFormData): Promise<boolean> => {
  try {
    // EmailJSの初期化
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // テンプレートパラメータの準備
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      to_email: 'g1348032@gmail.com',
      reply_to: formData.email,
    };

    // メール送信
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_CONTACT_TEMPLATE_ID,
      templateParams
    );

    console.log('Contact email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Contact email sending failed:', error);
    return false;
  }
};

export const sendReservationNotification = async (data: ReservationNotificationData): Promise<boolean> => {
  try {
    // EmailJSの初期化
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // 日付フォーマット
    const formattedDate = new Date(data.date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });

    // 花の種類と色の日本語変換
    const flowerTypeMap: { [key: string]: string } = {
      'rose': 'ローズ',
      'carnation': 'カーネーション',
      'lily': 'ユリ',
      'hydrangea': 'あじさい',
      'chrysanthemum': '菊',
      'mixed': 'ミックス'
    };

    const colorMap: { [key: string]: string } = {
      'red': 'レッド系',
      'pink': 'ピンク系',
      'white': 'ホワイト系',
      'purple': 'パープル系',
      'blue': 'ブルー系',
      'yellow': 'イエロー系',
      'mixed': 'ミックス'
    };

    // テンプレートパラメータの準備
    const templateParams = {
      reservation_id: data.reservationId,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone,
      reservation_date: formattedDate,
      reservation_time: data.time,
      participants: data.participants,
      flower_type: data.flowerType ? flowerTypeMap[data.flowerType] || data.flowerType : 'お任せ',
      color_preference: data.colorPreference ? colorMap[data.colorPreference] || data.colorPreference : 'お任せ',
      customer_message: data.message || 'なし',
      to_email: 'g1348032@gmail.com',
      reply_to: data.customerEmail,
    };

    // 管理者への通知メール送信
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_RESERVATION_NOTIFICATION_TEMPLATE_ID,
      templateParams
    );

    console.log('Reservation notification sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Reservation notification sending failed:', error);
    return false;
  }
};

export const sendReservationConfirmation = async (data: ReservationConfirmationData): Promise<boolean> => {
  try {
    // EmailJSの初期化
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // 日付フォーマット
    const formattedDate = new Date(data.date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });

    // 花の種類と色の日本語変換
    const flowerTypeMap: { [key: string]: string } = {
      'rose': 'ローズ',
      'carnation': 'カーネーション',
      'lily': 'ユリ',
      'hydrangea': 'あじさい',
      'chrysanthemum': '菊',
      'mixed': 'ミックス'
    };

    const colorMap: { [key: string]: string } = {
      'red': 'レッド系',
      'pink': 'ピンク系',
      'white': 'ホワイト系',
      'purple': 'パープル系',
      'blue': 'ブルー系',
      'yellow': 'イエロー系',
      'mixed': 'ミックス'
    };

    // テンプレートパラメータの準備
    const templateParams = {
      customer_name: data.customerName,
      reservation_date: formattedDate,
      reservation_time: data.time,
      participants: data.participants,
      flower_type: data.flowerType ? flowerTypeMap[data.flowerType] || data.flowerType : 'お任せ',
      color_preference: data.colorPreference ? colorMap[data.colorPreference] || data.colorPreference : 'お任せ',
      to_email: data.customerEmail,
      reply_to: 'g1348032@gmail.com',
    };

    // 顧客への確認メール送信
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_RESERVATION_CONFIRMATION_TEMPLATE_ID,
      templateParams
    );

    console.log('Reservation confirmation sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Reservation confirmation sending failed:', error);
    return false;
  }
};

// フォールバック用のシンプルなメール送信（mailto）
export const sendEmailFallback = (formData: ContactFormData): void => {
  const subject = encodeURIComponent(`【お問い合わせ】${formData.subject} - なおかん`);
  const body = encodeURIComponent(`
お名前: ${formData.name}
メールアドレス: ${formData.email}
電話番号: ${formData.phone}
お問い合わせ種別: ${formData.subject}

お問い合わせ内容:
${formData.message}

---
このメールはなおかん (naocan) のウェブサイトから送信されました。
代表: 挾間 健二
  `);

  const mailtoLink = `mailto:g1348032@gmail.com?subject=${subject}&body=${body}`;
  window.open(mailtoLink, '_blank');
};