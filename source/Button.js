import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import ActivityIndicator from './ActivityIndicator'

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

		// Set to `true` to stretch the button to full width
		stretch         : PropTypes.bool.isRequired,

		// CSS class name
		className       : PropTypes.string,

		// CSS style object for the button container
		style           : PropTypes.object,

		// CSS style object for the button itself
		buttonStyle     : PropTypes.object
	}

	static defaultProps =
	{
		// Set to `true` to stretch the button to full width
		stretch : false
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
			stretch,
			style,
			className
		}
		= this.props

		const markup =
		(
			<div
				className={ classNames('rrui__input', 'rrui__button',
				{
					'rrui__button--busy'     : busy,
					'rrui__button--disabled' : disabled,
					'rrui__button--stretch'  : stretch
				},
				className) }
				style={ style }>

				<ActivityIndicator
					className={ classNames('rrui__button__activity-indicator',
					{
						// CSS selector performance optimization
						'rrui__button__activity-indicator--busy'   : busy
					}) }/>

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

		const properties =
		{
			ref: ref => this.button = ref,
			title,
			className,
			style: buttonStyle
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