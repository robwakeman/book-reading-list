'use strict';

// save elements into variables
const search = document.getElementById('search');
const addBookForm = document.getElementById('addBookForm');
const bookList = document.querySelector('.book-list');
const bookListDeleteButtons = document.getElementsByClassName(
  'book-list__delete'
);
const hideBooks = document.getElementById('hide-books-input');
let bookTitles = document.querySelectorAll('.book-list__title');

// get data from Open Library API
const bookListApi = $('.book-list.book-list-api');
let booksOpenLibHtml = '';
const getBooks = () => {
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
      bookTitles[i].parentElement.style.display = 'none';
      if (bookTitles[i].textContent.toLowerCase().indexOf(searchTerm) != -1) {
        bookTitles[i].parentElement.style.display = 'flex';
      }
    }
  } else {
    for (let i = 0; i < bookTitles.length; i++) {
      bookTitles[i].parentElement.style.display = 'flex';
    }
  }
};

const addBook = e => {
  e.preventDefault();
  const newBookTitle = document.getElementById('addBookInput').value;

  // need to clear search, because if filtered list of books still displays from a search and then add book, that newly added book won't display if search term not matched
  clearSearch();

  bookList.innerHTML += `
    <li class="book-list__item">
    <span class="book-list__title">${newBookTitle}</span>
    <button class="book-list__delete">Delete</button>
    </li>
    `;

  // update bookTitles NodeList, because new book added
  bookTitles = document.querySelectorAll('.book-list__title');

  // re-invoke highlight hover states
  addHighLighting();
};

const clearSearch = () => {
  search.value = '';
  for (let i = 0; i < bookTitles.length; i++) {
    bookTitles[i].parentElement.style.display = 'flex';
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

// get books
getBooks();

// add event listeners
search.addEventListener('keyup', searchBooks);
addBookForm.addEventListener('submit', addBook);
bookList.addEventListener('click', deleteBook);
hideBooks.addEventListener('change', hideBooksHandler);
addHighLighting();
