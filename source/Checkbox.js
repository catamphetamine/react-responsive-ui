import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { submitFormOnCtrlEnter } from './utility/dom'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

// http://tympanus.net/codrops/2013/10/15/animated-checkboxes-and-radio-buttons-with-svg/

export default class Checkbox extends PureComponent
{
	static propTypes =
	{
		// HTML form field "name"
		name : PropTypes.string,

		// `true`/`false`
		value : PropTypes.bool.isRequired,

		// Set to `true` to enable multiline label
		multiline : PropTypes.bool.isRequired,

		// Disables the checkbox
		disabled  : PropTypes.bool.isRequired,

		// `onChange` handler
		onChange  : PropTypes.func,

		// When `true` autofocuses the checkbox
		focus     : PropTypes.bool.isRequired,

		// `aria-label` attribute.
		// Deprecated, use `aria-label` instead.
		ariaLabel : PropTypes.string,

		// The label (text)
		children  : PropTypes.node,

		// CSS class
		className : PropTypes.string,

		// CSS style object
		style     : PropTypes.object
	}

	static defaultProps =
	{
		disabled  : false,
		value     : false,
		multiline : false,
		focus     : false,

		// Show `error` (if passed).
		indicateInvalid : true
	}

	state = {}

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

	onFocus = () => this.setState({ isFocused: true })
	onBlur  = () => this.setState({ isFocused: false })

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
			// Deprecated, use `aria-label` instead.
			ariaLabel,
			children,
			style,
			className
		}
		= this.props

		const { isFocused } = this.state

		return (
			<div
				className={ classNames('rrui__checkbox',
				{
					// 'rrui__checkbox--checked'  : value,
					'rrui__checkbox--invalid'   : indicateInvalid && error,
					'rrui__checkbox--disabled'  : disabled,
					'rrui__checkbox--multiline' : multiline,
					'rrui__checkbox--focus'     : isFocused
				},
				className) }
				style={ style }>

				<label
					className={ classNames('rrui__input',
					{
						'rrui__input--multiline' : multiline
					}) }>

					<span className="rrui__checkbox__checkbox">
						<input
							ref={ this.storeInstance }
							type="checkbox"
							aria-label={ this.props['aria-label'] || ariaLabel }
							aria-invalid={ indicateInvalid && error ? true : undefined }
							checked={ value }
							disabled={ disabled }
							onKeyDown={ this.onKeyDown }
							onChange={ this.toggle }
							onFocus={ this.onFocus }
							onBlur={ this.onBlur }
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

						<span className="rrui__checkbox__box-background"/>
						<span className="rrui__checkbox__focus-ring"/>
					</span>

					{ children &&
						<span
							className={ classNames('rrui__checkbox__label',
							{
								'rrui__checkbox__label--multiline' : multiline
							}) }>
							{ children }
						</span>
					}
				</label>

				{ indicateInvalid && error &&
					<div className="rrui__input-error">
						{ error }
					</div>
				}
			</div>
		)
	}

	// render_static()
	// {
	// 	const { name, value, focus, disabled, children } = this.props
	//
	// 	return (
	// 		<div className="rrui__rich__fallback">
	// 			{/* This checkbox will be sent as either "on" or `undefined` */}
	// 			<input
	// 				type="checkbox"
	// 				name={ name }
	// 				disabled={ disabled }
	// 				defaultChecked={ value }
	// 				autoFocus={ focus }/>
	//
	// 			<label className="rrui__checkbox__label rrui__checkbox__label--fallback">
	// 				{ children }
	// 			</label>
	// 		</div>
	// 	)
	// }

	focus = () => this.checkbox.focus()

	toggle = (event) =>
	{
		// If a link was clicked - don't treat it as a checkbox label click.
		// (is used for things like "✓ Read and accepted the <a>licence agreement</a>")
		if (event.target.tagName.toLowerCase() === 'a') {
			return
		}

		this.focus()

		const { disabled, onChange, value } = this.props

		if (disabled) {
			return
		}

		onChange(!value)
	}
}

const CHECKBOX_CHECKED_PATH   = "M21.3,0H2.7C1.2,0,0,1.2,0,2.7v18.7C0,22.8,1.2,24,2.7,24h18.7c1.5,0,2.7-1.2,2.7-2.7V2.7C24,1.2,22.8,0,21.3,0z M9.3,18.7 L2.7,12l1.9-1.9l4.8,4.8L19.5,4.8l1.9,1.9L9.3,18.7z"
const CHECKBOX_UNCHECKED_PATH = "M21.2,0H2.9C1.3,0,0,1.3,0,2.9v18.3C0,22.8,1.3,24,2.9,24h18.3c1.6,0,2.8-1.3,2.8-2.8V2.9C24,1.3,22.8,0,21.2,0z M22.3,20.7c0,0.9-0.8,1.7-1.7,1.7H3.4c-0.9,0-1.7-0.8-1.7-1.7V3.4c0-0.9,0.8-1.7,1.7-1.7h17.2c0.9,0,1.7,0.8,1.7,1.7V20.7z"

// Thin.
// const CHECKBOX_UNCHECKED_PATH = "M21.2,0H2.9C1.3,0,0,1.3,0,2.8v18.3C0,22.7,1.3,24,2.9,24h18.3c1.6,0,2.8-1.3,2.8-2.8V2.8C24,1.3,22.8,0,21.2,0z M23.2,20.3c0,1.6-1.3,2.8-2.8,2.8H3.7c-1.6,0-2.8-1.3-2.8-2.8V3.7c0-1.6,1.3-2.8,2.8-2.8h16.6c1.6,0,2.8,1.3,2.8,2.8V20.3z"