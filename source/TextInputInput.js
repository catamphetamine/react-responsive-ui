import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import throttle from 'lodash/throttle'

import { getModularGridUnit } from './utility/grid'
import { submitFormOnCtrlEnter } from './utility/dom'

export default class TextInput extends PureComponent
{
	state = {}

	static propTypes =
	{
		// `<input type/>` attribute.
		type             : PropTypes.string,

		// Whether `<textarea/>` should autoresize itself
		// (is `true` by default)
		autoresize       : PropTypes.bool.isRequired,

		// Set to `false` to prevent the `<label/>` from floating
		floatingLabel    : PropTypes.bool.isRequired,

		// A custom input component.
		// (is `<input/>` by default)
		inputComponent   : PropTypes.oneOfType
		([
			PropTypes.func,
			PropTypes.string
		])
		.isRequired
	}

	static defaultProps =
	{
		// `<textarea/>` should autoresize itself
		autoresize : true,

		// Set to `false` to prevent the `<label/>` from floating
		floatingLabel : true,

		// A custom input component.
		// (is `<input/>` by default)
		inputComponent : 'input'
	}

	// Client side rendering, javascript is enabled
	componentDidMount()
	{
		const { multiline, autoresize, value } = this.props

		// Doing `this.measure()` here now
		// because `<textarea/>` should autoresize
		// in case its `value` is set up front.
		// // Not doing `this.measure()` here because
		// // that resulted in weird `<textarea/>` height mismatch.
		// // Measuring the height of `<textarea/>` during
		// // the first `this.measurements()` call instead.

		if (multiline && autoresize && value) {
			this.autoresize()
		}

		if (multiline && autoresize) {
			window.addEventListener('resize', this.onWindowResize)
		}
	}

	componentWillUnmount()
	{
		const { multiline, autoresize } = this.props

		if (multiline && autoresize) {
			window.removeEventListener('resize', this.onWindowResize)
		}
	}

	autoresize = (event) =>
	{
		const measurements = this.measurements()
		const element = event ? event.target : this.input

		element.style.height = 0

		// `element.scrollHeight` is always an integer
		// so it doesn't need rounding (e.g. `em`s).
		let height = element.scrollHeight + measurements.extra_height
		height = Math.max(height, measurements.initial_height)

		if (getModularGridUnit() && height % getModularGridUnit())
		{
			height = Math.ceil(height / getModularGridUnit()) * getModularGridUnit()
		}

		// For some reason Chrome on Windows 10
		// requires an extra pixel been added
		// to avoid showing vertical scrollbar.
		// (Jan 11, 2018)
		if (height > measurements.initial_height)
		{
			height += 1
		}

		element.style.height = height + 'px'
	}

	onWindowResize = throttle((event) => this.autoresize(), 100)

	measure = () => autoresize_measure(this.input)

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
			if (measurements.initial_height) {
				this.setState({ autoresize: measurements })
			}
		}

		return measurements
	}

	// The underlying `input` component
	// can pass both `event`s and `value`s
	// to this parent `onChange` listener.
	onChange = (event) =>
	{
		// Extract `value` from the argument
		// of this `onChange` listener
		// (for convenience)

		let value = event

		if (event.target !== undefined) {
			value = event.target.value
		}

		// Call the parent `onChange` handler
		// with the `value` as an argument
		// (for convenience)

		const { onChange } = this.props

		// Call `onChange` only if `value` did actually change
		if (value !== this.props.value) {
			onChange(value)
		}
	}

	onKeyDown = (event) =>
	{
		const { onKeyDown } = this.props

		if (onKeyDown) {
			onKeyDown(event)
		}

		if (event.defaultPrevented) {
			return
		}

		if (submitFormOnCtrlEnter(event, this.input)) {
			return
		}
	}

	storeInputNode = (node) =>
	{
		const { inputRef } = this.props

		if (inputRef) {
			inputRef(node)
		}

		this.input = node
	}

	focus = () => this.input.focus()

	render()
	{
		const
		{
			name,
			value,
			multiline,
			inputComponent,
			focus,
			onChange,
			disabled,
			type,
			autoresize,
			indicateInvalid,
			error,
			className,

			// Rest
			inputRef,
			containerRef,
			floatingLabel,
			required,
			children,
			...rest
		}
		= this.props

		let { inputStyle } = this.props

		if (multiline && autoresize)
		{
			inputStyle =
			{
				resize : 'none',
				...inputStyle
			}
		}

		const properties =
		{
			...rest,
			name        : name === false ? undefined : name,
			ref         : this.storeInputNode,
			value       : (value === undefined || value === null) ? '' : value,
			disabled,
			onChange    : this.onChange,
			onKeyDown   : this.onKeyDown,
			className   : classNames
			(
				'rrui__input-element',
				'rrui__input-field',
				{
					// CSS selector performance optimization
					'rrui__input-field--invalid'   : indicateInvalid && error,
					'rrui__input-field--disabled'  : disabled,
					'rrui__input-field--multiline' : multiline
				},
				className
			),
			style       : inputStyle,
			autoFocus   : focus
		}

		// In case of `multiline` set to `true`
		// this is gonna be a `<textarea/>`
		if (multiline)
		{
			// "keyup" is required for IE to properly reset height when deleting text
			return (
				<textarea
					{ ...properties }
					onInput={ autoresize ? this.autoresize : undefined }
					onKeyUp={ autoresize ? this.autoresize : undefined }/>
			)
		}

		// Add `<input/>` `type` property.
		if (inputComponent === 'input') {
			properties.type = type || 'text'
		}

		return React.createElement(inputComponent, properties)
	}
}

// <textarea/> autoresize (without ghost elements)
// https://github.com/javierjulio/textarea-autosize/blob/master/src/jquery.textarea_autosize.js
function autoresize_measure(element)
{
	const style = getComputedStyle(element)

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