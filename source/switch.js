import React, { Component, PropTypes } from 'react'
import styler from 'react-styling/flat'

// http://wd.dizaina.net/en/experiments/ios7-style-switch/

// An iOS-style switch
export default class Switch extends Component
{
	state = {}

	static propTypes =
	{
		// HTML form input `name` attribute
		name      : PropTypes.string,

		// Disables the switch
		disabled  : PropTypes.bool,

		// Either `true` or `false`
		value     : PropTypes.bool,

		// Is called when the switch is switched
		onChange  : PropTypes.func.isRequired,

		// CSS style object
		style     : PropTypes.object
	}

	constructor(props, context)
	{
		super(props, context)

		this.toggle = this.toggle.bind(this)
	}

	// Client side rendering, javascript is enabled
	componentDidMount()
	{
		this.setState({ javascript: true })
	}

	render()
	{
		const { value } = this.props

		const markup =
		(
			<label
				className="rrui__rich rrui__switch"
				style={ this.props.style ? { ...style.switch, ...this.props.style } : style.switch }>

				<input
					type="checkbox"
					style={style.input}
					value={value}
					onChange={this.toggle}/>

				<span className="rrui__switch__groove" style={value ? style.groove_when_checked : style.groove}/>
				<div className="rrui__switch__knob" style={value ? style.knob_when_checked : style.knob}/>

				{!this.state.javascript && this.render_static()}
			</label>
		)

		return markup
	}

	// supports disabled javascript
	render_static()
	{
		const { name, disabled } = this.props

		const markup =
		(
			<div className="rrui__rich__fallback">
				<input
					type="checkbox"
					name={name}
					disabled={disabled}
					value={this.props.value}/>
			</div>
		)

		return markup
	}

	toggle(event)
	{
		const { onChange, disabled, value } = this.props

		if (disabled)
		{
			return
		}

		onChange(!value)
	}
}

const style = styler
`
	switch
		display  : inline-block
		position : relative

		-webkit-user-select : none
		-moz-user-select    : none
		-ms-user-select     : none
		user-select         : none

		-webkit-tap-highlight-color : transparent
		tap-highlight-color         : transparent

	input
		position : absolute
		opacity  : 0

	groove
		position : relative
		display  : inline-block
		width    : 1.65em
		height   : 1em

		background    : white
		box-shadow    : inset 0 0 0 0.0625em #d7d7d7
		border-radius : 0.5em
		transition    : all 0.40s cubic-bezier(.17,.67,.43,.98)

		&when_checked
			box-shadow : inset 0 0 0 0.73em #4cd964

	knob
		position      : absolute
		display       : block
		width         : 0.875em
		height        : 0.875em
		border-radius : 0.4375em
		top           : 0.0625em
		left          : 0.0625em
		background    : white
		box-shadow    : inset 0 0 0 0.03em rgba(0,0,0,0.3), 0 0 0.05em rgba(0,0,0,0.05), 0 0.1em 0.2em rgba(0,0,0,0.2)
		transition    : all 0.25s ease-out

		&when_checked
			left : 0.7125em
`