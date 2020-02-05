const createElement = (element) => document.createElement(element);

const selectElement = (element) => document.querySelector(element);

const selectAllElements = (element) => document.querySelectorAll(element);

const getElementById = (id) => document.getElementById(id);

const getElementsByName = (name) => document.getElementsByName(name);

const addItem = function () {
  const todoItems = getElementById('todoItems');
  const item = createElement('textarea');
  item.setAttribute('name', 'todoItem');
  item.rows = 3;
  item.cols = 40;
  todoItems.appendChild(item);
};

const deleteItem = function () {
  const todoItems = getElementById('todoItems');
  const items = getElementsByName('todoItem');
  if (items.length > 1) {
    todoItems.removeChild(items[items.length - 1]);
  }
};

const refreshHomePage = function (title, textareas) {
  const todoItems = selectElement('#todoItems');
  textareas[0].value = '';
  textareas.slice(1).forEach((textarea) => {
    todoItems.removeChild(textarea);
  });
  title.value = '';
};

const getContent = function () {
  const titleTag = selectElement('input');
  const textareas = Array.from(selectAllElements('textarea'));
  const tasks = textareas.map((textarea) => `tasks=${textarea.value}`);
  const title = `title=${titleTag.value}`;
  refreshHomePage(titleTag, textareas);
  return `${title}&${tasks.join('&')}`;
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
  getElementById('todos').innerHTML = getTodosHtml(JSON.parse(text));
};

const getHomePage = () => sendHttpGET('serveTodos', writeToBody);

const createTodo = () => sendHttpPOST('createTodo', getContent(), writeToBody);

const deleteTodo = (id) => sendHttpPOST('deleteTodo', `id=${id}`, writeToBody);

const deleteTask = (id) => sendHttpPOST('deleteTask', `id=${id}`, writeToBody);

const doneTodo = (id) => sendHttpPOST('todoDone', `id=${id}`, writeToBody);

const doneTask = (id) => sendHttpPOST('taskDone', `id=${id}`, writeToBody);

