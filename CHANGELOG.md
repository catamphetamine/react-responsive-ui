<!-- Maybe somehow autoreplace CSS class names like `.menu-button-close__icon__icon-icon--modifier` with something like `.rrui-mbc-i-ii--m` to reduce the resulting application bundle size -->

<!-- Doesn't collapse `<ExpandableMenu/>` on an iPhone after any menu item was selected. -->

<!-- `scroll-into-view-if-needed` bug: https://github.com/stipsan/scroll-into-view-if-needed/issues/359 -->

<!-- `List.js`: replace `<div></div>` with `<React.Fragment></React.Fragment>` in some future when React >= 16.2.0 is common -->

<!-- Remove <FileUpload/> action property -->

<!-- Rename `ActivityIndicator` -> `Spinner` + CSS class names -->

<!-- Rename `--busy`/`__busy` CSS classes to `--wait`/`__wait` -->

<!-- (breaking change) Add `background-color: transparent;` to `TextInput`:

.rrui__input-field
{
  background-color: transparent;
  color: inherit;
}
-->

<!-- (breaking change) `<Page/>` component was removed. `<PageAndMenu/>` was renamed to `<App/>` (or something). -->

<!-- Maybe add `maxLines` to `<TextInput multiline/>` (or maybe not) which would require rethinking CSS and markup if it was implemented. -->

<!-- (breaking change) (maybe) Removed `outline: none` from button styles. -->

<!-- (breaking change) (maybe) Moved `box-sizing: border-box` from `.rrui__button` to `.rrui__button-reset`. -->

<!-- (CSS breaking change) ARIA requires <Button/> focus indication, so default button style now has `border-bottom` added for focused and non-focused states. -->

<!-- (breaking change) Maybe remove "fullscreen" styles. -->

<!-- (CSS breaking change) Maybe move classes like `rrui__autocomplete` a level deeper so that they don't include the error message section. -->

<!-- Maybe add `--focus` CSS classes; maybe replace :focus with --focus if the specificity is the same, or in future version. -->

