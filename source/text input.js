import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import styler from 'react-styling/flat'
import classNames from 'classnames'

import { submit_parent_form } from './misc/dom'

export default class Text_input extends Component
{
	state = {}

	static propTypes =
	{
		// Text field label
		label            : PropTypes.string,

		// HTML form input `name` attribute
		name             : PropTypes.string,

		// Text field value
		value            : PropTypes.string,

		// Is called when the `value` is edited
		onChange         : PropTypes.func.isRequired,

		// Disables the text field
		disabled         : PropTypes.bool,

		// Renders description text before the `<input/>`
		description      : PropTypes.string,

		// Renders an error message below the `<input/>`
		error            : PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),

		// If this flag is `true` then the `error` is shown.
		// If this flag is `false` then the `error` is not shown (even if passed).
		indicateInvalid  : PropTypes.bool,

		// HTML 5 placeholder (instead of a label)
		placeholder      : PropTypes.string,

		// `<textarea/>` instead of an `<input type="text"/>`
		multiline        : PropTypes.bool,

		// Sets HTML input `type` attribute to `email`
		email            : PropTypes.bool,

		// Sets HTML input `type` attribute to `password`
		password         : PropTypes.bool,

		// Autofocuses the input field
		focus            : PropTypes.bool,

		// CSS style object
		style            : PropTypes.object,

		// CSS style object for `<input/>`
		inputStyle       : PropTypes.object,

		// CSS style object for the label
		labelStyle       : PropTypes.object
	}

	constructor(props, context)
	{
		super(props, context)

		this.autoresize = this.autoresize.bind(this)
		this.on_change = this.on_change.bind(this)
		this.on_key_down = this.on_key_down.bind(this)
	}

	// Client side rendering, javascript is enabled
	componentDidMount()
	{
		if (this.props.multiline)
		{
			this.setState({ autoresize: autoresize_measure(ReactDOM.findDOMNode(this.input)) })
		}

		this.setState({ javascript: true })
	}

	render()
	{
		const
		{
			name,
			value,
			label,
			labelStyle,
			description,
			error,
			indicateInvalid,
			className
		}
		= this.props

		const markup =
		(
			<div
				style={ this.props.style ? { ...style.text_input, ...this.props.style } : style.text_input }
				className={classNames
				(
					'rrui__rich',
					'rrui__text-input',
					{
						'rrui__text-input--empty'   : !value,
						'rrui__text-input--invalid' : indicateInvalid && error
					},
					className
				)}>

				{/* Description */}
				{this.render_description()}

				{/* <input/> */}
				{this.render_input({ name: false })}

				{/* input label */}
				{!description && label &&
					<label
						className="rrui__text-input__label"
						style={ labelStyle ? { ...style.label, ...labelStyle } : style.label }>
						{label}
					</label>
				}

				{/* Error message */}
				{this.render_error_message()}

				{/* Fallback in case javascript is disabled (no animated <label/>) */}
				{!this.state.javascript && this.render_static()}
			</div>
		)

		return markup
	}

	render_description()
	{
		const { description, value } = this.props

		if (!description)
		{
			return
		}

		const markup =
		(
			<p
				className="rrui__text-input__description"
				style={value && value.trim() ? style.description_tame : style.description}>
				{description}
			</p>
		)

		return markup
	}

	render_input(options = {})
	{
		const { placeholder, ref, name } = options
		const { value, multiline, email, password, focus, onChange, disabled, inputStyle } = this.props

		let type

		if (email)
		{
			type = 'email'
		}
		else if (password)
		{
			type = 'password'
		}
		else
		{
			type = 'text'
		}

		let input_style = style.input
		if (inputStyle)
		{
			input_style = { ...input_style, ...inputStyle }
		}

		const properties =
		{
			name        : name === false ? undefined : this.props.name,
			ref         : ref === false ? undefined : ref => this.input = ref,
			value       : (value === undefined || value === null) ? '' : value,
			placeholder : placeholder || this.props.placeholder,
			onChange    : this.on_change,
			onKeyDown   : this.on_key_down,
			disabled,
			// onFocus     : this.props.on_focus,
			// onBlur      : this.props.on_blur,
			className   : 'rrui__text-input__field',
			style       : input_style,
			autoFocus   : focus
		}

		if (multiline)
		{
			// maybe add autoresize for textarea (smoothly animated)
			return <textarea
				rows={2}
				onInput={this.autoresize}
				onKeyUp={this.autoresize}
				{...properties}/>
		}

		return <input type={type} {...properties}/>
	}

	render_error_message()
	{
		const { error, indicateInvalid } = this.props

		if (indicateInvalid && error)
		{
			return <div className="rrui__text-input__error">{error}</div>
		}
	}

	// Fallback in case javascript is disabled (no animated <label/>)
	render_static()
	{
		const markup =
		(
			<div className="rrui__rich__fallback">
				{/* Description */}
				{this.render_description()}

				{/* <input/> */}
				{this.render_input({ placeholder: this.props.label, ref: false })}

				{/* Error message */}
				{this.render_error_message()}
			</div>
		)

		return markup
	}

	// "keyup" is required for IE to properly reset height when deleting text
	autoresize(event)
	{
		const element = event.target

		const current_scroll_position = window.pageYOffset

		element.style.height = 0

		let height = element.scrollHeight + this.state.autoresize.extra_height
		height = Math.max(height, this.state.autoresize.initial_height)

		element.style.height = height + 'px'

		window.scroll(window.pageXOffset, current_scroll_position)
	}

	on_change(event)
	{
		this.props.onChange(event.target.value)
	}

	on_key_down(event)
	{
		// Submit the form on Cmd + Enter (or Ctrl + Enter)
		if ((event.ctrlKey || event.metaKey) && event.keyCode === 13)
		{
			if (submit_parent_form(ReactDOM.findDOMNode(this.input)))
			{
				event.preventDefault()
			}
		}
	}

	focus()
	{
		ReactDOM.findDOMNode(this.input).focus()
	}
}

const style = styler
`
	text_input

	input
		// max-width : 100%

	label
		-webkit-user-select : none
		-moz-user-select    : none
		-ms-user-select     : none
		user-select         : none

	description
		transition : opacity 160ms ease-out

		&tame
			opacity : 0.6
`

// <textarea/> autoresize (without ghost elements)
// https://github.com/javierjulio/textarea-autosize/blob/master/src/jquery.textarea_autosize.js
function autoresize_measure(element)
{
	const style = window.getComputedStyle(element)

	const extra_height =
		parseInt(style.borderTopWidth) +
		parseInt(style.borderBottomWidth)

	// Raw `.getBoundingClientRect().height` could be used here
	// to avoid rounding (e.g. `em`, `rem`, `pt`, etc),
	// but setting `.scrollHeight` has no non-rounded equivalent.
	const initial_height = Math.ceil(element.getBoundingClientRect().height) // element.offsetHeight
	// Apply height rounding
	element.style.height = initial_height + 'px'

	return { extra_height, initial_height }
}
