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

export { Task }
