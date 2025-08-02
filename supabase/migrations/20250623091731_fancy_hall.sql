-- Clear existing data to avoid conflicts
DELETE FROM reservations;
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
WHERE date = CURRENT_DATE + 1 AND time = '10:00-12:00';

UPDATE available_slots 
SET current_reservations = 2 
WHERE date = CURRENT_DATE + 2 AND time = '13:00-15:00';

UPDATE available_slots 
SET current_reservations = 3
WHERE date = CURRENT_DATE + 3 AND time = '15:30-17:30';

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