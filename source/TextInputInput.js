import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import throttle from 'lodash/throttle'
import createRef from 'react-create-ref'

import { getModularGridUnit } from './utility/grid'
import { submitFormOnCtrlEnter } from './utility/dom'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

export default class TextInput extends PureComponent
{
	static propTypes =
	{
		// (optional) HTML `id` attribute.
		id : PropTypes.string,

		// `<input type/>` attribute.
		type : PropTypes.string,

		// Whether `<textarea/>` should autoresize itself
		// (is `true` by default)
		autoresize : PropTypes.bool.isRequired,

		// In order for this to work properly
		// `<textarea/>` vertical padding should be `0`
		// and instead the padding should be defined on `<textarea/>` parent `<div/>`
		// like it's done in Material UI.
		// Otherwise it won't look pretty and the line of text near the top border
		// will be partially visible resulting in weird UX.
		// If `<textarea/>` vertical padding was `0`
		// the line of text near the top border wouldn't be visible.
		// // The maximum number of rows <textarea/> grows up to.
		// rowsMax          : PropTypes.number.isRequired,

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
		inputComponent : 'input',

		// // The maximum number of rows <textarea/> grows up to.
		// rowsMax : 12
	}

	hiddenTextArea = createRef()
	// hiddenTextAreaSingleLine = createRef()

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

		if (multiline && autoresize) {
			const style = getComputedStyle(this.input)

			// Measurements can be in `em`s/`rem`s/`pt`s which can give fractional pixel sizes.
			// `style.height` includes borders.
			this.currentHeight = Math.ceil(parseFloat(style.height))
			this.minHeight = this.currentHeight

			// this.verticalPadding = Math.ceil(parseFloat(style.paddingTop)) + Math.ceil(parseFloat(style.paddingBottom))

			// Top and bottom borders are extra height,
			// because `.scrollHeight` doesn't include borders.
			this.bordersHeight =
				Math.ceil(parseFloat(style.borderTopWidth)) +
				Math.ceil(parseFloat(style.borderBottomWidth))

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

	componentDidUpdate()
	{
		const { autoresize } = this.props

		if (autoresize) {
			this.autoresize()
		}
	}

	// Copy-pasted from Material UI on Oct 24th, 2018.
	// https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/InputBase/Textarea.js
	autoresize = (event) =>
	{
		// const { rowsMax } = this.props

		// Guarding for **broken** shallow rendering method that call componentDidMount
		// but doesn't handle refs correctly.
		// To remove once the shallow rendering has been fixed.
		if (!this.hiddenTextArea.current) {
			return
		}

		// const lineHeight = this.hiddenTextAreaSingleLine.current.scrollHeight - this.verticalPadding
		let height = this.hiddenTextArea.current.scrollHeight

		// Guarding for jsdom, where scrollHeight isn't present.
		// See https://github.com/tmpvar/jsdom/issues/1013
		if (height === undefined) {
			return
		}

		// It would have to first subtract `paddingTop` and `paddingBottom`,
		// then it would calculate `rowsMax * lineHeight` and
		// then it would re-add `paddingTop` and `paddingBottom`.
		// height = Math.min(rowsMax * lineHeight + this.verticalPadding, height)

		// `.scrollHeight` doesn't include borders.
		// `.style.height` does include borders.
		height += this.bordersHeight

		if (height <= this.minHeight) {
			height = this.minHeight
		}
		// For some reason Chrome on Windows 10
		// requires an extra pixel been added
		// to avoid showing vertical scrollbar.
		// (Oct 24th, 2018)
		else {
			height += 1
		}

		// "Need a large enough different to update the height.
		//  This prevents infinite rendering loop."
		// Don't know what loop they're talking about.
		if (Math.abs(this.currentHeight - height) > 1) {
			this.currentHeight = height
			// `.style.height` includes borders.
			this.input.style.height = height + 'px'
		}
	}

	onWindowResize = throttle((event) => this.autoresize(), 100)

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
			id,
			value,
			multiline,
			inputComponent,
			focus,
			onChange,
			disabled,
			label,
			placeholder,
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
			id,
			ref : this.storeInputNode,
			value : (value === undefined || value === null) ? '' : value,
			disabled,
			'aria-label'    : rest['aria-label'] || (id && label ? undefined : label || placeholder),
			'aria-required' : required || rest['aria-required'],
			'aria-invalid'  : error && indicateInvalid ? true : rest['aria-invalid'],
			placeholder,
			onChange    : this.onChange,
			onKeyDown   : this.onKeyDown,
			className   : classNames
			(
				// `<TextInput/>` has `border-color` to indicate its `:focus` state.
				// Therefore the `outline` can be safely removed.
				'rrui__outline',
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
			if (autoresize) {
				return [
					// <textarea
					// 	key="textarea-measurement-single-line"
					// 	ref={this.hiddenTextAreaSingleLine}
					// 	rows="1"
					// 	readOnly
					// 	aria-hidden="true"
					// 	value=""
					// 	tabIndex={-1}
					// 	className={properties.className}
					// 	style={this.props.inputStyle ? { ...inputStyle, ...HIDDEN_TEXTAREA_STYLE } : HIDDEN_TEXTAREA_STYLE}/>,

					<textarea
						key="textarea-measurement"
						ref={this.hiddenTextArea}
						readOnly
						aria-hidden
						value={properties.value}
						rows={properties.rows}
						tabIndex={-1}
						className={properties.className}
						style={this.props.inputStyle ? { ...inputStyle, ...HIDDEN_TEXTAREA_STYLE } : HIDDEN_TEXTAREA_STYLE}/>,

					<textarea
						key="textarea"
						{ ...properties }/>
				]
			}

			return <textarea key="textarea" { ...properties }/>
		}

		// Add `<input/>` `type` property.
		if (inputComponent === 'input') {
			properties.type = type || 'text'
		}

		return React.createElement(inputComponent, properties)
	}
}

// https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/InputBase/Textarea.js
const HIDDEN_TEXTAREA_STYLE = {
	// Overflow also needed to here to remove the extra row
	// added to `<textarea/>`s in Firefox.
	overflow: 'hidden',
	// Visibility needed to hide the extra `<textarea/>` on iPads.
	visibility: 'hidden',
	position: 'absolute',
	height: 'auto',
	// Don't know why is it here.
	whiteSpace: 'pre-wrap'
}