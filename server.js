require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 校验环境变量并初始化 Supabase 客户端
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('缺少环境变量：请在 .env 中配置 SUPABASE_URL 和 SUPABASE_ANON_KEY');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const VALID_PRIORITIES = ['高', '中', '低'];

// ============ API 路由 ============

// 获取任务列表，支持按优先级筛选，按创建时间倒序
app.get('/api/tasks', async (req, res) => {
  try {
    const { priority } = req.query;
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (priority && priority !== 'all' && VALID_PRIORITIES.includes(priority)) {
      query = query.eq('priority', priority);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ code: 0, data });
  } catch (err) {
    console.error('获取任务失败:', err);
    res.status(500).json({ code: 1, msg: err.message });
  }
});

// 新增任务
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, priority } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ code: 1, msg: '任务标题不能为空' });
    }
    if (!VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ code: 1, msg: '优先级必须为 高 / 中 / 低' });
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({ title: title.trim(), priority, completed: false })
      .select()
      .single();

    if (error) throw error;
    res.json({ code: 0, data });
  } catch (err) {
    console.error('新增任务失败:', err);
    res.status(500).json({ code: 1, msg: err.message });
  }
});

// 切换任务完成状态
app.put('/api/tasks/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: current, error: qErr } = await supabase
      .from('tasks')
      .select('completed')
      .eq('id', id)
      .single();
    if (qErr) throw qErr;

    const { data, error } = await supabase
      .from('tasks')
      .update({ completed: !current.completed })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json({ code: 0, data });
  } catch (err) {
    console.error('切换状态失败:', err);
    res.status(500).json({ code: 1, msg: err.message });
  }
});

// 删除任务
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
    res.json({ code: 0, msg: '删除成功' });
  } catch (err) {
    console.error('删除任务失败:', err);
    res.status(500).json({ code: 1, msg: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`智能任务管理系统已启动: http://localhost:${PORT}`);
});
