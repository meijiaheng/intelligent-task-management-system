# 智能任务管理系统

基于 **Node.js (Express) + Supabase (PostgreSQL)** 的简洁任务管理应用，中文界面。

## 功能

- ➕ 输入任务标题 + 选择优先级（高 / 中 / 低），回车或点击按钮添加
- 📋 任务列表显示标题、优先级标签、完成状态
- ✅ 每条任务有「完成 / 未完成」切换按钮、「删除」按钮
- 🔍 按优先级筛选（全部 / 高 / 中 / 低）
- 🕒 任务按创建时间倒序显示
- ~~ 已完成任务自动加删除线并置灰

## 项目结构

```
task-manager/
├── server.js            # Express 后端 + Supabase API
├── package.json
├── .env.example         # 环境变量示例
├── supabase_schema.sql  # Supabase 建表 SQL
└── public/
    ├── index.html       # 页面
    ├── style.css        # 样式
    └── app.js           # 前端逻辑
```

## 快速开始

### 1. 准备 Supabase

1. 登录 [Supabase](https://supabase.com/)，新建一个项目
2. 打开左侧 **SQL Editor**，粘贴执行 `supabase_schema.sql` 中的全部语句
3. 进入 **Project Settings -> API**，复制：
   - `Project URL`
   - `service_role key`（仅后端使用，切勿暴露到前端）

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=你的-service-role-key
PORT=3000
```

### 3. 安装依赖并启动

```bash
npm install
npm start
```

浏览器打开 http://localhost:3000 即可使用。

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET    | `/api/tasks?priority=high` | 获取任务列表（priority 可选：all/high/medium/low） |
| POST   | `/api/tasks` | 新增任务，body: `{ "title": "xxx", "priority": "high" }` |
| PUT    | `/api/tasks/:id/toggle` | 切换完成状态 |
| DELETE | `/api/tasks/:id` | 删除任务 |
