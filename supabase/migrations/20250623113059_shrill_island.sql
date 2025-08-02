/*
  # Fix reservation RLS policy for guest bookings

  1. Security Updates
    - Allow anonymous users to create reservations
    - Maintain security for reading reservations
    - Keep admin access for management

  2. Changes Made
    - Update INSERT policy to allow public access
    - Ensure guest reservations work without authentication
    - Maintain existing read/update policies for security
*/

-- Drop existing reservation policies
DROP POLICY IF EXISTS "Users can create reservations" ON reservations;
DROP POLICY IF EXISTS "Users can read own reservations" ON reservations;
DROP POLICY IF EXISTS "Admin can read all reservations" ON reservations;
DROP POLICY IF EXISTS "Admin can update reservations" ON reservations;

-- Create new policies that allow guest reservations
CREATE POLICY "Anyone can create reservations"
  ON reservations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read own reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

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

CREATE POLICY "Admin can delete reservations"
  ON reservations
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.name = 'admin'
    )
  );