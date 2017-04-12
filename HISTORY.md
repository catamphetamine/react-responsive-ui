0.7.0 / 12.04.2017
==================

  * (breaking change) Dropped inline styles in favour of the CSS stylesheet (seems more convenient and theoretically more performant). Including the CSS via `require()` is the recommended way now.
  * (breaking change) Changed the path to style from `/styles/react-responsive-ui.css` to just `style.css`.
  * (breaking change) `<Menu/>` has been rewritten and no longer accepts `items` and instead accepts `children`. And it's always `slideout` now.

0.6.4 / 11.04.2017
==================

  * Dropped both `moment` and `date-fns` in favour of a custom date formatter and parser (to reduce bundle size)

0.6.0 / 10.04.2017
==================

Refactoring component styling to better match CSS grid styling (`.col-x`):

  * (breaking change) Now it stretches the inputs to full column width by default. Because everyone uses CSS grids today (like Bootstrap Grid). See `react-responsive-ui.css` diff for the change (a simple `width: 100%` rule).
  * (breaking change) Changed `<Select/>` and `<DatePicker/>` markup a bit: they're now wrapped in a `<div className="rrui__input"/>` wrapper (and added `height: 100%` CSS rule for the contents).
  * `<Modal/>` now receives `className` parameter.
  * Added `stretch` flag for `<Button/>`s to stretch them to full width.
  * Added `floatingLabel` boolean flag for `<TextInput/>`.

0.5.0 / 06.03.2017
===================

  * (breaking change) Moved `position: relative` from inline styles to CSS for `<Button/>`, `<Switch/>`, `<DatePicker/>`, `<SegmentedControl/>`.
  * (breaking change) Refactored CSS classes for `<Select/>` and `<DatePicker/>`.
  * (breaking change) Refactored CSS classes for `<Switch/>`.
  * Fixed day clicking bug in `<DatePicker/>` on mobile devices.
  * Moved slideout menu styles to CSS classes `.rrui__slideout-menu`, `.rrui__slideout-menu--shown`, `.rrui__slideout-menu-list-item` and `.rrui__menu__item`

0.4.0 / 03.03.2017
===================

  * (breaking change) `<Modal/>` now no longer takes `actions`, create the buttons manually instead. `title` property is gone too, use `<h1/>` instead. Changed `.rrui__modal__top-padding` and `.rrui__modal__bottom-padding` into `.rrui__modal__margin`. `cancel` property is gone, use `closeLabel` instead. Changed some styles for modal (see the relevant commit)
  * (breaking change) `<Form/>`'s `action` has been renamed to `submit`.
  * (might be a breaking change) Moved `<Select/>` option list styles from inline to `.rrui__select__options`

0.3.0 / 25.02.2017
===================

  * (could be a breaking change) Moving `position: relative` from inline styles to the CSS file therefore if using an edited CSS file from older versions add `position: relative` for `.rrui__select`

0.2.14 / 07.02.2017
===================

  * Added a custom `input` property for `<TextInput/>`

0.2.11 / 06.02.2017
===================

  * Added `.rrui__fixed-full-width` CSS class for self-adjusting the width of specific DOM elements when a modal opens

0.2.10 / 05.02.2017
===================

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