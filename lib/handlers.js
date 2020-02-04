const fs = require('fs');
const querystring = require('querystring');
const { App } = require('./app');
const Todo = require('./todo.js');
const CONTENT_TYPES = require('./types');
const { loadTemplate } = require('./viewTemplate');

const loadTodos = function () {
  const filePath = './data/todos.json';
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');
  }
  return [];
};

const todoList = loadTodos();


const STATIC_FOLDER = `${__dirname}/../public`;

const isStatusNotOk = function (stat) {
  return !stat || !stat.isFile();
};

const getUrl = function (url) {
  return url === '/' ? '/home.html' : url;
};



const serveStaticFile = (req, res, next) => {
  const url = getUrl(req.url);
  if (url === '/home.html') return serveHomePage(req, res, next);
  const path = `${STATIC_FOLDER}${url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (isStatusNotOk(stat)) {
    return next();
  }
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const contentType = CONTENT_TYPES[extension];
  const html = fs.readFileSync(path);
  res.setHeader('Content-Type', contentType);
  res.end(html);
};

const redirectTo = function (res, file) {
  res.setHeader('Content-Type', CONTENT_TYPES.html);
  res.setHeader('Location', file);
  res.writeHead(301, 'redirect');
  res.end();
};

const createTodo = function (req, res) {
  const filePath = './data/todos.json';
  let { title, tasks } = req.body;
  const todoItems = tasks.map((task) => new Todo(task));
  todoList.unshift({ title, todoItems });
  fs.writeFileSync(filePath, JSON.stringify(todoList), 'utf8');
  redirectTo(res, '/home.html');
};

const generateHtml = function (html, todo) {
  const { title, todoItems } = todo;
  const todosHtml =
    `<div class='todolist'>
     <div class="header"> <b>${title.toUpperCase()}</b>
     <div><input type="button" value="Done"/><img src="images/trash.png" width='20px' /></div></div>
      <ul>
        ${todoItems.reduce((list, todoItem) => list + `<input type="checkbox"/>${todoItem.item}<br/>`, '')}
      </ul>
    </div>`;
  return html + todosHtml;
};

const generateTodos = function () {
  const todosHtml = todoList.reduce(generateHtml, '');
  return todosHtml ? todosHtml : '';
};

const serveHomePage = function (req, res) {
  const todos = generateTodos();
  const html = loadTemplate('/home.html', { todos });
  res.setHeader('content-Type', CONTENT_TYPES.html);
  res.setHeader('content-Length', html.length);
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
app.post('/createTodo', createTodo);
app.post('/home.html', serveHomePage);
app.get('', serveStaticFile);
app.get('', notFound);
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