<!-- (CSS breaking change) Maybe wrap <TextInputComponent/>'s <input/> and <textarea/>, <Autocomplete/>'s <input/>, <DatePicker/>'s <input/> and <Select/>'s <select/> in `<labels/>`. For that, the `--focus` classes will be required to style things (like `<Select/>`'s `<button/>`). Also maybe the second `<textarea/>` has to be moved out from such `<label/>` in `<TextInput multiline/>`. -->

0.14.127 / 24.01.2018
====================

  * `--rrui-card-text-color` default value changed from `currentColor` to `--rrui-black-color` because `currentColor` had some issues in MS Edge (not in IE).

  * Removed `color: currentColor` from `.rrui__slideout-menu__item` (that was a weird CSS rule).

0.14.124 / 22.01.2018
====================

  * Removed `react-dnd` from the library because it's buggy and is no longer supported. Replaced with simple native HTML file drag-n-drop.

  * Multiple file upload/drop now passes an `Array` instead of an `DataTransferItemsList` or `FileList` to `onChange()`.

0.14.97 / 20.12.2018
====================

  * Fixed `<ActivityIndicator/>` SVG path animation using 100% CPU for some reason. `<ActivityIndicator/>` component got replaced for that, and the line thickness is now fixed compared of the older percentage value. Line thickness can be set as `.rrui__activity-indicator__arc { border-width: ... }`.

0.14.87 / 12.12.2018
====================

  * (CSS breaking change) Removed the default padding from `.rrui__date-picker .rrui__expandable__content` and added the default padding to `.DayPicker-wrapper`. Also changed the positioning of `.DayPicker-NavButton`s. Added a border to `.DayPicker-wrapper` when it's focused (accessibility).

0.14.84 / 12.12.2018
====================

  * Fixed `rrui__outline` CSS class across components.

0.14.83 / 11.12.2018
====================

  * Removed default `aria-haspopup` and `aria-label` attributes from `<MenuButton/>`: pass them manually if required.

  * Renamed `rrui__outline` to `rrui__outline--default`. `rrui__outline` is now always added to all focusable components and can be used to define custom "outline"-like styling (for example, via `box-shadow`).

  * Added `<KeyboardNavigationListener/>` component which sets `rrui__tabbing` CSS class on `document.body`. It can be used to only show outlines on buttons/links when the user is actually tabbing. It's still not considered a 100%-formally-correct solution because "screen readers" still emit all kinds of mouse events. It's more of an experimental feature.

  * Added `buttonAriaLabel` property to `<DatePicker/>`.

0.14.81 / 09.12.2018
====================

  * Added focus on `<SlideOutMenu/>` upon expanding it. Added close `<SlideOutMenu/>` on Escape. Added focus on `<MenuButton/>` upon collapsing the menu.

0.14.80 / 09.12.2018
====================

  * Renamed `<Modal/>`'s `contentLabel` to `ariaLabel`. `contentLabel` still works but is deprecated.

  * Added `togglerAriaHasPopup` property to `<ExpandableMenu/>`.

0.14.79 / 07.12.2018
====================

  * Removed the recently added `showOutline()` function. Use `rrui__outline` CSS class directly to retain outlines.

  * `<ExpandableMenu/>` now accepts `toggler`, `togglerAriaLabel` and `togglerClassName` properties. The older way of `toggler` being the first child is now deprecated.

  * `<FileUpload/>`'s `.rrui__file-upload__area` now has `tabIndex` property which is `0` by default (for accessibility), and pressing `Enter` or `Spacebar` triggers `click` event. `<DropFileUpload/>` and `<DropFilesUpload/>` both wrap `<FileUpload/>`.

  * Some ARIA-related fixes.

0.14.76 / 07.12.2018
====================

  * A couple of `:focus` fixes (accessibility).

  * Added `showOutline(true)` function for not adding `outline: none` CSS rule to buttons, inputs and selects (some people prefer this).

  * Increased default `<MenuButton/>` width and height. Shouldn't break anyone's code because users of this library almost 100% re-define the menu button dimensions.

  * Fixed `<Select/>` focusing on the toggler `<button/>` instead of the hidden `<select/>`.

0.14.51 / 08.10.2018
====================

  * (CSS breaking change) Introduced a list of "CSS variables" for components for easier customization. This may possibly cause a couple of small breaking changes to CSS: `color` property is now being explicitly set on components (e.g. `<Select/>` options) instead of being not defined which could potentially overwrite someone's color if it was previously being inherited from a parent. Also, `<TextInput/>` now has `background-color`, `color` and `font-size: inherit` set explicitly (previously wasn't set and was using defaults for these). Also `<Checkbox/>` box size changed from `unit * 2` to `0.9em`. Also renamed `--rrui-list-icon-margin` to `--rrui-list-icon-margin`.


0.14.42 / 06.10.2018
====================

  * (breaking change) `<Modal/>`'s `closeButton` was previously styled as `float: right` which resulted in multiline content for single-line notifications. Re-styled `closeButton` without `float` using `flex`.

0.14.38 / 29.09.2018
====================

  * (CSS breaking change) Refactored `<SlideOutMenu/>` styles.

  * `<SlideOutMenu/>` animation duration increased (added a new CSS variable for that).

  * `<SlideOutMenu/>` now takes an optional `anchor` property which can be one of: `left`, `right`, `top`, `bottom`.

  * `<SlideOutMenu/>` now takes an optional `fullscreen` boolean property.

0.14.35 / 27.09.2018
====================

  * Refactored menu icon component, and it's now exported as `<MenuIcon/>`.

  * (breaking change) Removed `.rrui__menu-button-icon-x` class, use `.rrui__menu-icon` instead.

0.14.25 / 22.08.2018
====================

* Removed `reset` property from `<Snackbar/>`. It's not required now.

0.14.13 / 14.08.2018
====================

* Added `value` property to `<List/>` and renamed `onSelectItem` to `onChange`. `onSelectItem` property still works but is deprecated.

