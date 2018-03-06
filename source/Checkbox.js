import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

// http://tympanus.net/codrops/2013/10/15/animated-checkboxes-and-radio-buttons-with-svg/

export default class Checkbox extends PureComponent
{
	state = {}

	static propTypes =
	{
		// HTML form field "name"
		name      : PropTypes.string,

		// `true`/`false`
		value     : PropTypes.bool.isRequired,

		// Set to `true` to enable multiline label
		multiline : PropTypes.bool.isRequired,

		// Disables the checkbox
		disabled  : PropTypes.bool.isRequired,

		// `onChange` handler
		onChange  : PropTypes.func.isRequired,

		// When `true` autofocuses the checkbox
		focus     : PropTypes.bool.isRequired,

		// The label (text)
		children  : PropTypes.node,

		// (exotic use case)
		// Falls back to a plain HTML input
		// when javascript is disabled (e.g. Tor)
		fallback  : PropTypes.bool.isRequired,

		// CSS class
		className : PropTypes.string,

		// CSS style object
		style     : PropTypes.object
	}

	static defaultProps =
	{
		disabled  : false,
		value     : false,
		fallback  : false,
		multiline : false,
		focus     : false
	}

	// Client side rendering, javascript is enabled
	componentDidMount()
	{
		const { value, fallback } = this.props

		if (value)
		{
			this.draw_checkmark()
		}

		if (fallback)
		{
			this.setState({ javascript: true })
		}
	}

	componentWillReceiveProps(next_props)
	{
		if (this.props.value !== next_props.value)
		{
			// Allows checkmark animation from now on
			this.was_toggled = true
		}

		if (this.props.value && !next_props.value)
		{
			this.setState({ path_style: undefined })
		}
	}

	componentDidUpdate(previous_props, previous_state)
	{
		if (this.props.value && !previous_props.value)
		{
			this.draw_checkmark()
		}
	}

	render()
	{
		const
		{
			value,
			error,
			indicateInvalid,
			multiline,
			disabled,
			children,
			fallback,
			style,
			className
		}
		= this.props

		return (
			<div
				className={ classNames('rrui__checkbox',
				{
					'rrui__rich'               : fallback,
					'rrui__checkbox--checked'  : value,
					'rrui__checkbox--invalid'  : indicateInvalid && error,
					'rrui__checkbox--disabled' : disabled
				},
				className) }
				style={ style }>

				<div
					className={ classNames('rrui__input',
					{
						'rrui__input--multiline' : multiline
					}) }>

					<div
						className={ classNames('rrui__checkbox__checkbox',
						{
							'rrui__checkbox__checkbox--multiline' : multiline
						}) }>

						<input
							ref={ ref => this.checkbox = ref }
							type="checkbox"
							checked={ value }
							disabled={ disabled }
							onChange={ this.toggle }
							onFocus={ this.on_focus }
							onBlur={ this.on_blur }
							className="rrui__checkbox__input"/>

						<div
							className={ classNames('rrui__checkbox__box',
							{
								'rrui__checkbox__box--no-label' : !children
							}) }/>

						<svg
							viewBox={ checkmark_svg_canvas_dimensions }
							className="rrui__checkbox__checkmark">
							{ value ? this.render_checkmark() : null }
						</svg>
					</div>

					{ children &&
						<label
							onClick={ this.toggle }
							className={ classNames('rrui__checkbox__label',
							{
								'rrui__checkbox__label--multiline' : multiline
							}) }>
							{ children }
						</label>
					}
				</div>

				{ indicateInvalid && error && <div className="rrui__input-error">{ error }</div> }

				{ fallback && !this.state.javascript && this.render_static() }
			</div>
		)
	}

	render_checkmark()
	{
		const { path_style } = this.state

		// For a web browser
		if (typeof window !== 'undefined')
		{
			return <path
				ref={ ref => this.path = ref }
				d={ checkmark_svg_path }
				style={ path_style || checkmark_svg_path_style }/>
		}

		// For Node.js
		return <path
			d={ checkmark_svg_path }
			style={ checkmark_svg_path_style }/>
	}

	// supports disabled javascript
	render_static()
	{
		const { name, value, focus, disabled, children } = this.props

		return (
			<div className="rrui__rich__fallback">
				{/* This checkbox will be sent as either "on" or `undefined` */}
				<input
					type="checkbox"
					name={ name }
					disabled={ disabled }
					defaultChecked={ value }
					autoFocus={ focus }/>

				<label className="rrui__checkbox__label rrui__checkbox__label--fallback">
					{ children }
				</label>
			</div>
		)
	}

	draw_checkmark()
	{
		const i = 0

		const path_element = ReactDOM.findDOMNode(this.path)

		const animation = { speed : .1, easing : 'ease-in-out' }

		const path_style = {}

		const length = path_element.getTotalLength() // in pixels
		path_style.strokeDasharray = `${length} ${length}`

		path_element.style.strokeDashoffset = Math.floor(length) - 1

		// Trigger a layout so styles are calculated & the browser
		// picks up the starting position before animating
		path_element.getBoundingClientRect()

		// Define our transition
		// (skips the animation on the initial page render on the client side)
		if (this.was_toggled)
		{
			path_style.transition =
			path_element.style.WebkitTransition =
			path_element.style.MozTransition =
				`stroke-dashoffset ${animation.speed}s ${animation.easing} ${i * animation.speed}s`
		}

		// Go
		path_style.strokeDashoffset = 0

		this.setState({ path_style: { ...path_style, ...svg_path_style } })
	}

	focus()
	{
		ReactDOM.findDOMNode(this.checkbox).focus()
	}

	toggle = (event) =>
	{
		// If a link was clicked - don't treat it as a checkbox label click.
		// (is used for things like "✓ Read and accepted the <a>licence agreement</a>")
		if (event.target.tagName.toLowerCase() === 'a')
		{
			return
		}

		this.focus()

		const { disabled, onChange, value } = this.props

		if (disabled)
		{
			return
		}

		// if (value)
		// {
		// 	this.setState({ path_style: undefined })
		// }

		onChange(!value)
	}
}

const checkmark_svg_canvas_dimensions = '0 0 100 100'
const checkmark_svg_path = ['M16.667,62.167c3.109,5.55,7.217,10.591,10.926,15.75 c2.614,3.636,5.149,7.519,8.161,10.853c-0.046-0.051,1.959,2.414,2.692,2.343c0.895-0.088,6.958-8.511,6.014-7.3 c5.997-7.695,11.68-15.463,16.931-23.696c6.393-10.025,12.235-20.373,18.104-30.707C82.004,24.988,84.802,20.601,87,16']

const checkmark_svg_path_style =
{
	fill           : 'transparent',
	strokeLinecap  : 'round',
	strokeLinejoin : 'round'
}

const svg_path_style =
{
	strokeLinecap  : 'round',
	strokeLinejoin : 'round',
	fill           : 'none'
}