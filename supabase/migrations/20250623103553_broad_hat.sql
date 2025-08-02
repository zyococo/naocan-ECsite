-- Fix admin user creation and ensure proper authentication setup

-- First, clean up any existing admin user to start fresh
DELETE FROM profiles WHERE name = 'admin';
DELETE FROM auth.users WHERE email = 'g1348032@gmail.com';

-- Create admin user properly
-- Note: In production, this should be done through Supabase dashboard
-- This is a development setup

DO $$
DECLARE
    admin_user_id uuid := gen_random_uuid();
    hashed_password text;
BEGIN
    -- Create the admin user in auth.users
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

    -- Create admin profile
    INSERT INTO profiles (id, name, phone, address, created_at, updated_at)
    VALUES (
        admin_user_id,
        'admin',
        '090-7882-2827',
        '〒544-0003 大阪市生野区小路東6-7-27',
        NOW(),
        NOW()
    );

    -- Create identity record for email authentication with all required fields
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

    RAISE NOTICE 'Admin user created successfully with ID: %', admin_user_id;
END $$;

-- Verify the admin user was created correctly
DO $$
DECLARE
    user_exists boolean;
    profile_exists boolean;
    identity_exists boolean;
BEGIN
    -- Check if user exists
    SELECT EXISTS(
        SELECT 1 FROM auth.users 
        WHERE email = 'g1348032@gmail.com' 
        AND email_confirmed_at IS NOT NULL
    ) INTO user_exists;

    -- Check if profile exists with admin role
    SELECT EXISTS(
        SELECT 1 FROM profiles p
        JOIN auth.users u ON p.id = u.id
        WHERE u.email = 'g1348032@gmail.com' 
        AND p.name = 'admin'
    ) INTO profile_exists;

    -- Check if identity exists
    SELECT EXISTS(
        SELECT 1 FROM auth.identities i
        JOIN auth.users u ON i.user_id = u.id
        WHERE u.email = 'g1348032@gmail.com'
        AND i.provider = 'email'
        AND i.provider_id IS NOT NULL
    ) INTO identity_exists;

    IF NOT user_exists THEN
        RAISE EXCEPTION 'Admin user was not created in auth.users';
    END IF;

    IF NOT profile_exists THEN
        RAISE EXCEPTION 'Admin profile was not created';
    END IF;

    IF NOT identity_exists THEN
        RAISE EXCEPTION 'Admin identity was not created';
    END IF;

    RAISE NOTICE 'Admin user setup verification passed';
END $$;