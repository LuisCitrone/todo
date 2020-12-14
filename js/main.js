let completedShown = false;
const todayElement = document.querySelector('.date__dayName');
const dateElement = document.querySelector('.date__numericDate');
const chillElement = document.querySelector('.chill__element');
const pendingDisplay = document.querySelector('.text__pending');
const completedDisplay = document.querySelector('.text__completed');
const todoListContainer = document.querySelector('.todoList__container');
const todoCompletedContainer = document.querySelector('.completed__section');
const inputElement = document.querySelector('.add__input');
inputElement.addEventListener('input', inputElementInput);
const addBtnElement = document.querySelector('.add__button');
addBtnElement.addEventListener('click', addBtnClickHandler);
const showBtnElement = document.querySelector('.show__button');
showBtnElement.addEventListener('click', showBtnClickHandler);
const clearAllBtnElemnt = document.querySelector('.clear__button');
clearAllBtnElemnt.addEventListener('click', clearAllBtnClickHandler);
const localStorageHandler = {
    store: function (database) {
        localStorage.setItem('todo', JSON.stringify(database));
    },
    read: function (key) {
        const value = localStorage.getItem(key);
        return JSON.parse(value);
    },
    clear: function (key) {
        localStorage.removeItem(key);
    },
}

const dbHandler = {
    getNumberOfTodos: function () {
        let num = 0;
        todoDB.forEach(item => {
            num += 1;
        })
        return num;
    },
    getNumberOfPending: function () {
        let num = 0;
        todoDB.forEach(item => {
            if (!item.done) num += 1;
        });
        if (num === 0) {
            setChillBackground();
        } else {
            unsetChillBackground();
        };
        return num;
    },

    getNumberOfCompleted: function () {
        let num = 0;
        todoDB.forEach(item => {
            if (item.done) num += 1;
        })
        return num;
    },

    addTodo: function (todo) {
        let todoObject = { todo: todo, done: false };
        todoDB.push(todoObject);
        localStorageHandler.store(todoDB);
        dbListHandler.addToList(todoObject);
        displayPendingTodos();
    },

    deleteTodo: function (todo) {
        todoDB.forEach((item, index) => {
            if (item.todo === todo) {
                todoDB.splice(index, 1);
            }
        })
        localStorageHandler.store(todoDB);
        displayPendingTodos();
        displayCompletedTodos();
    },

    completeTodo: function (todo) {
        todoDB.forEach((item, index) => {
            if (item.todo === todo) {
                todoDB[index].done = true;
                dbListHandler.addToCompletedList(todoDB[index]);
            }
        })
        localStorageHandler.store(todoDB);
        displayPendingTodos();
        displayCompletedTodos();
    },


    unCompleteTodo: function (todo) {
        todoDB.forEach((item, index) => {
            if (item.todo === todo) {
                todoDB[index].done = false;
                dbListHandler.addToList(todoDB[index]);
            }
        })
        localStorageHandler.store(todoDB);
        displayPendingTodos();
        displayCompletedTodos();
    },

  
    clearPendingTodo: function () {
        for (let i = todoDB.length - 1; i >= 0; i -= 1) {
            if (!todoDB[i].done) {
                todoDB.splice(i, 1);
            }
        }
        todoListContainer.innerHTML = '';
        localStorageHandler.store(todoDB);
        displayPendingTodos();
        displayCompletedTodos();
    },
}
const dbListHandler = {
    displayTodoList: function () {
        todoDB.forEach(item => {
            if (!item.done) {
                createListElement(item);
            } else {
                createCompletedListElement(item);
            }
        });
    },
    addToList: function (todo) {
        createListElement(todo);
    },
    addToCompletedList: function (todo) {
        createCompletedListElement(todo);
    },
}

const dateHandler = {
    getCurrentDay: function () {
        let now = new Date();
        let currentDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now);
        return (currentDay);
    },
    getCurrentDate: function () {
        let now = new Date();
        let day = now.getDate();
        let month = now.getMonth() + 1;
        let year = now.getFullYear();
        let currentDate = `${month}-${day}-${year}`;
        return (currentDate);
    },
}

function displayPendingTodos() {
    let num = dbHandler.getNumberOfPending();
    pendingDisplay.innerHTML = `You have ${num} pending items`;
}

function displayCompletedTodos() {
    let num = dbHandler.getNumberOfCompleted();
    completedDisplay.innerHTML = `You have ${num} completed items`;
}

