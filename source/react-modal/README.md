Since the authors of `react-modal` are lazy and don't want to add `onAfterClose` feature I'm doing it myself as part of this fork.

https://github.com/reactjs/react-modal/issues/214

https://github.com/reactjs/react-modal/pull/346

Forked on 03.03.2017.

Changes made:

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