-- Add RLS policies for storage and user_items table
-- This migration enables proper access control for the SnapCloset app

-- Enable RLS on user_items table (if not already enabled)
ALTER TABLE user_items ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to insert their own items
CREATE POLICY "Users can insert their own items" ON user_items
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Policy to allow users to view their own items
CREATE POLICY "Users can view their own items" ON user_items
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Policy to allow users to update their own items
CREATE POLICY "Users can update their own items" ON user_items
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Policy to allow users to delete their own items
CREATE POLICY "Users can delete their own items" ON user_items
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Storage policies for user-images bucket
-- Policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-images'
    AND auth.role() = 'authenticated'
  );

-- Policy to allow users to view their own images
CREATE POLICY "Users can view their own images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'user-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy to allow users to update their own images
CREATE POLICY "Users can update their own images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy to allow users to delete their own images
CREATE POLICY "Users can delete their own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- For development/testing: Allow all operations (remove in production)
-- Uncomment these lines if you want to bypass RLS for testing

-- CREATE POLICY "Allow all operations for testing" ON user_items
--   FOR ALL USING (true);

-- CREATE POLICY "Allow all storage operations for testing" ON storage.objects
--   FOR ALL USING (bucket_id = 'user-images');
