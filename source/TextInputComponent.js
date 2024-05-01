import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Input from './TextInputInput'
import Label from './TextInputLabel'

// `<input/>` and its `<label/>`.
function TextInputComponent({
	icon: Icon,
	className,
	children,
	...rest
}, ref) {
	const {
		id,
		value,
		// Set to `true` to mark the field as required.
		required = false,
		// Labels float by default.
		floatingLabel = true,
		label,
		placeholder,
		multiline,
		error,
		containerRef
	} = rest

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
				ref={ref}
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
					invalid={error}
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

TextInputComponent = React.forwardRef(TextInputComponent)

TextInputComponent.propTypes = {
	// Set to `true` to mark the field as required.
	required : PropTypes.bool,

	// Indicates that the input is invalid.
	error: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.bool
	]),

	// Labels float by default.
	floatingLabel : PropTypes.bool,

	// `<input/>` icon.
	icon : PropTypes.func
}

export default TextInputComponent