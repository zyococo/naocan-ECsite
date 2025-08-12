-- 既存の商品データを削除
DELETE FROM products;

-- 新しい商品データを挿入
-- 仏花商品
INSERT INTO products (id, name, price, original_price, image_url, category, description, tags, rating, reviews, color, size, flower, is_new, is_sale, is_active, created_at, updated_at) VALUES
('buddhist-001', '季節の仏花・春', 3800, NULL, '/flowers/buddhist-01.jpg', 'buddhist', '春の訪れを感じる美しい仏花アレンジメントです。桜や菜の花など、春らしい花材を使用しています。', ARRAY['季節限定', '春'], 4.5, 92, 'pink', 'medium', 'mixed', false, false, true, NOW(), NOW()),
('buddhist-002', '仏花・白蓮', 4200, NULL, '/flowers/buddhist-02.jpg', 'buddhist', '清らかな白蓮を中心とした仏花です。心を落ち着かせる美しいアレンジメントです。', ARRAY['白蓮', '清らか'], 4.7, 78, 'white', 'medium', 'lotus', false, false, true, NOW(), NOW()),
('buddhist-003', '仏花・紫陽花', 3500, NULL, '/flowers/buddhist-03.jpg', 'buddhist', '紫陽花の美しさを活かした仏花です。雨の季節にぴったりの上品なアレンジメントです。', ARRAY['紫陽花', '雨の季節'], 4.6, 85, 'purple', 'medium', 'hydrangea', false, false, true, NOW(), NOW()),
('buddhist-004', '仏花・菊', 4500, NULL, '/flowers/buddhist-04.jpg', 'buddhist', '伝統的な菊を使用した仏花です。高貴で上品な印象を与えます。', ARRAY['菊', '伝統'], 4.8, 67, 'yellow', 'large', 'chrysanthemum', false, false, true, NOW(), NOW()),
('buddhist-005', '仏花・蓮', 3900, NULL, '/flowers/buddhist-05.jpg', 'buddhist', '蓮の花を中心とした仏花です。仏教の象徴である蓮の美しさを表現しています。', ARRAY['蓮', '仏教'], 4.4, 73, 'pink', 'medium', 'lotus', false, false, true, NOW(), NOW()),
('buddhist-006', '仏花・白菊', 3200, NULL, '/flowers/buddhist-06.jpg', 'buddhist', '純白の菊を使用した仏花です。清らかで上品な印象を与えます。', ARRAY['白菊', '純白'], 4.5, 89, 'white', 'small', 'chrysanthemum', false, false, true, NOW(), NOW()),
('buddhist-007', '仏花・黄菊', 3600, NULL, '/flowers/buddhist-07.jpg', 'buddhist', '明るい黄色の菊を使用した仏花です。温かみのある印象を与えます。', ARRAY['黄菊', '温かみ'], 4.3, 95, 'yellow', 'medium', 'chrysanthemum', false, false, true, NOW(), NOW()),
('buddhist-008', '仏花・小菊', 2800, NULL, '/flowers/buddhist-08.jpg', 'buddhist', '可愛らしい小菊を使用した仏花です。コンパクトで扱いやすいサイズです。', ARRAY['小菊', 'コンパクト'], 4.2, 112, 'mixed', 'small', 'chrysanthemum', false, false, true, NOW(), NOW()),
('buddhist-009', '仏花・大菊', 5200, NULL, '/flowers/buddhist-09.jpg', 'buddhist', '立派な大菊を使用した仏花です。存在感のある豪華なアレンジメントです。', ARRAY['大菊', '豪華'], 4.9, 45, 'mixed', 'large', 'chrysanthemum', true, false, true, NOW(), NOW()),
('buddhist-010', '仏花・和風', 4100, NULL, '/flowers/buddhist-10.jpg', 'buddhist', '和風の花材を使用した仏花です。日本の伝統美を表現しています。', ARRAY['和風', '伝統'], 4.6, 68, 'mixed', 'medium', 'mixed', false, false, true, NOW(), NOW());

