# react-responsive-ui

[![npm version](https://img.shields.io/npm/v/react-responsive-ui.svg?style=flat-square)](https://www.npmjs.com/package/react-responsive-ui)

Responsive React UI components.

[See Demo](https://catamphetamine.github.io/react-responsive-ui/)

## Install

```
npm install react-responsive-ui --save
```

The overall requirement is React >= 16.3, but most of the components only require React >= 0.14, except for a few:

* `<Tooltip/>` (requires "React Portals" from React >= 16).
* `<DragAndDrop/>` ([`react-dnd`](https://github.com/react-dnd/react-dnd) requires React >= 16.3).

For using components with React < 16.3 import them individually like `import Select from 'react-responsive-ui/modules/Select'` or `import Select from 'react-responsive-ui/commonjs/Select'` instead of `import { Select } from 'react-responsive-ui'` because otherwise it would break due to a [`react-dnd` bug](https://github.com/react-dnd/react-dnd/issues/1113).

## Use

See the [demo page](https://catamphetamine.github.io/react-responsive-ui/). It has code examples for every component.

## CSS

The CSS for this library must be included on a page too.

#### When using Webpack

```js
require('react-responsive-ui/style.css')
```

And set up a [`postcss-loader`](https://github.com/postcss/postcss-loader) with a [CSS autoprefixer](https://github.com/postcss/autoprefixer) for supporting old web browsers (e.g. `last 4 versions`, `iOS >= 7`, `Android >= 4`).

#### When not using Webpack

Get the `style.css` file from this package, process it with a [CSS autoprefixer](https://github.com/postcss/autoprefixer) for supporting old web browsers (e.g. `last 4 versions`, `iOS >= 7`, `Android >= 4`), and then include it on a page.

```html
<head>
  <link rel="stylesheet" href="/css/react-responsive-ui/style.css"/>
</head>
```

## Small Screen

The [`small-screen`](https://github.com/catamphetamine/react-responsive-ui/tree/master/small-screen) directory contains "small screen" ("mobile devices") styles for some of the components. E.g. `<Select/>`s, `<Autocomplete/>`s, `<ExpandableMenu/>`s, `<DatePicker/>`s and `<Modal/>`s can open in fullscreen and `<Snackbar/>` are expanded in full screen (not neccessarily a good idea though).

Native CSS [`@import`](https://developer.mozilla.org/docs/Web/CSS/@import) example:

```css
/* Main style. */
@import url(~react-responsive-ui/style.css)
/* Tweaks `<Modal/>`s for mobile devices a bit. */
@import url(~react-responsive-ui/small-screen/Modal.css) (max-width: 720px)
/* Tweaks `<Snackbar/>`s for mobile devices a bit. */
@import url(~react-responsive-ui/small-screen/Snackbar.css) (max-width: 720px)
/* Places a click-capturing overlay above `<DatePicker/>` input. */
@import url(~react-responsive-ui/small-screen/DatePicker.InputOverlay.css) (max-width: 720px)
```

SCSS `@import` example:

```css
@import "~react-responsive-ui/style";

@media (max-width: 720px) {
  @import "~react-responsive-ui/small-screen/Modal";
  @import "~react-responsive-ui/small-screen/Snackbar";
  @import "~react-responsive-ui/small-screen/DatePicker.InputOverlay";
}
```

## Variables

This library uses [native CSS variables](https://medium.freecodecamp.org/learn-css-variables-in-5-minutes-80cf63b4025d) for easier styling. See [`variables.css`](https://github.com/catamphetamine/react-responsive-ui/blob/master/variables.css) for the list of all available variables. These variables have some sensible defaults which can be overridden in a separate `react-responsive-ui-variables.css` file (analogous to the original `variables.css` file).

#### When not using Webpack

```html
<head>
  <!-- React Responsive UI -->
  <link rel="stylesheet" href="/css/react-responsive-ui/style.css"/>
  <!-- Custom variable values -->
  <link rel="stylesheet" href="/css/react-responsive-ui-variables.css"/>
</head>
```

#### When using Webpack

```js
// React Responsive UI.
require('react-responsive-ui/style.css')
// Custom variable values.
require('./src/styles/react-responsive-ui-variables.css')
```

Native CSS variables work in all modern browsers, but older ones like Internet Explorer [wont't support them](https://caniuse.com/#search=var). For compatibility with such older browsers one can use a CSS transformer like [PostCSS](http://postcss.org/) with a "CSS custom properties" plugin like [`postcss-css-variables`](https://github.com/MadLittleMods/postcss-css-variables). Check that it actually replaces `var()`s with the actual values in the output CSS.

An example for Webpack and SCSS:

```css
@import "~react-responsive-ui/style";

@media (max-width: 720px) {
  @import "~react-responsive-ui/small-screen/Modal";
  @import "~react-responsive-ui/small-screen/Snackbar";
  @import "~react-responsive-ui/small-screen/DatePicker.InputOverlay";
}

// Replace the default variable values.
:root {
  --rrui-unit               : 12px;
  --rrui-white-color        : #f0f7ff;
  --rrui-black-color        : #112233;
  --rrui-accent-color       : #cc0000;
  --rrui-accent-color-light : #ee0000;
  --rrui-gray-color         : #7f7f7f;
}
```

[An example for PostCSS](https://github.com/catamphetamine/webpack-react-redux-server-side-render-example/blob/master/src/styles/react-responsive-ui.css)

## Asterisk on required fields

```css
/* (when the `value` is empty) */
/* Required input field label asterisk. */
.rrui__input-label--required:after,
.rrui__select__selected-label--required:after
{
  content     : '*';
  margin-left : 0.2em;
}
```

## Reducing footprint

Webpack 4 still can't "tree-shake" simple cases like

```js
import { Modal, Button, TextInput } from 'react-responsive-ui'
```

So if one's using only a small subset of this library it could be imported like so

```js
import Modal     from 'react-responsive-ui/modules/Modal'
import Button    from 'react-responsive-ui/modules/Button'
import TextInput from 'react-responsive-ui/modules/TextInput'
```

or for CommonJS

```js
import Modal     from 'react-responsive-ui/commonjs/Modal'
import Button    from 'react-responsive-ui/commonjs/Button'
import TextInput from 'react-responsive-ui/commonjs/TextInput'
```

Which results in a much smaller bundle size.

The same can be done for CSS: instead of importing the whole `react-responsive-ui/style.css` bundle one could import only the necessary styles from `react-responsive-ui/styles/` like `react-responsive-ui/styles/Button.css`. There's a catch though: those stylesheets are usually dependent on each other and, for example, the `<Button/>` component actually requires three different stylesheets to be imported:

* `react-responsive-ui/styles/Button.css`
* `react-responsive-ui/styles/ButtonReset.css`
* `react-responsive-ui/styles/Input.css`

## Validation

Each form component receives an `error : String` error message property.

## Outline

By default all `<Button/>`s, `<TextInput/>`s, `<DatePicker/>`s, `<Autocomplete/>`s and `<Select/>`s have `outline: none` CSS rule set. To re-enable outlines on those components call the exported `showOutline()` function.

```js
import { showOutline } from 'react-responsive-ui'

showOutline(true)
```

## Supported Browsers

IE 11, Edge, Firefox, Chrome, Safari — have been tested.

Expandable components (`Select`, `Autocomplete`, `ExpandableMenu`, `Expandable`) require `Promise` (get a polyfill for IE 11).

## Known Issues

An overflown `<Modal/>` scroll is janky on iOS because it tries to scroll `<body/>` instead of the `<Modal/>` contents. [That's how it is on iOS](https://codeandmortar.com/blog/fed-tips-1/).

## Contributing

After cloning this repo, ensure dependencies are installed by running:

```sh
npm install
```

This module is written in ES6 and uses [Babel](http://babeljs.io/) for ES5
transpilation. Widely consumable JavaScript can be produced by running:

```sh
npm run build
```

Once `npm run build` has run, you may `import` or `require()` directly from
node.

After developing, the full test suite can be evaluated by running:

```sh
npm test
```

When you're ready to test your new functionality on a real project, you can run

```sh
npm pack
```

It will `build`, `test` and then create a `.tgz` archive which you can then install in your project folder

```sh
npm install [module name with version].tar.gz
```

## License

[MIT](LICENSE)