import { Modal } from 'bootstrap'

//Class Task ---------------------------------------------------------------------------------------------------------
class Task {
  id = this.createId()
  createdAt = this.createDate()
  state = 'todo'

  constructor({ title, user, description }) {
    this.user = user
    this.title = title
    this.description = description
  }

  createId() {
    return crypto.randomUUID()
  }

  createDate() {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date().toLocaleDateString('ru', options);
  }

  static setDataToLocalStorage(data) {
    localStorage.setItem('todos', JSON.stringify(data))
  }

  static getDataFromLocalStorage() {
    return JSON.parse(localStorage.getItem('todos')) || []
  }
}

//Variables --------------------------------------------------------------------------------------------------------------
const clock = document.querySelector('.header__time')
let data = Task.getDataFromLocalStorage()
const formAddTaskElement = document.querySelector('#addTask')
const dataCounterOfAllTasks = document.querySelectorAll('.list__board_counter')
const listElement = document.querySelector('.list__wrapper')
const rootTodoElement = document.querySelector('.todo .list__board_main')
const rootProgressElement = document.querySelector('.active .list__board_main')
const rootDoneElement = document.querySelector('.done .list__board_main')

//Handlers ---------------------------------------------------------------------------------------------------------------
formAddTaskElement.addEventListener('submit', handleSubmitTask)
listElement.addEventListener('change', handleChangeState)
listElement.addEventListener('click', handleClickRemove)

//Init -------------------------------------------------------------------------------------------------------------------
render(data)
clock.textContent = new Date().toLocaleTimeString()
clock.setAttribute('datetime', new Date().toLocaleTimeString())
refreshClock()

//Clock ------------------------------------------------------------------------------------------------------------------
async function refreshClock() {
  try {
    await setInterval(() => {
      clock.textContent = new Date().toLocaleTimeString()
      clock.setAttribute('datetime', new Date().toLocaleTimeString())
    }, 1000)
  }
  catch (error) {
    clock.textContent = `Data error`
  }
}

//Helper add task ------------------------------------------------------------------------------------------------------------
function handleSubmitTask(event) {
  event.preventDefault()
  const { target } = event
  const formData = new FormData(target)
  const formDataEntries = Object.fromEntries(formData.entries())
  const task = new Task(formDataEntries)
  data.push(task)
  Task.setDataToLocalStorage(data)
  render(data)
  target.reset()
}

//Helper render tasks ----------------------------------------------------------------------------------------------------
function render(payload = []) {
  rootTodoElement.innerHTML = ''
  rootProgressElement.innerHTML = ''
  rootDoneElement.innerHTML = ''

  payload.forEach(function (item) {
    switch (item.state) {
      case 'todo':
        rootTodoElement.insertAdjacentHTML('beforeend', templateListBoard(item))
        break;
      case 'progress':
        rootProgressElement.insertAdjacentHTML('beforeend', templateListBoard(item))
        break;
      case 'done':
        rootDoneElement.insertAdjacentHTML('beforeend', templateListBoard(item))
        break;
    }
  })

  countTasks()
}

//Helper count elements -------------------------------------------------------------------------------------------
function countTasks() {
  const dataTodoTasks = data.filter(function (item) {
    return item.state === 'todo'
  })
  const dataProgressTasks = data.filter(function (item) {
    return item.state === 'progress'
  })
  const dataDoneTasks = data.filter(function (item) {
    return item.state === 'done'
  })

  dataCounterOfAllTasks.forEach(function (item) {
    if (item.getAttribute('data-action') === 'counterTodo') {
      item.setAttribute('value', dataTodoTasks.length)
    }

    if (item.getAttribute('data-action') === 'counterProgress') {
      item.setAttribute('value', dataProgressTasks.length)
    }

    if (item.getAttribute('data-action') === 'counterDone') {
      item.setAttribute('value', dataDoneTasks.length)
    }
  })
}

//Helper change state --------------------------------------------------------------------------------------------------------
function handleChangeState({ target }) {
  const switchState = target.value
  const { id } = target.closest('.list__board_task').dataset

  switch (switchState) {
    case 'todo':
      data.map(function (item) {
        if (item.id === id) {
          item.state = 'todo'
        }
        return item
      })
      Task.setDataToLocalStorage(data)
      render(data)
      break;
    case 'progress':
      data.map(function (item) {
        if (item.id === id) {
          item.state = 'progress'
        }
        return item
      })
      Task.setDataToLocalStorage(data)
      render(data)
      break;
    case 'done':
      data.map(function (item) {
        if (item.id === id) {
          item.state = 'done'
        }
        return item
      })
      Task.setDataToLocalStorage(data)
      render(data)
      break;
  }
}

//Helper remove task --------------------------------------------------------------------------------------------------------
function handleClickRemove({ target }) {
  const removeAction = target.dataset.action

  switch (removeAction) {
    case 'confirmRemoveAll':
      data.length = 0
      localStorage.clear()
      render(data)
      break;
    case 'removeTodo':
      const { id } = target.closest('.list__board_task').dataset
      data.splice(data.findIndex(function (item) {
        return item.id === id
      }), 1)
      Task.setDataToLocalStorage(data)
      render(data)
      break;
  }
}

//Add task template in HTML ---------------------------------------------------------------------------------------------
function templateListBoard({ id, user, title, description, createdAt, state }) {
  const todoAttribute = (state === 'todo') ? 'selected' : ''
  const progressAttribute = (state === 'progress') ? 'selected' : ''
  const doneAttribute = (state === 'done') ? 'selected' : ''

  return `
    <div class="list__board_task" data-id=${id}>
      <div class="info">
        <span class="info__user">User:
          <input class="info__user_value" type="text" value="${user}" readonly>
        </span>
        <span class="info__date">Date:
          <input class="info__data_value" type="text" value="${createdAt}" readonly>
        </span>
      </div>
      <div class="task">
        <span class="task__title">Title:
          <textarea class="task__title_value" name="Todo title" readonly>${title}</textarea>
          <!-- <input class="task__title_value" type="text" value="0" readonly> -->
        </span>
        <span class="task__description">Description:
          <textarea class="task__description_value" name="Todo text" readonly>${description}</textarea>
          <!-- <input class="task__description_value" type="text" value="0" readonly> -->
        </span>
      </div>
      <div class="action">
        <select class="form-select action__select" aria-label="Default select example">
          <option value="todo" ${todoAttribute}>Todo</option>
          <option value="progress" ${progressAttribute}>In progress</option>
          <option value="done" ${doneAttribute}>Done</option>
        </select>
        <button type="button" class="btn btn-primary action__edit" data-bs-toggle="modal"
          data-bs-target="#editTodoModal" data-action="editTodo">
          Edit
        </button>
        <button type="button" class="btn btn-danger action__remove" data-action="removeTodo">Remove</button>
      </div>
    </div>
  `
}
