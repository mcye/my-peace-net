# Peace Net 重构实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 使用 Next.js 重新构建 Peace Net 和平网站，实现新闻发布、用户故事分享、社交互动功能。

**Tech Stack:**
- 框架: Next.js 14+ (App Router)
- 数据库/认证: Supabase
- 样式: Tailwind CSS + shadcn/ui
- 状态管理: Zustand (客户端) + TanStack Query (服务端)
- 部署: Cloudflare Pages

**内容系统:**
- 新闻 (News) - 官方发布的资讯
- 故事 (Stories) - 用户投稿的个人经历

**多语言:** 中文 + 英文

---

## 阶段概览

| 阶段 | 内容 | 任务数 |
|------|------|--------|
| 0 | 项目初始化 | 8 |
| 1 | 数据库设计 | 6 |
| 2 | 认证系统 | 5 |
| 3 | 新闻系统 | 6 |
| 4 | 故事系统 | 6 |
| 5 | 社交功能 (点赞/收藏/分享) | 6 |
| 6 | 评论系统 | 4 |
| 7 | 用户资料页 | 5 |
| 8 | 首页 | 4 |
| 9 | 管理后台 | 8 |
| 10 | 多语言支持 | 4 |

---

## 阶段 0: 项目初始化

**目标:** 搭建 Next.js 项目基础架构，配置所有依赖。

**推荐 Skills:**
- `nextjs-react-typescript` - Next.js 项目配置
- `shadcn-ui` - 组件库初始化
- `tailwind-css` - 样式配置
- `pnpm` - 包管理

### Task 0.1: 创建 Next.js 项目

**Step 1:** 创建项目
```bash
cd /Users/menchengye/Documents/workspace
pnpm create next-app@latest my-peace-net --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**Step 2:** Commit
```bash
git add -A && git commit -m "init: create Next.js project"
```

---

### Task 0.2: 安装 shadcn/ui

**Step 1:** 初始化 shadcn/ui
```bash
cd /Users/menchengye/Documents/workspace/my-peace-net
pnpm dlx shadcn@latest init
```

**Step 2:** 安装常用组件
```bash
pnpm dlx shadcn@latest add button card input textarea form dialog dropdown-menu avatar tabs toast
```

**Step 3:** Commit
```bash
git add -A && git commit -m "feat: setup shadcn/ui components"
```

---

### Task 0.3: 安装 Supabase 客户端

**Step 1:** 安装依赖
```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

**Step 2:** 创建 `src/lib/supabase/client.ts` - 浏览器端客户端
**Step 3:** 创建 `src/lib/supabase/server.ts` - 服务端客户端
**Step 4:** 创建 `src/lib/supabase/middleware.ts` - 中间件辅助

**Step 5:** Commit
```bash
git add -A && git commit -m "feat: setup Supabase client"
```

---

### Task 0.4: 安装状态管理库

**Step 1:** 安装 Zustand 和 TanStack Query
```bash
pnpm add zustand @tanstack/react-query
```

**Step 2:** 创建 `src/lib/stores/ui-store.ts` - UI 状态 store
**Step 3:** 创建 `src/providers/query-provider.tsx` - Query Provider

**Step 4:** Commit
```bash
git add -A && git commit -m "feat: setup Zustand and TanStack Query"
```

---

### Task 0.5: 配置环境变量

**Step 1:** 创建 `.env.local.example`
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Step 2:** 创建 `.env.local` (不提交)

**Step 3:** Commit
```bash
git add .env.local.example && git commit -m "chore: add env example file"
```

---

### Task 0.6: 配置项目结构

**Step 1:** 创建目录结构
```
src/
├── app/                 # Next.js App Router 页面
├── components/          # 可复用组件
│   ├── ui/             # shadcn/ui 组件
│   └── shared/         # 业务组件
├── lib/                # 工具库
│   ├── supabase/       # Supabase 客户端
│   └── stores/         # Zustand stores
├── hooks/              # 自定义 hooks
├── types/              # TypeScript 类型
└── providers/          # Context Providers
```

