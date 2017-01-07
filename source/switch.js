import React, { PureComponent, PropTypes } from 'react'
import styler from 'react-styling/flat'
import classNames from 'classnames'

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

		// CSS style object
		style     : PropTypes.object
	}

	static defaultProps =
	{
		value : false
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
				className={classNames('rrui__rich', 'rrui__switch',
				{
					'rrui__switch--on': value
				})}
				style={ this.props.style ? { ...style.switch, ...this.props.style } : style.switch }>

				<input
					type="checkbox"
					value={value}
					onChange={this.toggle}
					style={style.input}/>

				<span
					style={style.groove}
					className="rrui__switch__groove"/>

				<div
					style={style.knob}
					className="rrui__switch__knob"/>

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

	knob
		position : absolute
		display  : block
`