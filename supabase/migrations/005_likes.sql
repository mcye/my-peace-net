-- 点赞表
CREATE TABLE likes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('news', 'story')),
  content_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, content_type, content_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON likes FOR SELECT USING (true);
CREATE POLICY "User manage own" ON likes FOR ALL USING (auth.uid() = user_id);
