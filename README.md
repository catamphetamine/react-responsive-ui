# react-responsive-ui

[![npm version](https://img.shields.io/npm/v/react-responsive-ui.svg?style=flat-square)](https://www.npmjs.com/package/react-responsive-ui)

Responsive React UI components. Work both on client side and server side, with javascript enabled and with javascript disabled (e.g. DarkNet).

[See Demo](https://catamphetamine.github.io/react-responsive-ui/)

## Installation

```
npm install react-responsive-ui --save
```

## Usage

See the [demo page](https://catamphetamine.github.io/react-responsive-ui/). It has code examples for every component.

## Validation

Each form component receives two validation-specific properties

* `error : String` – error message
* `indicateInvalid : boolean` – whether the field should be displayed as an invalid one (including showing the `error` message)

When both of these properties are set the form component appends `--invalid` postfixes to its CSS `className`s.

## CSS

The CSS for this library must be included on a page too.

#### When using Webpack

```js
import rrui from 'react-responsive-ui/style.css'
```

And set up a [`postcss-loader`](https://github.com/postcss/postcss-loader) with a [CSS autoprefixer](https://github.com/postcss/autoprefixer) for supporting old web browsers (e.g. `last 4 versions`, `iOS >= 7`, `Android >= 4`).

#### When not using Webpack

Get the `style.css` file from this package, process it with a [CSS autoprefixer](https://github.com/postcss/autoprefixer) for supporting old web browsers (e.g. `last 4 versions`, `iOS >= 7`, `Android >= 4`), and then include it on a page.

```html
<head>
  <link rel="stylesheet" href="/css/react-responsive-ui/style.css"/>
</head>
```

## Grid

When using modular grid element sizes are multiples of a modular grid unit

```css
/* Sets `react-responsive-ui` controls' height */
.rrui__input,
.rrui__input-label {
  height: calc(var(--unit) * 5);
}

/* Set the default height of multiline `<TextInput/>`s */
.rrui__input--multiline {
  height: calc(var(--unit) * 15);
}

/* Multiline `<TextInput/>`'s vertical padding */
.rrui__input-field--multiline {
  padding-top: var(--textarea-padding);
  padding-bottom: var(--textarea-padding);
}

/* Multiline `<TextInput/>`'s label positioning */
.rrui__text-input__label--multiline {
  top: var(--textarea-padding);
}

/* `<Button/>`s are sized to match the height of all other controls. */
.rrui__button__button {
  height: 100%;
}

/* Styling `<Button/>`s */
.rrui__button {
  font-family: ...
  font-size: ...
  border: 2px solid black;
  border-radius: 5px;
}

/* `<Button/>`s' side padding */
/* (only when not sizing buttons as grid columns) */
.rrui__button__button {
  padding-left: calc(var(--unit) * 4);
  padding-right: calc(var(--unit) * 4);
}

/* `<Button/>`'s busy indicator styling */
.rrui__button__activity-indicator {
  left: calc(50% - var(--unit));
  top: calc(50% - var(--unit));
  width: calc(var(--unit) * 2);
  height: calc(var(--unit) * 2);
}

/* `<Select/>`'s options vertical padding. */
.rrui__select__options {
  padding-top: var(--unit);
  padding-bottom: var(--unit);
}

/* `<Select/>`'s options expand to full (grid) column width. */
.rrui__select__options:not(.rrui__select__options--menu) {
  width: 100%;
}

/* `<Select/>`'s options are aligned with the `<Select/>` itself. */
.rrui__select__options--left-aligned {
  left: 0;
}

/* `<Select/>`'s options are aligned with the `<Select/>` itself. */
.rrui__select__options--right-aligned {
  right: 0;
}
```

## Responsive

The included [`react-responsive-ui/small-screen.css`](https://github.com/catamphetamine/react-responsive-ui/blob/master/small-screen.css) stylesheet makes `<Select/>`s, `<DatePicker/>`s and `<Modal/>`s open in fullscreen on small screens (mobile devices).

Native CSS [`@import`](https://developer.mozilla.org/docs/Web/CSS/@import) example:

```css
@import url(~react-responsive-ui/small-screen.css) (max-width: 720px)
```

SCSS `@import` example:

```css
@media (max-width: 720px) {
  @import "~react-responsive-ui/small-screen";
}
```

And then some refinements:

```css
@media (max-width: 720px) {
  /* Fullscreen `<DatePicker/>` "Close" button */
  .rrui__date-picker__close {
    font-size: 14px;
    font-weight: lighter;
    color: var(--accent-color);
  }

  /* Fullscreen `<Select/>` options */
  .rrui__select__options:not(.rrui__select__options--autocomplete) {
    font-size: 22px;
  }

  /* Fullscreen `<Select/>`s and `<DatePicker/>`s `z-index`es */
  .rrui__select__options:not(.rrui__select__options--autocomplete),
  .rrui__date-picker__collapsible {
    z-index: var(--expandable-z-index);
  }

  /* Fullscreen `<Select/>` "Close" button */
  .rrui__select__close {
    z-index: var(--expandable-z-index);
  }

  /* Fullscreen `<Modal/>` content padding */
  .rrui__modal__content-body {
    margin-top: calc(var(--unit) * 2);
    margin-bottom: calc(var(--unit) * 2);
    margin-left: var(--column-padding);
    margin-right: var(--column-padding);
  }
}
```

## Drag'n'drop

Drag'n'drop is implemented internally using [`react-dnd`](https://github.com/gaearon/react-dnd) providing a much simpler-to-use API. Currently only file upload is supported but new features could be added upon request.

```js
import { DragAndDrop, CanDrop, FILE, FILES } from 'react-responsive-ui'

@DragAndDrop()
class Application extends Component {
  render() {
    const { isDragging, children } = this.props
    return <div>{ children }</div>
  }
}

@CanDrop(FILE, (props, dropped, component) => alert('Uploading file'))
class FileDropArea extends Component {
  render() {
    const { dropTarget, draggedOver, canDrop } = this.props
    return dropTarget(<div>Drop a file here</div>)
  }
}
```

Use [babel-plugin-transform-decorators-legacy](https://babeljs.io/docs/plugins/transform-decorators/) for decorators syntax support.

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