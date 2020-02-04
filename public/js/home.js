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
  if (items.length > 1)
    todoItems.removeChild(items[items.length - 1]);
};

const refreshHomePage = function (title, textareas) {
  const todoItems = document.querySelector('#todoItems')
  textareas[0].value = ''
  textareas.slice(1).forEach((textarea) => {
    todoItems.removeChild(textarea);
  });
  title.value = '';
}

const getContent = function () {
  const titleTag = document.querySelector('input');
  const textareas = Array.from(document.querySelectorAll('textarea'));
  const tasks = textareas.map((textarea) => `tasks=${textarea.value}`);
  const title = `title=${titleTag.value}`;
  refreshHomePage(titleTag, textareas)
  return `${title}&${tasks.join('&')}`;
}

const sendHttpPOST = (url, callback) => {
  const data = getContent();
  const req = new XMLHttpRequest();
  req.onload = function () {
    if (this.status === 200) callback(this.responseText);
  }
  req.open('POST', url);
  req.send(data);
}
