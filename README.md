# Book Reading List

## About

Book reading list app.

[Demo](http://dev.robwakeman.com/book-reading-list/)

This app is a demo of some of my coding practices:

- **HTML**
  - Form elements contain ARIA attributes for accessibility.
  - Add book validation is simply managed by the required attribute on the input field. If used in production, the validation would be a more elegant solution with consistent cross-browser support.
- **CSS**
  - If used in a production context, I would consider using Normalize.css, which would mean rewriting some of the existing custom CSS in this project.
  - CSS uses BEM methodology.
  - Flexbox and Grid is used for some layout.
  - The project is too small to justify the use of Sass.
  - CSS logical properties are used in place of physical counterparts for testing. If in production, I would consider using them only in combination with this [PostCSS plugin](https://github.com/jonathantneal/postcss-logical).
  - If used in a production context, Autoprefixer and minification would be used. Ensure Autoprefixer Grid settings are set to true either via JS or [control comments](https://css-tricks.com/css-grid-in-ie-duplicate-area-names-now-supported/#article-header-id-10)
- **JavaScript**
  - The app uses both vanilla JavaScript and jQuery.
  - ES6 (ES2015) is used e.g. const, let, arrow functions, for..of loops.
  - If used in a production context, Babel would be used to compile the JavaScript down to ES5 and then optimised using a tool like UglifyJS.
  - Any changed data is not persistent.

The original book list is static and hardcoded. It is hidden when the Open Library API call is made, which then populates the list.

## TODO

- No need to add IE11 fallbacks for CSS Grid with the CSS as it stands. Only consider fallbacks if Grid features are used that aren't supported by IE11 e.g. grid-auto-rows and span

## License

book-reading-list is distributed under the terms of the GNU GPL version 2
