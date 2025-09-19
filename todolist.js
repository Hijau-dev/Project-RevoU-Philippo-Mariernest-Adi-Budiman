let todos = [];
let currentFilter = 'all';

document.getElementById('dateInput').valueAsDate = new Date();

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

function validateInput() {
    const todoText = document.getElementById('todoInput').value.trim();
    const todoDate = document.getElementById('dateInput').value;

    if (!todoText) {
        showError('Please enter a task!');
        return false;
    }

    if (todoText.length < 3) {
        showError('Task must be at least 3 characters long!');
        return false;
    }

    if (!todoDate) {
        showError('Please select a date!');
        return false;
    }

    return true;
}

function addTodo() {
    if (!validateInput()) return;

    const todoText = document.getElementById('todoInput').value.trim();
    const todoDate = document.getElementById('dateInput').value;

    const newTodo = {
        id: Date.now(),
        text: todoText,
        date: todoDate,
        completed: false,
        createdAt: new Date()
    };

    todos.push(newTodo);

    document.getElementById('todoInput').value = '';
    document.getElementById('dateInput').valueAsDate = new Date();

    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

function toggleComplete(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    renderTodos();
}

function filterTodos(filter) {
    currentFilter = filter;
    
    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector([data-filter-"${filter}"]).classList.add('active');
    
    renderTodos();
}

function getFilteredTodos() {
    switch(currentFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    }
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    const filteredTodos = getFilteredTodos();

    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<div class="no-todos">No tasks found!</div>';
        return;
    }

    filteredTodos.sort((a, b) => new Date(a.date) - new Date(b.date));

    todoList.innerHTML = filteredTodos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}">
            <div class="todo-content">
                <div class="todo-text">${todo.text}</div>
                <div class="todo-date">${formatDate(todo.date)}</div>
            </div>
            <div class="todo-actions">
                <button class="btn btn-complete" onclick="toggleComplete(${todo.id})">
                    ${todo.completed ? '↺' : '✓'}
                </button>
                <button class="btn btn-delete" onclick="deleteTodo(${todo.id})">✗</button>
            </div>
        </div>
    `).join('');
}

document.getElementById('todoInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

renderTodos();