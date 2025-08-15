-- 存在する画像ファイルのみを使用するように商品データを更新
-- 現在存在する画像ファイル:
-- buddhist-01.jpg 〜 buddhist-07.jpg
-- preserved-01.jpg 〜 preserved-05.jpg
-- wedding-01.jpg 〜 wedding-04.jpg
-- anniversary-01.jpg 〜 anniversary-05.jpg

-- 既存の商品データを削除して、存在する画像のみで再作成
DELETE FROM products;

-- 存在する画像ファイルを使用した商品データを挿入
INSERT INTO products (id, name, price, original_price, image_url, category, description, tags, rating, reviews, color, size, flower, is_new, is_sale, is_active, created_at, updated_at) VALUES
-- 仏花商品（buddhist-01.jpg 〜 buddhist-07.jpg）
(gen_random_uuid(), '季節の仏花・春', 3800, NULL, '/flowers/buddhist-01.jpg', 'buddhist', '春の訪れを感じる美しい仏花アレンジメントです。桜や菜の花など、春らしい花材を使用しています。', ARRAY['季節限定', '春'], 4.5, 92, 'pink', 'medium', 'mixed', false, false, true, NOW(), NOW()),
(gen_random_uuid(), '仏花・白蓮', 4200, NULL, '/flowers/buddhist-02.jpg', 'buddhist', '清らかな白蓮を中心とした仏花です。心を落ち着かせる美しいアレンジメントです。', ARRAY['白蓮', '清らか'], 4.7, 78, 'white', 'medium', 'lotus', false, false, true, NOW(), NOW()),
(gen_random_uuid(), '仏花・紫陽花', 3500, NULL, '/flowers/buddhist-03.jpg', 'buddhist', '紫陽花の美しさを活かした仏花です。雨の季節にぴったりの上品なアレンジメントです。', ARRAY['紫陽花', '雨の季節'], 4.6, 85, 'purple', 'medium', 'hydrangea', false, false, true, NOW(), NOW()),
(gen_random_uuid(), '仏花・菊', 4500, NULL, '/flowers/buddhist-04.jpg', 'buddhist', '伝統的な菊を使用した仏花です。高貴で上品な印象を与えます。', ARRAY['菊', '伝統'], 4.8, 67, 'yellow', 'large', 'chrysanthemum', false, false, true, NOW(), NOW()),
(gen_random_uuid(), '仏花・蓮', 3900, NULL, '/flowers/buddhist-05.jpg', 'buddhist', '蓮の花を中心とした仏花です。仏教の象徴である蓮の美しさを表現しています。', ARRAY['蓮', '仏教'], 4.4, 73, 'pink', 'medium', 'lotus', false, false, true, NOW(), NOW()),
(gen_random_uuid(), '仏花・白菊', 3200, NULL, '/flowers/buddhist-06.jpg', 'buddhist', '純白の菊を使用した仏花です。清らかで上品な印象を与えます。', ARRAY['白菊', '純白'], 4.5, 89, 'white', 'small', 'chrysanthemum', false, false, true, NOW(), NOW()),
(gen_random_uuid(), '仏花・黄菊', 3600, NULL, '/flowers/buddhist-07.jpg', 'buddhist', '明るい黄色の菊を使用した仏花です。温かみのある印象を与えます。', ARRAY['黄菊', '温かみ'], 4.3, 95, 'yellow', 'medium', 'chrysanthemum', false, false, true, NOW(), NOW()),

-- プリザーブドフラワー商品（preserved-01.jpg 〜 preserved-05.jpg）
(gen_random_uuid(), 'プリザーブドローズ・エレガント', 12800, NULL, '/flowers/preserved-01.jpg', 'preserved', 'エレガントなプリザーブドローズのアレンジメントです。長期間美しさを保ちます。', ARRAY['新作', 'ギフト'], 4.9, 89, 'red', 'medium', 'rose', true, false, true, NOW(), NOW()),
(gen_random_uuid(), 'プリザーブド・ハートボックス', 9800, NULL, '/flowers/preserved-02.jpg', 'preserved', 'ハート型のボックスに入ったロマンチックなプリザーブドフラワーです。', ARRAY['記念日', '贈り物'], 4.8, 134, 'pink', 'small', 'mixed', false, false, true, NOW(), NOW()),
(gen_random_uuid(), 'プリザーブド・ガーデンドーム', 15800, NULL, '/flowers/preserved-03.jpg', 'preserved', 'ガラスドームに入った美しいプリザーブドフラワーガーデンです。', ARRAY['高級', '新作'], 4.9, 56, 'mixed', 'large', 'mixed', true, false, true, NOW(), NOW()),
(gen_random_uuid(), 'プリザーブド・ブルーローズ', 8800, 9800, '/flowers/preserved-04.jpg', 'preserved', '珍しいブルーのプリザーブドローズです。', ARRAY['希少', 'ブルー'], 4.7, 112, 'blue', 'medium', 'rose', false, true, true, NOW(), NOW()),
(gen_random_uuid(), 'プリザーブド・ミニブーケ', 6800, NULL, '/flowers/preserved-05.jpg', 'preserved', 'コンパクトなミニブーケです。デスクや小スペースに最適です。', ARRAY['ミニ', 'コンパクト'], 4.5, 87, 'mixed', 'small', 'mixed', false, false, true, NOW(), NOW()),

