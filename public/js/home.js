const todoItems = [];
const changeAction = function () {
  const activeElement = document.getElementsByClassName("active")[0];
  const inActiveElement = document.getElementsByClassName("inActive")[0];
  activeElement.classList.replace("active", "inActive");
  inActiveElement.classList.replace("inActive", "active");
};

const addItem = function () {
  const todoItems = document.getElementById("todoItems");
  const item = document.createElement("textarea");
  item.setAttribute("name", "todoItem");
  item.rows = 3;
  item.cols = 40;
  todoItems.appendChild(item);
};

const deleteItem = function () {
  const todoItems = document.getElementById("todoItems");
  const items = document.getElementsByName("todoItem");
  todoItems.removeChild(items[items.length - 1]);
};