'use strict';

const todoList = document.querySelector('.todo_list'),
    showInputButton = document.querySelector('.add_todo_input'),
    todoInput = document.querySelector('.new_todo_input'),
    todoEditInput = document.querySelector('.todo_list_item_input'),
    addTodoButton = document.querySelector('.add_todo_item'),
    editButton = document.querySelector('.edit'),
    saveButton = document.querySelector('.save'),
    deleteButton = document.querySelector('.todo_list_item_delete'),
    scope = document.querySelector('.scope'),
    successful = document.querySelector('.successful'),
    active = document.querySelector('.active'),
    done = document.querySelector('.todo_list_item_checkbox'),
    noTodo = document.querySelector('.no_todo')
let todos = [],
    todosListLocal = JSON.parse(localStorage.getItem('todos'))
if (!todosListLocal){
    todosListLocal = []
}

let todoId = 0
number()

showInputButton.addEventListener('click', showInput )
addTodoButton.addEventListener('click', addTodo )
if(done){
    done.addEventListener('click', check )
}

function noTodos () {
    if(todoList.children.length === 0 && todosListLocal.length === 0){
        noTodo.className = 'no_todo'
    } else {
        noTodo.classList.add('display_none')
    }
}

noTodos()

function check () {
    let item = this.parentElement.parentElement.parentElement,
        textTodo = item.childNodes[1],
        todosList = JSON.parse(localStorage.getItem('todos'))

        item.classList.toggle('check')
        textTodo.classList.toggle('text_through')
        if(todosList){
            let newTodos = todosList.map(todo => {
                if(todo.id == item.id){
                    return { ...todo, check: item.classList.contains('check') }
                }
                return todo
            })
            localStorage.removeItem('todos')
            localStorage.setItem('todos', JSON.stringify(newTodos))
        }
        number ()
}

function showInput () {
    document.querySelector('.new_todo_input').removeAttribute('hidden')
}

function hideInput () {
    document.querySelector('.new_todo_input').setAttribute('hidden', true)
}

function reset (){
    todoInput.value = ''
}

function number () {
        scope.innerHTML = todoList.children.length
    let allCheck = document.querySelectorAll('.check')
        successful.innerHTML = allCheck.length
        active.innerHTML = todoList.children.length - allCheck.length
}

function createListItem (value, date, doneCheck) {
    let todoItem = document.createElement('Li'),
                todoText = document.createElement('div'),
                todoEditInput = document.createElement('input'),
                todoInfo = document.createElement('div'),
                todoInfoWrap = document.createElement('div'),
                todoCheck = document.createElement('input'),
                todoDate = document.createElement('div'),
                todoButtons = document.createElement('div'),
                todoEdit = document.createElement('button'),
                todoDel = document.createElement('button'),
                todoEditIcon = document.createElement('i'),
                todoDelIcon = document.createElement('i'),
                itemId = 'todo_id'+todoId++

            todoItem.className = 'todo_list_item'
            todoItem.setAttribute('id', itemId);
            todoText.className = 'todo_list_item_text'
            todoInfo.className = 'todo_list_item_info'
            todoInfoWrap.className = 'todo_list_wrap_date'
            todoCheck.className = 'todo_list_item_checkbox'
            todoDate.className = 'todo_list_item_date'
            todoButtons.className = 'todo_list_item_buttons'
            todoEdit.className = 'todo_list_item_edit edit'
            todoDel.className = 'todo_list_item_delete'
            todoEditIcon.className = 'fa fa-pencil-square-o'
            todoDelIcon.className = 'fa fa-trash-o'
            todoEditInput.className = 'todo_list_item_text_input'

            todoCheck.setAttribute('type', 'checkbox')
            todoEditInput.setAttribute('hidden', true)
            todoEditInput.setAttribute('type', 'text')

            todoText.innerHTML = value
            todoDate.innerHTML = date

            todoEdit.appendChild(todoEditIcon)
            todoDel.appendChild(todoDelIcon)
            todoButtons.appendChild(todoEdit)
            todoButtons.appendChild(todoDel)
            todoInfoWrap.appendChild(todoCheck)
            todoInfoWrap.appendChild(todoDate)
            todoInfo.appendChild(todoInfoWrap)
            todoInfo.appendChild(todoButtons)
            todoItem.appendChild(todoInfo)
            todoItem.appendChild(todoText)
            todoItem.appendChild(todoEditInput)
            todoList.appendChild(todoItem)

            todoDel.addEventListener('click', deleteTodo )
            todoEdit.addEventListener('click', editTodo )
            todoCheck.addEventListener('click', check )

            if(doneCheck !== undefined && doneCheck){
                todoCheck.setAttribute('checked', true)
                todoText.classList.add('text_through')
            } else {
                let item = {
                    id: itemId,
                    text: value,
                    date,
                    check: false
                }
                todos = [
                    ...todos,
                    item
                ]
                localStorage.setItem('todos', JSON.stringify(todos))
            }
}

