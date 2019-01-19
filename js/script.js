'use strict';

// flag to determine which book source to use - 'hardcoded' or 'api'
let bookSource = 'api';

// save elements into constants
const search = document.getElementById('search');
const searchMessage = document.querySelector('.search__message');
const addBookForm = document.getElementById('addBookForm');
const bookLists = document.querySelectorAll('.book-list');
const bookListHardcoded = document.getElementById('book-list-hardcoded');
const bookListApi = document.getElementById('book-list-api');
const bookListDeleteButtons = document.getElementsByClassName(
  'book-list__delete'
); // returns live HTMLCollection
const hideBooks = document.getElementById('hide-books-input');

// declare other variables
let bookList;
let bookTitles;
let booksOpenLibHtml;

console.log(bookLists);

// hide both lists and show selected list conditionally below
bookLists.forEach(list => {
  list.style.display = 'none';
});

if (bookSource === 'api') {
  bookList = document.getElementById('book-list-api');
  bookList.style.display = 'block';
  // set up bookTitles as live HTMLCollection to enable search and add functions to work in combination
  bookTitles = bookListApi.getElementsByClassName('book-list__title');
} else if (bookSource === 'hardcoded') {
  bookList = document.getElementById('book-list-hardcoded');
  bookList.style.display = 'block';
  // set up bookTitles as live HTMLCollection to enable search and add functions to work in combination
  bookTitles = bookListHardcoded.getElementsByClassName('book-list__title');
}

// get data from Open Library API
const getBooksOL = () => {
  // bookListHardcoded.style.display = 'none';

  $.getJSON(
    'http://openlibrary.org/subjects/crime.json?published_in=1800-1880&limit=5',
    function(data) {
      const booksFromApi = data.works; //array
      // console.log(booksFromApi.length);
      // console.table(booksFromApi);

      if (booksFromApi.length) {
        // there are books

        const booksOpenLib = booksFromApi.map(book => {
          return {
            bookOpenLibId: book.cover_edition_key,
            bookOpenLibTitle: book.title
          };
        });

        // console.log(booksOpenLib);

        if (booksOpenLib.length) {
          booksOpenLibHtml = booksOpenLib.map(book => {
            return (
              '<li id="' +
              book.bookOpenLibId +
              '" class="book-list__item"><span class="book-list__title">' +
              book.bookOpenLibTitle +
              '</span><button class="book-list__delete">Delete</button></li>'
            );
          });
        }

        // booksOpenLibHtml is an array, so need to convert it to a string with join
        bookListApi.innerHTML += booksOpenLibHtml.join('');
        addHighLighting();
      } else {
        // we don't have data - show markup to explain that
      }
    }
  ).fail(function() {
    console.log(jqxhr.responseText);
  });
};

// functions as function expressions (must be declared before being called)
const searchBooks = () => {
  let searchTerm = search.value.toLowerCase();

  if (searchTerm) {
    for (let i = 0; i < bookTitles.length; i++) {
      bookTitles[i].parentElement.classList.remove(
        'book-list__item--is-hidden'
      );
      if (bookTitles[i].textContent.toLowerCase().indexOf(searchTerm) != -1) {
        bookTitles[i].parentElement.classList.remove(
          'book-list__item--is-hidden'
        );
      } else {
        bookTitles[i].parentElement.classList.add('book-list__item--is-hidden');
      }
    }
  } else {
    for (let i = 0; i < bookTitles.length; i++) {
      bookTitles[i].parentElement.classList.remove(
        'book-list__item--is-hidden'
      );
    }
  }
};

const addBook = e => {
  e.preventDefault();
  const newBookTitle = document.getElementById('addBookInput').value;

  // need to clear search, because if filtered list of books still displays from a search and then add book, that newly added book won't display if search term not matched
  clearSearch();

  bookList.innerHTML += `
    <li id="" class="book-list__item">
    <span class="book-list__title">${newBookTitle}</span>
    <button class="book-list__delete">Delete</button>
    </li>
    `;

  clearSearch();
  // re-invoke highlight hover states
  addHighLighting();
};

const clearSearch = () => {
  search.value = '';
  for (let i = 0; i < bookTitles.length; i++) {
    bookTitles[i].parentElement.classList.remove('book-list__item--is-hidden');
  }
};

const addHighLighting = () => {
  for (let deleteButton of bookListDeleteButtons) {
    deleteButton.addEventListener('mouseenter', e =>
      e.target.parentElement.classList.toggle('book-list__item--is-hovered')
    );
    deleteButton.addEventListener('mouseleave', e =>
      e.target.parentElement.classList.toggle('book-list__item--is-hovered')
    );
  }
};

const deleteBook = e => {
  if (e.target.className === 'book-list__delete') {
    e.target.parentElement.remove();
  }
};

const hideBooksHandler = () => {
  if (hideBooks.checked) {
    bookList.style.display = 'none';
  } else {
    bookList.style.display = 'block';
  }
};

if (bookSource === 'api') {
  // get books from Open Library
  getBooksOL();
}

// add event listeners
search.addEventListener('keyup', searchBooks);
addBookForm.addEventListener('submit', addBook);
bookList.addEventListener('click', deleteBook);
hideBooks.addEventListener('change', hideBooksHandler);
addHighLighting();