* Added the currently selected item indication to `<List/>` (and the components using it like `<Select/>` and `<Autocomplete/>`): `.rrui__list__item--selected`.

0.14.10 / 28.07.2018
====================

* `.rrui__file-upload` component now has two children: `.rrui__file-upload__area` and `.rrui__input-error`. This is unlikely to break existing code because `.rrui__input-error` is `display: none`, so if `error` is not passed then it doesn't matter much which CSS class is customized: `.rrui__file-upload` or `.rrui__file-upload__area`.

* Renamed `<FileUpload/>` `action` property to `onChange`. `action` still works but is deprecated.

* Added `<DropFileUpload/>` and `<DropMultiFileUpload/>`.

0.14.7 / 27.07.2018
===================

* Reduced React requirements for most components (now >= 0.14) for `PureComponent`.

* (breaking change) Renamed `SegmentedControl` to `Switcher` and `rrui__segmented-control__...` to `rrui__switcher__...`.

0.14.6 / 26.07.2018
===================

* Rewrote `<List/>` without using `<React.Fragment/>` for older React support (>= 15.3.0 for `PureComponent` support).

0.14.4 / 22.07.2018
===================

* (could be a minor breaking change) `indicateInvalid` is now `true` by default, and is considered an "undocumented" feature.

0.14.0 / 20.07.2018
===================

* (breaking change) Changed how `<List.Item/>` works: it is now just a wrapper for its `children`. If `<List onSelectItem/>` or `<List.Item onSelect/>` are present then it creates a `<button/>`. Otherwise it just renders `children` (adding some props to them, like `onClick` and `onMouseDown`).

* (breaking change) `<Snackbar/>` no longer receives `value` of type `String` — only an object of shape `{ content, type, component, ... }` is accepted.

* (breaking change) Renamed `SegmentedControl` to `Switcher` and `rrui__segmented-control__...` to `rrui__switcher__...`.

* (could be a minor breaking change) `indicateInvalid` is now `true` by default, and is considered an "undocumented" feature.

0.13.0 / 12.07.2018
===================

* (breaking change) React >= 16.3 is required ("React Portals" are used for `<Tooltip/>`, which requires React >= 16; `react-dnd@5` requires React >= 16.3). Still, components other than `<Tooltip/>` and `@DragAndDrop` can be used with older React.

* (breaking change) `react-dnd` updated from version `2.x` to version `5.x`.

* (breaking change) Some things got refactored so something might theoretically break.

* (breaking change) `<MenuButton/>` changed the icon for SVG to a CSS-animated HTML.

* (breaking change) Rewrote `<Select/>` and split it into `<Select/>`, `<Autocomplete/>` and `<ExpandableMenu/>`; their CSS structure got rewritten and CSS class names changed. Extracted `<Select.Separator/>` into `<Divider/>`. Due to the rewrite of `<Select/>` it may possibly be a breaking change for existing applications in some non-generic cases.

* (breaking change) `<Select menu/>` `toggler` property moved to `children` of `<ExpandableMenu/>`.

* (breaking change) Renamed `<CollapsibleMenu/>` to `<SlideOutMenu/>`.

* (breaking change) Renamed `<Select/>`'s `concise` property to `icon`.

* (breaking change) Renamed `<Select/>`'s `maxItems` property to `scrollMaxItems`.

* (breaking change) Renamed `<Select/>`'s `autocompleteShowAll` property to `showAllMatchingOptions`.

* (breaking change) `<Select/>` `icon` can now only be a React component (not an element). `<Select/>` `toggler` can now only be a React component (not an element).

* (breaking change) `<Select/>` `onToggle` property replaced with `onExpand` and `onCollapse`.

* (breaking change) `<DatePicker/>` design changed.

* (breaking change) `<Button/>`'s `action` property is deprecated, use `onClick` instead.

* (breaking change) `<Tooltip/>` now accepts `content` property instead of `text`, and `content` is now a `React.Element` instead of a function.

