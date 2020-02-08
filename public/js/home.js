const getTaskBody = function (task, todoId) {
  const { item, id, isDone } = task;
  const [cName, check] = isDone ? ['class="lightText"', 'checked'] : ['', ''];
  const checkOnclick = `onclick = "toggleTaskDoneStatus(${id},${todoId})"`;
  const buttonOnclick = `onclick="performDelete(${id},'task',${todoId})`;
  return (
    `<span>
      <input type="checkbox" ${checkOnclick} ${check} />
     <span ${cName} contenteditable="true" onfocusout="renameTask(${id})" id="item${id}">
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

const appendTaskToTodo = (todo, text) => {
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

const searchItem = () => sendHttpGET('serveTodos', (text) => {
  const todoLists = JSON.parse(text);
  const searchedText = getElement('#searchBar').value;
  const todos = todoLists.filter((todo) => {
    return todo.title.includes(searchedText);
  });
  getElement('#todos').innerHTML = getTodosHtml(todos);
});
