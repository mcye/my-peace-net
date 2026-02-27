-- 故事表
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read approved" ON stories FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);
CREATE POLICY "User create" ON stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin manage" ON stories FOR ALL USING (is_admin());
