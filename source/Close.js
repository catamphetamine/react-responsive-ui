import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default function Close(props)
{
	const {
		onClick,
		closeLabel,
		className,
		children
	} = props
	return (
		<button
			type="button"
			onClick={ onClick }
			aria-label={ props['aria-label'] || closeLabel }
			className={ classNames('rrui__button-reset', 'rrui__outline', 'rrui__close', className) }>
			{ children }
		</button>
	)
}

export const CloseIcon = () => (
	<svg viewBox="0 0 22 21" className="rrui__close__icon">
		<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round">
			<g className="rrui__close__icon-path" transform="translate(-1367.000000, -40.000000)" strokeWidth="1">
				<g transform="translate(1368.000000, 41.000000)">
					<path d="M0.807611845,0.307611845 L19.1923882,18.6923882"></path>
					<path d="M0.807611845,0.307611845 L19.1923882,18.6923882" transform="translate(10.000000, 9.500000) scale(-1, 1) translate(-10.000000, -9.500000) "></path>
				</g>
			</g>
		</g>
	</svg>
)

Close.propTypes =
{
	onClick : PropTypes.func.isRequired,
	closeLabel : PropTypes.string.isRequired,
	className : PropTypes.string,
	children : PropTypes.node.isRequired
}

Close.defaultProps =
{
	closeLabel : 'Close'
}