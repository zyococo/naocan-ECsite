# Supabase セットアップガイド

このプロジェクトで Supabase を使用するための完全なセットアップガイドです。

## 1. Supabase プロジェクト作成

1. [Supabase](https://supabase.com) にアクセス
2. 「Start your project」をクリック
3. GitHub アカウントでサインイン
4. 「New project」をクリック
5. プロジェクト情報を入力：
   - **Organization**: 個人アカウントを選択
   - **Name**: `naocan-flower-shop`
   - **Database Password**: 強力なパスワードを設定（保存しておく）
   - **Region**: `Northeast Asia (Tokyo)`
6. 「Create new project」をクリック

## 2. データベースセットアップ

### 2.1 SQL エディタでスキーマ作成

1. Supabase ダッシュボードで「SQL Editor」を選択
2. 「New query」をクリック
3. `supabase/migrations/create_initial_schema.sql` の内容をコピー&ペースト
4. 「Run」をクリックしてスキーマを作成

### 2.2 サンプルデータ挿入

1. 新しいクエリを作成
2. `supabase/migrations/insert_sample_data.sql` の内容をコピー&ペースト
3. 「Run」をクリックしてサンプルデータを挿入

## 3. 認証設定

### 3.1 Email 認証設定

1. 「Authentication」→「Settings」を選択
2. 「Email」タブで以下を設定：
   - **Enable email confirmations**: OFF（開発用）
   - **Enable email change confirmations**: OFF（開発用）
   - **Secure email change**: OFF（開発用）

### 3.2 認証プロバイダー設定

1. 「Authentication」→「Settings」→「Auth Providers」を選択
2. **Email** プロバイダーが有効になっていることを確認
3. **Enable sign up**: ON（一般ユーザーの登録を許可）
4. **Enable sign in**: ON

### 3.3 Google 認証設定

1. **Google** プロバイダーを有効にする
2. **Enable sign up**: ON
3. **Enable sign in**: ON
4. **Client ID** と **Client Secret** を設定（後述）

#### Google OAuth アプリケーションの作成

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成または既存のプロジェクトを選択
3. 「API とサービス」→「認証情報」を選択
4. 「認証情報を作成」→「OAuth 2.0 クライアント ID」を選択
5. アプリケーションの種類で「ウェブアプリケーション」を選択
6. 承認済みのリダイレクト URI に以下を追加：
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
7. クライアント ID とクライアントシークレットをコピー

#### Supabase での設定

1. Supabase ダッシュボードで「Authentication」→「Settings」→「Auth Providers」
2. Google プロバイダーの設定で：
   - **Client ID**: Google Cloud Console で取得したクライアント ID
   - **Client Secret**: Google Cloud Console で取得したクライアントシークレット
   - **Redirect URL**: `https://your-project-id.supabase.co/auth/v1/callback`

### 3.4 管理者ユーザー作成

1. 「Authentication」→「Users」を選択
2. 「Add user」をクリック
3. 管理者情報を入力：
   - **Email**: `g1348032@gmail.com`
   - **Password**: `naocan0621`
   - **Email confirm**: チェック
4. 「Create user」をクリック

### 3.5 管理者プロフィール作成

1. 「SQL Editor」で新しいクエリを作成
2. 以下の SQL を実行：

```sql
-- 管理者プロフィールを作成
INSERT INTO profiles (id, name, phone, address)
SELECT
  id,
  'admin',
  '090-7882-2827',
  '〒544-0003 大阪市生野区小路東6-7-27'
FROM auth.users
WHERE email = 'g1348032@gmail.com';
```

### 3.6 一般ユーザー認証のテスト

1. アプリケーションで新規ユーザー登録をテスト
2. 登録後、Supabase ダッシュボードの「Authentication」→「Users」でユーザーが作成されていることを確認
3. 「Table Editor」→「profiles」でプロフィールが作成されていることを確認

## 4. 環境変数設定

### 4.1 プロジェクト情報取得

1. Supabase ダッシュボードで「Settings」→「API」を選択
2. 以下の情報をコピー：
   - **Project URL**
   - **anon public key**

### 4.2 環境変数ファイル作成

1. プロジェクトルートに `.env` ファイルを作成
2. 以下の内容を記入：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 5. Row Level Security (RLS) ポリシー確認

以下のポリシーが正しく設定されているか確認：

### 5.1 プロフィール

- ユーザーは自分のプロフィールのみ読み書き可能
- 管理者は全プロフィール読み書き可能

### 5.2 商品

- 全ユーザーが有効な商品を読み取り可能
- 管理者のみ商品の作成・更新・削除可能

### 5.3 予約枠

- 全ユーザーが有効な予約枠を読み取り可能
- 管理者のみ予約枠の作成・更新・削除可能

### 5.4 予約

- ユーザーは自分の予約のみ読み取り可能
- 全認証ユーザーが予約作成可能
- 管理者は全予約の読み書き可能

### 5.5 カート・お気に入り

- ユーザーは自分のカート・お気に入りのみ管理可能

## 6. テストデータ確認

### 6.1 商品データ確認

```sql
SELECT name, price, category, is_active FROM products LIMIT 5;
```

### 6.2 予約枠データ確認

```sql
SELECT date, time, max_participants, current_reservations, is_active
FROM available_slots
WHERE date >= CURRENT_DATE
ORDER BY date, time
LIMIT 10;
```

### 6.3 ユーザー認証テスト

```sql
-- 登録されたユーザーを確認
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 10;

-- プロフィールを確認
SELECT id, name, phone, created_at FROM profiles ORDER BY created_at DESC LIMIT 10;
```

## 7. 本番環境での追加設定

### 7.1 Email 設定（本番時）

1. 「Authentication」→「Settings」→「Email」
2. SMTP 設定を行う（SendGrid、Resend 等）
3. **Enable email confirmations**: ON（本番環境では有効にする）

### 7.2 セキュリティ設定

1. **Enable sign up**: 必要に応じて制限
2. **Enable sign in**: ON
3. **Password strength**: 適切な強度を設定

### 7.3 ドメイン制限（本番時）

1. 「Authentication」→「Settings」→「URL Configuration」
2. 本番ドメインを追加
3. リダイレクト URL を設定

## 8. トラブルシューティング

### 8.1 認証エラー

- 環境変数が正しく設定されているか確認
- Supabase プロジェクトの URL とキーが正しいか確認
- ブラウザのコンソールでエラーメッセージを確認

### 8.2 プロフィール作成エラー

- RLS ポリシーが正しく設定されているか確認
- ユーザー ID が正しく渡されているか確認

### 8.3 セッション管理

- ブラウザのローカルストレージをクリア
- Supabase ダッシュボードでユーザーセッションを確認
