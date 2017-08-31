# react-responsive-ui

[![npm version](https://img.shields.io/npm/v/react-responsive-ui.svg?style=flat-square)](https://www.npmjs.com/package/react-responsive-ui)

Slick and accurate React UI components. Work both on client side and server side, with javascript enabled and with javascript disabled (e.g. DarkNet).

[See Demo](https://catamphetamine.github.io/react-responsive-ui/)

## Installation

```
npm install react-responsive-ui --save
```

## Usage

See the [demo page](https://catamphetamine.github.io/react-responsive-ui/) source code.

```js
import
{
  PageAndMenu,
  Page,
  CollapsibleMenu,
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
  <CollapsibleMenu>
    <ul>
      <li>
        <Link to="/first">First</Link>
      </li>
      <li>
        <Link to="/second">Second</Link>
      </li>
    </ul>
  </CollapsibleMenu>

  <Page>
    <MenuButton title="Show menu"/>

    <Snackbar
      value={ this.state.snack }
      reset={ () => this.setState({ snack: undefined }) }/>

    <Button
      action={ () => this.setState({ snack: Math.random() }) }>
      Show a snack notification
    </Button>

    <Tooltip text="A tooltip">Hover this for a tooltip</Tooltip>

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
        placeholder="Select one"
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
      isOpen={this.state.showModal}
      close={() => this.setState({ showModal: false })>
      This is a modal
      <Button action={() => this.setState({ showModal: false })>Hide</Button>
    </Modal>

    <Button action={() => this.setState({ showModal: true })>Show modal</Button>
  </Page>
</PageWithMenu>
```

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

And set up a [`postcss-loader`](https://github.com/postcss/postcss-loader) with a [CSS autoprefixer](https://github.com/postcss/autoprefixer) for supporting old web browsers (e.g. `last 2 versions`, `iOS >= 7`, `Android >= 4`).

#### When not using Webpack

Get the `style.css` file from this package, process it with a [CSS autoprefixer](https://github.com/postcss/autoprefixer) for supporting old web browsers (e.g. `last 2 versions`, `iOS >= 7`, `Android >= 4`), and then include it on a page.

```html
<head>
  <link rel="stylesheet" href="/css/react-responsive-ui/style.css"/>
</head>
```

## API

See `propTypes` in the source code for the possible `props` — they are well documented and self-explanatory.

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

## Responsive

The following CSS makes `<Select/>`s, `<DatePicker/>`s and `<Modal/>`s open in fullscreen on mobile phones:

```css
@media (max-width: 320px) {
  /* `<Select/>`s and `<DatePicker/>`s go fullscreen when expanded */
  .rrui__select__options,
  .rrui__date-picker__collapsible {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: var(--expandable-z-index);
    margin: 0;
    max-height: none !important;
  }

  /*
  Displays a click-intercepting overlay
  over `<DatePicker/>`'s `<input/>`
  so that the keyboard doesn't slide from bottom
  pushing the expanded `<DatePicker/>` from the screen.
  */
  .rrui__date-picker__input-overlay {
    display: block;
  }

  /* Show "Close" button for full-screen `<DatePicker/>`s */
  .rrui__date-picker__close {
    display: block;
    font-weight: lighter;
    font-size: 14px;
    color: var(--accent-color);
  }

  /* Show "Close" button for full-screen `<Select/>`s */
  .rrui__select__close {
    display: block;
    z-index: var(--expandable-z-index);
  }

  /* `<Modal/>` goes full-screen wide and high */
  .rrui__modal__overlay {
    display: block;
  }

  /* CSS selector specificity fix for the above rule */
  .rrui__modal__overlay--hidden {
    display: none;
  }

  /* Centers `<Modal/>` content (body) horizontally and vertically */
  .rrui__modal__container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* `<Modal/>` goes full-screen wide and high */
  .rrui__modal__vertical-margin {
    display: none;
  }

  /* `<Modal/>` goes full-screen wide and high */
  .rrui__modal__content {
    border-radius: 0;
  }

  /* `<Modal/>` content goes full-screen wide and high */
  .rrui__modal__content-body {
    margin-left: 0;
    margin-right: 0;
    margin-top: calc(var(--unit) * 2);
    margin-bottom: calc(var(--unit) * 2);
    padding-left: var(--column-padding);
    padding-right: var(--column-padding);
  }

  /* Bigger font size for full-screen `<Select/>` options */
  .rrui__select__options {
    font-size: 24px;
  }

  /* Makes all dropdowns inside modals not go into fullscreen */
  .rrui__modal__content .rrui__select__options {
    position: absolute;
    left: 0;
    top: auto;
    right: auto;
    bottom: auto;
    /*
    Disables `.rrui__select__options { font-size: 24px }`
    defined in the above rule since it's not fullscreen again.
    */
    font-size: inherit;
  }

  /*
  Don't show the "x" close button for `<Select/>`s inside modals
  since they're not fullscreen.
  */
  .rrui__modal__content .rrui__select__close {
    display: none;
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