-- プリザーブドフラワー商品
INSERT INTO products (id, name, price, original_price, image_url, category, description, tags, rating, reviews, color, size, flower, is_new, is_sale, is_active, created_at, updated_at) VALUES
('preserved-001', 'プリザーブドローズ・エレガント', 12800, NULL, '/flowers/preserved-01.jpg', 'preserved', 'エレガントなプリザーブドローズのアレンジメントです。長期間美しさを保ちます。', ARRAY['新作', 'ギフト'], 4.9, 89, 'red', 'medium', 'rose', true, false, true, NOW(), NOW()),
('preserved-002', 'プリザーブド・ハートボックス', 9800, NULL, '/flowers/preserved-02.jpg', 'preserved', 'ハート型のボックスに入ったロマンチックなプリザーブドフラワーです。', ARRAY['記念日', '贈り物'], 4.8, 134, 'pink', 'small', 'mixed', false, false, true, NOW(), NOW()),
('preserved-003', 'プリザーブド・ガーデンドーム', 15800, NULL, '/flowers/preserved-03.jpg', 'preserved', 'ガラスドームに入った美しいプリザーブドフラワーガーデンです。', ARRAY['高級', '新作'], 4.9, 56, 'mixed', 'large', 'mixed', true, false, true, NOW(), NOW()),
('preserved-004', 'プリザーブド・ブルーローズ', 8800, 9800, '/flowers/preserved-04.jpg', 'preserved', '珍しいブルーのプリザーブドローズです。希少価値の高い商品です。', ARRAY['希少', 'ブルー'], 4.7, 112, 'blue', 'medium', 'rose', false, true, true, NOW(), NOW()),
('preserved-005', 'プリザーブド・ホワイトブーケ', 11200, NULL, '/flowers/preserved-05.jpg', 'preserved', '純白のプリザーブドフラワーブーケです。ウェディングにも最適です。', ARRAY['ウェディング', '純白'], 4.8, 78, 'white', 'large', 'mixed', false, false, true, NOW(), NOW()),
('preserved-006', 'プリザーブド・レインボー', 13500, NULL, '/flowers/preserved-06.jpg', 'preserved', 'カラフルなプリザーブドフラワーのアレンジメントです。明るい印象を与えます。', ARRAY['カラフル', '明るい'], 4.6, 93, 'mixed', 'large', 'mixed', false, false, true, NOW(), NOW()),
('preserved-007', 'プリザーブド・ピンクローズ', 9500, NULL, '/flowers/preserved-07.jpg', 'preserved', '優しいピンクのプリザーブドローズです。女性に人気の商品です。', ARRAY['ピンク', '女性向け'], 4.7, 156, 'pink', 'medium', 'rose', false, false, true, NOW(), NOW()),
('preserved-008', 'プリザーブド・ミニブーケ', 6800, NULL, '/flowers/preserved-08.jpg', 'preserved', 'コンパクトなミニブーケです。デスクや小スペースに最適です。', ARRAY['ミニ', 'コンパクト'], 4.5, 87, 'mixed', 'small', 'mixed', false, false, true, NOW(), NOW()),
('preserved-009', 'プリザーブド・ラベンダー', 8200, NULL, '/flowers/preserved-09.jpg', 'preserved', '癒しのラベンダーを使用したプリザーブドフラワーです。リラックス効果があります。', ARRAY['ラベンダー', '癒し'], 4.4, 103, 'purple', 'medium', 'lavender', false, false, true, NOW(), NOW()),
('preserved-010', 'プリザーブド・プレミアム', 18500, NULL, '/flowers/preserved-10.jpg', 'preserved', '最高級のプリザーブドフラワーです。特別な記念日に最適です。', ARRAY['プレミアム', '最高級'], 5.0, 34, 'mixed', 'large', 'mixed', true, false, true, NOW(), NOW());

-- ウェディング商品
INSERT INTO products (id, name, price, original_price, image_url, category, description, tags, rating, reviews, color, size, flower, is_new, is_sale, is_active, created_at, updated_at) VALUES
('wedding-001', 'ウェディングブーケ・クラシック', 15800, NULL, '/flowers/wedding-01.jpg', 'preserved', 'クラシックな白いウェディングブーケです。永遠の愛を象徴します。', ARRAY['ウェディング', 'クラシック'], 4.9, 67, 'white', 'large', 'rose', false, false, true, NOW(), NOW()),
('wedding-002', 'ウェディングブーケ・ロマンティック', 14200, NULL, '/flowers/wedding-02.jpg', 'preserved', 'ロマンティックなピンクのウェディングブーケです。優しい印象を与えます。', ARRAY['ウェディング', 'ロマンティック'], 4.8, 89, 'pink', 'large', 'rose', false, false, true, NOW(), NOW()),
('wedding-003', 'ウェディングブーケ・エレガント', 16800, NULL, '/flowers/wedding-03.jpg', 'preserved', 'エレガントなウェディングブーケです。上品で洗練された印象です。', ARRAY['ウェディング', 'エレガント'], 4.9, 45, 'white', 'large', 'mixed', false, false, true, NOW(), NOW()),
('wedding-004', 'ウェディングブーケ・モダン', 13500, NULL, '/flowers/wedding-04.jpg', 'preserved', 'モダンなデザインのウェディングブーケです。現代的でスタイリッシュです。', ARRAY['ウェディング', 'モダン'], 4.7, 78, 'mixed', 'medium', 'mixed', false, false, true, NOW(), NOW()),
('wedding-005', 'ウェディングブーケ・ミニ', 9800, NULL, '/flowers/wedding-05.jpg', 'preserved', 'コンパクトなミニウェディングブーケです。小柄な方に最適です。', ARRAY['ウェディング', 'ミニ'], 4.6, 112, 'white', 'small', 'rose', false, false, true, NOW(), NOW());

