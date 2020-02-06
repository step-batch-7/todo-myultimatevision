class Task {
  constructor(item, id, status = false) {
    this.item = item;
    this.id = id;
    this.isDone = status;
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
  constructor(title, id, status = false) {
    this.title = title;
    this.tasks = [];
    this.id = id;
    this.isDone = status;
  }

  isCompleted() {
    return this.isDone && this.tasks.every(task => task.isCompleted() === true);
  }

  addTask(task) {
    this.tasks.push(Task.create(task));
  }

  getTasks() {
    return this.tasks;
  }

  toggleDoneStatus() {
    this.isDone = !this.isDone;
    this.tasks.forEach((task) => task.markAsDone());
  }

  toggleTaskDoneStatus(id) {
    const task = this.tasks.find((task) => task.id === id);
    task.toggleDoneStatus();
  }

  markAsUndone() {
    this.isDone = false;
  }

  removeTask(id) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    this.tasks.splice(taskIndex, 1);
  }

  static create({ title, id, status, tasks }) {
    const todo = new Todo(title, id, status);
    tasks.forEach(task => todo.addTask(task));
    return todo;
  }

  toJSON() {
    const { title, id, isDone } = this;
    const tasks = this.tasks.map((task) => task.toJSON());
    return { title, id, tasks, isDone };
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
    todos.forEach(todo => todoList.addTodo(todo));
    return todoList;
  }

  toJSON() {
    const todos = this.todos.map((todo) => todo.toJSON());
    return todos;
  }
}

const getTodoIndex = (todos, id) => todos.findIndex(todo => todo.id === id);

module.exports = { TodoList };
