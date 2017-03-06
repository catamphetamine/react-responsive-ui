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

		// If `link` is set, then the button is gonna be an <a/> tag.
		link            : PropTypes.string,

		// `<a download="..."/>` HTML attribute
		linkDownload    : PropTypes.string,

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
			title,
			style,
			className
		}
		= this.props

		const container_style = disabled ? styles.container_disabled : (busy ? styles.container_busy : styles.container)

		const markup =
		(
			<div
				className={ classNames('rrui__input', 'rrui__button',
				{
					'rrui__button--busy'     : busy,
					'rrui__button--disabled' : disabled
				},
				className) }
				style={ style ? { ...container_style, ...style } : container_style }>

				<Activity_indicator
					className={ classNames('rrui__button__activity-indicator',
					{
						// CSS selector performance optimization
						'rrui__button__activity-indicator--busy'   : busy
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
			linkDownload,
			title,
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
			// CSS selector performance optimization
			'rrui__button__button--busy'     : busy,
			'rrui__button__button--disabled' : disabled
		})

		const button_style = link ? styles.button_link : styles.button

		const properties =
		{
			ref: ref => this.button = ref,
			title,
			className,
			style: buttonStyle ? { ...button_style, ...buttonStyle } : button_style
		}

		const contents = <div
			className={ classNames('rrui__button__contents',
			{
				// CSS selector performance optimization
				'rrui__button__contents--busy' : busy
			}) }>
			{ children }
		</div>

		if (link)
		{
			const markup =
			(
				<a
					href={ link }
					download={ linkDownload }
					onClick={ this.link_on_click }
					{ ...properties }>

					{ contents }
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

				{ contents }
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

		if (busy || disabled)
		{
			return
		}

		// Could be just a "submit" button without having any `action`.
		// Could also be just a `link` button.
		// Therefore "preventing default" only if `action` is set:
		// for example, if `link` is set and no `action`
		// then it should proceed with navigating to the `link`.
		// And if `link` is set and `action` is specified too
		// then it will prevent it from navigating to the `link`.
		if (action)
		{
			event.preventDefault()
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
		box-sizing : border-box

		&busy
			// "pointer-events" prevents "cursor: wait" from working
			pointer-events : none

		&disabled
			pointer-events : none

	spinner
		position : absolute
		// (if z-index = -1 then it disappears)
		z-index  : 0
		pointer-events : none

		&hide
			opacity : 0

	button
		width : 100%

		-webkit-user-select : none
		-moz-user-select    : none
		-ms-user-select     : none
		user-select         : none

		cursor : inherit
		color  : inherit

		&link
			// <button/> tends to vertially align its contents by itself
			// (I guess that's a <button/>'s natural behaviour)
			// but <a/> needs special treatment in this sense.
			display         : flex
			align-items     : center
			text-decoration : none
`