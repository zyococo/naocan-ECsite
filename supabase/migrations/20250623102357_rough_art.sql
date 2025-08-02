/*
  # Setup Admin User and Profile

  1. Admin User Setup
    - Creates admin user if not exists
    - Sets up admin profile with proper permissions
    - Ensures admin can access management functions

  2. Security
    - Admin profile linked to auth user
    - Proper RLS policies already in place
    - Admin identified by profiles.name = 'admin'

  3. Credentials
    - Email: g1348032@gmail.com
    - Password: naocan0621
    - Profile name: admin
*/

-- First, let's check if the admin user already exists and create if needed
-- Note: This is a safe operation that won't duplicate users

DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Check if admin user exists
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'g1348032@gmail.com';
    
    -- If admin user doesn't exist, we need to create it manually
    -- In production, this should be done through Supabase dashboard
    IF admin_user_id IS NULL THEN
        -- Insert admin user into auth.users
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'g1348032@gmail.com',
            crypt('naocan0621', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{}',
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        );
        
        -- Get the newly created user ID
        SELECT id INTO admin_user_id 
        FROM auth.users 
        WHERE email = 'g1348032@gmail.com';
    END IF;
    
    -- Ensure admin profile exists
    INSERT INTO profiles (id, name, phone, address, created_at, updated_at)
    VALUES (
        admin_user_id,
        'admin',
        '090-7882-2827',
        '〒544-0003 大阪市生野区小路東6-7-27',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        name = 'admin',
        phone = '090-7882-2827',
        address = '〒544-0003 大阪市生野区小路東6-7-27',
        updated_at = NOW();
        
    RAISE NOTICE 'Admin user and profile setup completed for user ID: %', admin_user_id;
END $$;

-- Verify the setup
DO $$
DECLARE
    user_count integer;
    profile_count integer;
BEGIN
    SELECT COUNT(*) INTO user_count 
    FROM auth.users 
    WHERE email = 'g1348032@gmail.com';
    
    SELECT COUNT(*) INTO profile_count 
    FROM profiles p
    JOIN auth.users u ON p.id = u.id
    WHERE u.email = 'g1348032@gmail.com' AND p.name = 'admin';
    
    IF user_count = 0 THEN
        RAISE EXCEPTION 'Admin user was not created successfully';
    END IF;
    
    IF profile_count = 0 THEN
        RAISE EXCEPTION 'Admin profile was not created successfully';
    END IF;
    
    RAISE NOTICE 'Verification complete: Admin user and profile exist';
END $$;