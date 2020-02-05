const fs = require('fs');
const querystring = require('querystring');
const { App } = require('./app');
const { TodoList } = require('./todo.js');
const CONTENT_TYPES = require('./types');

const STATIC_FOLDER = `${__dirname}/../public`;
const TEMPLATE_FOLDER = `${__dirname}/../templates`;
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

const areIdsEqual = (id, todo) => todo.id === id;

const doesAnyTaskHaveId = (id, { tasks }) => tasks.some(task => id === task.id);

const getTodo = (id, func) => todoList.todos.find(func.bind(null, id));

const sendResponse = (res) => {
  fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(todoList.toJSON()), 'utf8');
  const response = todoList.toJSON();
  res.setHeader('content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(response));
};

const markTaskAsDone = function (req, res) {
  const { id } = req.body;
  const todo = getTodo(+id, doesAnyTaskHaveId);
  todo.markTaskAsDoneAt(+id);
  sendResponse(res);
};

const deleteTask = function (req, res) {
  const { id } = req.body;
  const todo = getTodo(+id, doesAnyTaskHaveId);
  todo.removeTask(+id);
  sendResponse(res);
};

const markTodoAsDone = function (req, res) {
  const { id } = req.body;
  const todo = getTodo(+id, areIdsEqual);
  todo.markAsDone();
  sendResponse(res);
};

const deleteTodo = function (req, res) {
  const { id } = req.body;
  todoList.removeTodo(+id);
  sendResponse(res);
};

const formatTasks = (items) => items.map((item) => ({ item, id: getId() }));

const createTodo = function (req, res) {
  const { title, tasks } = req.body;
  const tasksTodo = tasks instanceof Array ? tasks : [tasks];
  todoList.addTodo({ title, id: getId(), tasks: formatTasks(tasksTodo) });
  sendResponse(res);
};

const serveTodos = function (req, res) {
  sendResponse(res);
};

const serveHomePage = function (req, res) {
  const html = fs.readFileSync(`${TEMPLATE_FOLDER}/home.html`);
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
app.get(/\/$/, serveHomePage);
app.get('/home.html', serveHomePage);
app.get('/serveTodos', serveTodos);
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
