import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Input from './TextInputInput'
import Label from './TextInputLabel'

// `<input/>` and its `<label/>`.
export default function TextInputComponent(props) {
	const {
		id,
		value,
		required,
		floatingLabel,
		label,
		placeholder,
		multiline,
		error,
		indicateInvalid,
		containerRef
	} = props

	const {
		icon: Icon,
		className,
		children,
		...rest
	} = props

	return (
		<div
			ref={containerRef}
			className={classNames('rrui__input', {
				'rrui__input--multiline' : multiline,
			})}>

			{Icon &&
				<Icon className="rrui__input-field__icon"/>
			}

			{/* `<input/>` */}
			<Input
				{...rest}
				className={classNames(className, {
					'rrui__input-field--with-icon': Icon
				})}/>

			{/* Input `<label/>`. */}
			{/* It is rendered after the input to utilize the
		       `input:focus + label` CSS selector rule */}
			{label &&
				<Label
					aria-hidden
					inputId={id}
					value={value}
					required={required}
					invalid={indicateInvalid && error}
					floats={floatingLabel && !placeholder}>
					{label}
				</Label>
			}

			{/* `children` are placed after the `<input/>`
			    so that in cases when they're `position: absolute`
			    then their default top position is right below the `<input/>`.
			    For example, this is used in `<DatePicker/>` so that
			    the list of options is displayed right below the `<input/>`. */}
			{children}
		</div>
	)
}

TextInputComponent.propTypes = {
	// Set to `true` to mark the field as required.
	required : PropTypes.bool.isRequired,

	// Labels float by default.
	floatingLabel : PropTypes.bool.isRequired,

	// `<input/>` icon.
	icon : PropTypes.func
}

TextInputComponent.defaultProps = {
	// Set to `true` to mark the field as required.
	required : false,

	// Labels float by default.
	floatingLabel : true
}