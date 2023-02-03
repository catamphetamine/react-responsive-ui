# react-responsive-ui

[![npm version](https://img.shields.io/npm/v/react-responsive-ui.svg?style=flat-square)](https://www.npmjs.com/package/react-responsive-ui)

Responsive React UI components.

[See Demo](https://catamphetamine.gitlab.io/react-responsive-ui/)

## GitHub

On March 9th, 2020, GitHub, Inc. silently [banned](https://medium.com/@catamphetamine/how-github-blocked-me-and-all-my-libraries-c32c61f061d3) my account (and all my libraries) without any notice. I opened a support ticked but they didn't answer. Because of that, I had to move all my libraries to [GitLab](https://gitlab.com/catamphetamine).

## Install

```
npm install react-responsive-ui --save
```

React >= 16.3 is required.

## Use

See the [demo page](#demo). It has code examples for every component.

## Demo

[Online demo page](https://catamphetamine.gitlab.io/react-responsive-ui/).

To run the demo page locally:

```
npm run demo
```

And then go to http://localhost:8080

## CSS

The CSS for this library resides in `react-responsive-ui/style.css` file and should be included on a page.

The stylesheet uses [native CSS variables](https://medium.freecodecamp.org/learn-css-variables-in-5-minutes-80cf63b4025d) for easier styling. See [`variables.css`](https://gitlab.com/catamphetamine/react-responsive-ui/blob/master/variables.css) for the list of all available variables. These variables have some sensible defaults which can be overridden:

```css
:root {
  --rrui-unit               : 12px;
  --rrui-white-color        : white;
  --rrui-black-color        : black;
  --rrui-accent-color       : blue;
  --rrui-accent-color-light : cyan;
  --rrui-gray-color         : gray;
}
```

Native CSS variables work in all modern browsers, but older ones like Internet Explorer [wont't support them](https://caniuse.com/#search=var). For compatibility with such older browsers one can use a CSS transformer like [PostCSS](http://postcss.org/) with a "CSS custom properties" plugin like [`postcss-custom-properties`](https://github.com/postcss/postcss-custom-properties).

#### When using Webpack

```js
// React Responsive UI.
require('react-responsive-ui/style.css')
// Custom variable values.
require('./src/styles/react-responsive-ui-custom-variable-values.css')
```

And set up a [`postcss-loader`](https://github.com/postcss/postcss-loader) with a [CSS autoprefixer](https://github.com/postcss/autoprefixer) for supporting old web browsers.

#### When not using Webpack

Get the `style.css` file from this package, process it with a [CSS autoprefixer](https://github.com/postcss/autoprefixer) for supporting old web browsers, and then include it on a page.

```html
<head>
  <!-- React Responsive UI -->
  <link rel="stylesheet" href="/css/react-responsive-ui/style.css"/>
  <!-- Custom variable values -->
  <link rel="stylesheet" href="/css/react-responsive-ui-custom-variable-values.css"/>
</head>
```

## Small Screen

The [`small-screen`](https://gitlab.com/catamphetamine/react-responsive-ui/tree/master/small-screen) directory contains "small screen" ("mobile devices") styles for some of the components. For example, `<Select/>`s, `<Autocomplete/>`s, `<ExpandableMenu/>`s, `<DatePicker/>`s can open in fullscreen (not neccessarily a good idea though). `<Modal/>`s have less padding and `<Snackbar/>`s are full-width. These CSS files may also use [native CSS variables](https://medium.freecodecamp.org/learn-css-variables-in-5-minutes-80cf63b4025d).

Native CSS [`@import`](https://developer.mozilla.org/docs/Web/CSS/@import) example:

```css
/* Main style. */
@import url(~react-responsive-ui/style.css)
/* Less padding on `<Modal/>`s on mobile devices. */
@import url(~react-responsive-ui/small-screen/Modal.css) (max-width: 768px)
/* Full-width `<Snackbar/>`s on mobile devices. */
@import url(~react-responsive-ui/small-screen/Snackbar.css) (max-width: 768px)
/* Places a click-capturing overlay above `<DatePicker/>` input
   so that the `<input/>` is not focused on touch meaning that the
   keyboard won't slide in when the user taps the `<DatePicker/>` input. */
@import url(~react-responsive-ui/small-screen/DatePicker.InputOverlay.css) (max-width: 768px)
```

<!--
SCSS `@import` example:

```css
@import "~react-responsive-ui/style";

@media (max-width: 768px) {
  @import "~react-responsive-ui/small-screen/Modal";
  @import "~react-responsive-ui/small-screen/Snackbar";
  @import "~react-responsive-ui/small-screen/DatePicker.InputOverlay";
}
```
-->

## Validation

Each form component can be passed an `error: String` property. When passed, the component will be styled as "invalid" and the `error` will be displayed under the component.

## Asterisk on required fields

To show asterisks (`*`) on required fields' labels:

When field `value` is empty:

```css
/* (when the `value` is empty) */
/* Required input field labels will have asterisks. */
.rrui__input-label--required:after {
  content: '*';
  margin-left: 0.2em;
}
```

Regardless of whether the field `value` is empty or not:

```css
/* (regardless of whether the `value` is empty or not) */
/* Required input field labels will have asterisks. */
.rrui__input-label--required-field:after {
  content: '*';
  margin-left: 0.2em;
}
```

## Supported Browsers

IE 11, Edge, Firefox, Chrome, Safari (macOS, iOS) — have been tested.

Expandable components (`Select`, `Autocomplete`, `ExpandableMenu`) require `Promise` which is not present in IE 11 and requires a `Promise` polyfill to be included on a page.

## Reducing footprint

### Code

For a "tree-shaking" bundler (should work, but check it yourself just in case):

```js
import { Modal, Button, TextInput } from 'react-responsive-ui'
```

For "ECMAScript modules" imports:

```js
import Modal     from 'react-responsive-ui/modules/Modal'
import Button    from 'react-responsive-ui/modules/Button'
import TextInput from 'react-responsive-ui/modules/TextInput'
```

For CommonJS imports:

```js
import Modal     from 'react-responsive-ui/commonjs/Modal'
import Button    from 'react-responsive-ui/commonjs/Button'
import TextInput from 'react-responsive-ui/commonjs/TextInput'
```

### Styles

The CSS styles could also be imported selectively (theoretically): instead of importing the whole `react-responsive-ui/style.css` bundle, one could import just the necessary styles from the `react-responsive-ui/styles/` folder. But there's a catch: some components' styles may also require some other styles to be loaded.

For example, the `<Button/>` component requires the following stylesheets to be loaded:

* `react-responsive-ui/styles/Button.css`
* `react-responsive-ui/styles/ButtonReset.css`
* `react-responsive-ui/styles/Input.css`

And the `<DatePicker/>` component requires the following stylesheets to be loaded (didn't check):

* `react-responsive-ui/styles/DatePicker.css`
* `react-responsive-ui/styles/ButtonReset.css`
* `react-responsive-ui/styles/Input.css`
* `react-responsive-ui/styles/TextInput.css`
* `react-responsive-ui/styles/Expandable.css`
* `react-responsive-ui/styles/Close.css`

And don't forget about also including `react-responsive-ui/variables.css` when going with the selective styles import approach.

So it might be easier to just import the whole `react-responsive-ui/style.css` file.

## Outline

By default all buttons and inputs have `rrui__outline` CSS class attached to them which hides the default browser outline for focused components.

```css
.rrui__outline:not(.rrui__outline--default) {
  outline: none;
}
```

Instead of using the default browser outline which doesn't look pretty by any standards and which nobody uses (not "Google", not "Apple", not anyone else) the default `react-responsive-ui` styles define some custom `:focus` styling for most cases (though not for all of them). Still, these out-of-the-box `:focus` styles are quite subtle and if a developer is implementing a [WAI-ARIA](https://developers.google.com/web/fundamentals/accessibility/)-compliant website then they should make sure that those `:focus` styles are more pronounced in each case.

Alternatively, those looking for a very-quick-and-dirty solution can use the same default browser outline, but prettier.

```css
.rrui__outline:focus {
  box-shadow: 0 0 0 0.15rem #00aaff;
}
```

If a developer still prefers the default browser outline then they still can manually add `rrui__outline--default` CSS class to buttons and inputs to prevent `outline: none` CSS rule from being applied.

There's also an exported component called `<KeyboardNavigationListener/>` which listens to `keydown` events on `document.body`, and when it detects a `Tab` key being pressed it adds `rrui__tabbing` CSS class to `document.body`. Any further mouse or touch events reset the `rrui__tabbing` CSS class. This way `rrui__outline` can only be shown when the user is actually tabbing. It's still not considered a 100%-formally-correct solution because "screen readers" still emit all kinds of mouse events, or maybe some "screen readers" hypothetically don't emit a "keydown" event for the `Tab` key — who knows. It's more of an experimental feature. There're some other possible ideas like `./source/Interaction.js`.

## Inspecting Expandables

Expandables are implemented in such a way that they collapse when losing focus. This may present difficulties when trying to inspect expandable content via DevTools because switching to DevTools captures focus causing expandables to collapse. For such cases there's a global debug flag `window.rruiCollapseOnFocusOut` which can be set to `false` to prevent expandables from collapsing when losing focus. This flag affects: `<Select/>`, `<Autocomplete/>`, `<ExpandableMenu/>`, `<SlideOutMenu/>`, `<DatePicker/>`, `<Snackbar/>`, `<Tooltip/>`.

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