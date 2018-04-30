import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Input from './TextInputInputComponent'

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

		// Disables the text field
		disabled         : PropTypes.bool,

		// Renders an error message below the `<input/>`
		error            : PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),

		// If this flag is `true` then the `error` is shown.
		// If this flag is `false` then the `error` is not shown (even if passed).
		indicateInvalid  : PropTypes.bool,

		// Set to `true` to mark the field as required
		required         : PropTypes.bool,

		// `<input/>` placeholder
		placeholder      : PropTypes.string,

		// `<textarea/>` instead of an `<input type="text"/>`
		multiline        : PropTypes.bool,

		// Sets HTML input `type` attribute to `email`
		email            : PropTypes.bool,

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
		// Javascriptless users support (e.g. Tor)
		fallback : false
	}

	// Client side rendering, javascript is enabled
	componentDidMount()
	{
		const { fallback } = this.props

		if (fallback)
		{
			this.setState({ javascript: true })
		}
	}

	storeInputComponent = (ref) => this.input = ref

	focus()
	{
		return this.input.focus()
	}

	render()
	{
		const
		{
			indicateInvalid,
			error,
			fallback,
			style,
			className
		}
		= this.props

		return (
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

				<Input {...this.props} ref={this.storeInputComponent} name={undefined} />

				{/* Fallback in case javascript is disabled (no animated <label/>) */}
				{ fallback && !this.state.javascript && this.render_static() }

				{/* Error message */}
				{ indicateInvalid && error &&
					<div className="rrui__input-error">
						{ error }
					</div>
				}
			</div>
		)
	}

	// Fallback in case javascript is disabled (no animated <label/>)
	render_static()
	{
		const { label } = this.props

		return (
			<div className="rrui__rich__fallback">
				<Input {...this.props} placeholder={label} />
			</div>
		)
	}
}