* (breaking change) `<TextInput/>` no longer accepts `email` and `password` properties. Use `type="..."` directly instead.

* (breaking change) `.rrui__button--link` CSS class renamed to `.rrui__button-reset--link`.

* (breaking change) `Select.Fullscreen.css` renamed to `Expandable.Fullscreen.css`.

* (breaking change) `DatePicker.Fullscreen.css` merged into `Expandable.Fullscreen.css`.

* `<TextInput/>` now accepts `inputComponent` property.

* Added `<List/>` component.

0.12.13 / 01.05.2018
===================

* (breaking change) `<Select/>`: `autocomplete` now always renders only `<input type="text"/>` (not a button), and native `<select/>` is always rendered in a transparent overlay so that native select is activated on mobile devices when there's too much options (for better UX) and custom select is always activated on desktop (if no `touchstart` has been received). `.rrui__select__native-expanded` CSS class removed and replaced with `.rrui__select__native` (mostly the same). Removed `onFocus` property of `<Select/>`.

* (breaking change) `<Select/>` no longer accepts both `label` and `placeholder`.

0.12.5 / 28.04.2018
===================

* (breaking change) `small-screen.css` file has been split into individual per-component files (see the updated README).

* (breaking change) `<DatePicker/>` `icon` is now a React component instead of a React element, and there's a default one, and the `icon` is hidden by default via CSS (a developer must explicitly set `display: block` for `.rrui__date-picker__icon` in order for the `icon` to be visible), and also `.rrui__date-picker__icon` CSS class styling changed.

* Fixed `<Select autocomplete/>` input focus upon expansion on mobile devices.

* Fixed `<Select/>` too many options rendered when collapsed.

0.12.0 / 23.04.2018
===================

* (breaking change) Introduced CSS variables which must be set before including the CSS files on a page (see the updated README).

* (breaking change) `<Button/>` now comes with default `margin-left` and `margin-right` (previously had no margins). And the `busy` indicator changed from a spinner to an underline.

* (breaking change) `<MenuButton/>` now comes with negative `margin`.

* (breaking change) On small screens (see `small-screen.css`) the "Close" cross for fullscreen `<Select/>` is now on the bottom-right (not on the top-right).

* (breaking change) On small screens (see `small-screen.css`) `<Select/>`s and `<DatePicker/>`s now expand themselves to fullscreen even if inside `<Modal/>`s, and the expand animation changed from "dropdown" to "fade-in/scale".

* (breaking change) Changed `<Modal/>` CSS styles (including `small-screen.css`): `.rrui__modal__content` class (which defines all CSS styles and animations for opening/closing) was renamed to `.rrui__modal__contents` (along with `rrui__modal__content--fullscreen` and `.rrui__modal__content-body`). `<Modal/>` now provides three child components: `<Modal.Content/>`, `<Modal.Title/>` and `<Modal.Actions/>`. Before `.rrui__modal__content-body` had `margin` — now that margin has been moved to these three new child components. Tweaked `<Modal/>` opening/closing animation on small screens (see `small-screen.css`).

* (breaking change) `<Modal/>`'s `closeButton` property removed and replaced with `closeButtonIcon` property (which is for the icon, not for the button). `closeButtonIcon` is now either a `Component` (not `Element`) or `true` (which renders a default cross icon).

* (breaking change) `<Select/>`'s `closeButton` property removed and replaced with `closeButtonIcon` property (which is for the icon, not for the button).

* (breaking change) `<DatePicker/>`'s `closeButton` property removed and replaced with `closeButtonIcon` property (which is for the icon, not for the button).

* (breaking change) If someone was overriding `.rrui__close__icon` CSS styles: its `padding` was moved to `.rrui__close`.

* (breaking change) `<Snackbar/>` CSS styles changed and it is now positioned in the left bottom corner of the screen (with some margin) instead of being in the middle on the bottom (without margin).

* (breaking change) `<Select/>`'s list of options (except `autocomplete`) has been moved up to cover the toggler button: added `margin-top` to `.rrui__select__options`.

