/*
  # なおかん (naocan) データベース初期スキーマ

  1. New Tables
    - `profiles` - ユーザープロフィール情報
      - `id` (uuid, primary key) - auth.users.idと連携
      - `name` (text) - ユーザー名
      - `phone` (text) - 電話番号
      - `address` (text) - 住所
      - `avatar_url` (text) - アバター画像URL
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `products` - 商品情報
      - `id` (uuid, primary key)
      - `name` (text) - 商品名
      - `price` (integer) - 価格（円）
      - `original_price` (integer) - 元価格
      - `image_url` (text) - 商品画像URL
      - `category` (text) - カテゴリ（buddhist/preserved）
      - `description` (text) - 商品説明
      - `tags` (text[]) - タグ配列
      - `rating` (decimal) - 評価
      - `reviews` (integer) - レビュー数
      - `color` (text) - 色
      - `size` (text) - サイズ
      - `flower` (text) - 花の種類
      - `is_new` (boolean) - 新作フラグ
      - `is_sale` (boolean) - セールフラグ
      - `is_active` (boolean) - 有効フラグ
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `available_slots` - 予約可能枠
      - `id` (uuid, primary key)
      - `date` (date) - 予約日
      - `time` (text) - 時間帯
      - `max_participants` (integer) - 最大参加人数
      - `current_reservations` (integer) - 現在の予約数
      - `is_active` (boolean) - 有効フラグ
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `reservations` - 予約情報
      - `id` (uuid, primary key)
      - `user_id` (uuid) - ユーザーID（null可能：ゲスト予約）
      - `slot_id` (uuid) - 予約枠ID
      - `name` (text) - 予約者名
      - `email` (text) - メールアドレス
      - `phone` (text) - 電話番号
      - `participants` (integer) - 参加人数
      - `flower_type` (text) - 希望の花
      - `color_preference` (text) - 希望の色
      - `message` (text) - メッセージ
      - `status` (text) - ステータス（pending/confirmed/completed/cancelled）
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `cart_items` - カート商品
      - `id` (uuid, primary key)
      - `user_id` (uuid) - ユーザーID
      - `product_id` (uuid) - 商品ID
      - `quantity` (integer) - 数量
      - `created_at` (timestamp)

    - `favorites` - お気に入り
      - `id` (uuid, primary key)
      - `user_id` (uuid) - ユーザーID
      - `product_id` (uuid) - 商品ID
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add admin policies for management
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  address text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  price integer NOT NULL,
  original_price integer,
  image_url text NOT NULL,
  category text NOT NULL CHECK (category IN ('buddhist', 'preserved')),
  description text NOT NULL,
  tags text[] DEFAULT '{}',
  rating decimal(3,2) DEFAULT 4.5,
  reviews integer DEFAULT 0,
  color text,
  size text DEFAULT 'medium',
  flower text,
  is_new boolean DEFAULT false,
  is_sale boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create available_slots table
CREATE TABLE IF NOT EXISTS available_slots (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  date date NOT NULL,
  time text NOT NULL,
  max_participants integer NOT NULL DEFAULT 3,
  current_reservations integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(date, time)
);

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  slot_id uuid REFERENCES available_slots(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  participants integer NOT NULL DEFAULT 1,
  flower_type text,
  color_preference text,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Products policies (public read, admin write)
CREATE POLICY "Anyone can read active products"
  ON products
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.name = 'admin'
    )
  );

-- Available slots policies (public read, admin write)
CREATE POLICY "Anyone can read active slots"
  ON available_slots
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage slots"
  ON available_slots
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.name = 'admin'
    )
  );

-- Reservations policies
CREATE POLICY "Users can read own reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create reservations"
  ON reservations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can read all reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.name = 'admin'
    )
  );

CREATE POLICY "Admin can update reservations"
  ON reservations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.name = 'admin'
    )
  );

-- Cart items policies
CREATE POLICY "Users can manage own cart"
  ON cart_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can manage own favorites"
  ON favorites
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_available_slots_updated_at BEFORE UPDATE ON available_slots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update slot reservation count
CREATE OR REPLACE FUNCTION update_slot_reservation_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE available_slots 
    SET current_reservations = current_reservations + 1
    WHERE id = NEW.slot_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE available_slots 
    SET current_reservations = current_reservations - 1
    WHERE id = OLD.slot_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.slot_id != NEW.slot_id THEN
      UPDATE available_slots 
      SET current_reservations = current_reservations - 1
      WHERE id = OLD.slot_id;
      
      UPDATE available_slots 
      SET current_reservations = current_reservations + 1
      WHERE id = NEW.slot_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for reservation count
CREATE TRIGGER update_slot_count_on_reservation_change
  AFTER INSERT OR UPDATE OR DELETE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_slot_reservation_count();