function inputElementInput() {
    if (inputElement.value === '') {
        addBtnElement.classList.remove('add__button--active');
    } else {
        addBtnElement.classList.add('add__button--active');
    }
}

function addBtnClickHandler() {
    input = inputElement.value;
    if (!input) return
    dbHandler.addTodo(input);
    inputElement.value = '';
    addBtnElement.classList.remove('add__button--active');
}

function showBtnClickHandler() {
    if (completedShown) {
        todoCompletedContainer.classList.remove('completed__section--show');
        showBtnElement.innerText = 'Show complete';
        completedShown = false;
    } else {
        todoCompletedContainer.classList.add('completed__section--show');
        showBtnElement.innerText = 'Hide complete';
        completedShown = true;
    }
}

function clearAllBtnClickHandler() {
    dbHandler.clearPendingTodo();
}

function createDiv(divName) {
    const todoDiv = document.createElement('div');
    todoDiv.className = divName;
    return todoDiv;
}

function createCheckbox(dbObject) {
    const checkboxElement = document.createElement('input');
    checkboxElement.type = 'checkbox';
    if (dbObject.done) {
        checkboxElement.checked = true;
    }
    checkboxElement.className = 'todo__checkbox';
    checkboxElement.addEventListener('click', ev => {
        if (checkboxElement.checked === true) {
            let todo = ev.target.nextSibling.innerText;
            ev.target.parentElement.remove();
            dbHandler.completeTodo(todo);
        }
        else {
            let todo = ev.target.nextSibling.innerText;
            ev.target.parentElement.remove();
            dbHandler.unCompleteTodo(todo);
        };
    });
    return checkboxElement;
}

function createSpan(dbObject) {
    const spanElement = document.createElement('span');
    spanElement.className = 'todo__span';
    spanElement.innerText = dbObject.todo;
    return spanElement;
}

function createCompletedSpan(dbObject) {
    const spanElement = document.createElement('span');
    spanElement.className = 'todoCompleted__span';
    spanElement.innerText = dbObject.todo;
    return spanElement;
}
function createDeleteBtnElement() {
    const deleteBtnElement = document.createElement('button');
    deleteBtnElement.className = 'todo__deleteButton';
    deleteBtnElement.addEventListener('click', (ev) => {
        let todo = ev.target.previousSibling.innerText;
        ev.target.parentElement.remove();
        dbHandler.deleteTodo(todo);
    });
    return deleteBtnElement;
}
function createListElement(dbObject) {
    const todoDiv = createDiv('todo__div');
    const checkboxElement = createCheckbox(dbObject);
    const spanElement = createSpan(dbObject);
    const deleteBtnElement = createDeleteBtnElement();

    todoListContainer.appendChild(todoDiv);
    todoDiv.appendChild(checkboxElement);
    todoDiv.appendChild(spanElement);
    todoDiv.appendChild(deleteBtnElement);
}

function createCompletedListElement(dbObject) {
    const todoCompletedDiv = createDiv('todoCompleted__div');
    const checkboxElement = createCheckbox(dbObject);
    const spanElement = createCompletedSpan(dbObject);
    const deleteBtnElement = createDeleteBtnElement();

    todoCompletedContainer.appendChild(todoCompletedDiv);
    todoCompletedDiv.appendChild(checkboxElement);
    todoCompletedDiv.appendChild(spanElement);
    todoCompletedDiv.appendChild(deleteBtnElement);
}

function setChillBackground() {
    chillElement.classList.add('chill__element--enable');
    pendingDisplay.classList.add('text__pending--disable')
};
function unsetChillBackground() {
    chillElement.classList.remove('chill__element--enable');
    pendingDisplay.classList.remove('text__pending--disable')
};

todayElement.innerText = dateHandler.getCurrentDay();
dateElement.innerText = dateHandler.getCurrentDate();

todoDB = localStorageHandler.read('todo');

if (todoDB != null && todoDB && Array.isArray(todoDB)) {
    displayPendingTodos();
    displayCompletedTodos();
    dbListHandler.displayTodoList();
} else {
    todoDB = [
        { todo: 'Go to codepen and get inspired', done: false },
        { todo: 'Pick a project', done: false },
        { todo: 'Create a new pen', done: true },
    ];
    displayPendingTodos();
    displayCompletedTodos();
    dbListHandler.displayTodoList();
    localStorageHandler.store(todoDB);
}
