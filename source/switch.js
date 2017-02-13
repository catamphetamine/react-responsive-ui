import React, { PureComponent, PropTypes } from 'react'
import styler from 'react-styling'
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

		// (exotic use case)
		// Falls back to a plain HTML input
		// when javascript is disabled (e.g. Tor)
		fallback  : PropTypes.bool.isRequired,

		// CSS style object
		style     : PropTypes.object,

		// CSS class
		className : PropTypes.string
	}

	static defaultProps =
	{
		value    : false,
		fallback : false
	}

	constructor()
	{
		super()

		this.toggle = this.toggle.bind(this)
	}

	// Client side rendering, javascript is enabled
	componentDidMount()
	{
		const { fallback } = this.props

		if (fallback)
		{
			this.setState({ javascript: true })
		}
	}

	render()
	{
		const
		{
			value,
			fallback,
			disabled,
			indicateInvalid,
			error,
			style,
			className
		}
		= this.props

		const markup =
		(
			<label
				className={ classNames('rrui__switch',
				{
					'rrui__rich'             : fallback,
					'rrui__switch--on'       : value,
					'rrui__switch--disabled' : disabled
				},
				className) }
				style={ this.props.style ? { ...styles.switch, ...style } : styles.switch }>

				<div className="rrui__input">
					<input
						type="checkbox"
						value={ value }
						onChange={ this.toggle }
						style={ styles.input }/>

					<span
						style={ styles.groove }
						className="rrui__switch__groove"/>

					<div
						style={ styles.knob }
						className="rrui__switch__knob"/>
				</div>

				{ fallback && !this.state.javascript && this.render_static() }

				{ indicateInvalid && error && <div className="rrui__input-error">{ error }</div> }
			</label>
		)

		return markup
	}

	// supports disabled javascript
	render_static()
	{
		const { name, disabled, value } = this.props

		const markup =
		(
			<div className="rrui__rich__fallback">
				<input
					type="checkbox"
					name={ name }
					disabled={ disabled }
					value={ value }/>
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

const styles = styler
`
	switch
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