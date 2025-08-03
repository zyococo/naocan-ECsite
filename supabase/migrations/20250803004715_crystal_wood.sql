/*
  # 管理者認証情報の更新

  1. Admin User Setup
    - Email: g1348032@gmail.com
    - Password: naocan0621
    - Profile name: admin (管理者識別用)

  2. Security
    - 管理者プロフィールの作成・更新
    - 適切なRLSポリシーで保護
    - 管理者権限の確保

  3. Important Notes
    - この情報は機密情報として扱ってください
    - 本番環境では必ずパスワードを変更してください
    - 管理者アクセスは profiles.name = 'admin' で判定されます
*/

-- 既存の管理者ユーザーがいる場合は削除（クリーンアップ）
DO $$
DECLARE
    existing_admin_id uuid;
BEGIN
    -- 既存の管理者プロフィールを検索
    SELECT p.id INTO existing_admin_id
    FROM profiles p
    JOIN auth.users u ON p.id = u.id
    WHERE u.email = 'g1348032@gmail.com' AND p.name = 'admin';

    -- 既存の管理者が見つかった場合は削除
    IF existing_admin_id IS NOT NULL THEN
        DELETE FROM profiles WHERE id = existing_admin_id;
        DELETE FROM auth.users WHERE id = existing_admin_id;
        RAISE NOTICE '既存の管理者ユーザーを削除しました: %', existing_admin_id;
    END IF;
END $$;

-- 新しい管理者ユーザーを作成
DO $$
DECLARE
    admin_user_id uuid := gen_random_uuid();
BEGIN
    -- auth.usersテーブルに管理者ユーザーを作成
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        phone_confirmed_at,
        confirmation_sent_at,
        recovery_sent_at,
        email_change_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        phone,
        phone_change,
        phone_change_token,
        phone_change_sent_at,
        email_change,
        email_change_token_new,
        email_change_token_current,
        confirmation_token,
        recovery_token,
        reauthentication_token,
        reauthentication_sent_at
    ) VALUES (
        admin_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'g1348032@gmail.com',
        crypt('naocan0621', gen_salt('bf')),
        NOW(),
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        '{"provider": "email", "providers": ["email"]}',
        '{}',
        FALSE,
        NOW(),
        NOW(),
        NULL,
        '',
        '',
        NULL,
        '',
        '',
        '',
        '',
        '',
        '',
        NULL
    );

    -- 管理者プロフィールを作成
    INSERT INTO profiles (id, name, phone, address, created_at, updated_at)
    VALUES (
        admin_user_id,
        'admin',
        '090-7882-2827',
        '〒544-0003 大阪市生野区小路東6-7-27',
        NOW(),
        NOW()
    );

    -- 認証用のidentityレコードを作成
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        admin_user_id,
        format('{"sub":"%s","email":"%s","email_verified":true,"phone_verified":false}', admin_user_id, 'g1348032@gmail.com')::jsonb,
        'email',
        'g1348032@gmail.com',
        NOW(),
        NOW(),
        NOW()
    );

    RAISE NOTICE '管理者ユーザーが正常に作成されました。ID: %', admin_user_id;
END $$;

-- セットアップの検証
DO $$
DECLARE
    user_exists boolean;
    profile_exists boolean;
    identity_exists boolean;
BEGIN
    -- ユーザーの存在確認
    SELECT EXISTS(
        SELECT 1 FROM auth.users 
        WHERE email = 'g1348032@gmail.com' 
        AND email_confirmed_at IS NOT NULL
    ) INTO user_exists;

    -- 管理者プロフィールの存在確認
    SELECT EXISTS(
        SELECT 1 FROM profiles p
        JOIN auth.users u ON p.id = u.id
        WHERE u.email = 'g1348032@gmail.com' 
        AND p.name = 'admin'
    ) INTO profile_exists;

    -- 認証identityの存在確認
    SELECT EXISTS(
        SELECT 1 FROM auth.identities i
        JOIN auth.users u ON i.user_id = u.id
        WHERE u.email = 'g1348032@gmail.com'
        AND i.provider = 'email'
    ) INTO identity_exists;

    IF NOT user_exists THEN
        RAISE EXCEPTION '管理者ユーザーの作成に失敗しました';
    END IF;

    IF NOT profile_exists THEN
        RAISE EXCEPTION '管理者プロフィールの作成に失敗しました';
    END IF;

    IF NOT identity_exists THEN
        RAISE EXCEPTION '管理者認証情報の作成に失敗しました';
    END IF;

    RAISE NOTICE '管理者セットアップの検証が完了しました';
END $$;