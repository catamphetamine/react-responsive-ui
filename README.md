# react-responsive-ui

[![NPM Version][npm-badge]][npm]
<!-- [![Build Status][travis-badge]][travis]
[![Test Coverage][coveralls-badge]][coveralls] -->

Slick and accurate React UI components. Work both on client side and server side, with javascript enabled and with javascript disabled (e.g. DarkNet).

[See Demo](https://halt-hammerzeit.github.io/react-responsive-ui/)

## Installation

```
npm install react-responsive-ui --save
```

## Usage

See the [demo page](https://halt-hammerzeit.github.io/react-responsive-ui/) source code.

```js
import
{
  PageAndMenu,
  Page,
  Menu,
  MenuButton,
  Form,
  Snackbar,
  Tooltip,
  ActivityIndicator,
  TextInput,
  Select,
  Button,
  Switch,
  Checkbox,
  SegmentedControl,
  DatePicker,
  FileUpload,
  Modal
}
from 'react-responsive-ui'

<PageAndMenu>
  <Menu
    slideout
    items=
    {[
      { name: 'One', link: '/one' },
      { name: 'Two', link: '/two' }
    ]}/>

  <Page>
    <MenuButton/>

    <Snackbar value="That's the snackbar on the bottom of the screen"/>

    <Tooltip text="A tooltip">Hover this</Tooltip>

    <ActivityIndicator/>

    <Form action={() => alert('Form submitted')}>
      <TextInput
        label="Enter something"
        value={this.state.text}
        onChange={text => this.setState({ text })}/>

      <TextInput
        multiline
        label="Enter description"
        value={this.state.description}
        onChange={description => this.setState({ description })}/>

      <Select
        label="Select one"
        value={this.state.fruit}
        onChange={fruit => this.setState({ fruit })}
        options=
        {[
          { value: 'A', label: 'Apples' },
          { value: 'O', label: 'Oranges' }
        ]}/>

      <SegmentedControl
        value={this.state.fruit}
        onChange={fruit => this.setState({ fruit })}
        options=
        {[
          { value: 'A', label: 'Apples' },
          { value: 'O', label: 'Oranges' }
        ]}/>

      <Switch
        value={this.state.switch}
        onChange={switch => this.setState({ switch })}>
        IOS style
      </Switch>

      <Checkbox
        value={this.state.checkbox}
        onChange={checkbox => this.setState({ checkbox })}>
        Tickable
      </Checkbox>

      <DatePicker
        value={this.state.selectedDay}
        onChange={selectedDay => this.setState({ selectedDay })}/>

      <FileUpload
        onChange={file => alert(file.name)}>
        Click here to choose file for upload
      </FileUpload>

      <Button>Button</Button>

      <Button submit className="rrui__button--border">Submit</Button>
    </Form>

    <Modal
      shown={this.state.showModal}>
      This is a modal
      <Button action={() => this.setState({ showModal: false })>Hide</Button>
    </Modal>

    <Button action={() => this.setState({ showModal: true })>Show modal</Button>
  </Page>
</PageWithMenu>
```

## CSS

The CSS for this library is distributed along with the React components. Just copy [`styles/react-responsive-ui.css`](https://github.com/halt-hammerzeit/react-responsive-ui/blob/master/styles/react-responsive-ui.css) to your project folder and include it on a page:

```html
<head>
  <link rel="stylesheet" href="/css/react-responsive-ui.css"/>
</head>
```

This CSS file is meant as a base one and a developer should override the CSS rules defined in it (this can be done in a separate file) to better suit the project's needs.

An alternative way of including the base CSS file when using Webpack would be:

```js
require('~/react-responsive-ui/styles/react-responsive-ui.css')
```

## API

See `propTypes` in the source code for the possible `props` — they are well documented and self-explanatory.

## Javascript

(Advanced feature)

This library is also responsive in a sense that it works both with javascript enabled and disabled (e.g. [Tor](https://www.torproject.org/)). It does so by rendering two components inside one: one for javascript enabled browsers and the other one (fallback) for javascript disabled browsers. It then automatically hides the non-javascript (fallback) counterpart component in `componentDidMount` call, but if you're a perfectionist and are willing to get Server Side Rendering 100% precise (`componentDidMount` is not called on server side) then this section explains how to achieve that.

A bit of extra CSS is added to `styles/react-responsive-ui.css` to make it work the best way (it would still work without this extra touch though).

In cases when support for javascript-less browsers is not required, simply this CSS would have been enough:

```css
// Shows only javascript-powered components
// and hides javascriptless (fallback) components
.rrui__rich__fallback
{
  display: none !important;
}
```

But, if your website supports both javascript-enabled and javascript-less browsers, then this CSS is what's required:

```html
<body>
  <script>document.body.classList.add('javascript-is-enabled')</script>
</body>
```

```css
// Shows javascript-powered components
// and hides javascriptless (fallback) components
body.javascript-is-enabled
{
  .rrui__rich__fallback
  {
    display: none !important;
  }
}

// Hides javascript-powered components
// and shows only javascriptless (fallback) components
body:not(.javascript-is-enabled)
{
  .rrui__rich
  {
    > *:not(.rrui__rich__fallback)
    {
      display: none !important;
    }
  }
}
```

### Menu

Responsive `<Menu/>` example

```js
<PageAndMenu>
  {/* Slideout menu (for small screens) */}
  {/* Slides over the `<Page/>` */}
  <Menu slideout items={...}/>
  <Page>
    {/* Slideout menu toggler */}
    <MenuButton/>
    {/* Full-sized menu (for wide screens) */}
    <Menu items={...}/>
  </Page>
</PageAndMenu>
```

```css
// Default style is for small screens

// Don't show the widescreen full-sized menu
.rrui__menu
{
  display: none;
}

.rrui__slideout-menu-button__icon
{
  path
  {
    // In case of a black backround,
    // overrides the default menu button icon color.
    fill: white !important;
  }
}

// Widescreen
@media (min-width: 900px)
{
  // Hide the slideout menu
  .rrui__slideout-menu,
  .rrui__slideout-menu-button
  {
    display: none !important;
  }

  // Show the widescreen full-sized menu
  .rrui__menu
  {
    display: inline-block;
  }
}
```

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
[npm]: https://www.npmjs.org/package/react-responsive-ui
[npm-badge]: https://img.shields.io/npm/v/react-responsive-ui.svg?style=flat-square
[travis]: https://travis-ci.org/halt-hammerzeit/react-responsive-ui
[travis-badge]: https://img.shields.io/travis/halt-hammerzeit/react-responsive-ui/master.svg?style=flat-square
[coveralls]: https://coveralls.io/r/halt-hammerzeit/react-responsive-ui?branch=master
[coveralls-badge]: https://img.shields.io/coveralls/halt-hammerzeit/react-responsive-ui/master.svg?style=flat-square
