const searchBox = document.querySelector(".search-box");
const deleteModal = document.querySelector(".deleteModal");
const taskList = document.querySelector(".taskList");

// UTILITY
const show = (elem) => {
  elem.classList.remove("hidden");
};
const hide = (elem) => {
  elem.classList.add("hidden");
};
const getTasks = () => {
  return JSON.parse(window.localStorage.getItem("tasks"));
};
const setTasks = (tasks) => {
  window.localStorage.setItem("tasks", JSON.stringify(tasks));
};
// READ
const renderTask = (taskData, msg = "You have no tasks left. Congrats 🎉") => {
  if (!taskData || taskData.length === 0) {
    taskList.innerHTML = `<div class='w-full h-[172px] flex items-center justify-center italic font-bold text-gray-400'><p class='text-center'>${msg}</p></div>`;
    return;
  }
  taskList.innerHTML = "";
  taskData.forEach((task) => {
    createTask(task);
  });
};

// CREATE
const addToLocalStorage = (task) => {
  const taskData = getTasks() || [];
  taskData.push(task);
  setTasks(taskData);
};
const createTask = (task) => {
  const taskElem = `
    <div class="taskItem flex gap-3 justify-between items-center py-2">
    <div class="flex grow">
        <p class="taskName">${task}</p>
        <input
        type="text"
        size="1"
        name="taskName"
        class="taskEditor hidden grow"
        />
    </div>
    <div class="flex gap-3">
        <button
        type="button"
        class="rounded-md px-3 py-1 font-bold bg-orange-400 text-white"
        onclick="showEditor(event)"
        >
        <i class="fa-regular fa-pen-to-square"></i>
        </button>
        <button
        type="button"
        class="saveBtn hidden rounded-md px-3 py-1 font-bold bg-orange-400 text-white"
        onclick="saveTask()"
        >
        <i class="fa-regular fa-floppy-disk"></i>
        </button>
        <button
        type="button"
        class="deleteBtn rounded-md px-3 py-1 font-bold bg-orange-400 text-white"
        onclick="showDeleteModal(event);"
        >
        <i class="fa-solid fa-trash"></i>
        </button>
    </div>
    </div>
    `;
  taskList.innerHTML += taskElem;
};
const clearInput = () => {
  searchBox.value = "";
};

const handleCreate = (event) => {
  const newTask = event.target.previousElementSibling.firstElementChild.value;
  addToLocalStorage(newTask);
  renderTask(getTasks());
  clearInput();
};

// UPDATE
let toBeUpdatedTask,
  toBeUpdatedTaskIndex,
  taskEditor,
  taskName,
  editBtn,
  saveBtn;
const showEditor = (event) => {
  editBtn = event.target;

  toBeUpdatedTask = editBtn.closest(".taskItem");
  toBeUpdatedTaskIndex = Array.prototype.indexOf.call(
    taskList.children,
    toBeUpdatedTask
  );

  taskEditor = toBeUpdatedTask.querySelector(".taskEditor");
  show(taskEditor);
  taskEditor.focus();

  taskName = taskEditor.previousElementSibling;
  hide(taskName);
  taskEditor.value = taskName.innerHTML;

  saveBtn = editBtn.nextElementSibling;
  hide(editBtn);
  show(saveBtn);
};

const saveTask = () => {
  const newTaskName = taskEditor.value;

  const taskData = getTasks();
  taskData.splice(toBeUpdatedTaskIndex, 1, newTaskName);
  setTasks(taskData);

  hide(taskEditor);
  taskName.innerHTML = newTaskName;
  show(taskName);

  hide(saveBtn);
  show(editBtn);
};

// DELETE
let toBeDeletedTask;

const showDeleteModal = (event) => {
  show(deleteModal);
  toBeDeletedTask = event.target.closest(".taskItem");
};

const removeFromLocalStorage = (task) => {
  const taskData = getTasks();
  const taskIndex = Array.prototype.indexOf.call(taskList.children, task);
  taskData.splice(taskIndex, 1);
  setTasks(taskData);
};

const handleDelete = () => {
  removeFromLocalStorage(toBeDeletedTask);
  renderTask(getTasks());
  hide(deleteModal);
  toBeDeletedTask = null;
};

// SEARCH
const search = (event) => {
  console.log(event);
  const query = event.target.value;
  const regex = new RegExp(query, "i");
  const taskData = getTasks();
  const result = taskData.filter((task) => {
    return regex.test(task);
  });
  renderTask(
    result,
    `No task found <span class='not-italic'>&nbsp;😅😅😅</span><br>
          <button
            type='button'
            class='rounded-md inline-block mt-2 px-3 py-2 font-bold bg-orange-400 text-white'
            onclick='document.querySelector(".addBtn").click()'
          >Add</button> it instead?`
  );
};

// Run when page load
clearInput();
renderTask(getTasks());
