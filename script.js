
const todoForm = document.querySelector('.todo-form');

const todoInput = document.querySelector('.todo-input');

const todoItemsList = document.querySelector('.todo-items');

// массив для todos
let todos = [];

// eventListener на форму
todoForm.addEventListener('submit', function(event) {
  // отключение перезагрузки страницы при нажатии на кнопку
  event.preventDefault();
  addTodo(todoInput.value); // вызов функции
});

// функция для добавления todo
function addTodo(item) {
  // если поле не пустое
  if (item !== '') {
    // создать объект
    const todo = {
      id: Date.now(),
      name: item,
      completed: false
    };

    // потом добавить его в массив
    todos.push(todo);
    addToLocalStorage(todos); // загрузить в LocalStorage

    // очистить поле
    todoInput.value = '';
  }
}

// функция для показа на экране
function renderTodos(todos) {
  // очистить всё что есть в <ul>
  todoItemsList.innerHTML = '';

  // пройти по всему массиву
  todos.forEach(function(item) {
    // проверка на completed
    const checked = item.completed ? 'checked': null;

    // создать <li> элемент и заполнить его
    // <li> </li>
    const li = document.createElement('li');
    // <li class="item"> </li>
    li.setAttribute('class', 'item');
    // <li class="item" data-key="20200708"> </li>
    li.setAttribute('data-key', item.id);
    // если элемент completed, добавить class 'checked' к <li> ,
    // который зачеркнет элемент
    if (item.completed === true) {
      li.classList.add('checked');
    }

    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${checked}>
      ${item.name}
      <button class="delete-button">X</button>
    `;
    // добавить <li> к <ul>
    todoItemsList.append(li);
  });

}

// функция для сохранения массива в LocalStorage
function addToLocalStorage(todos) {
  // превратить массив в строку и сохранить
  localStorage.setItem('todos', JSON.stringify(todos));
  // показать на экране
  renderTodos(todos);
}

// функция для получения из local storage
function getFromLocalStorage() {
  const reference = localStorage.getItem('todos');
  // если хоть что-то есть
  if (reference) {
    // преобразовать строку в массив
    todos = JSON.parse(reference);
    renderTodos(todos);
  }
}

// переключение значения завершенности
function toggle(id) {
  todos.forEach(function(item) {
    // использую ==, а не ===, потому что 2 разных типа данных: строка и число
    if (item.id == id) {
      // переключаем
      item.completed = !item.completed;
    }
  });

  addToLocalStorage(todos);
}

// удаляет элементы из массива, обновляет LocalStorage и отображает на экран
function deleteTodo(id) {
  // найти объект <li> с id и обновить массив
  todos = todos.filter(function(item) {
    //!= а не !==, потому что разные типы данных: строка и число
    return item.id != id;
  });

  // обновить LocalStorage
  addToLocalStorage(todos);
}

// получить всё из Localtorage
getFromLocalStorage();

// addEventListener <ul> с class=todoItems. Потому что надо следить за кликами на кнопку удаления и chekbox
todoItemsList.addEventListener('click', function(event) {
  // проверить, на checkbox ли нажатие
  if (event.target.type === 'checkbox') {
    // сменить значение
    toggle(event.target.parentElement.getAttribute('data-key'));
  }

  // проверить, нажатие ли это на delete-button
  if (event.target.classList.contains('delete-button')) {
    // получить id из data-key родительского <li>, где присутствует кнопка удаления
    deleteTodo(event.target.parentElement.getAttribute('data-key'));
  }
});