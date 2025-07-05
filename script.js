let todos = [];
let currentDate = new Date();
let selectedDate = null;
let todoIdCounter = 0;

// Inisialisasi partikel mengambang
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

// Inisialisasi kalender
function initCalendar() {
    updateCalendarDisplay();
    createParticles();
}

// Update tampilan kalender
function updateCalendarDisplay() {
    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    document.getElementById('currentMonth').textContent =
        `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    generateCalendarDays();
}

// Generate hari-hari dalam kalender
function generateCalendarDays() {
    const grid = document.getElementById('calendarGrid');

    // Hapus hari-hari sebelumnya (kecuali header)
    const dayHeaders = grid.querySelectorAll('.day-header');
    grid.innerHTML = '';
    dayHeaders.forEach(header => grid.appendChild(header));

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    for (let i = 0; i < 42; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        const currentDateIter = new Date(startDate);
        currentDateIter.setDate(startDate.getDate() + i);

        dayElement.textContent = currentDateIter.getDate();

        if (currentDateIter.getMonth() !== currentDate.getMonth()) {
            dayElement.style.opacity = '0.3';
        }

        // Cek apakah ada tugas pada tanggal ini
        const dateStr = currentDateIter.toDateString();
        const hasTask = todos.some(todo => todo.date === dateStr);
        if (hasTask) {
            dayElement.classList.add('has-task');
        }

        // Cek apakah ini tanggal yang dipilih
        if (selectedDate && currentDateIter.toDateString() === selectedDate.toDateString()) {
            dayElement.classList.add('selected');
        }

        dayElement.addEventListener('click', () => selectDate(currentDateIter));

        grid.appendChild(dayElement);
    }
}

// Pilih tanggal
function selectDate(date) {
    selectedDate = date;
    updateCalendarDisplay();

    // Animasi selection
    const selectedEl = document.querySelector('.calendar-day.selected');
    if (selectedEl) {
        selectedEl.style.animation = 'pulse 0.5s ease-in-out';
    }
}

// Navigasi bulan
function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendarDisplay();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendarDisplay();
}

// Tambah tugas baru
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();

    if (text === '') return;

    const todo = {
        id: todoIdCounter++,
        text: text,
        completed: false,
        date: selectedDate ? selectedDate.toDateString() : null,
        createdAt: new Date()
    };

    todos.push(todo);
    input.value = '';

    updateTodoList();
    updateCalendarDisplay();
    updateStats();
}

// Update daftar tugas
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

// Toggle status tugas
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        updateTodoList();
        updateStats();
    }
}

// Hapus tugas
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    updateTodoList();
    updateCalendarDisplay();
    updateStats();
}

// Update statistik
function updateStats() {
    document.getElementById('totalTasks').textContent = todos.length;
    document.getElementById('completedTasks').textContent = todos.filter(t => t.completed).length;
    document.getElementById('pendingTasks').textContent = todos.filter(t => !t.completed).length;
}

// Event listener untuk Enter key
document.getElementById('todoInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', function () {
    initCalendar();
    updateTodoList();
    updateStats();
});