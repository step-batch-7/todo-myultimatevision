const getTaskAsHtml = function (task) {
  const { item, id, isDone } = task;
  return (
    `<span class="task">
     <span>${item}</span>
     <div>
     <input type="button" value="Done" onclick="markTaskAsDone(${id})"/>
     <img src="images/trash.png" width='20px' onclick="deleteTask(${id})"/> 
     </div>
     </span><br/>`);
};

const getTodoAsHtml = function (todo) {
  const { id, title, tasks } = todo;
  return (
    `<div class='todo' id="${id}">
       <div class="header"> <b>${title.toUpperCase()}</b><div> 
       <input type="button" value="Done" onclick="markTodoAsDone(${id})"/>
       <img src="images/trash.png" width='20px' onclick="deleteTodo(${id})"/>
       </div>
     </div>
     <ul>
       ${ tasks.map(getTaskAsHtml).join('\n')}
     </ul>
   </div>`);
};

const getTodosHtml = function (todoList) {
  return todoList.map(getTodoAsHtml);
};
