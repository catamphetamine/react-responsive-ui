Since the authors of `react-modal` are lazy and don't want to add `onAfterClose` feature I'm doing it myself as part of this fork.

https://github.com/reactjs/react-modal/issues/214

https://github.com/reactjs/react-modal/pull/346

Forked on 03.03.2017.

Changes made:

Added `onAfterClose` handler

#### components/ModalPortal.js

```js
  afterClose = () => {
    returnFocus();
    teardownScopedFocus();
    if (this.props.onAfterClose) {
      this.props.onAfterClose();
    }
  }
```

`focusContent()` if `requestClose()` returned `false`

```js
  handleOverlayOnClick = (event) => {
    if (this.shouldClose === null) {
      this.shouldClose = true;
    }
    if (this.shouldClose && this.props.shouldCloseOnOverlayClick) {
      if (this.ownerHandlesClose()) {
        if (this.requestClose(event) === false) {
          this.focusContent();
        }
      } else {
        this.focusContent();
      }
    }
    this.shouldClose = null;
  }

  requestClose (event) {
    if (this.ownerHandlesClose()) {
      return this.props.onRequestClose(event);
    }
  }
```