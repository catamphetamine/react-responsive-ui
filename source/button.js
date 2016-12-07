import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import styler from 'react-styling/flat'
import classNames from 'classnames'

import Activity_indicator from './activity indicator'

export default class Button extends Component
{
	static propTypes =
	{
		// onClick handler
		action          : PropTypes.func,

		// If `busy` is `true` then the button
		// will be disabled and a spinner will be shown.
		busy            : PropTypes.bool,

		// Disables the button
		disabled        : PropTypes.bool,

		// If `primary` is `true`,
		// then the button will have CSS class of a primary button.
		primary         : PropTypes.bool,

		// When `true`, the button will submit an enclosing form.
		submit          : PropTypes.bool,

		// If `link` is set, then the button is gonna be an <a/> tag.
		link            : PropTypes.string,

		// CSS class name
		className       : PropTypes.string,

		// CSS style object for the button container
		style           : PropTypes.object,

		// CSS style object for the button itself
		buttonStyle     : PropTypes.object
	}

	render()
	{
		const { busy, primary, submit, className } = this.props

		const markup =
		(
			<div
				className={classNames('rrui__button', className,
				{
					'rrui__button--primary' : primary || submit,
					'rrui__button--busy'    : busy
				})}
				style={ this.props.style ? { ...style.container, ...this.props.style } : style.container }>

				<Activity_indicator style={ busy ? style.spinner_show : style.spinner_hide }/>

				{this.render_button()}
			</div>
		)

		return markup
	}

	render_button()
	{
		const { link, busy, primary, disabled, action, submit, className, buttonStyle } = this.props

		let button_style = busy ? style.button_hide : style.button_show

		if (buttonStyle)
		{
			button_style = { ...button_style, ...buttonStyle }
		}

		if (link)
		{
			const markup =
			(
				<a
					ref={ref => this.button = ref}
					href={link}
					onClick={event =>
					{
						// Ignore mouse wheel clicks
						// and clicks with a modifier key pressed
						if (event.nativeEvent.which === 2
							|| event.shiftKey
							|| event.altKey
							|| event.ctrlKey
							|| event.metaKey)
						{
							return
						}

						event.preventDefault()

						if (busy || disabled)
						{
							return
						}

						action(event)
					}}
					className="rrui__button__link"
					style={button_style}>

					{this.props.children}
				</a>
			)

			return markup
		}

		const markup =
		(
			<button
				ref={ref => this.button = ref}
				type={submit ? 'submit' : 'button'}
				disabled={busy || disabled}
				onClick={action}
				className="rrui__button__button"
				style={button_style}>

				{this.props.children}
			</button>
		)

		return markup
	}

	focus()
	{
		ReactDOM.findDOMNode(this.button).focus()
	}
}

const style = styler
`
	container
		position : relative
		display  : inline-block

	spinner
		position   : absolute
		// (if z-index = -1 then it disappears)
		z-index    : 0
		top        : 0.1em

		width  : 1em
		height : 1em

		pointer-events : none

		transition : opacity 300ms ease-out

		&show
			opacity          : 1
			transition-delay : 350ms
		&hide
			transition : opacity 200ms ease-out
			opacity    : 0

	button
		&show
			opacity          : 1
			transition       : opacity 150ms ease-out
			transition-delay : 100ms
		&hide
			opacity          : 0
			transition       : opacity 200ms ease-out
			transition-delay : 300ms
`