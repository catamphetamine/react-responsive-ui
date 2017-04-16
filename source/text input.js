import React, { PureComponent, createElement } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
// import { throttle } from 'lodash-es'

import { submit_parent_form } from './misc/dom'

export default class Text_input extends PureComponent
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

		// Renders an error message below the `<input/>`
		error            : PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),

		// If this flag is `true` then the `error` is shown.
		// If this flag is `false` then the `error` is not shown (even if passed).
		indicateInvalid  : PropTypes.bool,

		// Set to `true` to mark the field as required
		required         : PropTypes.bool.isRequired,

		// `<input/>` placeholder
		placeholder      : PropTypes.string,

		// Set to `false` to prevent the `<label/>` from floating
		floatingLabel    : PropTypes.bool.isRequired,

		// `<textarea/>` instead of an `<input type="text"/>`
		multiline        : PropTypes.bool,

		// Sets HTML input `type` attribute to `email`
		email            : PropTypes.bool,

		// Sets HTML input `type` attribute to `password`
		password         : PropTypes.bool,

		// A manually specified `type` attribute
		type             : PropTypes.string.isRequired,

		// Autofocuses the input field
		focus            : PropTypes.bool,

		// HTML `tabindex` attribute
		tabIndex         : PropTypes.number,

		// `<textarea/>` `rows` attribute (row count, i.e. height)
		rows             : PropTypes.number.isRequired,

		// `<textarea/>` `cols` attribute (column count, i.e. width)
		cols             : PropTypes.number,

		// A custom `input` component can be passed
		input            : PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,

		// (exotic use case)
		// Falls back to a plain HTML input
		// when javascript is disabled (e.g. Tor)
		fallback         : PropTypes.bool.isRequired,

		// CSS style object
		style            : PropTypes.object,

		// CSS name
		className        : PropTypes.string,

		// CSS style object for `<input/>`
		inputStyle       : PropTypes.object,

		// CSS style object for the label
		labelStyle       : PropTypes.object
	}

	static defaultProps =
	{
		// `<textarea/>` row count
		rows : 2,

		// HTML input `type` attribute
		type : 'text',

		// Set to `false` to prevent the `<label/>` from floating
		floatingLabel : true,

		// Javascriptless users support (e.g. Tor)
		fallback : false,

		// Set to `true` to mark the field as required
		required : false,

		// Render an `<input/>` by default
		input: 'input'
	}

	// Client side rendering, javascript is enabled
	componentDidMount()
	{
		const { multiline, fallback } = this.props

		if (multiline)
		{
			// Measure `<textarea/>` inner height and borders
			this.setState({ autoresize: this.measure() })
		}

		if (fallback)
		{
			this.setState({ javascript: true })
		}
	}

	render()
	{
		const
		{
			id,
			name,
			value,
			placeholder,
			label,
			labelStyle,
			multiline,
			fallback,
			disabled,
			required,
			floatingLabel,
			style,
			className
		}
		= this.props

		const label_floats = placeholder === undefined && floatingLabel

		const markup =
		(
			<div
				style={ style }
				className={ classNames
				(
					'rrui__text-input',
					{
						'rrui__rich' : fallback
					},
					className
				) }>

				{/* `<input/>` and its `<label/>` */}
				<div
					className={ classNames('rrui__input',
					{
						'rrui__input--multiline' : multiline,
					}) }>

					{/* `<input/>` */}
					{ this.render_input({ name: false }) }

					{/* Input `<label/>`. */}
					{/* It is rendered after the input to utilize the
				       `input:focus + label` CSS selector rule */}
					{ label &&
						<label
							htmlFor={ id }
							className={ classNames('rrui__input-label',
							{
								// CSS selector performance optimization
								'rrui__input-label--invalid'           : this.should_indicate_invalid(),
								'rrui__input-label--floating'          : label_floats,
								'rrui__input-label--required'          : required && this.is_empty(),
								'rrui__text-input__label--placeholder' : label_floats && this.is_empty()
							}) }
							style={ labelStyle }>
							{ label }
						</label>
					}
				</div>

				{/* Error message */}
				{ this.should_indicate_invalid() && this.render_error_message() }

				{/* Fallback in case javascript is disabled (no animated <label/>) */}
				{ fallback && !this.state.javascript && this.render_static() }
			</div>
		)

		return markup
	}

	render_input(options = {})
	{
		const { placeholder, ref, name } = options

		const
		{
			value,
			multiline,
			focus,
			onChange,
			disabled,
			inputStyle,
			rows,
			cols,
			tabIndex,

			// A custom input component
			// (e.g. for an `input-format` text input, like a phone number)
			input,

			// Passthrough properties
			id,
			onBlur
		}
		= this.props

		const properties =
		{
			id,
			name        : name === false ? undefined : this.props.name,
			ref         : ref === false ? undefined : ref => this.input = ref,
			value       : (value === undefined || value === null) ? '' : value,
			placeholder : placeholder || this.props.placeholder,
			onChange    : this.on_change,
			onKeyDown   : this.on_key_down,
			onBlur,
			disabled,
			className   : classNames('rrui__input-field', 'rrui__text-input__input',
			{
				'rrui__input-field--invalid'         : this.should_indicate_invalid(),
				// CSS selector performance optimization
				'rrui__text-input__input--empty'     : this.is_empty(),
				'rrui__text-input__input--invalid'   : this.should_indicate_invalid(),
				'rrui__text-input__input--disabled'  : disabled,
				'rrui__text-input__input--multiline' : multiline
			}),
			style       : inputStyle,
			autoFocus   : focus,
			tabIndex
		}

		// In case of `multiline` set to `true`
		// this is gonna be a `<textarea/>`
		if (multiline)
		{
			// "keyup" is required for IE to properly reset height when deleting text
			return <textarea
				rows={ rows }
				cols={ cols }
				onInput={ this.autoresize }
				onKeyUp={ this.autoresize }
				{ ...properties }/>
		}

		// Add `<input/>` `type` to properties
		properties.type = this.get_input_type()

		// If a custom `input` component was passed then use it.
		// Otherwise use a simple `<input/>`.
		return createElement(input, properties)
	}

	render_error_message()
	{
		const { error } = this.props

		return <div className="rrui__input-error">{ error }</div>
	}

	// Fallback in case javascript is disabled (no animated <label/>)
	render_static()
	{
		const { label } = this.props

		const markup =
		(
			<div className="rrui__rich__fallback">
				{/* <input/> */}
				{ this.render_input({ placeholder: label, ref: false }) }

				{/* Error message */}
				{ this.should_indicate_invalid() && this.render_error_message() }
			</div>
		)

		return markup
	}

	// "text", "email", "password", etc
	get_input_type()
	{
		const { type, email, password } = this.props

		if (email)
		{
			return 'email'
		}

		if (password)
		{
			return 'password'
		}

		return type
	}

	// Whether the input is empty
	is_empty()
	{
		const { value } = this.props
		return !value || !value.trim()
	}

	// Whether should indicate that the input value is invalid
	should_indicate_invalid()
	{
		const { indicateInvalid, error } = this.props

		return indicateInvalid && error
	}

	autoresize = (event) =>
	{
		const measurements = this.measurements()
		const element = event ? event.target : ReactDOM.findDOMNode(this.input)

		// Keep the current vertical scroll position so that
		// it doesn't jump due to textarea resize.
		const current_scroll_position = window.pageYOffset

		element.style.height = 0

		let height = element.scrollHeight + measurements.extra_height
		height = Math.max(height, measurements.initial_height)

		element.style.height = height + 'px'

		// Restore vertical scroll position so that
		// it doesn't jump due to textarea resize.
		window.scroll(window.pageXOffset, current_scroll_position)
	}

	// The underlying `input` component
	// can pass both `event`s and `value`s
	// to this parent `onChange` listener.
	on_change = (event) =>
	{
		// Extract `value` from the argument
		// of this `onChange` listener
		// (for convenience)

		let value = event

		if (event.target !== undefined)
		{
			value = event.target.value
		}

		// Call the parent `onChange` handler
		// with the `value` as an argument
		// (for convenience)

		const { onChange } = this.props

		onChange(value)
	}

	on_key_down = (event) =>
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
		const { input } = this.props

		// For simple DOM nodes like `<input/>`
		// just focus on them.
		if (typeof input === 'string') {
			return ReactDOM.findDOMNode(this.input).focus()
		}

		// For custom components call `.focus()` on them
		// (if available)
		return this.input.focus && this.input.focus()
	}

	measure()
	{
		return autoresize_measure(ReactDOM.findDOMNode(this.input))
	}

	measurements()
	{
		let measurements = this.state.autoresize

		// If the textarea was initially hidden
		// (like `display: none` for a mobile-oriented responsive design)
		// then make the initial measurements now.
		if (!measurements.initial_height)
		{
			measurements = this.measure()

			// If the `<textarea/>` is not hidden (e.g. via `display: none`)
			// then keep its initial (minimum) height
			// so that it doesn't shrink below this value
			if (measurements.initial_height)
			{
				this.setState({ autoresize: measurements })
			}
		}

		return measurements
	}
}

// <textarea/> autoresize (without ghost elements)
// https://github.com/javierjulio/textarea-autosize/blob/master/src/jquery.textarea_autosize.js
function autoresize_measure(element)
{
	const style = window.getComputedStyle(element)

	// Borders extra height, because `.scrollHeight` doesn't include borders.
	const extra_height =
		parseInt(style.borderTopWidth) +
		parseInt(style.borderBottomWidth)

	// `<textarea/>`'s height is a float when using `em`, `rem`, `pt`, etc.
	const non_rounded_initial_height = element.getBoundingClientRect().height
	const initial_height = Math.ceil(non_rounded_initial_height)

	// Round the height of `<textarea/>` so that it doesn't jump
	// when autoresizing while typing for the first time.
	if (initial_height !== non_rounded_initial_height)
	{
		element.style.height = initial_height + 'px'
	}

	return { extra_height, initial_height }
}
