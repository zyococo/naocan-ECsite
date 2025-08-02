# Supabase セットアップガイド

このプロジェクトでSupabaseを使用するための完全なセットアップガイドです。

## 1. Supabaseプロジェクト作成

1. [Supabase](https://supabase.com) にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントでサインイン
4. 「New project」をクリック
5. プロジェクト情報を入力：
   - **Organization**: 個人アカウントを選択
   - **Name**: `naocan-flower-shop`
   - **Database Password**: 強力なパスワードを設定（保存しておく）
   - **Region**: `Northeast Asia (Tokyo)`
6. 「Create new project」をクリック

## 2. データベースセットアップ

### 2.1 SQLエディタでスキーマ作成

1. Supabaseダッシュボードで「SQL Editor」を選択
2. 「New query」をクリック
3. `supabase/migrations/create_initial_schema.sql` の内容をコピー&ペースト
4. 「Run」をクリックしてスキーマを作成

### 2.2 サンプルデータ挿入

1. 新しいクエリを作成
2. `supabase/migrations/insert_sample_data.sql` の内容をコピー&ペースト
3. 「Run」をクリックしてサンプルデータを挿入

## 3. 認証設定

### 3.1 Email認証設定

1. 「Authentication」→「Settings」を選択
2. 「Email」タブで以下を設定：
   - **Enable email confirmations**: OFF（開発用）
   - **Enable email change confirmations**: OFF（開発用）
   - **Secure email change**: OFF（開発用）

### 3.2 管理者ユーザー作成

1. 「Authentication」→「Users」を選択
2. 「Add user」をクリック
3. 管理者情報を入力：
   - **Email**: `g1348032@gmail.com`
   - **Password**: `naocan0621`
   - **Email confirm**: チェック
4. 「Create user」をクリック

### 3.3 管理者プロフィール作成

1. 「SQL Editor」で新しいクエリを作成
2. 以下のSQLを実行：

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

## 4. 環境変数設定

### 4.1 プロジェクト情報取得

1. Supabaseダッシュボードで「Settings」→「API」を選択
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

## 7. 本番環境での追加設定

### 7.1 Email設定（本番時）

1. 「Authentication」→「Settings」→「Email」
2. SMTP設定を行う（SendGrid、Resend等）
3. Email confirmationを有効化

### 7.2 セキュリティ設定

1. 「Settings」→「API」→「JWT Settings」
2. JWT有効期限を適切に設定（デフォルト: 1時間）

### 7.3 バックアップ設定

1. 「Settings」→「Database」→「Backups」
2. 自動バックアップを有効化

## 8. トラブルシューティング

### 8.1 接続エラー

- `.env` ファイルの環境変数が正しく設定されているか確認
- Supabase URLとキーが正確にコピーされているか確認

### 8.2 認証エラー

- RLSポリシーが正しく設定されているか確認
- ユーザーが正しく認証されているか確認

### 8.3 データ取得エラー

- テーブルが正しく作成されているか確認
- サンプルデータが正しく挿入されているか確認

## 9. 開発時の注意点

- 開発環境では Email confirmation を無効化
- 本番環境では必ず Email confirmation を有効化
- 管理者権限は `profiles.name = 'admin'` で判定
- パスワードは本番環境では必ず変更する

## 10. 完了確認

以下が正常に動作することを確認：

- [ ] ユーザー登録・ログイン
- [ ] 商品一覧表示
- [ ] 予約カレンダー表示
- [ ] 管理者ログイン
- [ ] 管理者での予約枠管理
- [ ] カート・お気に入り機能

すべて確認できたら、Supabaseセットアップ完了です！