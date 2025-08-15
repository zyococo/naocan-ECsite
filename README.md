# naocan-ECsite

## 概要

花屋の EC サイトで、仏花とプリザーブドフラワーの販売、ガイド予約機能を提供しています。

## 機能

- 商品閲覧・購入（仏花、プリザーブドフラワー）
- ショッピングカート機能
- Stripe 決済連携
- お気に入り機能
- ガイド予約システム
- 管理者ダッシュボード
- AI チャットボット（Gemini API 連携）

## 環境変数の設定

### Supabase 設定

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Stripe 設定

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

### Google Cloud Gemini API 設定

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## インストール・実行

```bash
npm install
npm run dev
```

## Stripe 決済の設定

1. Stripe アカウントを作成
2. 公開キーと秘密キーを取得
3. 環境変数に設定
4. Netlify Functions を使用してサーバーサイド API を実装

**注意**: 現在の実装では、Netlify Functions を使用して Stripe の顧客ポータルセッションを作成しています。これにより、決済情報の管理を Stripe が行い、セキュリティが向上します。

### 顧客ポータルの利点

- 決済情報の安全な管理
- 支払い方法の更新・削除
- 注文履歴の確認
- サブスクリプション管理（将来的な機能拡張時）

### Netlify Functions の設定

1. `netlify/functions/` ディレクトリに API 関数を配置
2. `netlify.toml` で設定を管理
3. 環境変数で Stripe 秘密キーを設定

### Gemini API チャットボットの設定

1. Google Cloud Console で Gemini API を有効化
2. API キーを取得
3. 環境変数 `VITE_GEMINI_API_KEY` に設定
4. チャットボットは画面右下に常時表示され、naocan に関する質問に回答