**Step 2:** Commit
```bash
git add -A && git commit -m "chore: setup project structure"
```

---

### Task 0.7: 创建基础布局

**Step 1:** 创建 `src/components/shared/header.tsx` - 导航栏
**Step 2:** 创建 `src/components/shared/footer.tsx` - 页脚
**Step 3:** 更新 `src/app/layout.tsx` - 根布局

**Step 4:** Commit
```bash
git add -A && git commit -m "feat: create base layout components"
```

---

### Task 0.8: 配置 Cloudflare Pages 部署

**Step 1:** 安装适配器
```bash
pnpm add @cloudflare/next-on-pages
```

**Step 2:** 更新 `next.config.js` 配置
**Step 3:** 创建 `wrangler.toml` 配置文件

**Step 4:** Commit
```bash
git add -A && git commit -m "chore: setup Cloudflare Pages deployment"
```

---

## 阶段 1: 数据库设计

**目标:** 在 Supabase 中创建所有数据表和 RLS 策略。

**推荐 Skills:**
- `supabase-postgres-best-practices` - 数据库设计和 RLS 策略

### Task 1.1: 创建 profiles 表

**SQL:**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  is_banned BOOLEAN DEFAULT false,
  banned_at TIMESTAMPTZ,
  ban_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Own update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 自动创建 profile 触发器
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

### Task 1.2: 创建 admins 表

**SQL:**
```sql
CREATE TABLE admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read own" ON admins FOR SELECT USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid());
$$ LANGUAGE sql SECURITY DEFINER;
```

---

### Task 1.3: 创建 news 表

**SQL:**
```sql
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published" ON news FOR SELECT USING (status = 'published');
CREATE POLICY "Admin manage" ON news FOR ALL USING (is_admin());
```

---

### Task 1.4: 创建 stories 表

**SQL:**
```sql
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
```

---

### Task 1.5: 创建社交功能表 (likes, bookmarks, follows)

**SQL:**
```sql
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

-- 关注表
CREATE TABLE follows (
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (follower_id, following_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON follows FOR SELECT USING (true);
CREATE POLICY "User manage own" ON follows FOR ALL USING (auth.uid() = follower_id);
```

---

### Task 1.6: 创建 comments 表

**SQL:**
```sql
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
```

---

## 阶段 2: 认证系统

**目标:** 实现用户注册、登录、登出功能。

**推荐 Skills:**
- `nextjs-react-typescript` - API 路由和中间件
- `shadcn-ui` - 表单组件
- `react-best-practices` - React hooks

### Task 2.1: 创建登录页面

**Files:** `src/app/(auth)/signin/page.tsx`

支持邮箱密码登录和 Google OAuth 登录。

---

### Task 2.2: 创建注册页面

**Files:** `src/app/(auth)/register/page.tsx`

邮箱注册表单，包含用户名设置。

---

### Task 2.3: 创建认证 API 路由

**Files:**
- `src/app/api/auth/callback/route.ts` - OAuth 回调
- `src/app/auth/confirm/route.ts` - 邮箱确认

---

### Task 2.4: 创建认证中间件

**Files:** `src/middleware.ts`

保护需要登录的路由，刷新 session。

---

### Task 2.5: 创建用户状态 hook

**Files:** `src/hooks/use-user.ts`

获取当前登录用户信息的 hook。

---

## 阶段 3: 新闻系统

**目标:** 实现新闻列表和详情页面。

**推荐 Skills:**
- `nextjs-react-typescript` - 页面和数据获取
- `shadcn-ui` - UI 组件
- `tailwind-css` - 样式
- `frontend-design` - 页面设计
- `react-best-practices` - 组件架构

### Task 3.1: 创建新闻列表页面

**Files:** `src/app/news/page.tsx`

展示已发布新闻列表，支持分页。

---

### Task 3.2: 创建新闻详情页面

**Files:** `src/app/news/[slug]/page.tsx`

展示新闻内容、点赞、收藏、分享、评论。

---

### Task 3.3: 创建新闻卡片组件

**Files:** `src/components/shared/news-card.tsx`

