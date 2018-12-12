import React from 'react'
import PropTypes from 'prop-types'
import DayPicker, { ModifiersUtils } from 'react-day-picker'
import classNames from 'classnames'

import TextInput from './TextInputInputComponent'
import Expandable from './Expandable'
import YearMonthSelect from './YearMonthSelect'

import { onBlurForReduxForm } from './utility/redux-form'
import { onBlur } from './utility/focus'
import { isInternetExplorer } from './utility/dom'

import { parseDate, formatDate, trimInvalidPart, normalizeDate } from './utility/date'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

// Derived from `react-day-picker` example
// http://react-day-picker.js.org/examples/?overlay
export default class DatePicker extends PureComponent
{
	static propTypes =
	{
		// An optional label placed on top of the input field
		label : PropTypes.string,

		// `<input/>` placeholder
		placeholder : PropTypes.string,

		// First day of week.
		// `0` means "Sunday", `1` means "Monday", etc.
		// (is `0` by default)
		// http://react-day-picker.js.org/docs/localization/
		firstDayOfWeek : PropTypes.number.isRequired,

		// `react-day-picker` `locale`.
		// http://react-day-picker.js.org/docs/localization/
		locale : PropTypes.string,

		// `react-day-picker` `localeUtils`.
		// http://react-day-picker.js.org/docs/localization/
		localeUtils : PropTypes.object,

		// Month labels.
		// http://react-day-picker.js.org/docs/localization/
		months : PropTypes.arrayOf(PropTypes.string),

		// Long weekday labels.
		// http://react-day-picker.js.org/docs/localization/
		weekdaysLong : PropTypes.arrayOf(PropTypes.string),

		// Short weekday labels.
		// http://react-day-picker.js.org/docs/localization/
		weekdaysShort : PropTypes.arrayOf(PropTypes.string),

		// Date format. Only supports `DD`, `MM`, `YY` and `YYYY` for now (to reduce bundle size).
		// Can support custom localized formats, perhaps, when `date-fns@2` is released.
		// (is US `MM/DD/YYYY` by default)
		format : PropTypes.string.isRequired,
		// format : PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,

		// Internationalization
		// locale : PropTypes.string,

		// The Date `value`
		value : PropTypes.instanceOf(Date),

		// Writes new `value`.
		// The `value` is in the user's time zone and the time is `00:00`.
		onChange : PropTypes.func.isRequired,

		// Is called when the date picker is either collapsed or expanded
		onToggle : PropTypes.func,

		// Is called when the input is focused
		onFocus : PropTypes.func,

		// Is called when the input is blurred.
		// This `onBlur` interceptor is a workaround for `redux-form`,
		// so that it gets the parsed `value` in its `onBlur` handler,
		// not the formatted text.
		onBlur : PropTypes.func,

		// Disables the input
		disabled : PropTypes.bool,

		// Set to `true` to mark the field as required
		required : PropTypes.bool.isRequired,

		// HTML `<input/>` `name` attribute
		name : PropTypes.string,

		// `react-day-picker`'s `disabledDays`.
		// http://react-day-picker.js.org/examples/disabled
		disabledDays : PropTypes.oneOfType
		([
			PropTypes.object,
			PropTypes.func,
			PropTypes.array
		]),

		// How much years back can a user navigate using the year `<select/>`
		selectYearsIntoPast : PropTypes.number.isRequired,

		// How much years forward can a user navigate using the year `<select/>`
		selectYearsIntoFuture : PropTypes.number.isRequired,

		// Whether dates being selected should be in UTC+0 timezone.
		// (is `false` by default)
		utc : PropTypes.bool.isRequired,

		// Whether to set time to 12:00 for dates being selected.
		// (is `true` by default)
		noon : PropTypes.bool.isRequired,

		// The calendar icon.
		icon : PropTypes.func,

		// `aria-label` attribute for the toggle calendar button.
		buttonAriaLabel : PropTypes.string,

		waitForKeyboardSlideIn : PropTypes.bool.isRequired,
		keyboardSlideInAnimationDuration : PropTypes.number.isRequired,

		// CSS class
		className : PropTypes.string,

		// CSS style object
		style : PropTypes.object
	}

