// Derived from `react-day-picker` example
// http://react-day-picker.js.org/examples/?overlay

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DayPicker, { ModifiersUtils } from 'react-day-picker'
import classNames from 'classnames'

import TextInput from './TextInputInputComponent'

import { onBlurForReduxForm } from './utility/redux-form'

import { onBlur } from './utility/focus'

// // Moment.js takes 161 KB of space (minified) which is too much
// import moment from 'moment'

// // `date-fns` would be a better alternative to moment
// // but it doesn't support templated date parsing
// // until version `2.0.0` of it is released.
// // https://github.com/date-fns/date-fns/issues/347
// import parse_date_date_fns from 'date-fns/parse'
// import format_date_date_fns from 'date-fns/format'

export default class DatePicker extends Component
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

	componentDidMount()
	{
		// Set "previous" and "next" buttons untabbable
		// so that a Tab out of the `<input/>` field
		// moves cursor not inside to these buttons
		// but rather to the next form input.
		//
		// (rewritten)
		// Requires ES6 Symbol.Iterator polyfill.
		// for (const button of calendar.querySelectorAll('.DayPicker-NavButton'))
		//
		for (const button of [].slice.call(this.container.querySelectorAll('.DayPicker-NavButton')))
		{
			button.removeAttribute('tabindex')
		}
	}

	componentWillUnmount()
	{
		clearTimeout(this.userHasJustChangedYearOrMonthTimer)
	}

	expand     = () => this.expandable.expand()
	collapse   = () => this.expandable.collapse()
	toggle     = () => this.expandable.toggle()
	isExpanded = () => this.expandable.isExpanded()

	focus = () =>
	{
		this.input.focus()
	}

	userHasJustChangedYearOrMonth = () =>
	{
		this._userHasJustChangedYearOrMonth = true
		clearTimeout(this.userHasJustChangedYearOrMonthTimer)
		this.userHasJustChangedYearOrMonthTimer = setTimeout(() => this._userHasJustChangedYearOrMonth = false, 50)
	}

	on_input_focus = (event) =>
	{
		const { onFocus } = this.props

		if (onFocus) {
			onFocus(event)
		}

		this.expand()
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
			text_value : format_date(value, format)
		})
	}

	onExpanded = () =>
	{
		const { value } = this.props

		// Toggling the calendar in a timeout
		// in order for iOS scroll not to get "janky"
		// when `<DatePicker/>` gets focused.
		// (for some unknown reason)
		setTimeout(() =>
		{
			this.setState
			({
				month : value ? normalize_value(value) : new Date()
			})
		}, 0)
	}

	// Cancels textual date editing.
	onCollapse = () =>
	{
		this.setState
		({
			text_value : undefined
		})

		// `onChange` fires on calendar day `click`
		// but the `value` hasn't neccessarily been updated yet,
		// therefore, say, if `value` was not set
		// and a user selects a day in the calendar
		// then the `value` is technically still `undefined`
		// so can't just set `state.text_value = format_date(value)` here.
		//
		// Analogous, `setState({ text_value })` has been called
		// in calendar day `onClick` handler but `state.text_value`
		// hasn't neccessarily been updated yet.
		//
		// Still must validate (recompute) `text_value`
		// upon expanding the `<DatePicker/>`, for example, on `<input/>` blur
		// in cases when a user manually typed in an incomplete date and then tabbed away.
	}

	on_key_down_in_container = (event) =>
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

	on_input_key_down = (event) =>
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

	on_input_change = (event) =>
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

		value = trim_invalid_part(value, format)

		const selected_day = parse_date(value, format, noon, utc)

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
		() => this.calendar.showMonth(selected_day))
	}

	on_day_click = (selected_day, { disabled }) =>
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

		// this.setState
		// ({
		// 	// text_value: format_date(selected_day, format),
		// 	expanded: false
		// })

		// // Blur the input so that the calendar
		// // will open upon a future click on it.
		// // (doesn't work in mobile browsers)
		// this.input.blur()

		// Hide the calendar
		this.collapse()

		// Focus the `<input/>`
		if (getComputedStyle(this.inputOverlay).display === 'none')
		{
			this.input.focus()
		}
	}

	on_calendar_key_down = (event) =>
	{
		switch (event)
		{
			// The next year is selected on "Up" arrow,
			// so `.preventDefault()` it to prevent page scrolling.
			// https://github.com/gpbl/react-day-picker/issues/273
			case 38:
				event.preventDefault()
				return

			// The previous year is selected on "Down" arrow,
			// so `.preventDefault()` it to prevent page scrolling.
			// https://github.com/gpbl/react-day-picker/issues/273
			case 40:
				event.preventDefault()
				return
		}
	}

	onMonthChange = (month) =>
	{
		this.setState({ month })
	}

	onBlur = (event) =>
	{
		clearTimeout(this.blurTimer)
		this.blurTimer = onBlur(event, this.onFocusOut, () => this.container, () => this.input, this.preventBlur)
	}

	onFocusOut = () =>
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
			expanded,
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
				<YearMonthSelector
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
				onKeyDown={ this.on_key_down_in_container }
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
					value={ text_value !== undefined ? text_value : format_date(value, format) }
					onKeyDown={ this.on_input_key_down }
					onChange={ this.on_input_change }
					onFocus={ this.on_input_focus }
					onClick={ this.expand }>

					{/* This layer can intercept taps on mobile devices
					    to prevent the keyboard from showing
					    when the date picker is in fullscreen mode */}
					<div
						ref={ this.storeInputOverlayNode }
						onClick={ this.toggle }
						className="rrui__date-picker__input-overlay"/>

					{/* Calendar icon which toggles the calendar */}
					{ icon &&
						<div
							onClick={ this.toggle }
							className="rrui__date-picker__icon">
							{ icon() }
						</div>
					}

					{/* <DayPicker/> doesn't support `style` property */}
					<Expandable
						ref={ this.storeExpandableRef }
						onExpand={ this.onExpand }
						onExpanded={ this.onExpanded }
						onCollapse={ this.onCollapse }
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
							onDayClick={ this.on_day_click }
							onKeyDown={ this.on_calendar_key_down }
							selectedDays={ normalize_value(value) }
							disabledDays={ disabledDays }
							captionElement={ captionElement }
							tabIndex={ -1 }
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

