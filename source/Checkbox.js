import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { submitFormOnCtrlEnter } from './utility/dom'

// http://tympanus.net/codrops/2013/10/15/animated-checkboxes-and-radio-buttons-with-svg/

export default class Checkbox extends Component
{
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

	state = {}

	// Client side rendering, javascript is enabled
	componentDidMount()
	{
		const { value, fallback } = this.props

		if (fallback)
		{
			this.setState({ javascript: true })
		}
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

	storeInstance = (ref) => this.checkbox = ref

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
					// 'rrui__checkbox--checked'  : value,
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

					<div className="rrui__checkbox__checkbox">
						<input
							ref={ this.storeInstance }
							type="checkbox"
							checked={ value }
							disabled={ disabled }
							onKeyDown={ this.onKeyDown }
							onChange={ this.toggle }
							onFocus={ this.on_focus }
							onBlur={ this.on_blur }
							className="rrui__checkbox__input"/>

						<svg
							className={ classNames('rrui__checkbox__box',
							{
								'rrui__checkbox__box--checked' : value
							}) }
							focusable="false"
							viewBox="0 0 24 24"
							aria-hidden="true">
							<path d={ value ? CHECKBOX_CHECKED_PATH : CHECKBOX_UNCHECKED_PATH }/> }
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

				{ indicateInvalid && error &&
					<div className="rrui__input-error">
						{ error }
					</div>
				}

				{ fallback && !this.state.javascript && this.render_static() }
			</div>
		)
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

	focus()
	{
		this.checkbox.focus()
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

const CHECKBOX_CHECKED_PATH   = "M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
const CHECKBOX_UNCHECKED_PATH = "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"