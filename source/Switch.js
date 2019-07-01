import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { submitFormOnCtrlEnter } from './utility/dom'
import { onBlurForReduxForm } from './utility/redux-form'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

// http://wd.dizaina.net/en/experiments/ios7-style-switch/

// An iOS-style switch
export default class Switch extends PureComponent
{
	state = {}

	static propTypes =
	{
		// HTML form input `name` attribute
		name      : PropTypes.string,

		// Disables the switch
		disabled  : PropTypes.bool,

		// Either `true` or `false`
		value     : PropTypes.bool.isRequired,

		// Is called when the switch is switched
		onChange  : PropTypes.func.isRequired,

		// The label to the left of the switch
		leftLabel : PropTypes.string,

		// The label to the right of the switch
		rightLabel : PropTypes.string,

		// (deprecated, use `placement="left"`)
		// Set to `true` to output `children` on the right side.
		rightContent : PropTypes.bool,

		// Determines the placement of the toggle relative to `children`.
		// Is "right" by default.
		placement : PropTypes.oneOf(['left', 'right']),

		// A label (analogous to `leftLabel`)
		children  : PropTypes.node,

		// CSS style object
		style     : PropTypes.object,

		// CSS class
		className : PropTypes.string
	}

	static defaultProps =
	{
		value: false,

		// Determines the placement of the toggle relative to `children`.
		// Is "right" by default.
		placement: 'right'
	}

	state = {}

	// // Prevent "blur" event on mouse down.
	// onMouseDown = (event) => event.preventDefault()

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

	onKeyDown = (event) =>
	{
		const { onKeyDown } = this.props

		if (onKeyDown) {
			onKeyDown(event)
		}

		if (event.defaultPrevented) {
			return
		}

		if (submitFormOnCtrlEnter(event, this.input)) {
			return
		}
	}

	storeInputComponent = _ => this.input = _

	render()
	{
		const
		{
			value,
			disabled,
			style,
			className,
			leftLabel,
			rightLabel,
			rightContent,
			placement,
			children
		}
		= this.props

		const { isFocused } = this.state

		const isRightSideContent = placement === 'left' || rightContent

		return (
			<label
				onMouseDown={this.onMouseDown}
				onFocus={this.onFocus}
				onBlur={this.onBlur}
				className={ classNames('rrui__switch',
				{
					// 'rrui__input'            : children,
					'rrui__switch--label'    : children,
					'rrui__switch--disabled' : disabled,
					'rrui__switch--focus'    : isFocused
				},
				className) }
				style={ style }>

				{/* Left label */}
				{ (leftLabel || (!isRightSideContent && children)) &&
					<span className={ classNames('rrui__switch__label', 'rrui__switch__label--left') }>
						{ leftLabel || (!isRightSideContent && children) }
					</span>
				}

				{/* The switch */}
				<span className="rrui__switch__switch">
					<input
						ref={ this.storeInputComponent }
						type="checkbox"
						value={ value }
						onKeyDown={ this.onKeyDown }
						onChange={ this.toggle }
						className="rrui__switch__input"
						style={ inputStyle }/>

					<span
						className={ classNames('rrui__switch__groove',
						{
							// CSS selector performance optimization
							'rrui__switch__groove--on' : value
						}) }/>

					<span
						className={ classNames('rrui__switch__knob',
						{
							// CSS selector performance optimization
							'rrui__switch__knob--on' : value
						}) }/>
				</span>

				{/* Right label */}
				{ (rightLabel || (isRightSideContent && children)) &&
					<span className={ classNames('rrui__switch__label', 'rrui__switch__label--right') }>
						{ rightLabel || (isRightSideContent && children) }
					</span>
				}
			</label>
		)
	}

	// render_static()
	// {
	// 	const { name, disabled, value } = this.props
	//
	// 	return (
	// 		<div className="rrui__rich__fallback">
	// 			<input
	// 				type="checkbox"
	// 				name={ name }
	// 				disabled={ disabled }
	// 				value={ value }/>
	// 		</div>
	// 	)
	// }

	toggle = (event) =>
	{
		const { onChange, disabled, value } = this.props

		if (disabled)
		{
			return
		}

		onChange(!value)
	}
}

const inputStyle =
{
	position : 'absolute',
	opacity  : 0,
	margin   : 0
}