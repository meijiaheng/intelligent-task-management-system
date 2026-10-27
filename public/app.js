const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const stats = document.getElementById('stats');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

// 中文优先级 -> CSS class 映射
const prioClass = { '高': 'priority-high', '中': 'priority-medium', '低': 'priority-low' };

// 加载任务
async function loadTasks() {
  const url = currentFilter === 'all'
    ? '/api/tasks'
    : `/api/tasks?priority=${encodeURIComponent(currentFilter)}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.code !== 0) {
    alert('加载任务失败：' + json.msg);
    return;
  }
  renderTasks(json.data);
}

// 渲染任务
function renderTasks(tasks) {
  taskList.innerHTML = '';
  if (!tasks.length) {
    emptyState.style.display = 'block';
    stats.textContent = '';
    return;
  }
  emptyState.style.display = 'none';

  const doneCount = tasks.filter(t => t.completed).length;
  stats.textContent = `共 ${tasks.length} 项 · 已完成 ${doneCount} 项`;

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');

    const badge = document.createElement('span');
    badge.className = 'priority-badge ' + (prioClass[task.priority] || 'priority-medium');
    badge.textContent = task.priority;

    const title = document.createElement('span');
    title.className = 'task-title';
    title.textContent = task.title;

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-btn ' + (task.completed ? 'done' : 'undone');
    toggleBtn.textContent = task.completed ? '已完成' : '未完成';
    toggleBtn.onclick = () => toggleTask(task.id);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '删除';
    deleteBtn.onclick = () => deleteTask(task.id);

    li.append(badge, title, toggleBtn, deleteBtn);
    taskList.appendChild(li);
  });
}

// 添加任务
async function addTask() {
  const title = taskInput.value.trim();
  const priority = prioritySelect.value;
  if (!title) {
    alert('请输入任务内容');
    taskInput.focus();
    return;
  }
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, priority })
  });
  const json = await res.json();
  if (json.code !== 0) {
    alert('添加失败：' + json.msg);
    return;
  }
  taskInput.value = '';
  taskInput.focus();
  loadTasks();
}

// 切换完成状态
async function toggleTask(id) {
  const res = await fetch(`/api/tasks/${id}/toggle`, { method: 'PUT' });
  const json = await res.json();
  if (json.code !== 0) {
    alert('操作失败：' + json.msg);
    return;
  }
  loadTasks();
}

// 删除任务
async function deleteTask(id) {
  if (!confirm('确定要删除这个任务吗？')) return;
  const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  const json = await res.json();
  if (json.code !== 0) {
    alert('删除失败：' + json.msg);
    return;
  }
  loadTasks();
}

// 事件绑定
addBtn.onclick = addTask;
taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

filterBtns.forEach(btn => {
  btn.onclick = () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.priority;
    loadTasks();
  };
});

// 初始化
loadTasks();
