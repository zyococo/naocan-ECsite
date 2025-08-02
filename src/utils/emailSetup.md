# EmailJS設定手順（予約システム対応版）

このお問い合わせフォームと予約システムを機能させるために、EmailJSの設定が必要です。

## 1. EmailJSアカウント作成
1. https://www.emailjs.com/ にアクセス
2. 無料アカウントを作成

## 2. サービス設定
1. EmailJSダッシュボードで「Email Services」を選択
2. 「Add New Service」をクリック
3. Gmail、Outlook、Yahoo等のメールサービスを選択
4. g1348032@gmail.com のメールアカウントを設定
5. Service IDをコピー（例：service_naocan）

## 3. テンプレート作成

### 3.1 お問い合わせ用テンプレート
1. 「Email Templates」を選択
2. 「Create New Template」をクリック
3. Template ID: `template_eajcymk`

**件名:**
```
【お問い合わせ】{{subject}} - フローリストなおかん
```

**本文:**
```
フローリストなおかんへお問い合わせをいただきありがとうございます。

■ お客様情報
お名前: {{from_name}}
メールアドレス: {{from_email}}
電話番号: {{phone}}
お問い合わせ種別: {{subject}}

■ お問い合わせ内容
{{message}}

---
このメールは自動送信されています。
3営業日以内にご返信いたします。

フローリストなおかん
〒544-0003 大阪府大阪市生野区小路東6丁目7−27
TEL: 090-7882-2827
```

### 3.2 予約通知用テンプレート（管理者宛）
1. 新しいテンプレートを作成
2. Template ID: `template_reservation_notification`

**件名:**
```
【新規予約】ガイド予約が入りました - {{customer_name}}様
```

**本文:**
```
新しいガイド予約が入りました。

■ 予約情報
予約ID: {{reservation_id}}
予約日時: {{reservation_date}} {{reservation_time}}
参加人数: {{participants}}名

■ お客様情報
お名前: {{customer_name}}
メールアドレス: {{customer_email}}
電話番号: {{customer_phone}}

■ ご希望内容
希望の花: {{flower_type}}
希望の色: {{color_preference}}
メッセージ: {{customer_message}}

---
24時間以内にお客様へ確認のお電話をお願いいたします。

フローリストなおかん
代表: 挾間 健二
```

### 3.3 予約確認用テンプレート（顧客宛）
1. 新しいテンプレートを作成
2. Template ID: `template_reservation_confirmation`

**件名:**
```
【予約確認】ガイド予約を承りました - {{customer_name}}様
```

**本文:**
```
{{customer_name}}様

この度は、フローリストなおかんのガイド予約をお申し込みいただき、誠にありがとうございます。

■ ご予約内容
予約日時: {{reservation_date}} {{reservation_time}}
参加人数: {{participants}}名
希望の花: {{flower_type}}
希望の色: {{color_preference}}

■ 今後の流れ
1. 24時間以内に代表の挾間より確認のお電話をいたします
2. 詳細な打ち合わせを行います
3. 当日は店舗にてガイド体験をお楽しみください

■ 体験について
・体験時間: 約2時間
・材料費: ¥3,000〜¥8,000程度（別途）
・場所: 〒544-0003 大阪市生野区小路東6-7-27

ご不明な点がございましたら、お気軽にお問い合わせください。

フローリストなおかん
代表: 挾間 健二
TEL: 090-7882-2827
Email: g1348032@gmail.com
```

## 4. 設定値の更新
`src/services/emailService.ts` ファイルの以下の値を更新してください：

```typescript
const EMAILJS_SERVICE_ID = 'your_service_id_here'; // ステップ2でコピーしたService ID
const EMAILJS_CONTACT_TEMPLATE_ID = 'template_eajcymk'; // お問い合わせ用
const EMAILJS_RESERVATION_NOTIFICATION_TEMPLATE_ID = 'template_reservation_notification'; // 管理者通知用
const EMAILJS_RESERVATION_CONFIRMATION_TEMPLATE_ID = 'template_reservation_confirmation'; // 顧客確認用
const EMAILJS_PUBLIC_KEY = 'your_public_key_here'; // EmailJSダッシュボードのPublic Key
```

## 5. Public Key取得
1. EmailJSダッシュボードで「Account」→「General」を選択
2. Public Keyをコピー

## 6. テスト
1. 予約フォームから実際に予約を送信
2. 管理者（g1348032@gmail.com）にメールが届くか確認
3. 顧客のメールアドレスに確認メールが届くか確認

## 注意事項
- 無料プランでは月200通まで送信可能
- より多くのメール送信が必要な場合は有料プランを検討
- 予約システムでは2通のメール（管理者通知+顧客確認）が送信されます
- フォールバック機能により、EmailJSが利用できない場合はmailtoリンクが開きます