-- バースデー商品
INSERT INTO products (id, name, price, original_price, image_url, category, description, tags, rating, reviews, color, size, flower, is_new, is_sale, is_active, created_at, updated_at) VALUES
('birthday-001', 'バースデーアレンジ・カラフル', 8800, NULL, '/flowers/birthday-01.jpg', 'preserved', 'カラフルで明るいバースデーアレンジメントです。お祝いの気持ちを表現します。', ARRAY['バースデー', 'カラフル'], 4.7, 156, 'mixed', 'medium', 'mixed', false, false, true, NOW(), NOW()),
('birthday-002', 'バースデーアレンジ・ピンク', 7200, NULL, '/flowers/birthday-02.jpg', 'preserved', '優しいピンクのバースデーアレンジメントです。女性に人気の商品です。', ARRAY['バースデー', 'ピンク'], 4.6, 134, 'pink', 'medium', 'rose', false, false, true, NOW(), NOW()),
('birthday-003', 'バースデーアレンジ・ホワイト', 7800, NULL, '/flowers/birthday-03.jpg', 'preserved', '清らかな白いバースデーアレンジメントです。上品で洗練された印象です。', ARRAY['バースデー', 'ホワイト'], 4.5, 98, 'white', 'medium', 'mixed', false, false, true, NOW(), NOW()),
('birthday-004', 'バースデーアレンジ・ミニ', 5800, NULL, '/flowers/birthday-04.jpg', 'preserved', 'コンパクトなミニバースデーアレンジメントです。小スペースに最適です。', ARRAY['バースデー', 'ミニ'], 4.4, 167, 'mixed', 'small', 'mixed', false, false, true, NOW(), NOW()),
('birthday-005', 'バースデーアレンジ・プレミアム', 12800, NULL, '/flowers/birthday-05.jpg', 'preserved', '特別なバースデーに最適なプレミアムアレンジメントです。', ARRAY['バースデー', 'プレミアム'], 4.9, 67, 'mixed', 'large', 'mixed', true, false, true, NOW(), NOW());

-- アニバーサリー商品
INSERT INTO products (id, name, price, original_price, image_url, category, description, tags, rating, reviews, color, size, flower, is_new, is_sale, is_active, created_at, updated_at) VALUES
('anniversary-001', 'アニバーサリー・ローズ', 11200, NULL, '/flowers/anniversary-01.jpg', 'preserved', '記念日に最適なローズのアニバーサリーアレンジメントです。', ARRAY['アニバーサリー', 'ローズ'], 4.8, 89, 'red', 'medium', 'rose', false, false, true, NOW(), NOW()),
('anniversary-002', 'アニバーサリー・エレガント', 13500, NULL, '/flowers/anniversary-02.jpg', 'preserved', 'エレガントなアニバーサリーアレンジメントです。特別な記念日に最適です。', ARRAY['アニバーサリー', 'エレガント'], 4.9, 56, 'mixed', 'large', 'mixed', false, false, true, NOW(), NOW()),
('anniversary-003', 'アニバーサリー・ロマンティック', 9800, NULL, '/flowers/anniversary-03.jpg', 'preserved', 'ロマンティックなアニバーサリーアレンジメントです。愛を表現します。', ARRAY['アニバーサリー', 'ロマンティック'], 4.7, 123, 'pink', 'medium', 'rose', false, false, true, NOW(), NOW()),
('anniversary-004', 'アニバーサリー・プレミアム', 16800, NULL, '/flowers/anniversary-04.jpg', 'preserved', '最高級のアニバーサリーアレンジメントです。特別な記念日に最適です。', ARRAY['アニバーサリー', 'プレミアム'], 5.0, 34, 'mixed', 'large', 'mixed', true, false, true, NOW(), NOW()),
('anniversary-005', 'アニバーサリー・ミニ', 6800, NULL, '/flowers/anniversary-05.jpg', 'preserved', 'コンパクトなミニアニバーサリーアレンジメントです。小スペースに最適です。', ARRAY['アニバーサリー', 'ミニ'], 4.5, 145, 'mixed', 'small', 'mixed', false, false, true, NOW(), NOW());
