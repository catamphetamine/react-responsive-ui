0.2.10 / 05.02.2017
==================

  * Added `fullscreen` mode for `<Modal/>`
  * (breaking change) Refactoring `<Modal/>` (for better `fullscreen` support)

0.2.5 / 04.02.2017
==================

  * (breaking change) Renamed `.rrui__text-input__label` to `.rrui__input-label`
  * `<TextInput/>` can now have both a `placeholder` and a `label`
  * Added `label`s to `<Select/>` and `<DatePicker/>` (analogous to text input)
  * (breaking change) Renamed `.rrui__text-input__error` to `.rrui__input-error`
  * (breaking change) Renamed `label` property of `<Select/>` to `placeholer`
  * (breaking change) Renamed `.rrui__text-input__field` and `.rrui__text-input__input--single-line` to `.rrui__input` and `.rrui__input--multiline`

0.2.0 / 03.02.2017
==================

  * (breaking change) Renamed `.rrui__text-input__field` to `.rrui__text-input__input`. `.rrui__text-input__field` now wraps `.rrui__text-input__input` and `.rrui__text-input__label`. This is done to be able to set `.rrui__text-input__field` exact height while also keeping `height: auto` for description and error message.
  * Dropped `description` property on `<TextInput/>`

0.1.67 / 03.02.2017
===================

  * Removed `--primary` and `--border` button flavours (use `className` manually instead since there are usually more than two kinds of buttons in an application UI)
  * Button contents are now a `<div/>` and the button itself is not made `opacity: 0` during `busy` state but instead that contents `<div/>` is
  * Refactoring floating label input

0.1.50 / 21.01.2017
===================

  * Added drag'n'drop components

0.1.48 / 20.01.2017
===================

  * (breaking change) Renamed `shown` property of `Modal` to `isOpen`
  * (breaking change) Renamed `.rrui__button__link` CSS class to `.rrui__button__button .rrui__button__button--link`
  * For "rich" components now not rendering static HTML fallback by default (unless `fallback` property is explicitly set to `true`) since it's a very exotic use case and therefore is not default behaviour now

0.1.27 / 07.01.2017
===================

  * Added `<DatePicker/>` via `react-day-picker` and `moment`

0.1.25 / 30.12.2016
===================

  * Added `className` and `style` properties to `<Select/>`

0.1.22 / 24.12.2016
===================

  * Fixed autocomplete up/down selection bug

0.1.19 / 20.12.2016
===================

  * (breaking change) Renamed `.rrui__select__option--selected` CSS class to `.rrui__select__option--focused`
  * `<Select/>` now automatically scrolls the options list down to the selected item and also while navigating with arrow keys

0.1.0 / 05.12.2016
==================

  * Initial release.