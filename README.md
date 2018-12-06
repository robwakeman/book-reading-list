# Book Reading List

## About

Book reading list app.

[Demo](http://robwakemandev.com/book-reading-list/)

This app is a demo of some of my coding practices:

- **HTML**
  - Form elements contain ARIA attributes for accessibility.
- **CSS**
  - CSS uses BEM methodology.
  - Flexbox is used for some layout.
  - The project is too small to justify the use of Sass.
  - Autoprefixer is not used as this app is not for production.
  - Minification of CSS is not used as this app is not for production.
  - CSS logical properties are used in place of physical counterparts for testing. If in production, I would consider using them only in combination with this [PostCSS plugin](https://github.com/jonathantneal/postcss-logical)
- **JavaScript**
  - The app uses native JavaScript to manipulate the DOM.
  - ES6 (ES2015) is used e.g. const, let, arrow functions, for..of loops.
  - Babel is not used to compile the JavaScript down to ES5 as this app is not for production.
  - Minification of JavaScript is not used as this app is not for production.

The book list is static and hardcoded.

## TODO

Replace static list of books with JSON data from a suitable API.

## License

book-reading-list is distributed under the terms of the GNU GPL version 2