-- ウェディング商品（wedding-01.jpg 〜 wedding-04.jpg）
(gen_random_uuid(), 'ウェディングブーケ・クラシック', 15800, NULL, '/flowers/wedding-01.jpg', 'preserved', 'クラシックな白いウェディングブーケです。永遠の愛を象徴します。', ARRAY['ウェディング', 'クラシック'], 4.9, 67, 'white', 'large', 'rose', false, false, true, NOW(), NOW()),
(gen_random_uuid(), 'ウェディングブーケ・ロマンティック', 14200, NULL, '/flowers/wedding-02.jpg', 'preserved', 'ロマンティックなピンクのウェディングブーケです。優しい印象を与えます。', ARRAY['ウェディング', 'ロマンティック'], 4.8, 89, 'pink', 'large', 'rose', false, false, true, NOW(), NOW()),
(gen_random_uuid(), 'ウェディングブーケ・エレガント', 16800, NULL, '/flowers/wedding-03.jpg', 'preserved', 'エレガントなウェディングブーケです。上品で洗練された印象です。', ARRAY['ウェディング', 'エレガント'], 4.9, 45, 'white', 'large', 'mixed', false, false, true, NOW(), NOW()),
(gen_random_uuid(), 'ウェディングブーケ・モダン', 13500, NULL, '/flowers/wedding-04.jpg', 'preserved', 'モダンなデザインのウェディングブーケです。現代的でスタイリッシュです。', ARRAY['ウェディング', 'モダン'], 4.7, 78, 'mixed', 'medium', 'mixed', false, false, true, NOW(), NOW()),

-- 記念日商品（anniversary-01.jpg 〜 anniversary-05.jpg）
(gen_random_uuid(), '記念日アレンジ・ロマンティック', 9800, NULL, '/flowers/anniversary-01.jpg', 'preserved', 'ロマンティックな記念日アレンジメントです。特別な日を彩ります。', ARRAY['記念日', 'ロマンティック'], 4.8, 123, 'pink', 'medium', 'rose', false, false, true, NOW(), NOW()),
(gen_random_uuid(), '記念日アレンジ・エレガント', 12800, NULL, '/flowers/anniversary-02.jpg', 'preserved', 'エレガントな記念日アレンジメントです。上品で洗練された印象です。', ARRAY['記念日', 'エレガント'], 4.9, 89, 'white', 'large', 'mixed', false, false, true, NOW(), NOW()),
(gen_random_uuid(), '記念日アレンジ・カラフル', 8800, NULL, '/flowers/anniversary-03.jpg', 'preserved', 'カラフルで明るい記念日アレンジメントです。お祝いの気持ちを表現します。', ARRAY['記念日', 'カラフル'], 4.7, 156, 'mixed', 'medium', 'mixed', false, false, true, NOW(), NOW()),
(gen_random_uuid(), '記念日アレンジ・プレミアム', 15800, NULL, '/flowers/anniversary-04.jpg', 'preserved', '特別な記念日に最適なプレミアムアレンジメントです。', ARRAY['記念日', 'プレミアム'], 5.0, 67, 'mixed', 'large', 'mixed', true, false, true, NOW(), NOW()),
(gen_random_uuid(), '記念日アレンジ・ミニ', 6800, NULL, '/flowers/anniversary-05.jpg', 'preserved', 'コンパクトなミニ記念日アレンジメントです。小スペースに最適です。', ARRAY['記念日', 'ミニ'], 4.6, 134, 'mixed', 'small', 'mixed', false, false, true, NOW(), NOW());
