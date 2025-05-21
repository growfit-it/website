/*
  # Add subscription fields to Customers table

  1. Changes
    - Add subscription_status column to Customers table
    - Add subscription_type column to Customers table
    - Add enum types for subscription status and type

  2. Notes
    - subscription_status can be 'active' or 'paused'
    - subscription_type can be 'Chef\'s Choice' or 'Custom'
*/

-- Create enum types
CREATE TYPE subscription_status AS ENUM ('active', 'paused');
CREATE TYPE subscription_type AS ENUM ('Chef''s Choice', 'Custom');

-- Add subscription columns to Customers table
ALTER TABLE "Customers"
ADD COLUMN subscription_status subscription_status DEFAULT 'active',
ADD COLUMN subscription_type subscription_type DEFAULT 'Chef''s Choice';