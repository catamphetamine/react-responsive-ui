import React, { PureComponent, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import styler from 'react-styling/flat'
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

		// If `primary` is `true`,
		// then the button will have CSS class of a primary button.
		primary         : PropTypes.bool,

		// When `true`, the button will submit an enclosing form.
		submit          : PropTypes.bool,

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

	constructor(props)
	{
		super(props)

		this.link_on_click = this.link_on_click.bind(this)
		this.button_on_click = this.button_on_click.bind(this)
	}

	render()
	{
		const { busy, primary, submit, title, className } = this.props

		const markup =
		(
			<div
				className={classNames('rrui__button', className,
				{
					'rrui__button--primary' : primary || submit,
					'rrui__button--busy'    : busy
				})}
				style={ this.props.style ? { ...style.container, ...this.props.style } : style.container }>

				<Activity_indicator style={ busy ? style.spinner : style.spinner_hide }/>

				{this.render_button()}
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
			primary,
			busy,
			disabled,
			submit,
			className,
			buttonStyle,
			children
		}
		= this.props

		const properties =
		{
			ref: ref => this.button = ref,
			title,
			style: buttonStyle ? { ...style.button, ...buttonStyle } : style.button
		}

		if (link)
		{
			const markup =
			(
				<a
					href={ link }
					onClick={ this.link_on_click }
					className="rrui__button__link"
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
				className="rrui__button__button"
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

const style = styler
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