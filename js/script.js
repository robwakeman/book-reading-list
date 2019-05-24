'use strict';

// flag to determine which book source to use - 'hardcoded' or 'api' - default is api
let bookSource = 'api';

// save elements into constants
const dataSourceSelect = document.getElementById('data-source-select');
const search = document.getElementById('search');
const apiNoBooksMessage = document.querySelector('.books__message-api-no-books');
const searchMessage = document.querySelector('.books__message-search');
const deleteMessage = document.querySelector('.books__message-delete');
const addBookForm = document.getElementById('addBookForm');
const bookLists = document.querySelectorAll('.book-list');
const bookListDeleteButtons = document.getElementsByClassName('book-list__delete'); // returns live HTMLCollection
const hideBooksForm = document.getElementById('hide-books-form');
const hideBooksInput = document.getElementById('hide-books-input');
const loader = document.querySelector('.loader');

// declare other variables
let bookList;
let bookTitles;
let booksOpenLibHtml;
let books;
let booksHidden;

const dataSourceSelectHandler = () => {
  bookSource = dataSourceSelect.value;
  initBookList();
  checkAllBooksDeleted();
  hideBooksInput.checked = false;
  loader.classList.add('is-hidden');
};

const initBookList = () => {
  // if bookSource flag is set to hardcoded, set data source select field option to bookSource on page load
  dataSourceSelect.value = bookSource;

  // hide both lists and show selected list conditionally below
  bookLists.forEach(list => {
    list.classList.add('is-hidden');
  });

  if (bookSource === 'api') {
    bookList = document.getElementById('book-list-api');
  } else {
    bookList = document.getElementById('book-list-hardcoded');
  }

  showBookListAndHideBooksForm();

  books = bookList.getElementsByClassName('book-list__item');
  booksHidden = bookList.getElementsByClassName('book-list__item--is-hidden');
  // set up bookTitles as live HTMLCollection to enable search and add functions to work in combination
  bookTitles = bookList.getElementsByClassName('book-list__title');
  // add delete functionality to delete buttons
  bookList.addEventListener('click', deleteBook);

  // only check for deleted books here if it's the hardcoded list, cos the api list won't have loaded yet
  if (bookSource === 'hardcoded') {
    checkAllBooksDeleted();
  }
  addHighLighting();
  resetSearch();
};

// handle errors
function handleErrors(res) {
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return res;
}

function getBooksOLFetch() {
  // show loading spinner
  loader.classList.remove('is-hidden');
  // do fetch
  fetch('http://openlibrary.org/subjects/crime.json?published_in=1840-1880&limit=5')
    .then(handleErrors)
    .then(res => res.json())
    .then(data => {
      // hide loading spinner
      loader.classList.add('is-hidden');
      // do sth with data
      console.log(data.works);
      // copied from getBooksOL
      const booksFromApi = data.works; //array

      if (booksFromApi.length) {
        // there are books
        apiNoBooksMessage.classList.add('is-hidden');

        const booksOpenLib = booksFromApi.map(book => {
          return {
            bookOpenLibId: book.cover_edition_key,
            bookOpenLibTitle: book.title,
          };
        });

        if (booksOpenLib.length) {
          booksOpenLibHtml = booksOpenLib.map(book => {
            return `<li id="${book.bookOpenLibId}" class="book-list__item"><span class="book-list__title">${book.bookOpenLibTitle}</span><button class="book-list__delete">Delete</button></li>`;
          });
        }

        // booksOpenLibHtml is an array, so need to convert it to a string with join
        bookList.innerHTML += booksOpenLibHtml.join('');
        addHighLighting();
        checkAllBooksDeleted();
      } else {
        // we don't have data
        hideBookListAndHideBooksForm();
        // show api no books message
        apiNoBooksMessage.classList.remove('is-hidden');
      }
    })
    .catch(err => console.log('Catch Error', err));
}

// get data from Open Library API
const getBooksOL = () => {
  // show loading spinner
  loader.classList.remove('is-hidden');
  $.getJSON('http://openlibrary.org/subjects/crime.json?published_in=1840-1880&limit=5', data => {
    const booksFromApi = data.works; //array

    if (booksFromApi.length) {
      // there are books
      apiNoBooksMessage.classList.add('is-hidden');

      const booksOpenLib = booksFromApi.map(book => {
        return {
          bookOpenLibId: book.cover_edition_key,
          bookOpenLibTitle: book.title,
        };
      });

      if (booksOpenLib.length) {
        booksOpenLibHtml = booksOpenLib.map(book => {
          return `<li id="${book.bookOpenLibId}" class="book-list__item"><span class="book-list__title">${book.bookOpenLibTitle}</span><button class="book-list__delete">Delete</button></li>`;
        });
      }

      // booksOpenLibHtml is an array, so need to convert it to a string with join
      bookList.innerHTML += booksOpenLibHtml.join('');
      addHighLighting();
      checkAllBooksDeleted();
    } else {
      // we don't have data
      hideBookListAndHideBooksForm();
      // show api no books message
      apiNoBooksMessage.classList.remove('is-hidden');
    }
  })
    .done(() => {
      console.log('Open Library request completed');
    })
    .fail(e => {
      console.error(e);
    })
    .always(() => {
      // hide loading spinner
      loader.classList.add('is-hidden');
    });
};

