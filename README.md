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

## Reducing footprint

Webpack 4 still can't "tree-shake" simple cases like

```js
import { Modal, Button, TextInput } from 'react-responsive-ui'
```

So if one's using only a small subset of this library it could be imported like so

```js
import Modal     from 'react-responsive-ui/commonjs/Modal'
import Button    from 'react-responsive-ui/commonjs/Button'
import TextInput from 'react-responsive-ui/commonjs/TextInput'
```

Which results in a much smaller bundle size.

## Validation

Each form component receives two validation-specific properties

* `error : String` – error message
* `indicateInvalid : boolean` – whether the field should be displayed as an invalid one (including showing the `error` message)

When both of these properties are set the form component appends `--invalid` postfixes to its CSS `className`s.

## CSS

The CSS for this library must be included on a page too.

#### When using Webpack

```js
require('react-responsive-ui/variables.css')
require('react-responsive-ui/style.css')
```

And set up a [`postcss-loader`](https://github.com/postcss/postcss-loader) with a [CSS autoprefixer](https://github.com/postcss/autoprefixer) for supporting old web browsers (e.g. `last 4 versions`, `iOS >= 7`, `Android >= 4`).

#### When not using Webpack

Get the `style.css` file from this package, process it with a [CSS autoprefixer](https://github.com/postcss/autoprefixer) for supporting old web browsers (e.g. `last 4 versions`, `iOS >= 7`, `Android >= 4`), and then include it on a page.

```html
<head>
  <link rel="stylesheet" href="/css/react-responsive-ui/variables.css"/>
  <link rel="stylesheet" href="/css/react-responsive-ui/style.css"/>
</head>
```

## Variables

This library uses [native CSS variables](https://medium.freecodecamp.org/learn-css-variables-in-5-minutes-80cf63b4025d) for easier styling. See [`variables.css`](https://github.com/catamphetamine/react-responsive-ui/blob/master/variables.css) for the list of all available variables. These variables have some sensible defaults which can be overridden in a separate `react-responsive-ui-variables.css` file (analogous to the original `variables.css` file).

#### When using Webpack

```js
// React Responsive UI.
require('react-responsive-ui/style.css')
// Custom variable values.
require('./src/styles/react-responsive-ui-variables.css')
```

#### When not using Webpack

```html
<head>
  <!-- React Responsive UI -->
  <link rel="stylesheet" href="/css/react-responsive-ui/style.css"/>
  <!-- Custom variable values -->
  <link rel="stylesheet" href="/css/react-responsive-ui-variables.css"/>
</head>
```

## Responsive

The included [`react-responsive-ui/small-screen.css`](https://github.com/catamphetamine/react-responsive-ui/blob/master/small-screen.css) stylesheet adapts all components for "small screens" ("mobile devices"). E.g. `<Select/>`s, `<DatePicker/>`s and `<Modal/>`s open in fullscreen.

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

The `small-screen.css` file must not be included before `variables.css` because it uses those variables (the values of which can be overridden as shown in the previous section).

## Drag'n'drop

Drag'n'drop is implemented internally using [`react-dnd`](https://github.com/gaearon/react-dnd) providing a much simpler-to-use API. Currently only file upload is supported but new features could be added upon request.

```js
import { DragAndDrop } from 'react-responsive-ui'

@DragAndDrop()
class Application extends Component {
  render() {
    const { isDragging, children } = this.props
    return <div>{ children }</div>
  }
}
```

```js
import { CanDrop, FILE, FILES, FileUpload } from 'react-responsive-ui'

class FileUploadPage extends Component {
  onUpload = (file, action) => {
    alert(`File ${action}: ${file.name}`)
  }

  render() {
    return (
      <div>
        <h1> File upload </h1>

        <FileUploadArea
          onUpload={ this.onUpload }
          className="file-upload"/>
      </div>
    )
  }
}

// `FILE` is for single-file upload.
// `FILES` is for multiple files upload.
@CanDrop(FILE, (props, file) => {
  props.onUpload(file, 'dropped')
})
class FileUploadArea extends Component {
  render() {
    const {
      dropTarget,
      draggedOver,
      onUpload,
      className
    } = this.props

    return dropTarget(
      <div>
        <FileUpload
          action={(file) => onUpload(file, 'chosen')}
          className={`${className} ${draggedOver ? 'rrui__file-upload--dragged-over' : ''}`}>
          Click here to choose a file
          or drop a file here
        </FileUpload>
      </div>
    )
  }
}
```

```css
.rrui__file-upload
{
  display          : inline-block;
  padding          : 20px;
  border           : 1px dashed #afafaf;
  border-radius    : 5px;
  background-color : #fbfbfb;
  cursor           : pointer;
  text-align       : center;
}

.rrui__file-upload--dragged-over
{
  background-color : #3678D1;
  color            : white;
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