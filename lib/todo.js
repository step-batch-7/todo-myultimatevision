class Todo {
  constructor(item) {
    this.item = item;
    this.isDone = false;
  }

  isDone() {
    return this.isDone;
  }
}

module.exports = Todo;
