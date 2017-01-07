// http://codepen.io/jczimm/pen/vEBpoL

import React, { PropTypes } from 'react'
import styler from 'react-styling/flat'
import classNames from 'classnames'

export default function Activity_indicator(props)
{
	const markup =
	(
		<div className={classNames('rrui__activity-indicator', props.className)} style={props.style}>
			<svg viewBox="0 0 50 50">
				<circle
					style={style.path}
					cx="25"
					cy="25"
					r="20"
					fill="none"
					strokeWidth="2.5"
					strokeMiterlimit="10"/>
			</svg>
		</div>
	)

	return markup
}

Activity_indicator.propTypes =
{
	// CSS class
	className : PropTypes.string,

	// CSS style object
	style     : PropTypes.object
}

const style = styler
`
	container
		display : inline-block

	wrapper
		width  : 100%
		height : 100%

	path
		stroke-dashoffset : 0
		stroke-linecap    : round
		transition        : all 1.5s ease-in-out
`