// Parses a text value into a `Date` provided a `format`.
// The date returned is in the user's time zone and the time is `12:00`.
function parse_date(text_value, format, noon, utc)
{
	if (!text_value) {
		return
	}

	// Custom
	return parse_date_custom(text_value, format, noon, utc)

	// // Using `date-fns`
	// const date = parse_date_date_fns(text_value)

	// if (isNaN(date.getTime()))
	// {
	// 	return
	// }

	// return date

	// // Using `Moment.js`
	// const moment_day = moment(text_value, format, true)

	// if (!moment_day.isValid())
	// {
	// 	return
	// }

	// return moment_day.toDate()
}

// (Moment.js)
// Formats a `Date` into a text value provided a `format`
function format_date(date, format)
{
	// Custom
	return format_date_custom(date, format)

	// // Using `date-fns`
	// return format_date_date_fns(date, format)

	// // Using `Moment.js`
	// return moment(date).format(format)
}

// Parses a text value into a `Date` provided a `format`.
// The date returned is in the user's time zone and the time is `00:00`.
// (only `DD`, `MM`, `YY` and `YYYY` literals are supported).
function parse_date_custom(string, format, noon, utc)
{
	if (!string) {
		return
	}

	let year = extract(string, format, 'YYYY')

	if (year === undefined)
	{
		year = extract(string, format, 'YY')

		if (year !== undefined)
		{
			// Current year in the user's time zone.
			const current_year = new Date().getFullYear()
			const current_year_century = current_year - current_year % 100
			year += current_year_century
		}
	}

	const month = extract(string, format, 'MM')
	const day   = extract(string, format, 'DD')

	if (year === undefined || month === undefined || day === undefined) {
		return
	}

	// The date created is in the user's time zone and the time is `00:00`.
	let date = new Date
	(
		year,
		month - 1,
		day,
		noon ? 12 : undefined
	)

	if (utc)
	{
		// Converts timezone to UTC while preserving the same time
		date = convert_to_utc_timezone(date)
	}

	// If `new Date()` returns "Invalid Date"
	// (sometimes it does)
	if (isNaN(date.getTime())) {
		return
	}

	return date
}

