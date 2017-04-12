// Derived from `react-day-picker` example
// http://react-day-picker.js.org/examples/?overlay

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import DayPicker, { DateUtils } from 'react-day-picker'
import classNames from 'classnames'

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

		// Date format. Only supports `DD`, `MM` and `YYYY` for now (to reduce bundle size).
		// Can support custom localized formats, perhaps, when `date-fns@2` is released.
		// (is `DD/MM/YYYY` by default)
		format : PropTypes.string.isRequired,
		// format : PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,

		// Internationalization
		// locale : PropTypes.string,

		// The Date `value`
		value : PropTypes.instanceOf(Date),

		// Writes new `value`
		onChange : PropTypes.func.isRequired,

		// Disables the input
		disabled : PropTypes.bool,

		// Set to `true` to mark the field as required
		required : PropTypes.bool.isRequired,

		// HTML `<input/>` `name` attribute
		name : PropTypes.string,

		// CSS class
		className : PropTypes.string,

		// CSS style object
		style : PropTypes.object
	}

	static defaultProps =
	{
		format : 'DD/MM/YYYY',

		// locale: 'en-US',
		firstDayOfWeek : 0,

		// Set to `true` to mark the field as required
		required : false
	}

	state =
	{
		expanded     : false,
		selected_day : null
	}

	componentDidMount()
	{
		document.addEventListener('click', this.document_clicked)
	}

	componentWillUnmount()
	{
		document.removeEventListener('click', this.document_clicked)
	}

	on_input_focus = () =>
	{
		const { value, format } = this.props

		this.setState
		({
			text_value : format_date(value, format),
			expanded   : true
		})
	}

	// Would have used `onBlur()` handler here
	// with `container.contains(event.relatedTarget)`,
	// but it has an IE bug in React.
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
			// Toggle on Tab out
			case 9:
				if (expanded)
				{
					this.date_chosen()
				}
				return
		}
	}

	on_input_key_down = (event) =>
	{
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey)
		{
			return
		}

		const { expanded } = this.state

		switch (event.keyCode)
		{
			// Collapse on Escape
			case 27:
				if (expanded)
				{
					this.date_chosen()
					// Since this `event` originated in the `<input/>`
					// mobile web browsers will allow `.blur()`ring it.
					this.input.blur()
				}
				return
		}
	}

	// Hides the day picker calendar and cancels textual date editing
	date_chosen()
	{
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
		const { value } = event.target
		const { onChange, format } = this.props

		// When the date is erased, reset it.
		if (!value)
		{
			onChange(undefined)
			return this.setState({ text_value: '' })
		}

		const selected_day = parse_date(value, format)

		if (!selected_day)
		{
			return this.setState({ text_value: value })
		}

		onChange(selected_day)

		this.setState
		({
			text_value: value
		},
		() => this.daypicker.showMonth(selected_day))
	}

	on_day_click = (selected_day) =>
	{
		const { format, onChange } = this.props

		// `onChange` fires but the `value`
		// hasn't neccessarily been updated yet
		onChange(selected_day)

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
		this.date_chosen()
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
		const input = ReactDOM.findDOMNode(this.input)
		const calendar = ReactDOM.findDOMNode(this.daypicker)

		// Don't close the dropdown if the click is inside input or calendar
		if (input.contains(event.target) || calendar.contains(event.target))
		{
			return
		}

		this.date_chosen()
	}

	render()
	{
		const
		{
			id,
			format,
			value,
			firstDayOfWeek,
			disabled,
			required,
			label,
			placeholder,
			error,
			indicateInvalid,
			className,
			style
		}
		= this.props

		const { text_value, expanded } = this.state

		// `<input type="date"/>` renders a browser-specific date picker
		// which can not be turned off using a simple HTML attribute
		// and also date format is not customizable,
		// therefore just using `<input type="text"/>` here

		return (
			<div
				onKeyDown={ this.on_key_down_in_container }
				className={ classNames('rrui__date-picker', className,
				{
					'rrui__date-picker--disabled' : disabled
				}) }
				style={ style }>

				<div className="rrui__input">
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
						className="rrui__date-picker__input"/>

					{/* Label */}
					{/* (this label is placed after the `<input/>`
					     to utilize the CSS `+` selector) */}
					{ label &&
						<label
							htmlFor={ id }
							className={ classNames('rrui__input-label',
							{
								'rrui__input-label--required' : required && !value,
								'rrui__input-label--invalid'  : error && indicateInvalid
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
						<DayPicker
							ref={ ref => this.daypicker = ref }
							initialMonth={ normalize_value(value) }
							firstDayOfWeek={ firstDayOfWeek }
							onDayClick={ this.on_day_click }
							onKeyDown={ this.on_calendar_key_down }
							selectedDays={ normalize_value(value) }
							className={ classNames
							(
								'rrui__expandable__content',
								'rrui__date-picker__calendar',
								{
									// CSS selector performance optimization
									'rrui__expandable__content--expanded'   : expanded
								}
							) }/>
					</div>
				</div>

				{/* Error message */}
				{ error && indicateInvalid &&
					<div className="rrui__input-error">{ error }</div>
				}
			</div>
		)
	}
}

// Parses a text value into a `Date` provided a `format`
function parse_date(text_value, format)
{
	if (!text_value)
	{
		return
	}

	// Custom
	return parse_date_custom(text_value, format)

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
	if (!date)
	{
		return ''
	}

	// Custom
	return format_date_custom(date, format)

	// // Using `date-fns`
	// return format_date_date_fns(date, format)

	// // Using `Moment.js`
	// return moment(date).format(format)
}

function parse_date_custom(string, format)
{
	if (!string)
	{
		return
	}

	const year  = extract(string, format, 'YYYY')
	const month = extract(string, format, 'MM')
	const day   = extract(string, format, 'DD')

	if (year === undefined || month === undefined || day === undefined)
	{
		return
	}

	const date = new Date
	(
		year,
		month - 1,
		day
	)

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

function format_date_custom(date, format)
{
	if (!(date instanceof Date))
	{
		return
	}

	const day   = date.getDate()
	const month = date.getMonth() + 1
	const year  = date.getFullYear()

	return format
		.replace('DD',   pad_with_zeroes(String(day),   2))
		.replace('MM',   pad_with_zeroes(String(month), 2))
		.replace('YYYY', pad_with_zeroes(String(year),  4))
}

// console.log(format_date_custom(new Date(), 'DD.MM.YYYY'))
// console.log(format_date_custom(new Date(), 'MM/DD/YYYY'))

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

function normalize_value(value)
{
	// Specially for `knex.js`
	if (value === null)
	{
		return undefined
	}

	return value
}