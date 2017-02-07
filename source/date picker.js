// Derived from `react-day-picker` example
// http://react-day-picker.js.org/examples/?overlay

import React, { PureComponent, PropTypes } from 'react'
import DayPicker, { DateUtils } from 'react-day-picker'
import classNames from 'classnames'
import { flat as style } from 'react-styling'

import moment from 'moment'

// `date-fns` would be a better alternative to moment
// but it doesn't support templated date parsing
// until version `2.0.0` of it is released.
// https://github.com/date-fns/date-fns/issues/347
// import parse_date from 'date-fns/parse'
// import format_date from 'date-fns/format'

export default class DatePicker extends PureComponent
{
	static propTypes =
	{
		// An optional label placed on top of the input field
		label : PropTypes.string,

		// `0` means "Sunday", `1` means "Monday", etc.
		// (is `0` by default)
		firstDayOfWeek : PropTypes.number.isRequired,

		// Date format
		// http://momentjs.com/docs/#/displaying/
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

		// HTML `<input/>` `name` attribute
		name : PropTypes.string,

		// CSS class
		className : PropTypes.string,

		// CSS style object
		style : PropTypes.object
	}

	static defaultProps =
	{
		format: 'DD/MM/YYYY',
		// locale: 'en-US',
		firstDayOfWeek: 0
	}

	state =
	{
		editing       : false,
		show_calendar : false,
		text_value    : '',
		selected_day  : null
	}

	constructor()
	{
		super()

		this.on_day_click    = this.on_day_click.bind(this)
		this.on_input_change = this.on_input_change.bind(this)
		this.on_input_focus  = this.on_input_focus.bind(this)
		this.on_input_blur   = this.on_input_blur.bind(this)
		this.on_mouse_down   = this.on_mouse_down.bind(this)
	}

	componentWillUnmount()
	{
		clearTimeout(this.clicked_inside_reset_timeout)
	}

	on_mouse_down()
	{
		this.clicked_inside = true
		// The `<input/>`'s `onBlur` method is called
		// from a queue right after `onMouseDown` event on the calendar.
		// Therefore `setTimeout` can be used to immediately
		// clear the `clicked_inside` flag (right after setting it)
		// in such a way that its lifetime is sufficient
		// for `on_input_blur()` to process it correctly.
		this.clicked_inside_reset_timeout = setTimeout(() => this.clicked_inside = false, 0)
	}

	on_input_focus()
	{
		const { value, format } = this.props

		this.setState
		({
			editing       : true,
			text_value    : format_date(value, format),
			show_calendar : true
		})
	}

	on_input_blur()
	{
		// Don't hide the calendar when `mouseDown`ing a day in it.
		// The calendar will be hidden later when `click` handler fires.
		// Force input's focus if blur event was caused by clicking on the calendar
		if (this.clicked_inside)
		{
			return this.input.focus()
		}

		this.setState
		({
			editing       : false,
			text_value    : undefined,
			show_calendar : false
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
		//
		// So, if the entered date isn't valid
		// then clear the `<input/>` field.

		// const { text_value } = this.state
		// const { format } = this.props

		// if (!parse_date(text_value, format))
		// {
		// 	this.setState({ text_value: '' })
		// }
	}

	on_input_change(event)
	{
		const { value } = event.target
		const { onChange, format } = this.props

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

	on_day_click(event, selected_day)
	{
		const { format, onChange } = this.props

		// `onChange` fires but the `value`
		// hasn't neccessarily been updated yet
		onChange(selected_day)

		this.setState
		({
			// text_value: format_date(selected_day, format),
			show_calendar: false
		})

		this.input.blur()
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
			label,
			error,
			indicateInvalid,
			className,
			style
		}
		= this.props

		const { editing, text_value, show_calendar } = this.state

		// `<input type="date"/>` renders a browser-specific date picker
		// which can not be turned off using a simple HTML attribute
		// and also date format is not customizable,
		// therefore just using `<input type="text"/>` here

		return (
			<div
				onMouseDown={ this.on_mouse_down }
				className={ classNames('rrui__date-picker', className,
				{
					'rrui__date-picker--disabled' : disabled
				}) }
				style={ style ? { ...styles.container, ...style } : styles.container }>

				<input
					id={ id }
					type="text"
					ref={ ref => this.input = ref }
					placeholder={ typeof format === 'string' ? format : undefined }
					disabled={ disabled }
					value={ editing ? text_value : format_date(value, format) }
					onChange={ this.on_input_change }
					onFocus={ this.on_input_focus }
					onBlur={ this.on_input_blur }
					className={ classNames
					(
						'rrui__input',
						'rrui__date-picker__input'
					) }
					style={ styles.input }/>

				{/* Label */}
				{/* (this label is placed after the `<input/>`
				     to utilize the CSS `+` selector) */}
				{ label &&
					<label
						htmlFor={ id }
						className={ classNames('rrui__input-label',
						{
							'rrui__input-label--invalid' : error && indicateInvalid
						}) }
						style={ styles.label }>
						{ label }
					</label>
				}

				{/* <DayPicker/> doesn't support `style` property */}
				{ show_calendar &&
					<div style={ calendar_container_style }>
						<DayPicker
							ref={ ref => this.daypicker = ref }
							initialMonth={ value }
							firstDayOfWeek={ firstDayOfWeek }
							onDayClick={ this.on_day_click }
							selectedDays={ day => DateUtils.isSameDay(value, day) }
							className="rrui__date-picker__calendar"/>
					</div>
				}

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

	const moment_day = moment(text_value, format, true)

	if (!moment_day.isValid())
	{
		return
	}

	return moment_day.toDate()
}

// Formats a `Date` into a text value provided a `format`
function format_date(date, format)
{
	if (!date)
	{
		return ''
	}

	return moment(date).format(format)
}

const calendar_container_style =
{
	position : 'absolute',
	zIndex   : 1
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

const styles = style
`
	container
		position : relative

	label
		position    : absolute
		white-space : nowrap

		-webkit-user-select : none
		-moz-user-select    : none
		-ms-user-select     : none
		user-select         : none

		// Vertically align
		display     : flex
		align-items : center
		height      : 100%

	input
		box-sizing : border-box
`