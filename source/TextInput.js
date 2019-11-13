import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Input from './TextInputComponent'
import WithError from './WithError'

import { onBlurForReduxForm } from './utility/redux-form'

function TextInput({
	value,
	onFocus,
	onBlur,
	indicateInvalid,
	error,
	style,
	className,
	// Deprecated.
	// Use `type="password"` instead.
	password,
	// Deprecated.
	// Use `type="email"` instead.
	email,
	...rest
}, ref) {
	const [isFocused, setFocused] = useState()

	const _onFocus = useCallback((event) => {
		if (onFocus) {
			onFocus(event)
		}
		setFocused(true)
	}, [onFocus, setFocused])

	const _onBlur = useCallback((event) => {
		if (onBlur) {
			onBlurForReduxForm(onBlur, event, value)
		}
		setFocused(false)
   }, [onBlur, setFocused, value])

	// Deprecated.
	// Use `type="password"` instead.
	if (password) {
		rest.type = 'password'
	}

	// Deprecated.
	// Use `type="email"` instead.
	if (email) {
		rest.type = 'email'
	}

	return (
		<WithError
			error={error}
			indicateInvalid={indicateInvalid}
			style={style}
			className={classNames(className, 'rrui__text-input', {
				'rrui__text-input--focus': isFocused
			})}>

			<Input
				{...rest}
				ref={ref}
				value={value}
				error={error}
				indicateInvalid={indicateInvalid}
				onFocus={_onFocus}
				onBlur={_onBlur} />
		</WithError>
	)
}

TextInput = React.forwardRef(TextInput)

TextInput.propTypes =
{
	// Text field label
	label            : PropTypes.string,

	// HTML form input `name` attribute
	name             : PropTypes.string,

	// Text field value
	value            : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

	// Is called when the `value` is edited
	onChange         : PropTypes.func.isRequired,

	// A custom input component.
	inputComponent   : PropTypes.oneOfType
	([
		PropTypes.func,
		PropTypes.string
	]),

	// Disables the text field
	disabled         : PropTypes.bool,

	// Renders an error message below the `<input/>`
	error            : PropTypes.string,

	// If this flag is `true` then the `error` is shown.
	// If this flag is `false` then the `error` is not shown (even if passed).
	indicateInvalid  : PropTypes.bool,

	// Set to `true` to mark the field as required
	required         : PropTypes.bool,

	// `<input/>` placeholder
	placeholder      : PropTypes.string,

	// `<textarea/>` instead of an `<input type="text"/>`
	multiline        : PropTypes.bool,

	// Deprecated.
	// Use `type="email"` instead.
	// Sets HTML input `type` attribute to `email`
	email            : PropTypes.bool,

	// Deprecated.
	// Use `type="password"` instead.
	// Sets HTML input `type` attribute to `password`
	password         : PropTypes.bool,

	// Autofocuses the input field.
	// Deprecated. Use `autoFocus` instead.
	focus            : PropTypes.bool,

	// HTML `tabindex` attribute
	tabIndex         : PropTypes.number,

	// `<textarea/>` `rows` attribute (row count, i.e. height)
	rows             : PropTypes.number,

	// `<textarea/>` `cols` attribute (column count, i.e. width)
	cols             : PropTypes.number,

	// Is called when the input is focused
	onFocus          : PropTypes.func,

	// `onKeyDown` event handler
	onKeyDown        : PropTypes.func,

	// Is called when the input is blurred
	onBlur           : PropTypes.func,

	// Is called when the input is clicked
	onClick           : PropTypes.func,

	// CSS style object
	style            : PropTypes.object,

	// CSS name
	className        : PropTypes.string,

	// CSS style object for `<input/>`
	inputStyle       : PropTypes.object
}

TextInput.defaultProps =
{
	// Show `error` (if passed).
	indicateInvalid : true
}

export default TextInput