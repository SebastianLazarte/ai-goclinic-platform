/*
  # Add Visit Columns to Existing Visits Table

  1. New Columns Added
    - `patient_name` (text) - Name of the patient
    - `insurance_company` (text) - Insurance company name
    - `location` (text) - Clinic location
    - `visit_date` (date) - Date of the visit
    - `visit_time` (time) - Time of the visit
    - `revenue` (decimal) - Revenue amount for the visit
    - `reminder` (boolean) - Whether reminder is enabled
    - `user_id` (uuid) - Reference to authenticated user

  2. Security
    - Add RLS policies for user-specific data access
    - Users can only access their own visits

  3. Indexes
    - Add indexes for better query performance on date and user_id
*/

-- Add new columns to the existing visits table
DO $$
BEGIN
  -- Add patient_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'visits' AND column_name = 'patient_name'
  ) THEN
    ALTER TABLE visits ADD COLUMN patient_name text NOT NULL DEFAULT '';
  END IF;

  -- Add insurance_company column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'visits' AND column_name = 'insurance_company'
  ) THEN
    ALTER TABLE visits ADD COLUMN insurance_company text NOT NULL DEFAULT '';
  END IF;

  -- Add location column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'visits' AND column_name = 'location'
  ) THEN
    ALTER TABLE visits ADD COLUMN location text NOT NULL DEFAULT '';
  END IF;

  -- Add visit_date column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'visits' AND column_name = 'visit_date'
  ) THEN
    ALTER TABLE visits ADD COLUMN visit_date date NOT NULL DEFAULT CURRENT_DATE;
  END IF;

  -- Add visit_time column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'visits' AND column_name = 'visit_time'
  ) THEN
    ALTER TABLE visits ADD COLUMN visit_time time NOT NULL DEFAULT '09:00:00';
  END IF;

  -- Add revenue column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'visits' AND column_name = 'revenue'
  ) THEN
    ALTER TABLE visits ADD COLUMN revenue decimal(10,2) NOT NULL DEFAULT 0.00;
  END IF;

  -- Add reminder column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'visits' AND column_name = 'reminder'
  ) THEN
    ALTER TABLE visits ADD COLUMN reminder boolean NOT NULL DEFAULT false;
  END IF;

  -- Add user_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'visits' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE visits ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'visits' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE visits ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS visits_user_id_idx ON visits(user_id);
CREATE INDEX IF NOT EXISTS visits_visit_date_idx ON visits(visit_date);
CREATE INDEX IF NOT EXISTS visits_user_date_idx ON visits(user_id, visit_date);

-- Update RLS policies for user-specific access
DROP POLICY IF EXISTS "Users can read own visits" ON visits;
DROP POLICY IF EXISTS "Users can insert own visits" ON visits;
DROP POLICY IF EXISTS "Users can update own visits" ON visits;
DROP POLICY IF EXISTS "Users can delete own visits" ON visits;

-- Create comprehensive RLS policies
CREATE POLICY "Users can read own visits"
  ON visits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own visits"
  ON visits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own visits"
  ON visits
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own visits"
  ON visits
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_visits_updated_at ON visits;
CREATE TRIGGER update_visits_updated_at
  BEFORE UPDATE ON visits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();