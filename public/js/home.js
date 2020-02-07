let id, itemToDelete;
const getTaskAsHtml = function (task) {
  const { item, id, isDone } = task;
  const [displayTag, check] = isDone ? ['strike', 'checked'] : ['span', ''];
  const checkOnclick = `onclick = "toggleTaskDoneStatus(${id})"`;
  const buttonOnclick = `onclick="getDeletePop(${id},'task'`;
  return (
    `<span class="task">
      <span>
        <input type="checkbox" ${checkOnclick} ${check} />
        <${displayTag}>${item}</${displayTag}>
      </span>
      <div>
        <input class="delete" type="button" value="delete" ${buttonOnclick})" />
      </div>
     </span><br/>`);
};

const getTodoAsHtml = function (todo) {
  const { id, title, tasks } = todo;
  const tasksDone = tasks.filter(task => task.isDone);
  const image = 'plus.svg';
  return (
    `<div class='todo' id="id${id}">
       <div class="header">
         <b>${tasksDone.length}/${tasks.length}</b>
         <b>${title}</b>
         <div> 
           <img src="images/edit.svg"/>
           <img src="images/${image}" onclick="addInput(${id})"/>
           <img src="images/trash.svg" onclick="getDeletePop(${id},'todo')"/>
         </div>
       </div>
       <div class="addItem" id="input${id}"></div>
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

const addTask = function (id) {
  const task = getElement(`#input${id}`).firstElementChild.value;
  sendHttpPOST('addTask', `id=${id}&&task=${task}`, writeToBody);

};

const getDeletePop = (itemId, item) => {
  getElement('#popUp').style.visibility = 'visible';
  id = itemId;
  itemToDelete = item;
};

const closePopUp = function () {
  getElement('#popUp').style.visibility = 'hidden';
};

const performDelete = () => {
  if (itemToDelete === 'task') {
    deleteTask(id);
    closePopUp();
    return;
  }
  deleteTodo(id);
  closePopUp();
};

const addButton = (taskAdder, id) => {
  const button = createElement('input');
  button.setAttribute('type', 'button');
  button.setAttribute('value', 'add');
  button.setAttribute('onclick', `addTask(${id})`);
  taskAdder.appendChild(button);
};

const addInputBox = (taskAdder) => {
  const item = createElement('input');
  item.setAttribute('type', 'text');
  item.setAttribute('placeholder', 'Enter Task');
  item.setAttribute('class', 'inputTasks');
  item.setAttribute('autocomplete', 'off');
  taskAdder.appendChild(item);
};

const addInput = (id) => {
  const taskAdder = getElement(`#input${id}`);
  addInputBox(taskAdder);
  addButton(taskAdder, id);
};

