class Task {
  constructor(item, id, status = false) {
    this.item = item;
    this.id = id;
    this.isDone = status;
  }

  isDone() {
    return this.isDone;
  }

  toHtml() {
    return (
      `<span class="task">
        <span>${this.item}</span>
        <div>
        <input type="button" value="Done" onclick="doneTask(${this.id})"/>
        <img src="images/trash.png" width='20px' onclick="deleteTask(${this.id})"/> 
        </div>
       </span><br/>`);
  }
}

class Todo {
  constructor(title, id) {
    this.title = title;
    this.tasks = [];
    this.id = id;
  }

  addTask(task) {
    this.tasks.push(task);
  }

  getTasks() {
    return this.tasks;
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

module.exports = { Todo, Task };
