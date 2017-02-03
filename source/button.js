import React, { PureComponent, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { flat as styler } from 'react-styling'
import classNames from 'classnames'

import Activity_indicator from './activity indicator'

export default class Button extends PureComponent
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

		// When `true`, the button will submit an enclosing form.
		submit          : PropTypes.bool,

		// If `border` is `true`,
		// then the button will have CSS class of a bordered button.
		border          : PropTypes.bool,

		// If `link` is set, then the button is gonna be an <a/> tag.
		link            : PropTypes.string,

		// HTML `title` attribute
		title           : PropTypes.string,

		// CSS class name
		className       : PropTypes.string,

		// CSS style object for the button container
		style           : PropTypes.object,

		// CSS style object for the button itself
		buttonStyle     : PropTypes.object
	}

	constructor()
	{
		super()

		this.link_on_click   = this.link_on_click.bind(this)
		this.button_on_click = this.button_on_click.bind(this)
	}

	render()
	{
		const
		{
			disabled,
			busy,
			submit,
			border,
			title,
			style,
			className
		}
		= this.props

		const markup =
		(
			<div
				className={ classNames('rrui__button', className,
				{
					// With CSS selector optimization
					'rrui__button--border'         : border,
					'rrui__button--busy'           : busy,
					'rrui__button--disabled'       : disabled
				}) }
				style={ style ? { ...styles.container, ...style } : styles.container }>

				<Activity_indicator
					className={ classNames('rrui__button__activity-indicator',
					{
						// CSS selector optimization
						'rrui__button__activity-indicator--busy'   : busy,
						'rrui__button__activity-indicator--border' : border
					}) }
					style={ busy ? styles.spinner : styles.spinner_hide }/>

				{ this.render_button() }
			</div>
		)

		return markup
	}

	render_button()
	{
		const
		{
			link,
			title,
			border,
			busy,
			disabled,
			submit,
			buttonStyle,
			children
		}
		= this.props

		const className = classNames('rrui__button__button',
		{
			'rrui__button__button--link'     : link,
			// CSS selector optimization
			'rrui__button__button--border'   : border,
			'rrui__button__button--busy'     : busy,
			'rrui__button__button--disabled' : disabled
		})

		const properties =
		{
			ref: ref => this.button = ref,
			title,
			className,
			style: buttonStyle ? { ...styles.button, ...buttonStyle } : styles.button
		}

		if (link)
		{
			const markup =
			(
				<a
					href={ link }
					onClick={ this.link_on_click }
					{ ...properties }>

					{ children }
				</a>
			)

			return markup
		}

		const markup =
		(
			<button
				type={ submit ? 'submit' : 'button' }
				disabled={ busy || disabled }
				onClick={ this.button_on_click }
				{ ...properties }>

				{ children }
			</button>
		)

		return markup
	}

	focus()
	{
		ReactDOM.findDOMNode(this.button).focus()
	}

	link_on_click(event)
	{
		const
		{
			busy,
			disabled,
			action
		}
		= this.props

		// Only handle left mouse button clicks
		// ignoring those ones with a modifier key pressed
		if (event.button !== 0
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

		// Could be just a "submit" button
		if (action)
		{
			action()
		}
	}

	button_on_click(event)
	{
		const { action } = this.props

		// Could be just a "submit" button
		if (action)
		{
			action()
		}
	}
}

const styles = styler
`
	container
		position : relative
		display  : inline-block

	spinner
		position : absolute
		// (if z-index = -1 then it disappears)
		z-index  : 0
		pointer-events : none

		&hide
			opacity : 0

	button
		-webkit-user-select : none
		-moz-user-select    : none
		-ms-user-select     : none
		user-select         : none
`