const fs = require('fs');
const querystring = require('querystring');
const { App } = require('./app');
const { Todo, Task } = require('./todo.js');
const CONTENT_TYPES = require('./types');
const { loadTemplate } = require('./viewTemplate');

const STATIC_FOLDER = `${__dirname}/../public`;
const DATA_STORE_PATH = './data/todos.json';
let id = new Date().getTime();

const getId = () => ++id;

const loadTodos = function () {
  if (fs.existsSync(DATA_STORE_PATH)) {
    return JSON.parse(fs.readFileSync(DATA_STORE_PATH, 'utf8') || '[]');
  }
  return [];
};

const createTask = function (todo, todoItem) {
  const { item, id } = todoItem;
  todo.addTask(new Task(item, id));
};

const todoList = loadTodos().map((todo) => {
  const { title, id, tasks } = todo;
  const newTodo = new Todo(title, id);
  tasks.forEach((todoItem) => createTask(newTodo, todoItem));
  return newTodo;
});

const isStatusNotOk = function (stat) {
  return !stat || !stat.isFile();
};

const serveStaticFile = (res, url, next) => {
  const path = `${STATIC_FOLDER}${url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (isStatusNotOk(stat)) {
    return next();
  }
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const html = fs.readFileSync(path);
  res.setHeader('Content-Type', CONTENT_TYPES[extension]);
  res.end(html);
};

const saveTodo = function () {
  fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(todoList), 'utf8');
};

const getIndecies = id => {
  const todoIndex = todoList.findIndex((todo) => {
    return todo.tasks.some(task => id === task.id);
  });
  console.log(todoList, todoIndex);

  const taskIndex = todoList[todoIndex].tasks.findIndex(task => id === task.id);
  return [todoIndex, taskIndex];
};

const deleteTask = function (req, res) {
  const { id } = req.body;
  const [todoIndex, taskIndex] = getIndecies(+id);
  todoList[todoIndex].tasks.splice(taskIndex, 1);
  saveTodo();
  serveHomePage(res, '/home.html');
};

const getTodoIndex = (id) => todoList.findIndex((todo) => todo.id === id);

const deleteTodo = function (req, res) {
  const { id } = req.body;
  const todoIndex = getTodoIndex(+id);
  todoList.splice(todoIndex, 1);
  saveTodo();
  serveHomePage(res, '/home.html');
};

const createTodo = function (req, res) {
  const { title, tasks } = req.body;
  const newTodo = new Todo(title, getId());
  const tasksTodo = tasks instanceof Array ? tasks : [tasks];
  tasksTodo.forEach((task) => createTask(newTodo, { item: task, id: getId() }));
  todoList.unshift(newTodo);
  saveTodo();
  serveHomePage(res, '/home.html');
};

const generateTodos = function () {
  const noTodosHtml = '<div class="todo">No tasks yet to show</div>';
  const todosHtml = todoList.map((todo) => todo.toHtml()).join('\n');
  return todosHtml ? todosHtml : noTodosHtml;
};

const serveHomePage = function (res, url) {
  const todos = generateTodos();
  const html = loadTemplate(url, { todos });
  res.setHeader('content-Type', CONTENT_TYPES.html);
  res.setHeader('content-Length', html.length);
  res.end(html);
};

const getUrl = function (url) {
  return url === '/' ? '/home.html' : url;
};

const isHomePage = function (url) {
  return url === '/home.html';
};

const servePage = function (req, res, next) {
  const url = getUrl(req.url);
  if (isHomePage(url)) {
    return serveHomePage(res, url);
  }
  return serveStaticFile(res, url, next);
};

const notFound = function (req, res) {
  res.writeHead(404, 'method not found');
  res.end('Not Found');
};

const methodNotAllowed = function (req, res) {
  res.writeHead(405, 'method not found');
  res.end('Method Not Found');
};

const readBody = (request, response, next) => {
  let body = '';
  request.on('data', data => {
    body += data;
  });
  request.on('end', () => {
    request.body = querystring.parse(body);
    next();
  });
};

const app = new App();

app.use(readBody);
app.post('/createTodo', createTodo);
app.post('/deleteTodo', deleteTodo);
app.post('/deleteTask', deleteTask);
app.get('', servePage);
app.get('', notFound);
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