const searchBooks = () => {
  let searchTerm = search.value.toLowerCase();

  if (searchTerm) {
    for (let i = 0; i < bookTitles.length; i++) {
      bookTitles[i].parentElement.classList.remove('book-list__item--is-hidden');
      if (bookTitles[i].textContent.toLowerCase().indexOf(searchTerm) != -1) {
        bookTitles[i].parentElement.classList.remove('book-list__item--is-hidden');
      } else {
        bookTitles[i].parentElement.classList.add('book-list__item--is-hidden');
      }
    }

    checkIfBooksShowing();
  } else {
    // no search term
    resetSearch();
  }
};

const addBook = e => {
  e.preventDefault();
  const newBookTitle = document.getElementById('addBookInput').value;

  // need to clear search, because if filtered list of books still displays from a search and then add book, that newly added book won't display if search term not matched
  resetSearch();

  bookList.innerHTML += `
    <li id="" class="book-list__item">
    <span class="book-list__title">${newBookTitle}</span>
    <button class="book-list__delete">Delete</button>
    </li>
    `;

  checkAllBooksDeleted();
  // checkIfBooksShowing();
  // re-invoke highlight hover states
  addHighLighting();
};

const booksShowingSearch = () => {
  searchMessage.classList.add('is-hidden');
  showBookListAndHideBooksForm();
};

const noBooksShowingSearch = () => {
  // only show search message if not all books have been deleted, i.e. if checkAllBooksDeleted is false
  if (!checkAllBooksDeleted()) {
    searchMessage.classList.remove('is-hidden');
  }

  hideBookListAndHideBooksForm();
};

const checkIfBooksShowing = () => {
  if (Array.from(booksHidden).length === Array.from(books).length) {
    // show search message - no books found
    noBooksShowingSearch();
  } else {
    booksShowingSearch();
  }
};

const clearSearch = () => {
  search.value = '';
};

const resetSearch = () => {
  search.value = '';
  for (let i = 0; i < bookTitles.length; i++) {
    bookTitles[i].parentElement.classList.remove('book-list__item--is-hidden');
  }
  booksShowingSearch();
};

const addHighLighting = () => {
  for (let deleteButton of bookListDeleteButtons) {
    deleteButton.addEventListener('mouseenter', e => e.target.parentElement.classList.add('book-list__item--is-hovered'));
    deleteButton.addEventListener('mouseleave', e => e.target.parentElement.classList.remove('book-list__item--is-hovered'));
  }
};

const showBookListAndHideBooksForm = () => {
  bookList.classList.remove('is-hidden');
  hideBooksForm.classList.remove('is-hidden');
};

const hideBookListAndHideBooksForm = () => {
  bookList.classList.add('is-hidden');
  hideBooksForm.classList.add('is-hidden');
};

// check if all books have been deleted
const checkAllBooksDeleted = () => {
  if (Array.from(books).length === 0) {
    // All books deleted - show delete message (You've deleted all the books...)
    deleteMessage.classList.remove('is-hidden');
    hideBookListAndHideBooksForm();
    return true;
  } else {
    // There is at least 1 book in the list - hide delete message (You've deleted all the books...)
    deleteMessage.classList.add('is-hidden');
    bookList.classList.remove('is-hidden');
    hideBooksForm.classList.remove('is-hidden');
    return false;
  }
};

const deleteBook = e => {
  if (e.target.className === 'book-list__delete') {
    e.target.parentElement.remove();
  }
  checkAllBooksDeleted();
};

const hideBooksInputHandler = () => {
  if (hideBooksInput.checked) {
    bookList.classList.add('is-hidden');
  } else {
    bookList.classList.remove('is-hidden');
  }
};

if (bookSource === 'api') {
  // get books from Open Library
  // getBooksOL();
  getBooksOLFetch();
}

initBookList();

// add event listeners
dataSourceSelect.addEventListener('change', dataSourceSelectHandler);
search.addEventListener('keyup', searchBooks);
addBookForm.addEventListener('submit', addBook);
hideBooksInput.addEventListener('change', hideBooksInputHandler);
