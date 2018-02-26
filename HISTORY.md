0.10.28 / 26.02.2018
====================

  * Disabled "scroll into view" feature for `<Select/>` in IE.

0.10.15 / 11.01.2018
====================

  * CSS has been split on per-component basis (not icluding `small-screen.css`) and is available in the `styles` folder of the package.

0.10.0 / 10.10.2017
===================

  * (CSS breaking change) `.rrui__text-input__input` -> `.rrui__input-field`

  * (CSS breaking change) `.rrui__text-input__input--multiline` -> `.rrui__input-field--multiline`

0.9.1 / 20.09.2017
===================

(CSS breaking change) Refactored `<Select/>` CSS class names:

  * `.rrui__select__selected--autocomplete` -> `.rrui__select__autocomplete`

  * `.rrui__select__selected` -> `.rrui__select__button`

  * `.rrui__select__selected--nothing` -> `.rrui__select__button--empty`

  * `.rrui__select__selected--expanded` -> `.rrui__select__button--expanded`

  * `.rrui__select__selected--disabled` -> `.rrui__select__button--disabled`

  * `.rrui__select__selected--invalid` -> `.rrui__select__button--invalid`

(CSS breaking change) Focused input label CSS selector changed. From this:

```css
/* Focused input label */
.rrui__text-input__input:focus    + .rrui__input-label:not(.rrui__text-input__label--placeholder),
.rrui__select__button:focus       + .rrui__input-label,
.rrui__select__autocomplete:focus + .rrui__input-label,
.rrui__date-picker__input:focus   + .rrui__input-label
```

To this:

```css
/* Focused input label */
.rrui__input-element:focus + .rrui__input-label
```

And the floating label now floats to top always when the input is focused regardless of whether it's empty or not.

So this:

```css
.rrui__text-input__label--placeholder
  transform: ...
```

Changes into this:

```css
.rrui__input-field:not(:focus) + .rrui__text-input__label--placeholder
  transform: ...
```

(CSS breaking change) `<Select/>`'s autocomplete `<input/>` is now `.rrui__text-input__input`.

(CSS breaking change) `<Select/>`'s `<option/>`s have now `height` set.

0.8.55 / 18.09.2017
===================

  * Added `<Select compact/>` property which makes the `<Select/>` not stretch to 100% width by making it `inline-block`.
  * (CSS breaking change) `<Select concise/>` are now `inline-block` too (but I guess perhaps no one even used that property since it's `concise` which means "inline" to me).
  * Added `.rrui__select--menu` CSS class so `.rrui__select__options:not(.rrui__select__options--menu)` becomes just `.rrui__select__options` which simplifies the stylesheet.

0.8.22 / 27.07.2017
===================

  * (CSS breaking change) `<Switch/>` CSS classes got refactored but it shouldn't break anyone's apps.

0.8.0 / 03.05.2017
===================

  * (CSS breaking change) Removed vertical padding from the first and the last `<Select/>` `<li/>` options and moved it to `.rrui__select__options` `<ul/>` itself. So if someone customized `.rrui__select__options-list-item:first-child` and `.rrui__select__options-list-item:last-child` vertical padding then those padding customizations should be moved to `.rrui__select__options` itself.
  * (CSS breaking change) Added `.rrui__select__option:hover` and `.rrui__select__option--focused:hover` background color for better UX.

0.7.11 / 15.04.2017
===================

  * Added `selectYearsIntoPast` and `selectYearsIntoFuture` to `<DatePicker/>`.
  * `<DatePicker/>` is now more strict while parsing keyboard input.

0.7.0 / 12.04.2017
==================

  * (breaking change) Dropped inline styles in favour of the CSS stylesheet (seems more convenient and theoretically more performant). Including the CSS via `require()` is the recommended way now.
  * (breaking change) Changed the path to style from `/styles/react-responsive-ui.css` to just `style.css`.
  * (breaking change) `<Menu/>` has been rewritten and no longer accepts `items` and instead accepts `children`. And it's always `slideout` now. Renamed `Menu` to `CollapsibleMenu`.

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