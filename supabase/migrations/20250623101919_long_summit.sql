/*
  # Fix RLS Policy for Available Slots

  1. Security Updates
    - Add missing INSERT policy for administrators on available_slots table
    - Ensure administrators can create new slots through the admin interface

  2. Changes Made
    - Create specific INSERT policy for admin users
    - Maintain existing policies for reading and general management
*/

-- Drop the existing "Admin can manage slots" policy if it exists
DROP POLICY IF EXISTS "Admin can manage slots" ON available_slots;

-- Create separate policies for better control
CREATE POLICY "Admin can read all slots"
  ON available_slots
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.name = 'admin'
    )
  );

CREATE POLICY "Admin can insert slots"
  ON available_slots
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.name = 'admin'
    )
  );

CREATE POLICY "Admin can update slots"
  ON available_slots
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.name = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.name = 'admin'
    )
  );

CREATE POLICY "Admin can delete slots"
  ON available_slots
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.name = 'admin'
    )
  );

-- Keep the existing policy for public read access to active slots
-- This should already exist, but ensure it's there
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'available_slots' 
    AND policyname = 'Anyone can read active slots'
  ) THEN
    CREATE POLICY "Anyone can read active slots"
      ON available_slots
      FOR SELECT
      TO public
      USING (is_active = true);
  END IF;
END $$;