const getTaskBody = function (task) {
  const { item, id, isDone } = task;
  const [cName, check] = isDone ? ['class="lightText"', 'checked'] : ['', ''];
  const checkOnclick = `onclick = "toggleTaskDoneStatus(${id})"`;
  const buttonOnclick = `onclick="performDelete(${id},'task'`;
  return (
    `<span>
      <input type="checkbox" ${checkOnclick} ${check} />
     <span ${cName} contenteditable="true" onfocusout="renameTask(${id})" id="item${id}">
      ${item}</span>
     </span>
    <input class="deleteBtn" type="button" value="delete" ${buttonOnclick})" />`);
};

const getTaskAsHtml = function (task) {
  return (
    `<span class="task" id="task${task.id}">
      ${getTaskBody(task)}
     </span><br/>`);
};


const getTodoBody = function (todo) {
  const { id, title, tasks } = todo;
  const image = 'plus.svg';
  return (
    `<div class="header">
     <b contenteditable="true" onfocusout="renameTitle(${id})" id="title${id}">
      ${title}</b>
     <div>
      <img src="images/edit.svg" onclick="focusonInput(${id})" />
      <img src="images/${image}" onclick="addInput(${id})" />
      <img src="images/trash.svg" onclick="performDelete(${id},'todo')" />
     </div>
   </div>
   <div class="addItem" id="input${id}" style="display:none;">
    <input type="text" placeholder="Enter Task" class="inputTasks" required/>
    <input type="button" value="Add" class="" />
   </div>
      ${ tasks.map(getTaskAsHtml).join('\n')}`);
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

const writeToBody = text => {
  getElement('#todos').innerHTML = getTodosHtml(JSON.parse(text));
};

const loadTodos = () => sendHttpGET('serveTodos', writeToBody);

const createTodo = () => sendHttpPOST('createTodo', getContent(), text => {
  const todo = JSON.parse(text);
  const div = createElement('div');
  div.setAttribute('id', `todo${todo.id}`);
  div.innerHTML = getTodoBody(todo)
  getElement('#todos').prepend(div);
});

const deleteTodo = (id) => sendHttpPOST('deleteTodo', `id=${id}`, () => {
  getElement('#todos').removeChild(getElement(`#id${id}`));
});

const deleteTask = (id) => sendHttpPOST('deleteTask', `id=${id}`, () => {
  const task = getElement(`#task${id}`);
  const todo = task.parentElement;
  todo.removeChild(task);
});

const toggleTaskDoneStatus = (id) =>
  sendHttpPOST('toggleTaskDoneStatus', `id=${id}`, (text) => {
    const task = getElement(JSON.parse(text).id);
    const checkBox = task.previousSibling;
    if (checkBox.checked) {
      checkBox.setAttribute('checked', false);
      return;
    }
    checkBox.setAttribute('checked', true);
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

const addTask = function (id) {
  const todo = getElement(`#id${id}`);
  const inputBox = getElement(`#inputBox${id}`);
  const taskToAdd = inputBox.firstElementChild.value;
  getElement(`#input${id}`).removeChild(inputBox);
  sendHttpPOST('addTask', `id=${id}&&task=${taskToAdd}`, (text) => {
    const task = JSON.parse(text);
    const span = createElement('span');
    span.setAttribute('class', 'task');
    span.setAttribute('id', `task${task.id}`);
    span.innerHTML = getTaskBody(JSON.parse(task));
    todo.appendChild(span);
  });
};

const performDelete = (id, item) => {
  const isDeleted = confirm('do you really want to delete ?');
  if (isDeleted === true) {
    if (item === 'task') {
      deleteTask(id);
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


