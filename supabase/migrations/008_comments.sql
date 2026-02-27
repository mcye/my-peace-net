-- 评论表
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('news', 'story')),
  content_id UUID NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read approved" ON comments FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);
CREATE POLICY "User create" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin manage" ON comments FOR ALL USING (is_admin());
