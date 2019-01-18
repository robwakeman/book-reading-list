'use strict';

// flag to determine which book source to use - hardcoded or api
let bookSource = 'api';
let match = false;

// save elements into identifiers and variables
const search = document.getElementById('search');
const searchMessage = document.querySelector('.search__message');
const addBookForm = document.getElementById('addBookForm');
const bookList = document.querySelector('.book-list');
const bookListHardcoded = document.querySelector(
  '.book-list.book-list-hardcoded'
);

// get book titles for use in search - set initial value to hardcoded and reset in api call if made
// I think this needs to be a live HTMLCollection so need to go back to using getElementsByClassName() or similar
let bookTitles = document.querySelectorAll(
  '.book-list-hardcoded .book-list__title'
);
const bookListApi = $('.book-list.book-list-api');
const bookListDeleteButtons = document.getElementsByClassName(
  'book-list__delete'
); // returns HTMLCollection (live)
const hideBooks = document.getElementById('hide-books-input');

// declare booksOpenLibHtml variable
let booksOpenLibHtml = '';

// get data from Open Library API
const getBooksOL = () => {
  bookListHardcoded.style.display = 'none';

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

        bookListApi.append(booksOpenLibHtml);
        addHighLighting();
        // get book titles for use in search
        // I think this needs to be a live HTMLCollection so need to go back to using getElementsByClassName() or similar
        bookTitles = document.querySelectorAll(
          '.book-list-api .book-list__title'
        );
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
      // bookTitles[i].parentElement.style.display = 'none';
      bookTitles[i].parentElement.classList.remove(
        'book-list__item--is-hidden'
      );
      // match = false;
      // console.log('match is:', match);
      if (bookTitles[i].textContent.toLowerCase().indexOf(searchTerm) != -1) {
        // bookTitles[i].parentElement.style.display = 'flex';
        bookTitles[i].parentElement.classList.remove(
          'book-list__item--is-hidden'
        );
        // match between search term and titles
        // console.log('match between search term and titles');
        // match = true;
        // console.log('match is:', match);
      } else {
        bookTitles[i].parentElement.classList.add('book-list__item--is-hidden');
        // NO match between search term and titles
        // console.log('NO match between search term and titles');
        // match = false;
        // console.log('match is:', match);
      }
    }
  } else {
    for (let i = 0; i < bookTitles.length; i++) {
      // bookTitles[i].parentElement.style.display = 'flex';
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
    // bookTitles[i].parentElement.style.display = 'flex';
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

// get books from Open Library
if (bookSource === 'api') {
  getBooksOL();
} else if (bookSource === 'hardcoded') {
  // disable api and show hardcoded list - TODO
}

// add event listeners
search.addEventListener('keyup', searchBooks);
addBookForm.addEventListener('submit', addBook);
bookList.addEventListener('click', deleteBook);
hideBooks.addEventListener('change', hideBooksHandler);
addHighLighting();
