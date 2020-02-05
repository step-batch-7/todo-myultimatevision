class Task {
  constructor(item, id, status = false) {
    this.item = item;
    this.id = id;
    this.isDone = status;
  }

  isDone() {
    return this.isDone;
  }

  markAsDone() {
    this.isDone = true;
  }

  toJson() {
    const { item, id, isDone } = this;
    return { item, id, isDone };
  }

  static create({ item, id, isDone }) {
    return new Task(item, id, isDone);
  }

  toHtml() {
    const { item, id } = this;
    return (
      `<span class="task">
        <span>${item}</span>
        <div>
        <input type="button" value="Done" onclick="doneTask(${id})"/>
        <img src="images/trash.png" width='20px' onclick="deleteTask(${id})"/> 
        </div>
       </span><br/>`);
  }
}

class Todo {
  constructor(title, id, status = false) {
    this.title = title;
    this.tasks = [];
    this.id = id;
    this.isDone = status;
  }

  addTask(task) {
    this.tasks.push(Task.create(task));
  }

  getTasks() {
    return this.tasks;
  }

  markAsDone() {
    this.isDone = true;
    this.tasks.forEach((task) => task.markAsDone());
  }

  markTaskAsDoneAt(id) {
    const task = this.tasks.find((task) => task.id === id);
    task.markAsDone();
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

  toJson() {
    const { title, id } = this;
    const tasks = this.tasks.map((task) => task.toJson());
    return { title, id, tasks };
  }

  toHtml() {
    return (
      `<div class='todo' id="${this.id}">
        <div class="header"> <b>${this.title.toUpperCase()}</b>
          <div> 
            <input type="button" value="Done" onclick="doneTodo(${this.id})"/>
            <img src="images/trash.png" width='20px' onclick="deleteTodo(${this.id})"/>
          </div>
        </div>
        <ul>
         ${ this.tasks.map(todoItem => todoItem.toHtml()).join('\n')}
        </ul>
      </div>`);
  }
}

class TodoList {
  constructor() {
    this.todos = [];
  }
  addTodo(todo) {
    this.todos.unshift(Todo.create(todo));
  }

  removeTodo(todo) {
    const todoIndex = this.todos.indexOf(todo);
    this.todos.splice(todoIndex, 1);
  }

  static create(todos) {
    const todoList = new TodoList();
    todos.forEach(todo => todoList.addTodo(todo));
    return todoList;
  }

}

module.exports = { TodoList, Todo, Task };
