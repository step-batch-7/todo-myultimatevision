class Task {
  constructor(item, id, status = false) {
    this.item = item;
    this.id = id;
    this.isDone = status;
  }

  isDone() {
    return this.isDone;
  }

  get status() {
    return this.isDone ? 'done' : 'unDone';
  }

  toHtml() {
    return (
      `<span class="task">
        <span>${this.item}</span>
        <div>
        <input type="button" value="Done" onclick="doneTask(${this.id})" class="${this.status}"/>
        <img src="images/trash.png" width='20px' onclick="deleteTask(${this.id})"/> 
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
    this.tasks.push(task);
  }

  getTasks() {
    return this.tasks;
  }

  get status() {
    return this.isDone ? 'done' : 'unDone';
  }

  toHtml() {
    return (
      `<div class='todo' id="${this.id}">
        <div class="header"> <b>${this.title.toUpperCase()}</b>
          <div> 
            <input type="button" value="Done" onclick="doneTodo(${this.id})" class="${this.status}"/>
            <img src="images/trash.png" width='20px' onclick="deleteTodo(${this.id})"/>
          </div>
        </div>
        <ul>
         ${ this.tasks.map(todoItem => todoItem.toHtml()).join('\n')}
        </ul>
      </div>`);
  }
}

module.exports = { Todo, Task };
