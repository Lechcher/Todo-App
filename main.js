// Lấy danh sách công việc từ localStorage
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
// Hàm lưu danh sách công việc vào localStorage
const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Truy cập phần tử trong DOM
const taskList = document.querySelector(".tasks__list");
const todoForm = document.querySelector(".todo__form");
const todoInput = document.querySelector(".todo__input");

// Hàm ngăn ngừa XSS
const escapeHTML = (html) => {
    const div = document.createElement("div");
    div.innerText = html; // Gán nội dung vào thẻ div để tự động escape các ký tự HTML
    return div.innerHTML; // Trả về nội dung đã được escape
}

// Hàm hiển thị danh sách công việc
const renderTasks = () => {
    if(tasks.length === 0) {
        taskList.innerHTML = `<li class="empty__task">No tasks available.</li>`;
        return;
    }

    const html = tasks.map((task, index) => `
<li class="${task.completed ? "tasks__item tasks__item--completed" : 'tasks__item'}" task-index="${index}">
<span class="tasks__title">${escapeHTML(task.title)}</span>
<div class="tasks__actions">
  <button class="tasks__btn tasks__btn--edit">EDIT</button>
  <button class="tasks__btn tasks__btn--mark-done">${task.completed ? 'MARK AS UNDONE' : 'MARK AS DONE'}</button>
  <button class="tasks__btn tasks__btn--delete">DELETE</button>
</div>
</li>
`).join("");

    taskList.innerHTML = html;
}

// Hàm kiểm tra trùng lặp
const isDuplicateTask = (newTitle, excludeIndex = -1) => tasks.some(
    (task, index) =>
        task.title.toLowerCase() === newTitle.toLowerCase() &&
        excludeIndex !== index
);

// Hàm thêm công việc mới
const addTask = (e) => {
    e.preventDefault();
    const value = todoInput.value.trim();
    if (!value) {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        title: value,
        completed: false
    }

    tasks.unshift(newTask);
    renderTasks();
    saveTasks();
    todoInput.value = "";
};

// Hàm xử lý các hành động trên công việc
const editTask = (e) => {
    const taskItem = e.target.closest(".tasks__item");
    const taskIndex = +taskItem.getAttribute("task-index");
    const task = tasks[taskIndex];

    if (e.target.closest(".tasks__btn--edit")) {
        let newTitle = prompt("Enter the new task title: ", task.title);

        if (newTitle === null) return;

        if (!newTitle) {
            alert("Please enter a task title!");
            return;
        }

        if (isDuplicateTask(newTitle, taskIndex)) {
            alert("Task title already exists! Please use a different task title!");
            return;
        }

        task.title = newTitle;
        renderTasks();
        saveTasks();
        return;
    } if (e.target.closest(".tasks__btn--mark-done")) {
        if (task.completed) {
            task.completed = false;
            renderTasks();
            saveTasks();
        } else {
            task.completed = true;
            renderTasks();
            saveTasks();
        }
        return;
    } else if (e.target.closest(".tasks__btn--delete")) {
        if (confirm("Are you sure you want to delete this task?")) {
            tasks.splice(taskIndex, 1);
            renderTasks();
            saveTasks();
        }
        return;
    }
}

// Thêm công việc mới
todoForm.addEventListener("submit", addTask);
// Xử lý các hành động trên danh sách công việc
taskList.addEventListener("click", editTask);
// Hiển thị danh sách công việc
renderTasks();