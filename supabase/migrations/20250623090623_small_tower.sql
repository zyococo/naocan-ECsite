/*
  # Sample data insertion

  1. Products
    - Insert sample preserved flowers and Buddhist flowers
    - Include pricing, images, and metadata
  
  2. Available Slots
    - Create slots for next 30 weekdays
    - 3 time slots per day
    - Skip weekends and avoid duplicates
  
  3. Sample Reservations
    - Add some test reservation data
*/

-- Insert sample products (only if they don't exist)
INSERT INTO products (name, price, original_price, image_url, category, description, tags, rating, reviews, color, size, flower, is_new, is_sale) 
SELECT * FROM (VALUES
  ('プリザーブド白菊と紫蘭の仏花', 4800, 5200, 'https://images.pexels.com/photos/1070357/pexels-photo-1070357.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'buddhist', '伝統的な白菊と紫蘭を使用したプリザーブド仏花です。', ARRAY['人気', '法事'], 4.8, 156, 'white', 'medium', 'chrysanthemum', false, true),
  ('プリザーブドローズ・エレガント', 12800, null, 'https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'preserved', 'エレガントなプリザーブドローズのアレンジメントです。', ARRAY['新作', 'ギフト'], 4.9, 89, 'red', 'medium', 'rose', true, false),
  ('プリザーブド蓮の花・供養セット', 7200, 8000, 'https://images.pexels.com/photos/1070360/pexels-photo-1070360.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'buddhist', '神聖な蓮の花を中心としたプリザーブド供養用セットです。', ARRAY['供養', '法要'], 4.6, 78, 'pink', 'large', 'lotus', false, true),
  ('プリザーブド・ハートボックス', 9800, null, 'https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'preserved', 'ハート型のボックスに入ったロマンチックなプリザーブドフラワーです。', ARRAY['記念日', '贈り物'], 4.8, 134, 'pink', 'small', 'mixed', false, false),
  ('プリザーブドお悔やみの花・白ゆり', 5400, null, 'https://images.pexels.com/photos/2072046/pexels-photo-2072046.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'buddhist', '清楚な白ゆりを使用したプリザーブドお悔やみ花です。', ARRAY['お悔やみ'], 4.7, 167, 'white', 'medium', 'lily', false, false),
  ('プリザーブド・ガーデンドーム', 15800, null, 'https://images.pexels.com/photos/1198264/pexels-photo-1198264.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'preserved', 'ガラスドームに入った美しいプリザーブドフラワーガーデンです。', ARRAY['高級', '新作'], 4.9, 56, 'mixed', 'large', 'mixed', true, false),
  ('プリザーブド季節の仏花・春', 3800, null, 'https://images.pexels.com/photos/1070357/pexels-photo-1070357.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'buddhist', '春の花々を使用したプリザーブド季節仏花です。', ARRAY['季節限定', '春'], 4.5, 92, 'mixed', 'small', 'seasonal', false, false),
  ('プリザーブド・ブルーローズ', 8800, 9800, 'https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'preserved', '珍しいブルーのプリザーブドローズです。', ARRAY['希少', 'ブルー'], 4.7, 112, 'blue', 'medium', 'rose', false, true)
) AS v(name, price, original_price, image_url, category, description, tags, rating, reviews, color, size, flower, is_new, is_sale)
WHERE NOT EXISTS (
  SELECT 1 FROM products p WHERE p.name = v.name
);

-- Clear existing available_slots to avoid duplicates
DELETE FROM available_slots WHERE date >= CURRENT_DATE;

-- Insert sample available slots (next 30 days, weekdays only)
DO $$
DECLARE
  slot_date date;
  time_slot text;
  time_slots text[] := ARRAY['10:00-12:00', '13:00-15:00', '15:30-17:30'];
BEGIN
  FOR i IN 1..30 LOOP
    slot_date := CURRENT_DATE + i;
    
    -- Skip weekends (Sunday = 0, Saturday = 6)
    IF EXTRACT(DOW FROM slot_date) NOT IN (0, 6) THEN
      FOREACH time_slot IN ARRAY time_slots LOOP
        INSERT INTO available_slots (date, time, max_participants, current_reservations, is_active)
        VALUES (slot_date, time_slot, 3, 0, true)
        ON CONFLICT (date, time) DO NOTHING;
      END LOOP;
    END IF;
  END LOOP;
END $$;

-- Update some specific slots to have reservations (only if they exist)
UPDATE available_slots 
SET current_reservations = 1 
WHERE date = CURRENT_DATE + 1 AND time = '10:00-12:00'
AND EXISTS (SELECT 1 FROM available_slots WHERE date = CURRENT_DATE + 1 AND time = '10:00-12:00');

UPDATE available_slots 
SET current_reservations = 2 
WHERE date = CURRENT_DATE + 2 AND time = '13:00-15:00'
AND EXISTS (SELECT 1 FROM available_slots WHERE date = CURRENT_DATE + 2 AND time = '13:00-15:00');

UPDATE available_slots 
SET current_reservations = 3, is_active = true
WHERE date = CURRENT_DATE + 3 AND time = '15:30-17:30'
AND EXISTS (SELECT 1 FROM available_slots WHERE date = CURRENT_DATE + 3 AND time = '15:30-17:30');

-- Insert some sample reservations (only if corresponding slots exist)
INSERT INTO reservations (user_id, slot_id, name, email, phone, participants, flower_type, color_preference, message, status)
SELECT 
  null,
  s.id,
  '田中 花子',
  'tanaka@example.com',
  '090-1234-5678',
  2,
  'rose',
  'pink',
  '母の誕生日プレゼントを作りたいです。',
  'pending'
FROM available_slots s
WHERE s.date = CURRENT_DATE + 1 AND s.time = '10:00-12:00'
AND NOT EXISTS (
  SELECT 1 FROM reservations r 
  WHERE r.slot_id = s.id AND r.email = 'tanaka@example.com'
)
LIMIT 1;

INSERT INTO reservations (user_id, slot_id, name, email, phone, participants, flower_type, color_preference, message, status)
SELECT 
  null,
  s.id,
  '佐藤 太郎',
  'sato@example.com',
  '080-9876-5432',
  1,
  'mixed',
  'white',
  '故人を偲ぶ仏花を作りたいです。',
  'confirmed'
FROM available_slots s
WHERE s.date = CURRENT_DATE + 2 AND s.time = '13:00-15:00'
AND NOT EXISTS (
  SELECT 1 FROM reservations r 
  WHERE r.slot_id = s.id AND r.email = 'sato@example.com'
)
LIMIT 1;

INSERT INTO reservations (user_id, slot_id, name, email, phone, participants, flower_type, color_preference, message, status)
SELECT 
  null,
  s.id,
  '山田 美咲',
  'yamada@example.com',
  '070-5555-1234',
  3,
  'carnation',
  'red',
  '結婚記念日のプレゼントです。',
  'completed'
FROM available_slots s
WHERE s.date = CURRENT_DATE + 3 AND s.time = '15:30-17:30'
AND NOT EXISTS (
  SELECT 1 FROM reservations r 
  WHERE r.slot_id = s.id AND r.email = 'yamada@example.com'
)
LIMIT 1;