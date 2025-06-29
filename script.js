const taskList = document.querySelector('.task-list');
const taskForm = document.querySelector('.task-form');
const taskInput = document.querySelector('.task-input');
const loadTasksButton = document.querySelector('.load-tasks');
const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('.nav-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `<span>${task.title}</span><span class="task-delete" data-id="${task.id}">✕</span>`;
        taskList.appendChild(li);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

async function fetchTasks() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
        if (!response.ok) throw new Error('Ошибка загрузки задач');
        const todos = await response.json();
        tasks = todos.map(todo => ({ id: Date.now() + todo.id, title: todo.title }));
        renderTasks();
    } catch (error) {
        console.error('Ошибка:', error);
        taskList.innerHTML = '<li>Не удалось загрузить задачи</li>';
}
}

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (taskInput.value.trim()) {
        tasks.push({ id: Date.now(), title: taskInput.value.trim() });
        renderTasks();
        taskInput.value = '';
    }
});

taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('task-delete')) {
        const id = parseInt(e.target.dataset.id);
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    }
});

loadTasksButton.addEventListener('click', fetchTasks);

hamburger.addEventListener('click', () => {
    navList.classList.toggle('active');
    hamburger.textContent = navList.classList.contains('active') ? '✕' : '☰';
});

// Начальная отрисовка
renderTasks();
