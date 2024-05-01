import React, { useRef, useMemo, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import throttle from 'lodash/throttle'
import createRef from 'react-create-ref'

import { getModularGridUnit } from './utility/grid'
import { submitFormOnCtrlEnter } from './utility/dom'

function TextInput({
	value,
	multiline,
	// A custom input component.
	// (is `<input/>` by default)
	inputComponent = 'input',
	// `focus` property is deprecated. Use `autoFocus` instead.
	focus,
	onChange,
	onKeyDown,
	disabled,
	readOnly,
	label,
	placeholder,
	type,
	// `<textarea/>` should autoresize itself
	autoresize = true,
	error,
	initialHeight,
	onHeightChange,
	inputStyle: originalInputStyle,
	className,

	// Rest
	containerRef,
	// Set to `false` to prevent the `<label/>` from floating
	floatingLabel = true,
	// // The maximum number of rows <textarea/> grows up to.
	// rowsMax = 12,
	required,
	children,
	...rest
}, ref) {
	const input = useRef()
	const hiddenTextArea = useRef()
	// hiddenTextAreaSingleLine = createRef()

	const autoResize = useMemo(() => {
		if (multiline && autoresize) {
			return new Autoresize(
				() => input.current,
				() => hiddenTextArea.current,
				{
					initialHeight,
					onHeightChange
				}
			)
		}
	}, [])

	// On component update.
	useEffect(() => {
		if (multiline && autoresize) {
			if (autoResize.initialized) {
				autoResize.resize()
			}
		}
	})

	// Client side rendering, javascript is enabled
	useEffect(() =>  {
		if (multiline && autoresize) {
			// Doing `this.init()` here
			// because `<textarea/>` should autoresize
			// in case its `value` is set up front.
			autoResize.init()
			const onWindowResize = throttle((event) => autoResize.resize(), 100)
			window.addEventListener('resize', onWindowResize)
			return () => {
				window.removeEventListener('resize', onWindowResize)
			}
		}
	}, [])

	// The underlying `input` component
	// can pass both `event`s and `value`s
	// to this parent `onChange` listener.
	const _onChange = useCallback((event) => {
		// Extract `value` from the argument
		// of this `onChange` listener
		// (for convenience)
		let newValue = event
		if (event && event.target) {
			newValue = event.target.value
		}
		// Call the parent `onChange` handler
		// with the `value` as an argument (for convenience).
		// Call `onChange` only if `value` did actually change
		if (newValue !== value) {
			onChange(newValue)
		}
	}, [value, onChange])

	const _onKeyDown = useCallback((event) => {
		if (onKeyDown) {
			onKeyDown(event)
		}
		if (event.defaultPrevented) {
			return
		}
		if (submitFormOnCtrlEnter(event, input.current)) {
			return
		}
	}, [onKeyDown, input])

	const storeInputNode = useCallback((node) => {
		if (ref) {
			if (typeof ref === 'function') {
				ref(node)
			} else {
				ref.current = node
			}
		}
		input.current = node
	}, [input, ref]);

	const inputStyle = useMemo(() => {
		if (multiline && autoresize) {
			return {
				resize: 'none',
				...originalInputStyle
			}
		}
		return originalInputStyle
	}, [multiline, autoresize, originalInputStyle])

	const inputStyleAutoHeight = useMemo(() => {
		if (multiline && autoresize) {
			return {
				height: autoResize.getHeight(),
				...inputStyle
			}
		}
		return inputStyle
	}, [multiline, autoresize, inputStyle, autoResize])

	const properties = {
		// Placed `autoFocus` before `...rest` so that
		// it doesn't override an already passed `autoFocus`.
		// `focus` property is deprecated. Use `autoFocus` instead.
		autoFocus: focus,
		placeholder,
		disabled,
		readOnly,
		...rest,

		// Set `aria-label`, if none passed.
		'aria-label': rest['aria-label'] === undefined
			? (rest['aria-labelledby'] || rest['aria-describedby']
				? undefined
				: label
			)
			: rest['aria-label'],

		// Set `aria-required`, if none passed.
		'aria-required': rest['aria-required'] === undefined
			? (required ? true : undefined)
			: rest['aria-required'],

		// Set `aria-invalid`, if none passed.
		'aria-invalid': rest['aria-invalid'] === undefined
			? (error ? true : undefined)
			: rest['aria-invalid'],

		ref: storeInputNode,
		value: isEmptyValue(value) ? '' : value,
		onChange: _onChange,
		onKeyDown: _onKeyDown,
		style: inputStyleAutoHeight,
		className: classNames(
			className,
			// `<TextInput/>` has `border-color` to indicate its `:focus` state.
			// Therefore the `outline` can be safely removed.
			'rrui__outline',
			'rrui__input-element',
			'rrui__input-field', {
				'rrui__input-field--empty': isEmptyValue(value),
				// CSS selector performance optimization
				'rrui__input-field--invalid'   : error,
				'rrui__input-field--disabled'  : disabled || readOnly,
				'rrui__input-field--multiline' : multiline
			}
		)
	}

	// In case of `multiline` set to `true`
	// this is gonna be a `<textarea/>`
	if (multiline) {
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
				// 	style={inputStyle ? { ...inputStyle, ...HIDDEN_TEXTAREA_STYLE } : HIDDEN_TEXTAREA_STYLE}/>,

				<textarea
					key="textarea-measurement"
					ref={hiddenTextArea}
					readOnly
					aria-hidden
					value={properties.value}
					rows={properties.rows}
					tabIndex={-1}
					className={properties.className}
					style={inputStyle ? { ...inputStyle, ...HIDDEN_TEXTAREA_STYLE } : HIDDEN_TEXTAREA_STYLE}/>,

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

TextInput = React.forwardRef(TextInput)

TextInput.propTypes =
{
	// `<input type/>` attribute.
	type : PropTypes.string,

	// Whether `<textarea/>` should autoresize itself
	// (is `true` by default)
	autoresize : PropTypes.bool,

	initialHeight: PropTypes.number,
	onHeightChange: PropTypes.func,

	// In order for this to work properly
	// `<textarea/>` vertical padding should be `0`
	// and instead the padding should be defined on `<textarea/>` parent `<div/>`
	// like it's done in Material UI.
	// Otherwise it won't look pretty and the line of text near the top border
	// will be partially visible resulting in weird UX.
	// If `<textarea/>` vertical padding was `0`
	// the line of text near the top border wouldn't be visible.
	// // The maximum number of rows <textarea/> grows up to.
	// rowsMax          : PropTypes.number,

	// Set to `false` to prevent the `<label/>` from floating
	floatingLabel    : PropTypes.bool,

	// A custom input component.
	// (is `<input/>` by default)
	inputComponent   : PropTypes.elementType,

	// Indicates that the input is invalid.
	error: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.bool
	]),
}

export default TextInput

// https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/InputBase/Textarea.js
const HIDDEN_TEXTAREA_STYLE = {
	// Overflow also needed to here to remove the extra row
	// added to `<textarea/>`s in Firefox.
	overflow: 'hidden',
	// Visibility needed to hide the extra `<textarea/>` on iPads.
	visibility: 'hidden',
	position: 'absolute',
	// Don't know why is it here.
	whiteSpace: 'pre-wrap'
}

function isEmptyValue(value) {
	return value === '' || value === undefined || value === null
}

class Autoresize {
	constructor(getInput, getHiddenTextArea, {
		initialHeight,
		onHeightChange
	}) {
		this.getInput = getInput
		this.getHiddenTextArea = getHiddenTextArea
		this.onHeightChange = onHeightChange

		this.currentHeight = initialHeight
		this.verticalPadding = 0
		this.bordersHeight = 0

		this.initAttempts = 0
	}

	getHeight() {
		return this.currentHeight
	}

	// Copy-pasted from Material UI on Oct 24th, 2018.
	// https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/InputBase/Textarea.js
	// There's a newer version of it (didn't copy-paste):
	// https://github.com/mui/material-ui/blob/master/packages/mui-base/src/TextareaAutosize/TextareaAutosize.js
	resize() {
		const hiddenTextArea = this.getHiddenTextArea()

		// "Guarding for **broken** shallow rendering method that call componentDidMount
		//  but doesn't handle refs correctly.
		//  To remove once the shallow rendering has been fixed."
		if (!hiddenTextArea) {
			return
		}

		// const lineHeight = this.hiddenTextAreaSingleLine.current.scrollHeight - verticalPadding.current
		let height = hiddenTextArea.scrollHeight

		// "Guarding for jsdom, where scrollHeight isn't present.
		//  See https://github.com/tmpvar/jsdom/issues/1013"
		if (height === undefined) {
			return
		}

		// `.scrollHeight` doesn't include borders.
		// `.style.height` does include borders.
		height += this.bordersHeight

		// `.scrollHeight` doesn't support fractional pixels precision ("retina" screens):
		// https://stackoverflow.com/questions/21666892/fractional-scrollheight
		// That would sometimes result in weird sub-pixel changes of height where they aren't required.
		// For example, when initially rendering a "stub" single-row `<textarea/>`
		// and then, after measuring it, rendering the "real" one that is `0.5px` higher.
		// Libraries like `virtual-scroller` wouldn't like such "unmotivated" changes in the height.
		const nonScrollHeight = hiddenTextArea.getBoundingClientRect().height
		if (Math.abs(height - nonScrollHeight) < 1) {
			// `nonScrollHeight` has fractional pixel precision.
			height = nonScrollHeight
		}

		// if (height <= this.minHeight) {
		// 	height = this.minHeight
		// }

		// This seems no longer relevant:
		//
		// // For some weird reason Chrome on Windows 10
		// // requires an extra pixel been added
		// // to avoid showing vertical scrollbar.
		// // (Oct 24th, 2018)
		// // else {
		// 	height += 1
		// // }

		// "Need a large enough different to update the height.
		//  This prevents infinite rendering loop."
		// By that, they were referring to the `> 1` condition below.
		// It's unclear what exact cause of the issue they were talking about.
		if (this.currentHeight === undefined || Math.abs(this.currentHeight - height) > 1) {
			this.currentHeight = height
			// `.style.height` includes borders.
			this.getInput().style.height = height + 'px'

			if (this.onHeightChange) {
				this.onHeightChange(height)
			}
		}
	}

	// `height` works incorrectly in some weird cases.
	// For example, when `<textarea/>` is hidden when mounted
	// or when there's no stylesheet loaded yet.
	// For example, when stylesheets are included "dynamically"
	// like Webpack's `style-loader` does (is used in development mode,
	// or when using "code splitting" when "chunks" are `import()`ed dynamically).
	//
	// https://stackoverflow.com/questions/39400038/how-to-ensure-that-hot-css-loads-before-js-in-webpack-dev-server
	// https://github.com/webpack-contrib/style-loader/issues/269
	//
	// An alternative solution would be:
	//
	// input.current.minHeight = 0
	// input.current.minHeight = input.current.scrollHeight + bordersHeight.current
	//
	// or:
	//
	// input.current.minHeight = hiddenTextArea.current.scrollHeight + bordersHeight.current
	//
	// which wouldn't ever undersize the <textarea/>
	// but it would oversize it due to the incorrect
	// <textarea/> width before styles are loaded.
	//
	init = () => {
		// Exit if the component is no longer mounted.
		if (!this.getInput()) {
			return
		}
		this.initAttempts++
		this.getMeasurements()
		if (this.haveStylesLoaded()) {
			this.resize()
		}
		this.initialized = true
		// Even if padding on <textarea/> has been set
		// it's still possible that `font-size` hasn't been set yet.
		// Or it could be another padding in a subsequent stylesheet.
		// So keep re-initializing <textarea/>, say, for a second.
		if (this.initAttempts <= 5) {
			setTimeout(this.init, 200)
		}
	}

	getMeasurements() {
		const style = getComputedStyle(this.getInput())

		// // Measurements can be in `em`s/`rem`s/`pt`s which can give fractional pixel sizes.
		// // `style.height` includes borders.
		// currentHeight.current = parseFloat(style.height)
		// this.minHeight = currentHeight.current

		// Get vertical padding.
		// Measurements can be in `em`s/`rem`s/`pt`s which can give fractional pixel sizes.
		this.verticalPadding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)

		// Top and bottom borders are extra height,
		// because `.scrollHeight` doesn't include borders.
		// Measurements can be in `em`s/`rem`s/`pt`s which can give fractional pixel sizes.
		this.bordersHeight =
			parseFloat(style.borderTopWidth) +
			parseFloat(style.borderBottomWidth)
	}

	// Even if padding on <textarea/> has been set
	// it's still possible that `font-size` hasn't been set yet.
	// (it happened in a project)
	// So this function doesn't guarantee anything.
	haveStylesLoaded() {
		// The default <textarea/> top/bottom padding in Chrome on Windows is 2px.
		// `react-responsive-ui` multiline text inputs are supposed to have larger padding.
		return this.verticalPadding > 2 * 2
	}
}