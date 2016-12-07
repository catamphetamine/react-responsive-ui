import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import styler from 'react-styling/flat'
import classNames from 'classnames'

// http://codepen.io/jczimm/pen/vEBpoL
// (18.02.2016)

// https://github.com/callemall/material-ui/blob/master/src/circular-progress.jsx
// 16.01.2016

// const more_than_circumference_max_length = 200

// const stripe_contracted_length = 1
// const stripe_expanded_length   = 89

export default class Activity_indicator extends Component
{
	static propTypes =
	{
		// CSS class
		className : PropTypes.string,

		// CSS style object
		style     : PropTypes.object
	}

	render()
	{
		let path_style = style.path

		const markup =
		(
			<div className={classNames('rrui__activity-indicator', this.props.className)} style={this.props.style}>
				<svg viewBox="0 0 50 50">
					<circle
						style={path_style}
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