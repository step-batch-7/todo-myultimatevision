const getTaskAsHtml = function (task) {
  const { item, id, isDone } = task;
  const className = isDone ? 'done' : 'undone';
  const name = isDone ? 'done' : 'mark';
  return (
    `<span class="task">
     <span>${item}</span>
     <div>
     <input type="button" value="${name}" onclick="toggleTaskDoneStatus(${id})" class="${className}"/>
     <input type="button" value="delete" onclick="deleteTask(${id})" />
     </div>
     </span><br/>`);
};

const getTodoAsHtml = function (todo) {
  const { id, title, tasks, isDone } = todo;
  const image = isDone ? 'tickBox.svg' : 'unTickBox.svg';
  return (
    `<div class='todo' id="${id}">
       <div class="header"> <b>${title.toUpperCase()}</b><div> 
       <img src="images/edit.svg"/>
       <img src="images/${image}" onclick="toggleTodoDoneStatus(${id})"/>
       <img src="images/trash.svg" onclick="deleteTodo(${id})"/>
       </div>
     </div>
     <ul>
       ${ tasks.map(getTaskAsHtml).join('\n')}
     </ul>
   </div>`);
};

const getTodosHtml = function (todoList) {
  return todoList.map(getTodoAsHtml).join('\n');
};

const createElement = (element) => document.createElement(element);

const getElement = (element) => document.querySelector(element);

const getAllElements = (element) => document.querySelectorAll(element);

const addItem = function () {
  const todoItems = getElement('#todoItems');
  const item = createElement('input');
  item.setAttribute('name', 'todoItem');
  item.setAttribute('type', 'text');
  item.setAttribute('placeholder', 'Enter Task');
  item.setAttribute('class', 'inputItems');
  item.setAttribute('autocomplete', 'off');
  todoItems.appendChild(item);
};

const deleteItem = function () {
  const todoItems = getElement('#todoItems');
  const items = getAllElements('.inputItems');
  if (items.length > 1) {
    todoItems.removeChild(items[items.length - 1]);
  }
};

const refreshHomePage = function (title, inputItems) {
  const todoItems = getElement('#todoItems');
  inputItems.forEach((inputItem) => todoItems.removeChild(inputItem));
  title.value = '';
};

const getContent = function () {
  const titleTag = getElement('input');
  const inputItems = Array.from(getAllElements('.inputItems'));
  const tasksTodo = inputItems.filter((inputItem) => inputItem.value !== '');
  const tasks = tasksTodo.map((task) => `tasks=${task.value}`);
  const title = `title=${titleTag.value}`;
  refreshHomePage(titleTag, inputItems);
  if (tasks.length !== 0) {
    return `${title}&${tasks.join('&')}`;
  }
  return title;
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

const createTodo = () => sendHttpPOST('createTodo', getContent(), writeToBody);

const deleteTodo = (id) => sendHttpPOST('deleteTodo', `id=${id}`, writeToBody);

const deleteTask = (id) => sendHttpPOST('deleteTask', `id=${id}`, writeToBody);

const toggleTodoDoneStatus = (id) =>
  sendHttpPOST('toggleTodoDoneStatus', `id=${id}`, writeToBody);

const toggleTaskDoneStatus = (id) =>
  sendHttpPOST('toggleTaskDoneStatus', `id=${id}`, writeToBody);
