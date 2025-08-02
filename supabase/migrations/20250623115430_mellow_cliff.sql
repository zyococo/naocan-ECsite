/*
  # Fix reservations table RLS policy for guest users

  1. Security Updates
    - Drop existing INSERT policy for reservations
    - Create new INSERT policy that properly allows both authenticated and anonymous users
    - Ensure the policy allows guest reservations (user_id can be null)

  2. Changes
    - Allow anonymous (public) users to insert reservations
    - Allow authenticated users to insert reservations
    - Maintain existing SELECT and UPDATE policies for admin and user access
*/

-- Drop the existing INSERT policy that might be causing issues
DROP POLICY IF EXISTS "Anyone can create reservations" ON reservations;

-- Create a new INSERT policy that explicitly allows both authenticated and anonymous users
CREATE POLICY "Allow reservation creation for all users"
  ON reservations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Ensure the existing SELECT policy for users reading their own reservations works correctly
-- This policy should allow users to see reservations where user_id matches their auth.uid()
-- or where user_id is null (guest reservations) - but we'll keep it restrictive for privacy

-- Update the user SELECT policy to be more explicit
DROP POLICY IF EXISTS "Users can read own reservations" ON reservations;

CREATE POLICY "Users can read own reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Keep the admin policies as they are since they're working correctly
-- Admin can read all reservations
-- Admin can update reservations  
-- Admin can delete reservations