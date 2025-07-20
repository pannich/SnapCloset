-- ----------------------------
-- GRANT ACCESS TO AUTHENTICATED USERS
-- ----------------------------

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT INSERT ON TABLE public.user_items TO authenticated;


-- ----------------------------
-- 1. PROFILES TABLE
-- ----------------------------

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Select own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Delete own profile" ON profiles
  FOR DELETE
  USING (auth.uid() = id);


-- ----------------------------
-- 2. USER_ITEMS TABLE
-- ----------------------------

ALTER TABLE user_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Select own items" ON user_items
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Insert own items" ON user_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Update own items" ON user_items
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Delete own items" ON user_items
  FOR DELETE
  USING (auth.uid() = user_id);


-- ----------------------------
-- 3. USER_COLLECTIONS TABLE
-- ----------------------------

ALTER TABLE user_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Select own collections" ON user_collections
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Insert own collections" ON user_collections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Update own collections" ON user_collections
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Delete own collections" ON user_collections
  FOR DELETE
  USING (auth.uid() = user_id);


-- ----------------------------
-- 4. COLLECTION_ITEMS TABLE
-- ----------------------------

ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;

-- Simple policies for authenticated users
CREATE POLICY "Allow authenticated insert" ON collection_items
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated select" ON collection_items
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated update" ON collection_items
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated delete" ON collection_items
  FOR DELETE
  USING (auth.uid() IS NOT NULL);