可复用的新闻卡片组件。

---

### Task 3.4: 创建新闻列表组件

**Files:** `src/components/shared/news-list.tsx`

新闻列表容器，支持加载更多。

---

### Task 3.5: 创建新闻数据 hooks

**Files:** `src/hooks/use-news.ts`

使用 TanStack Query 获取新闻数据。

---

### Task 3.6: 创建新闻类型定义

**Files:** `src/types/news.ts`

News 相关 TypeScript 类型。

---

## 阶段 4: 故事系统

**目标:** 实现用户故事投稿、列表和详情页面。

**推荐 Skills:**
- `nextjs-react-typescript` - 页面和数据获取
- `shadcn-ui` - 表单和 UI 组件
- `tailwind-css` - 样式
- `frontend-design` - 页面设计
- `react-best-practices` - 组件架构

### Task 4.1: 创建故事列表页面

**Files:** `src/app/stories/page.tsx`

展示已审核故事列表，支持分页和排序（最新/最热）。

---

### Task 4.2: 创建故事详情页面

**Files:** `src/app/stories/[id]/page.tsx`

展示故事内容、作者信息、点赞、收藏、分享、评论。

---

### Task 4.3: 创建故事发布页面

**Files:** `src/app/stories/new/page.tsx`

故事投稿表单，需要登录。

---

### Task 4.4: 创建故事卡片组件

**Files:** `src/components/shared/story-card.tsx`

---

### Task 4.5: 创建故事数据 hooks

**Files:** `src/hooks/use-stories.ts`

---

### Task 4.6: 创建故事类型定义

**Files:** `src/types/story.ts`

---

## 阶段 5: 社交功能

**目标:** 实现点赞、收藏、分享功能。

**推荐 Skills:**
- `shadcn-ui` - 按钮和交互组件
- `react-best-practices` - 状态管理
- `ui-ux-pro-max` - 交互设计

### Task 5.1: 创建点赞按钮组件

**Files:** `src/components/shared/like-button.tsx`

---

### Task 5.2: 创建收藏按钮组件

**Files:** `src/components/shared/bookmark-button.tsx`

---

### Task 5.3: 创建分享按钮组件

**Files:** `src/components/shared/share-button.tsx`

支持复制链接、Twitter、Facebook、微信二维码。

---

### Task 5.4: 创建关注按钮组件

**Files:** `src/components/shared/follow-button.tsx`

---

### Task 5.5: 创建社交功能 hooks

**Files:** `src/hooks/use-social.ts`

点赞、收藏、关注的 mutations。

---

### Task 5.6: 创建社交功能 API 路由

**Files:** `src/app/api/social/[action]/route.ts`

---

## 阶段 6: 评论系统

**目标:** 实现评论功能。

**推荐 Skills:**
- `shadcn-ui` - 表单和列表组件
- `react-best-practices` - 组件设计

### Task 6.1: 创建评论列表组件

**Files:** `src/components/shared/comments.tsx`

---

### Task 6.2: 创建评论表单组件

**Files:** `src/components/shared/comment-form.tsx`

---

### Task 6.3: 创建评论 hooks

**Files:** `src/hooks/use-comments.ts`

---

### Task 6.4: 创建评论 API 路由

**Files:** `src/app/api/comments/route.ts`

---

## 阶段 7: 用户资料页

**目标:** 实现用户资料页，展示用户信息和活动记录。

**推荐 Skills:**
- `shadcn-ui` - Tabs 和 Avatar 组件
- `tailwind-css` - 布局样式
- `frontend-design` - 页面设计
- `ui-ux-pro-max` - 用户体验

### Task 7.1: 创建用户资料页面

**Files:** `src/app/profile/[id]/page.tsx`

展示用户信息、粉丝数、关注数。

---

### Task 7.2: 创建资料页标签组件

**Files:** `src/components/shared/profile-tabs.tsx`

故事、收藏、点赞、评论四个标签页。

---

### Task 7.3: 创建用户故事列表组件

**Files:** `src/components/shared/user-stories.tsx`

---

### Task 7.4: 创建用户活动列表组件

