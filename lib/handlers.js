const fs = require('fs');
const querystring = require('querystring');
const { App } = require('./app');
const TodoList = require('./todoList.js');
const CONTENT_TYPES = require('./types');
const { DATA_STORE_PATH } = require('../config');

const STATIC_FOLDER = `${__dirname}/../public`;
const TEMPLATE_FOLDER = `${__dirname}/../templates`;
let id = new Date().getTime();

const getId = () => ++id;

const loadTodos = function () {
  if (fs.existsSync(DATA_STORE_PATH)) {
    return JSON.parse(fs.readFileSync(DATA_STORE_PATH, 'utf8') || '[]');
  }
  return [];
};

const todoList = TodoList.create(loadTodos());

const doesTaskHaveId = (id, { tasks }) => tasks.some(task => id === task.id);

const getTodo = (id) => todoList.todos.find(doesTaskHaveId.bind(null, id));

const getTodoForId = (id) => todoList.todos.find(todo => todo.id === id);

const saveTodoList = () => {
  fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(todoList.toJSON()), 'utf8');
}

const sendResponse = (res, data) => {
  const response = JSON.stringify(data);
  res.setHeader('content-Type', CONTENT_TYPES.json);
  res.end(response);
};

const toggleTaskDoneStatus = function (req, res) {
  const { id } = req.body;
  const todo = getTodo(+id);
  todo.toggleTaskDoneStatus(+id);
  const { isDone } = todo.getTask(+id);
  saveTodoList();
  sendResponse(res, { isDone });
};

const deleteTask = function (req, res) {
  const { id } = req.body;
  const todo = getTodo(+id);
  const { isDone } = todo.getTask(+id);
  todo.removeTask(+id);
  saveTodoList();
  sendResponse(res, { isDone });
};

const deleteTodo = function (req, res) {
  const { id } = req.body;
  todo = getTodoForId(+id);
  todoList.removeTodo(+id);
  saveTodoList();
  sendResponse(res, { id });
};

const renameTitle = function (req, res) {
  const { id, title } = req.body;
  const todo = getTodoForId(+id);
  todo.renameTitle(title);
  saveTodoList();
  sendResponse(res, todoList);
};

const renameTask = function (req, res) {
  const { id, task } = req.body;
  const todo = getTodo(+id);
  todo.renameTask(+id, task);
  saveTodoList();
  sendResponse(res, todoList);
};

const createTodo = function (req, res) {
  const { title } = req.body;
  const id = getId();
  todoList.addTodo({ title, id, tasks: [] });
  saveTodoList();
  const todo = getTodoForId(+id);
  sendResponse(res, todo);
};

const addTask = function (req, res) {
  const { id, task } = req.body;
  const todo = getTodoForId(+id);
  const taskId = getId();
  todo.addTask({ item: task, id: taskId });
  const taskAdded = todo.getTask(taskId);
  saveTodoList();
  sendResponse(res, taskAdded.toJSON());
};

const serveTodos = function (req, res) {
  sendResponse(res, todoList.toJSON());
};

const serveHomePage = function (req, res) {
  const { cookie } = req.headers;
  if (!cookie) {
    res.setHeader('location', '/entry.html');
    res.writeHead(301);
    res.end();
    return;
  }
  const html = fs.readFileSync(`${TEMPLATE_FOLDER}/home.html`);
  res.setHeader('content-Type', CONTENT_TYPES.html);
  res.setHeader('content-Length', html.length);
  res.end(html);
};

const serveEntryPage = function (req, res) {
  const { cookie } = req.headers;
  if (cookie) {
    res.setHeader('location', '/home.html');
    res.writeHead(301);
    res.end();
    return;
  }
  const html = fs.readFileSync(`${TEMPLATE_FOLDER}/entry.html`);
  res.setHeader('content-Type', CONTENT_TYPES.html);
  res.setHeader('content-Length', html.length);
  res.end(html);
};

const isStatusNotOk = (stat) => !stat || !stat.isFile();

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
app.get(/\/$/, serveEntryPage);
app.get('/login.html', serveEntryPage);
app.get('/home.html', serveHomePage);
app.get('/serveTodos', serveTodos);
app.post('/createTodo', createTodo);
app.post('/addTask', addTask);
app.post('/deleteTodo', deleteTodo);
app.post('/deleteTask', deleteTask);
app.post('/renameTitle', renameTitle);
app.post('/renameTask', renameTask);
app.post('/toggleTaskDoneStatus', toggleTaskDoneStatus);
app.getAll(serveStaticFile);
app.getAll(notFound);
app.postAll(notFound);
app.use(methodNotAllowed);

module.exports = { app };