	static defaultProps =
	{
		// Default US format
		format : 'MM/DD/YYYY',

		// locale: 'en-US',
		firstDayOfWeek : 0,

		// Set to `true` to mark the field as required
		required : false,

		// Show `error` (if passed).
		indicateInvalid : true,

		// Whether dates being selected should be in UTC+0 timezone
		utc : false,

		// Whether to set time to 12:00 for dates being selected
		noon : true,

		// A sensible default.
		selectYearsIntoPast : 100,
		selectYearsIntoFuture : 100,

		// Default calendar icon
		icon : () => (
			<svg style={iconStyle} viewBox="0 0 32 32">
				<path d=" M2 2 L10 2 L10 10 L2 10z M12 2 L20 2 L20 10 L12 10z M22 2 L30 2 L30 10 L22 10z M2 12 L10 12 L10 20 L2 20z M12 12 L20 12 L20 20 L12 20z M22 12 L30 12 L30 20 L22 20z M2 22 L10 22 L10 30 L2 30z M12 22 L20 22 L20 30 L12 30z M22 22 L30 22 L30 30 L22 30z "/>
			</svg>
		),

		waitForKeyboardSlideIn : true,
		keyboardSlideInAnimationDuration : 300
	}

	state =
	{
		selected_day : null
	}

	componentWillUnmount()
	{
		clearTimeout(this.userHasJustChangedYearOrMonthTimer)
	}

	expand     = () => this.expandable.expand()
	collapse   = () => this.expandable.collapse()
	toggle     = () => this.expandable.toggle()
	isExpanded = () => this.expandable.isExpanded()

	focus = () => this.input.focus()

	userHasJustChangedYearOrMonth = () =>
	{
		this._userHasJustChangedYearOrMonth = true
		clearTimeout(this.userHasJustChangedYearOrMonthTimer)
		this.userHasJustChangedYearOrMonthTimer = setTimeout(() => this._userHasJustChangedYearOrMonth = false, 50)
	}

	onInputFocus = (event) =>
	{
		const { onFocus } = this.props

		if (onFocus) {
			onFocus(event)
		}

		if (!this.focusAfterDaySelected) {
			this.expand()
		}
	}

	onExpand = () =>
	{
		const
		{
			value,
			format,
			onToggle
		}
		= this.props

		this.setState
		({
			// Reset month for some unknown reason.
			month : undefined,

			// Must re-calculate `text_value` on each "expand"
			// because it's being reset on each "collapse".
			text_value : formatDate(value, format),

			// For `aria-expanded`.
			isExpanded : true
		})
	}

	onExpanded = () =>
	{
		const { value } = this.props

		// Set "previous" and "next" buttons untabbable
		// so that a Tab out of the `<input/>` field
		// moves cursor not inside to these buttons
		// but rather to the first day of the month. // next form input.
		//
		// (rewritten)
		// Requires ES6 Symbol.Iterator polyfill.
		// for (const button of calendar.querySelectorAll('.DayPicker-NavButton'))
		//
		// The user can still navigate via Up/Down arrow keys
		// when the focus is on a calendar date.
		// Or the user can enter the date in the `<input/>` text field.
		//
		for (const button of [].slice.call(this.container.querySelectorAll('.DayPicker-NavButton'))) {
			button.setAttribute('tabindex', '-1')
		}

		// Toggling the calendar in a timeout
		// in order for iOS scroll not to get "janky"
		// when `<DatePicker/>` gets focused.
		// (for some unknown reason)
		setTimeout(() =>
		{
			this.setState
			({
				month : value ? normalizeDate(value) : new Date()
			})
		}, 0)
	}

	// Cancels textual date editing.
	onCollapse = () =>
	{
		this.setState
		({
			text_value : undefined,
			// For `aria-expanded`.
			isExpanded : false
		})

		// `onChange` fires on calendar day `click`
		// but the `value` hasn't neccessarily been updated yet,
		// therefore, say, if `value` was not set
		// and a user selects a day in the calendar
		// then the `value` is technically still `undefined`
		// so can't just set `state.text_value = formatDate(value)` here.
		//
		// Analogous, `setState({ text_value })` has been called
		// in calendar day `onClick` handler but `state.text_value`
		// hasn't neccessarily been updated yet.
		//
		// Still must validate (recompute) `text_value`
		// upon expanding the `<DatePicker/>`, for example, on `<input/>` blur
		// in cases when a user manually typed in an incomplete date and then tabbed away.
	}

	onContainerKeyDown = (event) =>
	{
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}