* (breaking change) `<Select/>`'s `.rrui__select__option` side padding reduced a bit: changed `.rrui__select__option`'s `padding-left`/`padding-right` and `min-width`, `.rrui__select__options--left-aligned`'s `left`, `.rrui__select__options--right-aligned`'s `right` and `.rrui__select__options`'s `min-width`.

* (breaking change) `<Select menu/>`'s `.rrui__select__option` side padding changed a bit.

* (breaking change) `.rrui__select--menu` is now `display: inline-block` by default.

* (breaking change) `<Switch/>` layout and styling changed a bit, added `.rrui__switch__box`.

* (breaking change) `<Tooltip/>` sizes changed.

* (breaking change) `<Button/>` was rewritten (the `<button/>` is no longer wrapped in a `<div/>`). `<Button/>` now has default `height`. `linkDownload` property removed (pass `download` property directly instead).

* (breaking change) `<SegmentedControl/>` now stretched to full width by default.

* (breaking change) `<Snackbar/>` CSS changed: it now resides in the lower bottom corner. Hide animation time changed from `400` to `195`. `content` can now also be a React component taking `hide` property (a function that hides the notification).

* (breaking change) `<Select autocomplete/>` now goes fullscreen.

* (breaking change) `<TextInput/>` no longer takes an `input` property.

<!--

icon:

<svg class="j54" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><g><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></g></svg>

position: absolute;
top: 50%;
right: ...;
transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

hidden: translateY(-50%) rotate(0deg)
shown: translateY(-50%) rotate(180deg)

ExpansionPanel

shown:

margin-bottom: 16px 0;

hidden:

margin-bottom: 0;

(border)

box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);

&:before {
  top: -1px;
  left: 0;
  right: 0;
  height: 1px;
  content: "";
  opacity: 1;
  position: absolute;
  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  background-color: rgba(0, 0, 0, 0.12);
}

hidden : opacity: 1;
shown : opacity: 0;

ExpansionPanel.Summary:

shown:

margin: 20px 0;

hidden:

margin: 12px 0;

ExpansionPanel.Details:

hidden:

height: 0;
transition: height 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

shown:

height: auto;
transition-duration: 207ms;

проверить на webpack-...-example, что postcss заменяет переменные

обновляя rrui в phone-number-input компилировать стили с переменными.

-->

0.11.0 / 20.04.2018
===================

* Migrated to new React 17 lifecycles (`componentWillReceiveProps` -> `getDerivedStateFromProps`) and new React 17 Context API. Still compatible with older versions of React.

* Refactored `<Select/>` and implemented `async getOptions()` for asynchronous autocomplete.

* (breaking change) `<Select/>`. Arrow CSS styles tweaked: `margin-top: 0.2em; margin-right: 0.4em; border-width: 0.35em 0.22em 0 0.22em;` (inside `style.css`). The `closeButton` property is now a `React.Component` (not `React.Element`). `closeAriaLabel` property renamed to `closeLabel`. `rrui__select__toggler` `height: 100%` removed. Added `line-height` rule to `.rrui__select__option` CSS class. `.rrui__select__option:hover` `background-color` tweaked from `#fbfdfd` to `#f7f7f7`.

* (breaking change) `<DatePicker/>` `closeButtonLabel` property removed and replaced the "Close" button with a cross icon with `position: fixed` (changed the styles inside `style.css` and `small-screen.css`). The new property is `closeButton` and is a `React.Component` (not `React.Element`).

* (breaking change) Changed `<Checkbox/>` design.

* (breaking change) `<Menu/>` now doesn't take `router` property from context. Instead, `<Menu/>` now listens directly to `history` transitions. `<Menu/>`'s `.rrui__slideout-menu--shown` CSS class renamed to `.rrui__slideout-menu--expanded`. `<Page/>` now has `.rrui__page--menu-overlay` CSS class added on menu expanded which adds a semi-transparent overlay.

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