# Markdown 编辑器实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为故事发布添加 Markdown 编辑器，支持富文本格式和图片上传

**Architecture:** 使用 Tiptap 编辑器 + Supabase Storage 存储图片，编辑器内容以 HTML 格式存储到数据库

**Tech Stack:** Tiptap, @tiptap/starter-kit, @tiptap/extension-image, Supabase Storage

---

## Task 1: 安装 Tiptap 依赖

**Step 1: 安装核心包**

```bash
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-placeholder
```

**Step 2: 验证安装**

```bash
pnpm list @tiptap/react
```

---

## Task 2: 配置 Supabase Storage

**Step 1: 创建存储桶**

在 Supabase Dashboard > Storage 中创建 `images` 桶，设置为 public。

**Step 2: 配置 RLS 策略**

```sql
-- 允许认证用户上传
CREATE POLICY "Users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- 允许公开读取
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');
```

---

## Task 3: 创建图片上传工具函数

**Files:**
- Create: `src/lib/utils/upload-image.ts`

**代码:**

```typescript
import { createClient } from '@/lib/supabase/client'

export async function uploadImage(file: File): Promise<string | null> {
  const supabase = createClient()
  const fileName = `${Date.now()}-${file.name}`

  const { error } = await supabase.storage
    .from('images')
    .upload(fileName, file)

  if (error) return null

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(fileName)

  return data.publicUrl
}
```

---

## Task 4: 创建 Tiptap 编辑器组件

**Files:**
- Create: `src/components/shared/rich-editor.tsx`

**功能:**
- 工具栏：加粗、斜体、标题、列表、引用、代码块
- 图片上传按钮
- 拖拽上传图片
- Markdown 快捷键支持

---

## Task 5: 创建编辑器样式

**Files:**
- Create: `src/components/shared/rich-editor.css`

**样式要点:**
- 编辑区域最小高度 200px
- 工具栏按钮样式
- 图片居中显示
- 代码块背景色

---

## Task 6: 修改故事发布页面

**Files:**
- Modify: `src/app/stories/new/page.tsx`

**改动:**
- 替换 Textarea 为 RichEditor
- 保存时获取 HTML 内容

---

## Task 7: 修改故事详情页渲染

**Files:**
- Modify: `src/app/stories/[id]/page.tsx`

**改动:**
- 使用 `dangerouslySetInnerHTML` 渲染 HTML 内容
- 添加 prose 样式类

---

## Task 8: 测试验证

- 创建新故事，测试格式功能
- 上传图片，验证显示
- 查看详情页渲染效果