**Files:** `src/components/shared/user-activity.tsx`

收藏、点赞、评论记录。

---

### Task 7.5: 创建用户数据 hooks

**Files:** `src/hooks/use-profile.ts`

---

## 阶段 8: 首页

**目标:** 重构首页，混合展示新闻和故事。

**推荐 Skills:**
- `frontend-design` - 首页设计
- `ui-ux-pro-max` - 视觉设计和布局
- `theme-factory` - 主题风格
- `shadcn-ui` - UI 组件
- `tailwind-css` - 响应式布局

### Task 8.1: 创建首页

**Files:** `src/app/page.tsx`

---

### Task 8.2: 创建 Hero 组件

**Files:** `src/components/shared/home-hero.tsx`

网站使命介绍和行动号召。

---

### Task 8.3: 创建新闻区块组件

**Files:** `src/components/shared/home-news-section.tsx`

---

### Task 8.4: 创建故事区块组件

**Files:** `src/components/shared/home-stories-section.tsx`

---

## 阶段 9: 管理后台

**目标:** 实现内容审核、用户管理、数据统计功能。

**推荐 Skills:**
- `shadcn-ui` - 表格、表单、图表组件
- `tailwind-css` - 后台布局
- `nextjs-react-typescript` - 路由保护
- `supabase-postgres-best-practices` - 数据查询优化

### Task 9.1: 创建管理后台布局

**Files:** `src/app/admin/layout.tsx`

管理员权限验证，侧边栏导航。

---

### Task 9.2: 创建管理后台首页

**Files:** `src/app/admin/page.tsx`

待审核内容统计、关键数据概览。

---

### Task 9.3: 创建新闻管理页面

**Files:** `src/app/admin/news/page.tsx`

新闻列表、新建、编辑、删除。

---

### Task 9.4: 创建故事审核页面

**Files:** `src/app/admin/stories/page.tsx`

待审核故事列表，通过/拒绝操作。

---

### Task 9.5: 创建评论审核页面

**Files:** `src/app/admin/comments/page.tsx`

---

### Task 9.6: 创建用户管理页面

**Files:** `src/app/admin/users/page.tsx`

用户列表、封禁/解封操作。

---

### Task 9.7: 创建数据统计页面

**Files:** `src/app/admin/stats/page.tsx`

用户增长、内容发布趋势图表。

---

### Task 9.8: 创建管理后台 API 路由

**Files:** `src/app/api/admin/[...path]/route.ts`

---

## 阶段 10: 多语言支持

**目标:** 实现中英文双语支持。

**推荐 Skills:**
- `nextjs-react-typescript` - i18n 配置
- `react-best-practices` - Context 使用

### Task 10.1: 安装 i18n 库

```bash
pnpm add next-intl
```

---

### Task 10.2: 配置 i18n

**Files:**
- `src/i18n.ts`
- `src/middleware.ts` (更新)
- `next.config.js` (更新)

---

### Task 10.3: 创建翻译文件

**Files:**
- `messages/zh.json`
- `messages/en.json`

---

### Task 10.4: 创建语言切换组件

**Files:** `src/components/shared/language-switcher.tsx`

---

## 实施建议

1. **按阶段顺序实施** - 阶段 0-1 必须先完成
2. **每个阶段完成后测试** - 确保功能正常再进入下一阶段
3. **优先级建议**:
   - 高优先级: 阶段 0-4 (基础架构和核心内容)
   - 中优先级: 阶段 5-8 (社交功能和首页)
   - 低优先级: 阶段 9-10 (管理后台和多语言)

## 依赖关系

```
阶段 0 (初始化) → 阶段 1 (数据库) → 阶段 2 (认证)
                                        ↓
                        阶段 3 (新闻) ←→ 阶段 4 (故事)
                                        ↓
                                   阶段 5 (社交)
                                        ↓
                                   阶段 6 (评论)
                                        ↓
                        阶段 7 (用户资料) → 阶段 8 (首页)
                                        ↓
                        阶段 9 (管理后台) → 阶段 10 (多语言)
```
