# Book Reading List

## About

Book reading list app.

[Demo](http://robwakemandev.com/book-reading-list/)

This app is a demo of some of my coding practices:

- **HTML**
  - Form elements contain ARIA attributes for accessibility.
- **CSS**
  - CSS uses BEM methodology.
  - Flexbox and Grid is used for some layout.
  - The project is too small to justify the use of Sass.
  - CSS logical properties are used in place of physical counterparts for testing. If in production, I would consider using them only in combination with this [PostCSS plugin](https://github.com/jonathantneal/postcss-logical).
  - If used in a production context, Autoprefixer and minification would be used. Ensure Autoprefixer Grid settings are set to true either via JS or [control comments](https://css-tricks.com/css-grid-in-ie-duplicate-area-names-now-supported/#article-header-id-10)
- **JavaScript**
  - The app uses both native JavaScript and jQuery.
  - ES6 (ES2015) is used e.g. const, let, arrow functions, for..of loops.
  - If used in a production context, Babel would be used to compile the JavaScript down to ES5 and then optimised using a tool like UglifyJS.
  - Any changed data is not persistent.

The original book list is static and hardcoded. It is hidden when the Open Library API call is made, which then populates the list.

## TODO

- The book data is currently sourced from the [Open Library API](https://openlibrary.org/dev/docs/api/books) and this option set with a flag in the script. The other data source option is to use the hardcoded books in the HTML. To set up a select field to opt between Open Library API book list and hardcoded book list.
- No need to add IE11 fallbacks for CSS Grid with the CSS as it stands. Only consider fallbacks if Grid features are used that aren't supported by IE11 e.g. grid-auto-rows and span

## License

book-reading-list is distributed under the terms of the GNU GPL version 2