function extract(string, template, piece)
{
	const starts_at = template.indexOf(piece)

	if (starts_at < 0) {
		return
	}

	// Check overall sanity
	if (!corresponds_to_template(string, template)) {
		return
	}

	const number = parseInt(string.slice(starts_at, starts_at + piece.length))

	if (!isNaN(number)) {
		return number
	}
}

function corresponds_to_template(string, template)
{
	if (string.length !== template.length) {
		return false
	}

	let i = 0
	while (i < string.length)
	{
		const is_a_digit = string[i] >= '0' && string[i] <= '9'

		if (!is_a_digit)
		{
			if (string[i] !== template[i])
			{
				return false
			}
		}
		else
		{
			if (template[i] !== 'D' && template[i] !== 'M' && template[i] !== 'Y')
			{
				return false
			}
		}

		i++
	}

	return true
}

// console.log(corresponds_to_template('1231231234', 'DD.MM.YYYY'))
// console.log(corresponds_to_template('12.12.1234', 'DD.MM.YYYY'))

// console.log(parse_date_custom('fadsfasd', 'DD.MM.YYYY'))
// console.log(parse_date_custom('28.02.2017', 'DD.MM.YYYY'))
// console.log(parse_date_custom('12/02/2017', 'MM/DD/YYYY'))
// console.log(parse_date_custom('99/99/2017', 'MM/DD/YYYY'))
// console.log(parse_date_custom('02/03/17', 'MM/DD/YY'))

function format_date_custom(date, format)
{
	// Someone may accidentally pass a timestamp, or a string.
	// Or `date` could be `undefined`.
	if (!(date instanceof Date)) {
		return ''
	}

	// Check if `date` is "Invalid Date".
	if (isNaN(date.getTime())) {
		return ''
	}

	const day   = date.getDate()
	const month = date.getMonth() + 1
	const year  = date.getFullYear()

	let text = format
		.replace('DD', pad_with_zeroes(String(day),   2))
		.replace('MM', pad_with_zeroes(String(month), 2))

	if (text.indexOf('YYYY') >= 0) {
		return text.replace('YYYY', pad_with_zeroes(String(year), 4))
	}

	if (text.indexOf('YY') >= 0) {
		return text.replace('YY', pad_with_zeroes(String(year % 100), 2))
	}
}

// console.log(format_date_custom(new Date(), 'DD.MM.YYYY'))
// console.log(format_date_custom(new Date(), 'MM/DD/YYYY'))
// console.log(format_date_custom(new Date(), 'MM/DD/YY'))

function pad_with_zeroes(string, target_length)
{
	while (string.length < target_length) {
		string = '0' + string
	}

	return string
}

// // Intl date formatting
//
// const dateFormatters = {}
//
// function format_dateIntl(date, locale) {
//   if (typeof Intl === 'undefined') {
//     return date.toISOString()
//   }
//
//   const key = typeof locale === 'string' ? locale : locale.join(',')
//
//   if (!dateFormatters[key]) {
//     dateFormatters[key] = new Intl.DateTimeFormat(locale, {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     })
//   }
//
//   return dateFormatters[key]
// }

// Converts `null` to `undefined`
// (specially for `knex.js`)
function normalize_value(value)
{
	if (value === null) {
		return
	}

	// Check if `value` is "Invalid Date".
	if (value instanceof Date && isNaN(value.getTime())) {
		return
	}

	return value
}

function trim_invalid_part(value, format)
{
	let i = 0
	while (i < value.length && i < format.length)
	{
		if (format[i] === 'D' || format[i] === 'M' || format[i] === 'Y')
		{
			if (!(value[i] >= '0' && value[i] <= '9'))
			{
				break
			}
		}
		else if (format[i] !== value[i])
		{
			break
		}
		i++
	}

	return value.slice(0, i)
}

// console.log(trim_invalid_part('fasdf', 'DD.MM.YYYY'))
// console.log(trim_invalid_part('01.01.1234', 'DD.MM.YYYY'))
// console.log(trim_invalid_part('01/02/34', 'MM/DD/YY'))
// console.log(trim_invalid_part('01/a2/34', 'MM/DD/YY'))

