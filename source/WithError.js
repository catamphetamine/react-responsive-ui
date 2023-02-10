import React from 'react'
import PropTypes from 'prop-types'

/**
 * .rrui__interaction--pointer {
 *   outline: none;
 *   box-shadow: none;
 * }
 * <Interaction><input .../></Interaction>
 * <Interaction><button .../></Interaction>
 */
export default function WithError(props) {
	const {
		setRef,
		error,
		children,
		...rest
	} = props
	return (
		<div ref={setRef} {...rest}>
			{children}
			{/* Error message */}
			{error && typeof error === 'string' &&
				<div className="rrui__input-error">
					{error}
				</div>
			}
		</div>
	)
}

WithError.propTypes = {
	setRef : PropTypes.func,

	// Renders an error message below the `<input/>`
	error : PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.bool
	]),

	// CSS style object
	style : PropTypes.object,

	// CSS name
	className : PropTypes.string,

	children : PropTypes.node.isRequired
}