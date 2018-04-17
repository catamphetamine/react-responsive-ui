// Derived from `react-day-picker` example
// http://react-day-picker.js.org/examples/?overlay

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import DayPicker, { ModifiersUtils } from 'react-day-picker'
import classNames from 'classnames'

import { submitFormOnCtrlEnter } from './utility/dom'

import Close from './Close'

// // Moment.js takes 161 KB of space (minified) which is too much
// import moment from 'moment'

// // `date-fns` would be a better alternative to moment
// // but it doesn't support templated date parsing
// // until version `2.0.0` of it is released.
// // https://github.com/date-fns/date-fns/issues/347
// import parse_date_date_fns from 'date-fns/parse'
// import format_date_date_fns from 'date-fns/format'

export default class DatePicker extends PureComponent
{
	static propTypes =
	{
		// An optional label placed on top of the input field
		label : PropTypes.string,

		// `<input/>` placeholder
		placeholder : PropTypes.string,

		// `0` means "Sunday", `1` means "Monday", etc.
		// (is `0` by default)
		firstDayOfWeek : PropTypes.number.isRequired,

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
		selectYearsIntoPast : PropTypes.number,

		// How much years forward can a user navigate using the year `<select/>`
		selectYearsIntoFuture : PropTypes.number,

		// Whether dates being selected should be in UTC+0 timezone.
		// (is `false` by default)
		utc : PropTypes.bool.isRequired,

		// Whether to set time to 12:00 for dates being selected.
		// (is `true` by default)
		noon : PropTypes.bool.isRequired,

		// The calendar icon
		icon : PropTypes.node,

		// `aria-label` for the "Close" button
		// (which is an "x" visible in fullscreen mode).
		closeLabel : PropTypes.string,

		// The "x" button that closes the `<Select/>`
		// in fullscreen mode on mobile devices.
		closeButton : PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf([false])]).isRequired,

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

		// The "x" button that closes the `<DatePicker/>`
		// in fullscreen mode on mobile devices.
		closeButton : Close
	}

	state =
	{
		expanded     : false,
		selected_day : null
	}

	componentDidMount()
	{
		document.addEventListener('click', this.document_clicked)

		// Set "previous" and "next" buttons untabbable
		// so that a Tab out of the `<input/>` field
		// moves cursor not inside to these buttons
		// but rather to the next form input.
		const calendar = ReactDOM.findDOMNode(this.calendar)
		// Requires ES6 Symbol.Iterator polyfill.
		// for (const button of calendar.querySelectorAll('.DayPicker-NavButton'))
		for (const button of [].slice.call(calendar.querySelectorAll('.DayPicker-NavButton')))
		{
			button.removeAttribute('tabindex')
		}
	}

	componentWillUnmount()
	{
		document.removeEventListener('click', this.document_clicked)
	}

	on_input_focus = (event) =>
	{
		const { onFocus } = this.props

		if (onFocus)
		{
			onFocus(event)
		}

		this.expand()
	}

	expand = () =>
	{
		const { expanded } = this.state
		const { value, format, onToggle } = this.props

		if (expanded)
		{
			return
		}

		this.setState
		({
			month : undefined
		},
		() =>
		{
			if (onToggle)
			{
				onToggle(true)
			}

			this.setState
			({
				text_value : format_date(value, format),
				expanded   : true,
				month      : value ? normalize_value(value) : new Date()
			})

			// Could also focus on the calendar controls upon expansion
			// but it's configured to collapse on Tab event.
			// , () =>
			// {
			// 	ReactDOM.findDOMNode(this.calendar).focus()
			// })
		})
	}

	// Would have used `onBlur={...}` event handler here
	// with `if (container.contains(event.relatedTarget))` condition,
	// but it doesn't work in IE in React.
	// https://github.com/facebook/react/issues/3751
	//
	// Therefore, using the hacky `document.onClick` handlers
	// and this `onKeyDown` Tab handler
	// until `event.relatedTarget` support is consistent in React.
	//
	on_key_down_in_container = (event) =>
	{
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey)
		{
			return
		}

		const { expanded } = this.state

		switch (event.keyCode)
		{
			// Collapse on Escape or on Tab out
			case 27:
				event.preventDefault()
				this.input.focus()
			case 9:
				if (expanded)
				{
					this.collapse()
				}
				return
		}
	}

	on_input_key_down = (event) =>
	{
		const { onKeyDown } = this.props

		if (onKeyDown)
		{
			onKeyDown(event)
		}

		if (submitFormOnCtrlEnter(event, this.input))
		{
			return
		}

		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey)
		{
			return
		}

		const { expanded } = this.state

		switch (event.keyCode)
		{
			// Collapse on Escape and on Enter
			case 27:
				event.preventDefault()
			case 13:
				if (expanded)
				{
					this.collapse()
				}
				return

			// Toggle the calendar on Spacebar
			case 32:
				event.preventDefault()

				if (expanded)
				{
					this.collapse()
				}
				else
				{
					this.expand()
				}

				return

			// Collapse the calendar (if expanded) on Up arrow
			case 38:
				if (expanded)
				{
					event.preventDefault()
					this.collapse()
				}
				return

			// Expand the calendar (if collapsed) on Down arrow
			case 40:
				if (!expanded)
				{
					event.preventDefault()
					this.expand()
				}
				return
		}
	}

	// Hides the day picker calendar and cancels textual date editing
	collapse = () =>
	{
		const { onToggle } = this.props

		if (onToggle)
		{
			onToggle(false)
		}

		this.setState
		({
			text_value : undefined,
			expanded   : false
		})

		// `onChange` fires on calendar day `click`
		// but the `value` hasn't neccessarily been updated yet,
		// therefore, say, if `value` was not set
		// and a user select a day in the calendar
		// then the `value` is technically still `undefined`
		// so can't just set `state.text_value = format_date(value)` here.
		//
		// Analogous, `setState({ text_value })` has been called
		// in calendar day `onClick` but `state.text_value`
		// hasn't neccessarily been updated yet.
		//
		// Still must validate (recompute) `text_value` on `<input/>` blur
		// in cases when a user manually typed in a date and then tabbed away.
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

		let { value } = event.target

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
		this.input.focus()
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

	document_clicked = (event) =>
	{
		const container = ReactDOM.findDOMNode(this.container)

		if (container.contains(event.target))
		{
			return
		}

		this.collapse()
	}

	on_month_selected = (month) =>
	{
		this.setState({ month })
	}

	// Whether should indicate that the input value is invalid
	should_indicate_invalid()
	{
		const { indicateInvalid, error } = this.props

		return indicateInvalid && error
	}

	// This handler is a workaround for `redux-form`
	on_blur = (event) =>
	{
		const { onBlur, value } = this.props

		// If clicked on an expanded calendar then don't trigger "blur" event
		if (event.relatedTarget && event.currentTarget.contains(event.relatedTarget))
		{
			return
		}

		// This `onBlur` interceptor is a workaround for `redux-form`,
		// so that it gets the right (parsed, not the formatted one)
		// `event.target.value` in its `onBlur` handler.
		if (onBlur)
		{
			const _event =
			{
				...event,
				target:
				{
					...event.target,
					value
				}
			}

			// For `redux-form` event detection.
			// https://github.com/erikras/redux-form/blob/v5/src/events/isEvent.js
			_event.stopPropagation = event.stopPropagation
			_event.preventDefault  = event.preventDefault

			onBlur(_event)
		}
	}

	render()
	{
		const
		{
			id,
			format,
			value,
			error,
			disabledDays,
			selectYearsIntoPast,
			selectYearsIntoFuture,
			firstDayOfWeek,
			disabled,
			required,
			label,
			placeholder,
			closeLabel,
			closeButton : CloseButton,
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

		let captionElement

		if (selectYearsIntoPast || selectYearsIntoFuture)
		{
			captionElement = <YearMonthSelector
				selectedDay={ value }
				onChange={ this.on_month_selected }
				selectYearsIntoPast={ selectYearsIntoPast }
				selectYearsIntoFuture={ selectYearsIntoFuture } />
		}

		return (
			<div
				ref={ ref => this.container = ref }
				onKeyDown={ this.on_key_down_in_container }
				onBlur={ this.on_blur }
				className={ classNames('rrui__date-picker', className,
				{
					'rrui__date-picker--disabled' : disabled
				}) }
				style={ style }>

				<div className="rrui__input">
					<div className="rrui__date-picker__icon">
						{ icon }
					</div>

					{/* This layer can intercept taps on mobile devices
					    to prevent the keyboard from showing
					    when the date picker is in fullscreen mode */}
					<div
						onClick={ this.expand }
						className="rrui__date-picker__input-overlay"/>

					{/* Date input */}
					<input
						id={ id }
						type="text"
						ref={ ref => this.input = ref }
						placeholder={ placeholder || (typeof format === 'string' ? format : undefined) }
						disabled={ disabled }
						value={ text_value !== undefined ? text_value : format_date(value, format) }
						onKeyDown={ this.on_input_key_down }
						onChange={ this.on_input_change }
						onFocus={ this.on_input_focus }
						onClick={ this.expand }
						className={ classNames
						(
							'rrui__input-element',
							'rrui__input-field',
							{
								'rrui__input-field--invalid'  : this.should_indicate_invalid(),
								'rrui__input-field--disabled' : disabled
							}
						) }/>

					{/* Label */}
					{/* (this label is placed after the `<input/>`
					     to utilize the CSS `+` selector) */}
					{ label &&
						<label
							htmlFor={ id }
							className={ classNames('rrui__input-label',
							{
								'rrui__input-label--required' : required && !value,
								'rrui__input-label--invalid'  : this.should_indicate_invalid()
							}) }>
							{ label }
						</label>
					}

					{/* <DayPicker/> doesn't support `style` property */}
					<div
						className={ classNames
						(
							'rrui__expandable',
							'rrui__expandable--overlay',
							'rrui__shadow',
							'rrui__date-picker__collapsible',
							{
								'rrui__expandable--expanded' : expanded
							}
						) }>
						<div
							className={ classNames
							(
								'rrui__expandable__content',
								{
									// CSS selector performance optimization
									'rrui__expandable__content--expanded'   : expanded
								}
							) }>
							<DayPicker
								ref={ ref => this.calendar = ref }
								month={ month }
								firstDayOfWeek={ firstDayOfWeek }
								onDayClick={ this.on_day_click }
								onKeyDown={ this.on_calendar_key_down }
								selectedDays={ normalize_value(value) }
								disabledDays={ disabledDays }
								captionElement={ captionElement }
								tabIndex={ -1 }
								className="rrui__date-picker__calendar" />

							{/* "Close" button for fullscreen mode on mobile devices */}
							{ CloseButton &&
								<CloseButton
									onClick={ this.collapse }
									closeLabel={ closeLabel }
									className="rrui__close--bottom-right rrui__date-picker__close"/>
							}
						</div>
					</div>
				</div>

				{/* Error message */}
				{ this.should_indicate_invalid() &&
					<div className="rrui__input-error">{ error }</div>
				}
			</div>
		)
	}
}

// Parses a text value into a `Date` provided a `format`.
// The date returned is in the user's time zone and the time is `12:00`.
function parse_date(text_value, format, noon, utc)
{
	if (!text_value)
	{
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
function parse_date_custom(string, format, noon, utc)
{
	if (!string)
	{
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

	if (year === undefined || month === undefined || day === undefined)
	{
		return console.error(`Couldn't parse date. Most likely an invalid date entered (manually). Otherwise it could be an unsupported date format: ${format} (only DD, MM, YY and YYYY literals are supported).`)
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
	if (isNaN(date.getTime()))
	{
		return
	}

	return date
}

function extract(string, template, piece)
{
	const starts_at = template.indexOf(piece)

	if (starts_at < 0)
	{
		return
	}

	// Check overall sanity
	if (!corresponds_to_template(string, template))
	{
		return
	}

	const number = parseInt(string.slice(starts_at, starts_at + piece.length))

	if (!isNaN(number))
	{
		return number
	}
}

function corresponds_to_template(string, template)
{
	if (string.length !== template.length)
	{
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
	if (!(date instanceof Date))
	{
		return ''
	}

	// Check if `date` is "Invalid Date".
	if (isNaN(date.getTime()))
	{
		return ''
	}

	const day   = date.getDate()
	const month = date.getMonth() + 1
	const year  = date.getFullYear()

	let text = format
		.replace('DD', pad_with_zeroes(String(day),   2))
		.replace('MM', pad_with_zeroes(String(month), 2))

	if (text.indexOf('YYYY') >= 0)
	{
		return text.replace('YYYY', pad_with_zeroes(String(year), 4))
	}

	if (text.indexOf('YY') >= 0)
	{
		return text.replace('YY', pad_with_zeroes(String(year % 100), 2))
	}
}

// console.log(format_date_custom(new Date(), 'DD.MM.YYYY'))
// console.log(format_date_custom(new Date(), 'MM/DD/YYYY'))
// console.log(format_date_custom(new Date(), 'MM/DD/YY'))

function pad_with_zeroes(string, target_length)
{
	while (string.length < target_length)
	{
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
	if (value === null)
	{
		return
	}

	// Check if `value` is "Invalid Date".
	if (value instanceof Date && isNaN(value.getTime()))
	{
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
function YearMonthSelector({ date, localeUtils, onChange, selectYearsIntoPast, selectYearsIntoFuture, selectedDay })
{
	// The current year in the user's time zone.
	const current_year = new Date().getFullYear()

	let from_year = selectYearsIntoPast   ? current_year - selectYearsIntoPast   : current_year
	const to_year = selectYearsIntoFuture ? current_year + selectYearsIntoFuture : current_year

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

	function on_change(event)
	{
		const month = event.target.parentNode.firstChild.value
		const year  = event.target.parentNode.lastChild.value

		// The date created is in the user's time zone and the time is `00:00`.
		// The `day` is `undefined` which means the first one of the `month`.
		onChange(new Date(year, month))
	}

	return (
		<div className="DayPicker-Caption">
			<div className="DayPicker-CaptionSelects">
				<select
					onChange={ on_change }
					value={ date.getMonth() }
					tabIndex={ -1 }
					className="DayPicker-MonthSelect">

					{ months.map((month, i) => (
						<option key={ i } value={ i }>
							{ month }
						</option>
					)) }
				</select>

				<select
					onChange={ on_change }
					value={ date.getFullYear() }
					tabIndex={ -1 }
					className="DayPicker-YearSelect">

					{ years.map((year, i) => (
						<option key={ i } value={ year }>
							{ year }
						</option>
					)) }
				</select>
			</div>
		</div>
	)
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