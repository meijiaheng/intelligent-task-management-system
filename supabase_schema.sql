-- ============================================================
-- 智能任务管理系统 - Supabase 建表脚本
-- 在 Supabase 控制台 -> SQL Editor 中执行以下语句
-- ============================================================

-- 创建 tasks 表
CREATE TABLE IF NOT EXISTS tasks (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('高', '中', '低')),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks (priority);

-- 允许匿名访问（使用 anon key 直连时需要）
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_anon" ON tasks FOR ALL USING (true) WITH CHECK (true);