		switch (event.keyCode)
		{
			// "Escape".
			//
			// Collapse.
			//
			// Maybe add this kind of support for "Escape" key in some future:
			//  hiding the item list, cancelling current item selection process
			//  and restoring the selection present before the item list was toggled.
			//
			case 27:
				event.preventDefault()
				// Collapse the list if it's expanded.
				return this.collapse()
		}
	}

	onInputKeyDown = (event) =>
	{
		const { onKeyDown } = this.props

		if (onKeyDown) {
			onKeyDown(event)
		}

		if (event.defaultPrevented) {
			return
		}

		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}

		switch (event.keyCode)
		{
			// On "Enter".
			case 13:
				if (this.isExpanded())
				{
					// Don't "prevent default" here
					// in order for a user to be able
					// to submit an enclosing form on "Enter".
					this.collapse()
				}
				return

			// On Spacebar.
			case 32:
				event.preventDefault()
				return this.toggle()

			// On "Up" arrow.
			case 38:
				// Collapse the calendar (if expanded).
				if (this.isExpanded())
				{
					event.preventDefault()
					this.collapse()
				}
				return

			// On "Down" arrow.
			case 40:
				// Expand the calendar (if collapsed).
				if (!this.isExpanded())
				{
					event.preventDefault()
					this.expand()
				}
				return
		}
	}

	onInputChange = (event) =>
	{
		const
		{
			onChange,
			value: previous_value,
			format,
			noon,
			utc,
			disabledDays
		}
		= this.props

		// Extract `value` from the argument
		// of this `onChange` listener
		// (for convenience)

		let value = event

		if (event.target !== undefined)
		{
			value = event.target.value
		}

		value = value.trim()

		// When the date is erased, reset it.
		if (!value)
		{
			// Call `onChange` only if `value` did actually change
			if (previous_value)
			{
				onChange(undefined)
			}

			return this.setState({ text_value: '' })
		}

		value = trimInvalidPart(value, format)

		const selected_day = parseDate(value, format, noon, utc)

		// If the date input is unparseable,
		// or if it's one of the disabled days,
		// then don't change the selected date.
		if (!selected_day ||
			disabledDays && ModifiersUtils.dayMatchesModifier(selected_day, disabledDays))
		{
			return this.setState({ text_value: value })
		}

		// Call `onChange` only if `value` did actually change
		if (!previous_value || previous_value.getTime() !== selected_day.getTime())
		{
			onChange(selected_day)
		}

		this.setState
		({
			text_value: value
		},
		() => this.calendar && this.calendar.showMonth(selected_day))
	}

	onDayClick = (selected_day, { disabled }) =>
	{
		const
		{
			format,
			onChange,
			value: previous_value,
			noon,
			utc
		}
		= this.props

		// If the day clicked is disabled then do nothing.
		if (disabled)
		{
			return
		}

		// https://github.com/gpbl/react-day-picker/issues/473
		// By default the `selected_day` has time
		// set to `12:00` of the current time zone.
		// These extra 12 hours do make sense and
		// do help make things less weird.
		//
		// These extra 12 hours are a hack to make things
		// a little bit less weird when rendering parsed dates.
		// E.g. if a date `Jan 1st, 2017` gets parsed as
		// `Jan 1st, 2017, 00:00 UTC+0` (England) then when displayed in the US
		// it would show up as `Dec 31st, 2016, 19:00 UTC-05` (Austin, Texas).
		// That would be weird for a website user.
		// Therefore this extra 12-hour padding is added
		// to compensate for the most weird cases like this
		// for adjacent countries / neighbours / same continent countries.
		//
		// So `selected_day` is in the user's time zone and the time is `12:00`.

		if (!noon)
		{
			// Here I strip those 12 hours from the `selected_day`
			// so the time becomes `00:00` in the user's time zone.
			//
			// (`selected_day` is the date in the user's time zone)
			// (`selected_day.getDate()` returns the day in the user's time zone)
			// (`new Date(year, month, day)` creates a date in the user's time zone)
			//
			selected_day = new Date(selected_day.getFullYear(), selected_day.getMonth(), selected_day.getDate())
		}

		if (utc)
		{
			// Converts timezone to UTC while preserving the same time
			selected_day = convert_to_utc_timezone(selected_day)
		}

		// `onChange` fires but the `value`
		// hasn't neccessarily been updated yet.
		//
		// Call `onChange` only if `value` did actually change.
		//
		if (!previous_value || previous_value.getTime() !== selected_day.getTime())
		{
			onChange(selected_day)
		}

		// Hide the calendar
		this.collapse()

		// Focus the `<input/>`.
		// (if not in "input overlay" mode for mobile devices).
		if (getComputedStyle(this.inputOverlay).display === 'none')
		{
			this.focusAfterDaySelected = true
			this.input.focus()

			// For some reason in IE 11 `onFocus` on `<input/>` is not called immediately.
			if (isInternetExplorer()) {
				setTimeout(() => this.focusAfterDaySelected = false, 0)
			} else {
				this.focusAfterDaySelected = false
			}
		}
	}

	// onCalendarKeyDown = (event) =>
	// {
	// 	switch (event)
	// 	{
	// 		// The next year is selected on "Up" arrow,
	// 		// so `.preventDefault()` it to prevent page scrolling.
	// 		// https://github.com/gpbl/react-day-picker/issues/273
	// 		case 38:
	// 			event.preventDefault()
	// 			return
	//
	// 		// The previous year is selected on "Down" arrow,
	// 		// so `.preventDefault()` it to prevent page scrolling.
	// 		// https://github.com/gpbl/react-day-picker/issues/273
	// 		case 40:
	// 			event.preventDefault()
	// 			return
	// 	}
	// }

	onMonthChange = (month) =>
	{
		this.setState({ month })
	}

	onBlur = (event) =>
	{
		clearTimeout(this.blurTimer)
		this.blurTimer = onBlur(event, this.onFocusOut, () => this.container, () => this.input, this.preventBlur)
	}

	onFocusOut = (event) =>
	{
		this.collapse()

		const { onBlur, value } = this.props

		if (onBlur) {
			onBlurForReduxForm(onBlur, event, value)
		}
	}

	preventBlur = () =>
	{
		// A hack for iOS when it collapses
		// the calendar after selecting a year/month.
		if (this._userHasJustChangedYearOrMonth)
		{
			this.focus()
			return true
		}
	}

	componentWillUnmount()
	{
		clearTimeout(this.blurTimer)
	}

	getContainerNode = () => this.container
	storeContainerNode = (node) => this.container = node
	storeExpandableRef = (ref) => this.expandable = ref
	storeCalendarComponent = (ref) => this.calendar = ref
	storeInputOverlayNode = (node) => this.inputOverlay = node
	storeInputNode = (node) => this.input = node
	storeInputContainerNode = (node) => this.inputContainer = node

	render()
	{
		const
		{
			id,
			format,
			value,
			error,
			indicateInvalid,
			disabledDays,
			selectYearsIntoPast,
			selectYearsIntoFuture,
			locale,
			localeUtils,
			months,
			weekdaysShort,
			weekdaysLong,
			firstDayOfWeek,
			disabled,
			required,
			label,
			placeholder,
			waitForKeyboardSlideIn,
			keyboardSlideInAnimationDuration,
			buttonAriaLabel,
			closeLabel,
			closeButtonIcon : CloseButtonIcon,
			icon,
			className,
			style
		}
		= this.props

		const
		{
			text_value,
			isExpanded,
			month
		}
		= this.state

		// `<input type="date"/>` renders a browser-specific date picker
		// which can not be turned off using a simple HTML attribute
		// and also date format is not customizable,
		// therefore just using `<input type="text"/>` here

		// "MM/DD/YYYY"
		const formatHint = typeof format === 'string' ? format : undefined

		let captionElement

		if (selectYearsIntoPast || selectYearsIntoFuture)
		{
			captionElement = (
				<YearMonthSelect
					focus={ this.focus }
					userHasJustChangedYearOrMonth={ this.userHasJustChangedYearOrMonth }
					selectedDay={ value }
					onChange={ this.onMonthChange }
					selectYearsIntoPast={ selectYearsIntoPast }
					selectYearsIntoFuture={ selectYearsIntoFuture } />
			)
		}

		return (
			<div
				ref={ this.storeContainerNode }
				onKeyDown={ this.onContainerKeyDown }
				onBlur={ this.onBlur }
				className={ classNames('rrui__date-picker', className,
				{
					'rrui__date-picker--disabled' : disabled
				}) }
				style={ style }>

				{/* Date input */}
				<TextInput
					id={ id }
					containerRef={ this.storeInputContainerNode }
					inputRef={ this.storeInputNode }
					required={ required }
					error={ error }
					indicateInvalid={ indicateInvalid }
					label={ label }
					placeholder={ label ? placeholder : placeholder || formatHint }
					disabled={ disabled }
					value={ text_value !== undefined ? text_value : formatDate(value, format) }
					onKeyDown={ this.onInputKeyDown }
					onChange={ this.onInputChange }
					onFocus={ this.onInputFocus }
					onClick={ this.expand }>

					{/* This layer can intercept taps on mobile devices
					    to prevent the keyboard from showing
					    when the date picker is in fullscreen mode */}
					<div
						ref={ this.storeInputOverlayNode }
						onClick={ this.toggle }
						className="rrui__date-picker__input-overlay"/>

					{/* Calendar icon which toggles the calendar */}
					<button
						type="button"
						onClick={ this.toggle }
						tabIndex={-1}
						aria-haspopup="grid"
						aria-expanded={ isExpanded }
						aria-label={ buttonAriaLabel }
						className={ classNames('rrui__button-reset', 'rrui__outline', 'rrui__date-picker__icon', {
							'rrui__date-picker__icon--hidden': !icon
						}) }>
						{ icon ? icon() : null }
					</button>

					{/* <DayPicker/> doesn't support `style` property */}
					<Expandable
						ref={ this.storeExpandableRef }
						onExpand={ this.onExpand }
						onExpanded={ this.onExpanded }
						onCollapse={ this.onCollapse }
						onTapOutside={ this.collapse }
						getTogglerNode={ this.getContainerNode }
						scrollIntoViewDelay={ waitForKeyboardSlideIn ? keyboardSlideInAnimationDuration : undefined }>

						<DayPicker
							ref={ this.storeCalendarComponent }
							month={ month }
							onMonthChange={ this.onMonthChange }
							locale={ locale }
							localeUtils={ localeUtils }
							months={ months }
							weekdaysLong={ weekdaysLong }
							weekdaysShort={ weekdaysShort }
							firstDayOfWeek={ firstDayOfWeek }
							onDayClick={ this.onDayClick }
							selectedDays={ normalizeDate(value) }
							disabledDays={ disabledDays }
							captionElement={ captionElement }
							classNames={ REACT_DAY_PICKER_CLASS_NAMES }
							className="rrui__date-picker__calendar" />
					</Expandable>
				</TextInput>

				{/* Error message */}
				{ indicateInvalid && error &&
					<div className="rrui__input-error">
						{ error }
					</div>
				}
			</div>
		)
	}
}

