class Todo {
  constructor(item) {
    this.item = item;
    this.isDone = false;
  }

  isDone() {
    return this.isDone;
  }

  toHtml() {
    return `<input type="checkbox"/>${this.item}<br/>`
  }
}


module.exports = Todo;
