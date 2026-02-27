-- 收藏表
CREATE TABLE bookmarks (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('news', 'story')),
  content_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, content_type, content_id)
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User read own" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User manage own" ON bookmarks FOR ALL USING (auth.uid() = user_id);