const iconStyle = {
	width  : '100%',
	height : '100%',
	fill   : 'currentColor'
}

// Should have been exported from `react-day-picker`.
// https://github.com/gpbl/react-day-picker/blob/master/src/classNames.js
// Can change in future versions of `react-day-picker`.
const REACT_DAY_PICKER_DEFAULT_CLASS_NAMES = {
	container: 'DayPicker',
	wrapper: 'DayPicker-wrapper',
	interactionDisabled: 'DayPicker--interactionDisabled',
	months: 'DayPicker-Months',
	month: 'DayPicker-Month',

	navBar: 'DayPicker-NavBar',
	navButtonPrev: 'DayPicker-NavButton DayPicker-NavButton--prev',
	navButtonNext: 'DayPicker-NavButton DayPicker-NavButton--next',
	navButtonInteractionDisabled: 'DayPicker-NavButton--interactionDisabled',

	caption: 'DayPicker-Caption',
	weekdays: 'DayPicker-Weekdays',
	weekdaysRow: 'DayPicker-WeekdaysRow',
	weekday: 'DayPicker-Weekday',
	body: 'DayPicker-Body',
	week: 'DayPicker-Week',
	weekNumber: 'DayPicker-WeekNumber',
	day: 'DayPicker-Day',
	footer: 'DayPicker-Footer',
	todayButton: 'DayPicker-TodayButton',

	// default modifiers
	today: 'today',
	selected: 'selected',
	disabled: 'disabled',
	outside: 'outside',
}

const REACT_DAY_PICKER_CLASS_NAMES = {
	...REACT_DAY_PICKER_DEFAULT_CLASS_NAMES,
	/* `.DayPicker-wrapper` is a `<div/>` wrapping the calendar.
	   It gets focused upon expanding which causes an outline.
	   That outline can be safely removed because it doesn't aid accesiblity. */
	wrapper: REACT_DAY_PICKER_DEFAULT_CLASS_NAMES.wrapper + ' rrui__outline',
	/* Calendar days have `background-color` on `:focus`.
	   Therefore their `outline` can be safely removed. */
	day: REACT_DAY_PICKER_DEFAULT_CLASS_NAMES.day + ' rrui__outline',
	/* Previous/Next month buttons have `background-color` on `:focus`.
	   Therefore their `outline` can be safely removed. */
	navButtonPrev: REACT_DAY_PICKER_DEFAULT_CLASS_NAMES.navButtonPrev + ' rrui__outline',
	navButtonNext: REACT_DAY_PICKER_DEFAULT_CLASS_NAMES.navButtonNext + ' rrui__outline'
}