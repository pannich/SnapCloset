-- Temporary migration to disable RLS for testing
-- WARNING: This should only be used for development/testing
-- Remove this migration in production

-- Disable RLS on user_items table for testing
ALTER TABLE user_items DISABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations on storage for testing
CREATE POLICY "Allow all storage operations for testing" ON storage.objects
  FOR ALL USING (bucket_id = 'user-images');

-- Note: This allows anyone to upload/access images in the user-images bucket
-- This is NOT secure for production use
