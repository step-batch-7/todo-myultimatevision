const getTaskBody = function (task, todoId) {
  const { item, id, isDone } = task;
  const [check, cname] = isDone ? ['checked', 'lightText'] : ['', ''];
  const checkOnclick = `onclick = "toggleTaskDoneStatus(${id},${todoId})"`;
  const buttonOnclick = `onclick="performDelete(${id},'task',${todoId})`;
  return (
    `<span>
      <input type="checkbox" ${checkOnclick} ${check} />
     <span class="${cname}" contenteditable="true" onfocusout="renameTask(${id})" id="item${id}">
      ${item}</span>
     </span>
    <input class="deleteBtn" type="button" value="delete" ${buttonOnclick}" />`);
};

const getTaskAsHtml = function (todoId, task) {
  return (
    `<span class="task" id="task${task.id}">
      ${getTaskBody(task, todoId)}
     </span><br/>`);
};

const getTodoBody = function (todo) {
  const { id, title, tasks } = todo;
  const tasksDone = tasks.filter((task) => task.isDone)
  const image = 'plus.svg';
  return (
    `<div class="header">
    <b id="counter${id}">${tasksDone.length}/${tasks.length}</b>
     <b contenteditable="true" onfocusout="renameTitle(${id})" class="title" id="title${id}">
      ${title}</b>
     <div>
      <img src="images/edit.svg" onclick="focusonInput(${id})" />
      <img src="images/${image}" onclick="addInput(${id})" />
      <img src="images/trash.svg" onclick="performDelete(${id},'todo')" />
     </div>
   </div>
   <div class="addItem" id="input${id}" style="display:none;">
    <input type="text" placeholder="Enter Task" class="inputTasks" required/>
    <input type="button" value="Add" class="button" onclick="addTask(${id})"/>
   </div>
      ${ tasks.map(task => getTaskAsHtml(id, task)).join('\n')}`);
}

const getTodoAsHtml = function (todo) {
  return (
    `<div class='todo' id="id${todo.id}">
       ${getTodoBody(todo)}
     </div>`);
};

const getTodosHtml = function (todoList) {
  return todoList.map(getTodoAsHtml).join('\n');
};

const createElement = (element) => document.createElement(element);

const getElement = (element) => document.querySelector(element);

const getAllElements = (element) => document.querySelectorAll(element);

const getContent = function () {
  const title = getElement('input');
  const inputTitle = title.value;
  title.value = '';
  return `title=${inputTitle}`;
};

const sendHttpPOST = (url, message, callback) => {
  const req = new XMLHttpRequest();
  req.onload = function () {
    if (this.status === 200) {
      callback(this.responseText);
    }
  };
  req.open('POST', url);
  req.send(message);
};

const sendHttpGET = (url, callback) => {
  const req = new XMLHttpRequest();
  req.onload = function () {
    if (this.status === 200) {
      callback(this.responseText);
    }
  };
  req.open('GET', url);
  req.send();
};

const loadTodos = () => sendHttpGET('serveTodos', text => {
  getElement('#todos').innerHTML = getTodosHtml(JSON.parse(text));
});

const createTodo = () => sendHttpPOST('createTodo', getContent(), text => {
  const todo = JSON.parse(text);
  const div = createElement('div');
  div.setAttribute('class', 'todo');
  div.setAttribute('id', `id${todo.id}`);
  div.innerHTML = getTodoBody(todo)
  getElement('#todos').prepend(div);
});

const deleteTodo = (id) => sendHttpPOST('deleteTodo', `id=${id}`, () => {
  getElement('#todos').removeChild(getElement(`#id${id}`));
});

const deleteTask = (id, todoId) => {
  sendHttpPOST('deleteTask', `id=${id}`, (text) => {
    const { isDone } = JSON.parse(text);
    const task = getElement(`#task${id}`);
    const counter = getElement(`#counter${todoId}`);
    const [tasksDone, totalTasks] = counter.innerText.split('/');
    const todo = getElement(`#id${todoId}`);
    todo.removeChild(task);
    const tasksCompleted = isDone ? +tasksDone - 1 : tasksDone;
    counter.innerText = `${tasksCompleted}/${+totalTasks - 1}`
  });
};

const toggleTaskDoneStatus = (id, todoId) =>
  sendHttpPOST('toggleTaskDoneStatus', `id=${id}`, (text) => {
    const { isDone } = JSON.parse(text);
    const counter = getElement(`#counter${todoId}`);
    const [tasksDone, totalTasks] = counter.innerText.split('/');
    const tasksCompleted = +tasksDone + (isDone ? 1 : -1);
    counter.innerText = `${tasksCompleted}/${totalTasks}`
    const task = getElement(`#task${id}`);
    if (isDone) {
      task.classList.add('lightText');
      return;
    }
    task.classList.remove('lightText');
  });

const renameTitle = (id) => {
  const title = getElement(`#title${id}`);
  const data = `id=${id}&title=${title.innerText}`;
  sendHttpPOST('renameTitle', data, () => {
    title.innerText = title.innerText;
  });
};

const renameTask = (id) => {
  const task = getElement(`#item${id}`);
  const item = task.innerText;
  const data = `id=${id}&task=${item}`;
  sendHttpPOST('renameTask', data, () => {
    task.innerText = item;
  });
};

const appendTaskToTodo = (id, text) => {
  const todo = getElement(`#id${id}`);
  const task = JSON.parse(text);
  const span = createElement('span');
  span.setAttribute('class', 'task');
  span.setAttribute('id', `task${task.id}`);
  span.innerHTML = getTaskBody(task, id);
  todo.appendChild(span);
}

const addTask = function (id) {
  const inputBox = getElement(`#input${id}`).firstElementChild;
  const taskToAdd = inputBox.value;
  inputBox.value = '';
  const counter = getElement(`#counter${id}`);
  const [tasksDone, totalTasks] = counter.innerText.split('/');
  counter.innerText = `${+tasksDone}/${+totalTasks + 1}`;
  const appendTask = appendTaskToTodo.bind(null, id)
  sendHttpPOST('addTask', `id=${id}&&task=${taskToAdd}`, appendTask);
};

const performDelete = (id, item, todoId) => {
  const isDeleted = confirm('do you really want to delete ?');
  if (isDeleted === true) {
    if (item === 'task') {
      deleteTask(id, todoId);
      return;
    }
    deleteTodo(id);
  }
};

const addInput = (id) => {
  const inputArea = getElement(`#input${id}`);
  inputArea.style.display = inputArea.style.display === 'block' ? 'none' : 'block'
};

const focusonInput = (id) => {
  const title = getElement(`#title${id}`);
  title.focus();
};

const hideTodo = (todo) => todo.classList.add('hidden');
const unHideTodo = (todo) => todo.classList.remove('hidden');

const searchByTitle = (todo, searchedText) => {
  const title = todo.querySelector(`.title`).innerText;
  const toggleHide = title.includes(searchedText) ? unHideTodo : hideTodo;
  toggleHide(todo);
};

const searchByTask = (todo, searchedText) => {
  const tasks = Array.from(todo.querySelectorAll(`.task`));
  const filteredTasks = tasks.filter(task => task.innerText.includes(searchedText));
  const toggleHide = filteredTasks.length !== 0 ? unHideTodo : hideTodo;
  toggleHide(todo);
};

const searchItem = () => {
  const searchedText = getElement('#searchBar').value;
  const searchedItem = getElement('#searchedItem').value;
  const search = searchedItem === 'title' ? searchByTitle : searchByTask;
  const todos = Array.from(getAllElements('.todo'));
  todos.forEach(todo => search(todo, searchedText));
};