// http://react-day-picker.js.org/examples/?yearNavigation
// Component will receive date, locale and localeUtils props
class YearMonthSelector extends Component
{
	constructor(props)
	{
		super(props)

		const
		{
			selectYearsIntoPast,
			selectYearsIntoFuture,
			selectedDay,
			localeUtils
		}
		= this.props

		// The current year in the user's time zone.
		const current_year = new Date().getFullYear()

		const from_year = selectYearsIntoPast   ? current_year - selectYearsIntoPast   : current_year
		const   to_year = selectYearsIntoFuture ? current_year + selectYearsIntoFuture : current_year

		const years = new Array(to_year - from_year + 1)

		let i = 0
		while (from_year + i <= to_year)
		{
			years[i] = from_year + i
			i++
		}

		// Makes sure the currently selected year is in the list
		// to not confuse the user.
		if (selectedDay)
		{
			const selected_year = selectedDay.getFullYear()

			if (selected_year < from_year)
			{
				years.unshift(selected_year)
			}
			else if (selected_year > to_year)
			{
				years.push(selected_year)
			}
		}

		const months = localeUtils.getMonths()

		this.months = months
		this.years = years
	}

	onChangeMonth = (event) =>
	{
		const { date, onChange } = this.props

		const month = event.target.value

		if (month !== date.getMonth())
		{
			// The date created is in the user's time zone and the time is `00:00`.
			// The `day` is `undefined` which means the first one of the `month`.
			onChange(new Date(date.getFullYear(), month))
		}

		// restoreFocus()
	}

	onChangeYear = (event) =>
	{
		const { date, onChange } = this.props

		const year = event.target.value

		if (year !== date.getFullYear())
		{
			// The date created is in the user's time zone and the time is `00:00`.
			// The `day` is `undefined` which means the first one of the `month`.
			onChange(new Date(year, date.getMonth()))
		}

		// restoreFocus()
	}

	restoreFocus = () =>
	{
		const { userHasJustChangedYearOrMonth } = this.props

		// Doesn't work on iOS
		// focus()

		// A hack for iOS when it collapses
		// the calendar after selecting a year/month.
		// Known bug: it won't work when a user
		// focuses one `<select/>` and then focuses another one
		// because in that case `onBlur` won't be triggered for the second `<select/>`.
		userHasJustChangedYearOrMonth()
	}

	render()
	{
		const { date } = this.props

		return (
			<div className="DayPicker-Caption">
				<div className="DayPicker-CaptionSelects">
					<div className="DayPicker-MonthSelect">
						{/* Month `<select/>` */}
						<select
							onChange={ this.onChangeMonth }
							onBlur={ this.restoreFocus }
							value={ date.getMonth() }
							tabIndex={ -1 }
							className="rrui__select__native rrui__select__native--overlay">

							{ this.months.map((month, i) => (
								<option key={ i } value={ i }>
									{ month }
								</option>
							)) }
						</select>

						{/* Month `<select/>` button */}
						<button type="button" className="rrui__button-reset">
							<div className="rrui__select__selected-content">
								<div className="rrui__select__selected-label">
									{this.months[date.getMonth()]}
								</div>
								<div className="rrui__select__arrow"/>
							</div>
						</button>
					</div>

					<div className="DayPicker-YearSelect">
						{/* Year `<select/>` */}
						<select
							onChange={ this.onChangeYear }
							onBlur={ this.restoreFocus }
							value={ date.getFullYear() }
							tabIndex={ -1 }
							className="rrui__select__native rrui__select__native--overlay">

							{ this.years.map((year, i) => (
								<option key={ i } value={ year }>
									{ year }
								</option>
							)) }
						</select>

						{/* Year `<select/>` button */}
						<button type="button" className="rrui__button-reset">
							<div className="rrui__select__selected-content">
								<div className="rrui__select__selected-label">
									{date.getFullYear()}
								</div>
								<div className="rrui__select__arrow"/>
							</div>
						</button>
					</div>
				</div>
			</div>
		)
	}
}

// Converts timezone to UTC while preserving the same time
function convert_to_utc_timezone(date)
{
	// Doesn't account for leap seconds but I guess that's ok
	// given that javascript's own `Date()` does not either.
	// https://www.timeanddate.com/time/leap-seconds-background.html
	//
	// https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
	//
	return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)
}

const iconStyle =
{
	width  : '100%',
	height : '100%',
	fill   : 'currentColor'
}