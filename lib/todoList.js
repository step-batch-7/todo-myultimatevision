const Todo = require('./todo');

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

module.exports = TodoList;