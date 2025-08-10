let todos = [];
let currentDate = new Date();
let selectedDate = null;

function createParticles() {
    const particlesContainer = document.querySelector('.floating-particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particlesContainer.appendChild(particle);
    }
}

function generateUniqueId() {
    return Date.now().toString() + Math.random().toString(36).substring(2, 6);
}

// Inisialisasi kalender
function initCalendar() {
    updateCalendarDisplay();
    createParticles();
    loadTodosFromLocalStorage();
    updateTodoList();
    updateStats();
}

function updateCalendarDisplay() {
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    document.getElementById('currentMonth').textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    generateCalendarDays();
}

function generateCalendarDays() {
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    const dayHeaders = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'day-header';
        header.textContent = day;
        grid.appendChild(header);
    });

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        const currentDateIter = new Date(startDate);
        currentDateIter.setDate(startDate.getDate() + i);

        dayElement.textContent = currentDateIter.getDate();

        if (currentDateIter.getMonth() !== currentDate.getMonth()) {
            dayElement.style.opacity = '0.3';
        }

        const dateStr = currentDateIter.toDateString();
        const hasTask = todos.some(todo => todo.date === dateStr);
        if (hasTask) dayElement.classList.add('has-task');

        if (currentDateIter.getTime() === today.getTime()) {
            dayElement.classList.add('today');
        }

        if (currentDateIter < today) {
            dayElement.classList.add('disabled-day');
            dayElement.style.opacity = '0.4';
            dayElement.style.pointerEvents = 'none';
        }

        if (selectedDate && currentDateIter.toDateString() === selectedDate.toDateString()) {
            dayElement.classList.add('selected');
        }

        dayElement.addEventListener('click', () => selectDate(currentDateIter));
        grid.appendChild(dayElement);
    }
}

function selectDate(date) {
    selectedDate = date;
    updateCalendarDisplay();
    const selectedEl = document.querySelector('.calendar-day.selected');
    if (selectedEl) selectedEl.style.animation = 'pulse 0.5s ease-in-out';
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendarDisplay();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendarDisplay();
}

function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    if (text === '') return;

    const todo = {
        id: generateUniqueId(),
        text: text,
        completed: false,
        date: selectedDate ? selectedDate.toDateString() : null,
        createdAt: new Date()
    };

    todos.push(todo);
    input.value = '';
    saveTodosToLocalStorage();
    updateTodoList();
    updateCalendarDisplay();
    updateStats();
}

function updateTodoList() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        const todoText = document.createElement('span');
        todoText.textContent = todo.text;
        if (todo.date) {
            todoText.textContent += ` (${new Date(todo.date).toLocaleDateString('id-ID')})`;
        }

        const actions = document.createElement('div');
        actions.className = 'todo-actions';

        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.textContent = todo.completed ? '↩️' : '✓';
        completeBtn.onclick = () => toggleTodo(todo.id);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '🗑️';
        deleteBtn.onclick = () => deleteTodo(todo.id);

        actions.appendChild(completeBtn);
        actions.appendChild(deleteBtn);

        todoItem.appendChild(todoText);
        todoItem.appendChild(actions);

        todoList.appendChild(todoItem);
    });
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodosToLocalStorage();
        updateTodoList();
        updateStats();
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodosToLocalStorage();
    updateTodoList();
    updateCalendarDisplay();
    updateStats();
}

function updateStats() {
    document.getElementById('totalTasks').textContent = todos.length;
    document.getElementById('completedTasks').textContent = todos.filter(t => t.completed).length;
    document.getElementById('pendingTasks').textContent = todos.filter(t => !t.completed).length;
}

function saveTodosToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodosFromLocalStorage() {
    const saved = localStorage.getItem('todos');
    if (saved) {
        todos = JSON.parse(saved);
        todos.forEach(todo => {
            if (todo.date) todo.date = new Date(todo.date).toDateString();
            if (todo.createdAt) todo.createdAt = new Date(todo.createdAt);
        });
    }
}

document.getElementById('todoInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    loadTodosFromLocalStorage();
    initCalendar();
    updateTodoList();
    updateStats();
});

