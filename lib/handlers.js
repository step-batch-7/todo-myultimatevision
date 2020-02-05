const fs = require('fs');
const querystring = require('querystring');
const { App } = require('./app');
const { TodoList, Todo, Task } = require('./todo.js');
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

const todoList = TodoList.create(loadTodos());

const createTask = function (todo, todoItem) {
  const { item, id } = todoItem;
  todo.addTask(new Task(item, id));
};

const saveTodo = function () {
  fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(todoList.todos), 'utf8');
};

const getTodohaveChild = id => {
  return todoList.todos.find((todo) => {
    return todo.tasks.some(task => id === task.id);
  });
};

const markTaskAsDone = function (req, res) {
  const { id } = req.body;
  const todo = getTodohaveChild(+id);
  todo.markTaskAsDoneAt(+id);
  saveTodo();
  serveHomePage(req, res);
};

const deleteTask = function (req, res) {
  const { id } = req.body;
  const todo = getTodohaveChild(+id);
  todo.removeTask(+id);
  saveTodo();
  serveHomePage(req, res);
};

const getTodo = (id) => todoList.todos.find((todo) => todo.id === id);

const markTodoAsDone = function (req, res) {
  const { id } = req.body;
  const todo = getTodo(+id);
  todo.markAsDone();
  saveTodo();
  serveHomePage(req, res);
};

const deleteTodo = function (req, res) {
  const { id } = req.body;
  const todo = getTodo(+id);
  todoList.todos.splice(todoList.todos.indexOf(todo), 1);
  saveTodo();
  serveHomePage(req, res);
};

const createTodo = function (req, res) {
  const { title, tasks } = req.body;
  const newTodo = new Todo(title, getId());
  const tasksTodo = tasks instanceof Array ? tasks : [tasks];
  tasksTodo.forEach((task) => createTask(newTodo, { item: task, id: getId() }));
  todoList.todos.unshift(newTodo);
  saveTodo();
  serveHomePage(req, res);
};

const generateTodos = function () {
  const noTodosHtml = '<div class="todo">No tasks yet to show</div>';
  const todosHtml = todoList.todos.map((todo) => todo.toHtml()).join('\n');
  return todosHtml ? todosHtml : noTodosHtml;
};

const serveHomePage = function (req, res) {
  const todos = generateTodos();
  const html = loadTemplate('/home.html', { todos });
  res.setHeader('content-Type', CONTENT_TYPES.html);
  res.setHeader('content-Length', html.length);
  res.end(html);
};

const isStatusNotOk = function (stat) {
  return !stat || !stat.isFile();
};

const serveStaticFile = (req, res, next) => {
  const path = `${STATIC_FOLDER}${req.url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (isStatusNotOk(stat)) {
    return next();
  }
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const html = fs.readFileSync(path);
  res.setHeader('Content-Type', CONTENT_TYPES[extension]);
  res.end(html);
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
app.get(/\/$/, serveHomePage);
app.get('/home.html', serveHomePage);
app.post('/createTodo', createTodo);
app.post('/deleteTodo', deleteTodo);
app.post('/deleteTask', deleteTask);
app.post('/todoDone', markTodoAsDone);
app.post('/taskDone', markTaskAsDone);
app.getAll(serveStaticFile);
app.getAll(notFound);
app.postAll(notFound);
app.use(methodNotAllowed);

module.exports = { app };
