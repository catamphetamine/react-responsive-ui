# react-responsive-ui

[![npm version](https://img.shields.io/npm/v/react-responsive-ui.svg?style=flat-square)](https://www.npmjs.com/package/react-responsive-ui)

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

## CSS

The CSS for this library is distributed along with the React components and it must be included on a page too.

When using Webpack:

```js
require('react-responsive-ui/styles/react-responsive-ui.css')
```

When not using Webpack, just copy [`styles/react-responsive-ui.css`](https://github.com/halt-hammerzeit/react-responsive-ui/blob/master/styles/react-responsive-ui.css) to your project folder and include it on a page:

```html
<head>
  <link rel="stylesheet" href="/css/react-responsive-ui.css"/>
</head>
```

This CSS file is meant as a base one and a developer should override the CSS rules defined in it (in a separate file) to better suit the project's style.

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

.rrui__slideout-menu-button__icon-path
{
  // In case of a black backround,
  // overrides the default menu button icon color.
  fill: white;
}

// Widescreen
@media (min-width: 900px)
{
  // Hide the slideout menu
  .rrui__slideout-menu,
  .rrui__slideout-menu-button
  {
    display: none;
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