// Book class: represent a book 
class Book {
  constructor (title, author, isbn) {
    this.title = title; 
    this.author = author; 
    this.isbn = isbn; 
  }
}

// UI class: to handle ui tasks 
class UI {
  static displayBooks () {    
    const books = Store.getBooks(); 
    books.forEach(book => UI.insertBookInList(book))
  }
  
  static insertBookInList (book) {
    const list = document.querySelector('#book-list'); 
    const row = document.createElement('tr'); 
    
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href='#' class='btn btn-danger btn-small delete'>X</a></td>
    `; 
    
    list.appendChild(row); 
  }
  
  static deleteBook (el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove()
    }
  }
  
  static showAlert (message, className) {
    const div = document.createElement('div'); 
    div.className = `alert alert-${className}`; 
    div.appendChild(document.createTextNode(message)); 
    const container = document.querySelector('.container'); 
    const form = document.querySelector('#book-form'); 
    container.insertBefore(div, form); 
    // alert will disappear in 2.5 seconds 
    setTimeout(() => {
      document.querySelector('.alert').remove(); 
    }, 2500)
  }
  
  static clearFields () {
    document.querySelector('#title').value = ''    
    document.querySelector('#author').value = ''    
    document.querySelector('#isbn').value = ''    
  }
}

// store class: handles storage 
class Store {
  static getBooks () {
    let books; 
    if (localStorage.getItem('books') === null) {
      books = []
    } else {
      books = JSON.parse(localStorage.getItem('books')); 
    }
    
    return books; 
  }
  
  static addBook (book) {
    const books = Store.getBooks(); 
    
    books.push(book); 
    
    localStorage.setItem('books', JSON.stringify(books)); 
  }
  
  static removeBook (isbn) {
    const books = Store.getBooks(); 
    
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1); 
      }
    })
    
    localStorage.setItem('books', JSON.stringify(books))
  }
}

// event listener: display books 
document.addEventListener('DOMContentLoaded', UI.displayBooks)

// event: add a book 
document.querySelector('#book-form').addEventListener('submit', (e) => {
  // prevent browser from reloading
  e.preventDefault()
  // get the values of the inputs
  const title = document.querySelector('#title').value; 
  const author = document.querySelector('#author').value
  const isbn = document.querySelector('#isbn').value; 
  // validate 
  if (!title || !author || !isbn) {
    UI.showAlert('Please fill in all the required fields', 'danger')
  } else {
    // instantiate a new Book instance 
    const book = new Book(title, author, isbn); 
    // add new instance to the list 
    UI.insertBookInList(book); 
    // Add book to local storage 
    Store.addBook(book); 
    // Show completed alert 
    UI.showAlert('The book has been added to the list', 'success')
    // clear inputs 
    UI.clearFields(); 
  }
})

// Event: remove a book 

document.querySelector('#book-list').addEventListener('click', (e) => {
  // Remove book from the UI
  UI.deleteBook(e.target); 
  // Remove book from local storage 
  const isbn = e.target.parentElement.previousElementSibling.textContent; 
  Store.removeBook(isbn); 
  // Show alert upon completion 
  UI.showAlert('The book has been removed from your list', 'warning')
})
