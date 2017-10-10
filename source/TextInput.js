import React, { PureComponent, createElement } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import throttle from 'lodash/throttle'

import { submit_parent_form } from './utility/dom'
import { get_modular_grid_unit } from './utility/grid'

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
		value            : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

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

		// Whether `<textarea/>` should autoresize itself
		// (is `true` by default)
		autoresize       : PropTypes.bool.isRequired,

		// Autofocuses the input field
		focus            : PropTypes.bool,

		// HTML `tabindex` attribute
		tabIndex         : PropTypes.number,

		// `<textarea/>` `rows` attribute (row count, i.e. height)
		rows             : PropTypes.number,

		// `<textarea/>` `cols` attribute (column count, i.e. width)
		cols             : PropTypes.number,

		// A custom `input` component can be passed
		input            : PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,

		// (exotic use case)
		// Falls back to a plain HTML input
		// when javascript is disabled (e.g. Tor)
		fallback         : PropTypes.bool.isRequired,

		// Is called when the input is focused
		onFocus          : PropTypes.func,

		// `onKeyDown` event handler
		onKeyDown        : PropTypes.func,

		// Is called when the input is blurred
		onBlur           : PropTypes.func,

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
		// HTML input `type` attribute
		type : 'text',

		// `<textarea/>` should autoresize itself
		autoresize : true,

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
		const { multiline, fallback, value, autoresize } = this.props

		// Doing `this.measure()` here now
		// because `<textarea/>` should autoresize
		// in case its `value` is set up front.
		// // Not doing `this.measure()` here because
		// // that resulted in weird `<textarea/>` height mismatch.
		// // Measuring the height of `<textarea/>` during
		// // the first `this.measurements()` call instead.

		if (value && autoresize)
		{
			this.autoresize()
		}

		if (multiline)
		{
			window.addEventListener('resize', this.on_window_resize)
		}

		if (fallback)
		{
			this.setState({ javascript: true })
		}
	}

	componentWillUnmount()
	{
		const { multiline } = this.props

		if (multiline)
		{
			window.removeEventListener('resize', this.on_window_resize)
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
			autoresize,

			// A custom input component
			// (e.g. for an `input-format` text input, like a phone number)
			input,

			// Passthrough properties
			id,
			onFocus,
			onBlur
		}
		= this.props

		let input_style = inputStyle

		if (multiline && autoresize)
		{
			input_style =
			{
				resize : 'none',
				...inputStyle
			}
		}

		const properties =
		{
			id,
			name        : name === false ? undefined : this.props.name,
			ref         : ref === false ? undefined : ref => this.input = ref,
			value       : (value === undefined || value === null) ? '' : value,
			placeholder : placeholder || this.props.placeholder,
			onChange    : this.on_change,
			onKeyDown   : this.on_key_down,
			onFocus,
			onBlur,
			disabled,
			className   : classNames
			(
				'rrui__input-element',
				'rrui__input-field',
				{
					// CSS selector performance optimization
					'rrui__input-field--invalid'   : this.should_indicate_invalid(),
					'rrui__input-field--disabled'  : disabled,
					'rrui__input-field--multiline' : multiline
				}
			),
			style       : input_style,
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

		// `0` is not an empty value
		if (typeof value === 'number' && value === 0)
		{
			return false
		}

		// An empty string, `undefined`, `null` –
		// all those are an empty value.
		if (!value)
		{
			return true
		}

		// Whitespace string is also considered empty
		if (typeof value === 'string' && !value.trim())
		{
			return true
		}

		// Not empty
		return false
	}

	// Whether should indicate that the input value is invalid
	should_indicate_invalid()
	{
		const { indicateInvalid, error } = this.props

		return indicateInvalid && error
	}

	autoresize = (event) =>
	{
		const { autoresize } = this.props

		if (!autoresize)
		{
			return
		}

		const measurements = this.measurements()
		const element = event ? event.target : ReactDOM.findDOMNode(this.input)

		element.style.height = 0

		// `element.scrollHeight` is always an integer
		// so it doesn't need rounding (e.g. `em`s).
		let height = element.scrollHeight + measurements.extra_height
		height = Math.max(height, measurements.initial_height)

		if (get_modular_grid_unit() && height % get_modular_grid_unit())
		{
			height = Math.ceil(height / get_modular_grid_unit()) * get_modular_grid_unit()
		}

		element.style.height = height + 'px'
	}

	on_window_resize = throttle((event) =>
	{
		this.autoresize()
	}, 100)

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
		const { onKeyDown } = this.props

		// Submit the form on Cmd + Enter (or Ctrl + Enter)
		if ((event.ctrlKey || event.metaKey) && event.keyCode === 13)
		{
			if (submit_parent_form(ReactDOM.findDOMNode(this.input)))
			{
				event.preventDefault()
			}
		}

		if (onKeyDown)
		{
			onKeyDown(event)
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

		// If it's the first time accessing measurements,
		// or if the textarea was initially hidden
		// (like `display: none` for a mobile-oriented responsive design)
		// then make the initial measurements now.
		if (!measurements || !measurements.initial_height)
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
