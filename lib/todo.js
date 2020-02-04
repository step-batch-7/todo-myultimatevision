class Task {
  constructor(item, status = false) {
    this.item = item;
    this.isDone = status;
  };

  isDone() {
    return this.isDone;
  };

  toHtml() {
    return `<input type="checkbox"/>${this.item}<br/>`
  };
}

class Todo {
  constructor(title) {
    this.title = title;
    this.tasks = [];
  };

  addTask(task) {
    this.tasks.push(task);
  };

  toHtml() {
    return (
      `<div class='todolist'>
        <div class="header"> <b>${this.title.toUpperCase()}</b>
          <div> 
            <input type="button" value="Done"/>
            <img src="images/trash.png" width='20px' />
          </div>
        </div>
        <ul>
         ${ this.tasks.reduce((list, todoItem) => list + todoItem.toHtml(), '')}
        </ul>
      </div>`);
  };
}

module.exports = { Todo, Task };
