const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearAllBtn = document.getElementById("clearAllBtn");
const taskCounter = document.getElementById("taskCounter");
const modeBtn = document.getElementById("modeBtn");
const searchInput = document.getElementById("searchInput");

// modal
const modal = document.getElementById("modal");
const modalMessage = document.getElementById("modalMessage");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");
const editInput = document.getElementById("editInput");

// data
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let modalAction = null;
let modalIndex = null;

// light mode 
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  modeBtn.textContent = "light ☀️";
}

// events
addTaskBtn.addEventListener("click", () => addTask());
taskInput.addEventListener("keypress", e => { if (e.key === "Enter") addTask(); });
searchInput.addEventListener("input", renderTasks);

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

clearAllBtn.addEventListener("click", () => showModal("do you want delete all tasks", "clear"));

modeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", isDark);
  modeBtn.textContent = isDark ? "light ☀️" : "dark 🌙";
});

// add task 
function addTask() {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = "";
  }
}

// view tasks
function renderTasks() {
  taskList.innerHTML = "";
  let filtered = tasks;

  if (currentFilter === "completed") filtered = tasks.filter(t => t.completed);
  if (currentFilter === "active") filtered = tasks.filter(t => !t.completed);

  const search = searchInput.value.toLowerCase();
  if (search) filtered = filtered.filter(t => t.text.toLowerCase().includes(search));

  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const span = document.createElement("span");
    span.textContent = task.text;

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const doneBtn = createButton("✓", "done-btn", () => toggleTask(index));
    const editBtn = createButton("✎", "edit-btn", () => showModal("edit this task:", "edit", index));
    const delBtn = createButton("✕", "delete-btn", () => showModal("do you want delete this task?", "delete", index));

    actions.append(doneBtn, editBtn, delBtn);
    li.append(span, actions);
    taskList.appendChild(li);
  });

  updateCounter();
}

// --------------------------
function createButton(text, className, onClick) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.className = className;
  btn.onclick = onClick;
  return btn;
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function updateCounter() {
  const activeTasks = tasks.filter(t => !t.completed).length;
  taskCounter.textContent = activeTasks === 0 ? "zero task to do , go to new task" : `you have ${activeTasks} task not completed`;
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// modal
function showModal(message, action, index = null) {
  modal.style.display = "flex";
  modalMessage.textContent = message;
  modalAction = action;
  modalIndex = index;
if (action === "edit") {
    editInput.style.display = "block";
    editInput.value = tasks[index].text;
  } else {
    editInput.style.display = "none";
  }
}

confirmBtn.onclick = () => {
  if (modalAction === "delete" && modalIndex !== null) {
    tasks.splice(modalIndex, 1);
  } else if (modalAction === "edit" && modalIndex !== null) {
    tasks[modalIndex].text = editInput.value.trim() || tasks[modalIndex].text;
  } else if (modalAction === "clear") {
    tasks = [];
  }
  saveTasks();
  renderTasks();
  modal.style.display = "none";
};

cancelBtn.onclick = () => modal.style.display = "none";

// start
renderTasks(); 
