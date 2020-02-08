const Task = require('./task');

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

module.exports = Todo;