function getTodo () {
    if(todosListLocal){
        for(let i = 0; i<todosListLocal.length; i++){
            let value = todosListLocal[i].text,
                date = todosListLocal[i].date,
                chek = todosListLocal[i].check
            createListItem(value, date, chek)
        }
    }
}
getTodo()

function addTodo () {
    let text = todoInput.value
    if(todoInput.hasAttribute('hidden')){
        showInput()
    } else if(text){
    let date = new Date(),
        moun = date.toString().slice(4,7),
        fullDate = `${date.getDate()} ${moun} ${date.getFullYear()}`
        createListItem(text, fullDate)

        noTodos()
        reset()
        number()
        hideInput()
    } else {
        alert('Todo cannot be empty')
    }
}

function deleteTodo () {
    let itemId = this.parentElement.parentElement.parentElement.id,
        todoItem = document.querySelector('#'+itemId),
        todosLocal = JSON.parse(localStorage.getItem('todos'))

        todoList.removeChild(todoItem)
        let newTodos = todosLocal.filter(todo =>todo.id !== itemId)
        console.log(newTodos);
            localStorage.removeItem('todos')
            localStorage.setItem('todos', JSON.stringify(newTodos))
        number()
        noTodos()
}

function editTodo () {
    this.removeEventListener('click', editTodo )
    let item = this.parentElement.parentElement.parentElement,
        edit = this.childNodes[0],
        itemId = item.id,
        todoItem = document.querySelector('#'+itemId),
        itemDiv = item.childNodes[1],
        itemInp = item.childNodes[2],
        value = itemDiv.innerText

        edit.className = 'fa fa-check'
        this.className = 'todo_list_item_edit save'
        this.addEventListener('click', saveTodo)
        todoItem.classList.add('edit')

        itemInp.removeAttribute('hidden')
        itemInp.setAttribute('value', value)
        itemDiv.setAttribute('hidden', true)
}

function saveTodo () {
    this.removeEventListener('click', saveTodo )
    let item = this.parentElement.parentElement.parentElement,
        itemInp = item.childNodes[2],
        value = itemInp.value
    if(value){
        let save = this.childNodes[0],
            itemDiv = item.childNodes[1],
            dateDiv = item.childNodes[0].childNodes[0].childNodes[0],
            newDate = new Date(),
            moun = newDate.toString().slice(4,7),
            fullDate = `${newDate.getDate()} ${moun} ${newDate.getFullYear()}`
            dateDiv.innerHTML = fullDate

            save.className = 'fa fa-pencil-square-o'
            this.className = 'todo_list_item_edit edit'

            let newTodos = todos.map(todo => {
                if(todo.id == item.id){
                    return { ...todo, text:value, date: fullDate }
                }
                return todo
            })
                localStorage.removeItem('todos')
                localStorage.setItem('todos', JSON.stringify(newTodos))

            itemDiv.innerHTML = value
            itemDiv.removeAttribute('hidden')
            itemInp.setAttribute('hidden', true)
    } else {
        alert('Todo cannot be empty')
    }
    this.addEventListener('click', editTodo)
}