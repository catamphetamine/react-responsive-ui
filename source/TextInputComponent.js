import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Input from './TextInputInput'
import Label from './TextInputLabel'

// `<input/>` and its `<label/>`.
export default function TextInputComponent(props)
{
	const
	{
		id,
		value,
		required,
		floatingLabel,
		label,
		placeholder,
		multiline,
		error,
		indicateInvalid,
		containerRef,
		children
	}
	= props

	return (
		<div
			ref={ containerRef }
			className={ classNames('rrui__input',
			{
				'rrui__input--multiline' : multiline,
			}) }>

			{/* `children` are placed before the `<input/>`
			    so that they're above it when having `position: absolute`. */}
			{children}

			{/* `<input/>` */}
			<Input {...props}/>

			{/* Input `<label/>`. */}
			{/* It is rendered after the input to utilize the
		       `input:focus + label` CSS selector rule */}
			{ label &&
				<Label
					aria-hidden
					inputId={ id }
					value={ value }
					required={ required }
					invalid={ indicateInvalid && error }
					floats={ floatingLabel && !placeholder }>
					{ label }
				</Label>
			}
		</div>
	)
}

TextInputComponent.propTypes =
{
	// Set to `true` to mark the field as required.
	required : PropTypes.bool.isRequired,

	// Labels float by default.
	floatingLabel : PropTypes.bool.isRequired
}

TextInputComponent.defaultProps =
{
	// Set to `true` to mark the field as required.
	required : false,

	// Labels float by default.
	floatingLabel : true
}