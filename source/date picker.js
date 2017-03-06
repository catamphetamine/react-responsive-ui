// Derived from `react-day-picker` example
// http://react-day-picker.js.org/examples/?overlay

import React, { PureComponent, PropTypes } from 'react'
import ReactDOM from 'react-dom'
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

import { is_reachable } from './misc/dom'

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
		expanded     : false,
		selected_day : null
	}

	constructor()
	{
		super()

		this.on_day_click      = this.on_day_click.bind(this)
		this.on_input_change   = this.on_input_change.bind(this)
		this.on_input_focus    = this.on_input_focus.bind(this)
		this.on_input_key_down = this.on_input_key_down.bind(this)
		this.on_key_down_in_container = this.on_key_down_in_container.bind(this)
		this.document_clicked  = this.document_clicked.bind(this)
	}

	componentDidMount()
	{
		document.addEventListener('click', this.document_clicked)
	}

	componentWillUnmount()
	{
		document.removeEventListener('click', this.document_clicked)
	}

	on_input_focus()
	{
		const { value, format } = this.props

		this.setState
		({
			text_value : format_date(value, format),
			expanded   : true
		})
	}

	// Would have used `onBlur()` handler here
	// with `is_reachable(event.relatedTarget, container)`,
	// but it has an IE bug in React.
	// https://github.com/facebook/react/issues/3751
	//
	// Therefore, using the hacky `document.onClick` handlers
	// and this `onKeyDown` Tab handler
	// until `event.relatedTarget` support is consistent in React.
	//
	on_key_down_in_container(event)
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

	on_input_key_down(event)
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

	document_clicked(event)
	{
		const dom_node = ReactDOM.findDOMNode(this.container)

		// Don't close the dropdown if the click is inside container
		if (is_reachable(event.target, dom_node))
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
			label,
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
				ref={ ref => this.container = ref }
				onKeyDown={ this.on_key_down_in_container }
				className={ classNames('rrui__date-picker', className,
				{
					'rrui__date-picker--disabled' : disabled
				}) }
				style={ style }>

				<input
					id={ id }
					type="text"
					ref={ ref => this.input = ref }
					placeholder={ typeof format === 'string' ? format : undefined }
					disabled={ disabled }
					value={ text_value !== undefined ? text_value : format_date(value, format) }
					onKeyDown={ this.on_input_key_down }
					onChange={ this.on_input_change }
					onFocus={ this.on_input_focus }
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
						initialMonth={ value }
						firstDayOfWeek={ firstDayOfWeek }
						onDayClick={ this.on_day_click }
						selectedDays={ day => DateUtils.isSameDay(value, day) }
						className={ classNames
						(
							'rrui__date-picker__calendar',
							{
								// CSS selector performance optimization
								'rrui__date-picker__calendar--expanded' : expanded
							}
						) }/>
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