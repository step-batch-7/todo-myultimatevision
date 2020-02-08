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

module.exports = Task;