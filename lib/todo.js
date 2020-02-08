class Task {
  constructor(item, id, status = false) {
    this.item = item;
    this.id = id;
    this.isDone = status;
  }

  rename(item) {
    this.item = item;
  }

  isCompleted() {
    return this.isDone;
  }

  markAsDone() {
    this.isDone = true;
  }

  toggleDoneStatus() {
    this.isDone = !this.isDone;
  }

  toJSON() {
    const { item, id, isDone } = this;
    return { item, id, isDone };
  }

  static create({ item, id, isDone }) {
    return new Task(item, id, isDone);
  }
}

class Todo {
  constructor(title, id) {
    this.title = title;
    this.tasks = [];
    this.id = id;
  }

  renameTask(id, item) {
    const task = this.tasks.find(task => task.id === id);
    task.rename(item)
  }

  renameTitle(title) {
    this.title = title;
  }

  addTask(task) {
    this.tasks.push(Task.create(task));
  }

  getTask(id) {
    return this.tasks.find(task => task.id === id)
  }

  getTasks() {
    return this.tasks;
  }

  toggleTaskDoneStatus(id) {
    const task = this.tasks.find((task) => task.id === id);
    task.toggleDoneStatus();
  }

  removeTask(id) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    this.tasks.splice(taskIndex, 1);
  }

  static create({ title, id, tasks }) {
    const todo = new Todo(title, id);
    tasks.forEach(task => todo.addTask(task));
    return todo;
  }

  toJSON() {
    const { title, id, tasks } = this;
    return { title, id, tasks };
  }
}

class TodoList {
  constructor() {
    this.todos = [];
  }
  addTodo(todo) {
    this.todos.unshift(Todo.create(todo));
  }

  removeTodo(todoId) {
    const todoIndex = getTodoIndex(this.todos, todoId);
    this.todos.splice(todoIndex, 1);
  }

  getTodo(id) {
    return this.todos.find((todo) => todo.id === id);
  }

  static create(todos) {
    const todoList = new TodoList();
    todos.reverse().forEach(todo => todoList.addTodo(todo));
    return todoList;
  }

  toJSON() {
    return this.todos;
  }
}

const getTodoIndex = (todos, id) => todos.findIndex(todo => todo.id === id);

module.exports = { TodoList };
