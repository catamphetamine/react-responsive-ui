import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Input from './TextInputComponent'
import WithError from './WithError'

import { onBlurForReduxForm } from './utility/redux-form'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

export default class TextInput extends PureComponent
{
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

		// Autofocuses the input field
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

	static defaultProps =
	{
		// Show `error` (if passed).
		indicateInvalid : true
	}

	state = {}

	storeInputNode = (node) => this.input = node

	focus = () => this.input.focus()

	onFocus = (event) => {
		const { onFocus } = this.props
		if (onFocus) {
			onFocus(event)
		}
		this.setState({ isFocused: true })
	}

	onBlur = (event) => {
		const { onBlur, value } = this.props
		if (onBlur) {
			onBlurForReduxForm(onBlur, event, value)
		}
   	this.setState({ isFocused: false })
   }

	render()
	{
		const
		{
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
		}
		= this.props

		const { isFocused } = this.state

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
					inputRef={this.storeInputNode}
					error={error}
					indicateInvalid={indicateInvalid}
					onFocus={this.onFocus}
					onBlur={this.onBlur} />
			</WithError>
		)
	}

	// render_static()
	// {
	// 	const { label } = this.props
	//
	// 	return (
	// 		<div className="rrui__rich__fallback">
	// 			<Input {...this.props} placeholder={label} />
	// 		</div>
	// 	)
	// }
}