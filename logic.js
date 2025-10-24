// ===== selectors =====
const toDoInput = document.querySelector(".todo-input");
const toDoBtn = document.querySelector(".todo-btn");
const toDoList = document.querySelector(".todo-list");

const standardThemeBtn = document.querySelector(".standard-theme");
const lightThemeBtn = document.querySelector(".light-theme");
const darkerThemeBtn = document.querySelector(".darker-theme");

// ===== state =====
let currentTheme = localStorage.getItem("savedTheme") || "standard";

// ===== init =====
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(currentTheme);
  restoreTodos();
});

toDoBtn.addEventListener("click", onAddTodo);
toDoList.addEventListener("click", onListClick);

standardThemeBtn.addEventListener("click", () => changeTheme("standard"));
lightThemeBtn.addEventListener("click", () => changeTheme("light"));
darkerThemeBtn.addEventListener("click", () => changeTheme("darker"));

// ===== theme =====
function changeTheme(name) {
  currentTheme = name;
  localStorage.setItem("savedTheme", name);
  applyTheme(name);
}

function applyTheme(name) {
  document.body.classList.remove("standard", "light", "darker");
  document.body.classList.add(name);
  // типінг-курсор у темній темі вже керується через body.darker у CSS
}

// ===== todos: storage helpers =====
function readTodos() {
  try {
    return JSON.parse(localStorage.getItem("todos")) || [];
  } catch {
    return [];
  }
}
function writeTodos(list) {
  localStorage.setItem("todos", JSON.stringify(list));
}

// ===== render helpers =====
function makeTodoItem(text) {
  const toDoDiv = document.createElement("div");
  toDoDiv.className = "todo";

  const li = document.createElement("li");
  li.className = "todo-item";
  li.textContent = text;

  const checkBtn = document.createElement("button");
  checkBtn.className = "check-btn";
  checkBtn.setAttribute("aria-label", "Mark as completed");
  checkBtn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i>';

  const delBtn = document.createElement("button");
  delBtn.className = "delete-btn";
  delBtn.setAttribute("aria-label", "Delete task");
  delBtn.innerHTML = '<i class="fas fa-trash" aria-hidden="true"></i>';

  toDoDiv.append(li, checkBtn, delBtn);
  return toDoDiv;
}

function appendTodoToDOM(text) {
  const node = makeTodoItem(text);
  toDoList.appendChild(node);
}

// ===== events =====
function onAddTodo(e) {
  e.preventDefault();
  const value = toDoInput.value.trim();

  if (!value) {
    toDoInput.classList.add("input-error");
    toDoInput.focus();
    return;
  }
  toDoInput.classList.remove("input-error");

  appendTodoToDOM(value);

  const todos = readTodos();
  todos.push(value);
  writeTodos(todos);

  toDoInput.value = "";
  toDoInput.focus();
}

function onListClick(e) {
  const target = e.target.closest("button");
  if (!target) return;

  if (target.classList.contains("delete-btn")) {
    const item = target.parentElement;
    const text = item.querySelector(".todo-item").textContent;
    item.classList.add("fall");
    item.addEventListener(
      "transitionend",
      () => {
        item.remove();
        const todos = readTodos().filter((t) => t !== text);
        writeTodos(todos);
      },
      { once: true }
    );
  }

  if (target.classList.contains("check-btn")) {
    target.parentElement.classList.toggle("completed");
  }
}

// ===== restore on load =====
function restoreTodos() {
  const todos = readTodos();
  todos.forEach(appendTodoToDOM);
}
