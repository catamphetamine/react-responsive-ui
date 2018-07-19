import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import ActivityIndicator from './ActivityIndicator'

export default class Button extends PureComponent
{
	static propTypes =
	{
		// onClick handler.
		// Doesn't receive `event` by default.
		onClick         : PropTypes.func,

		// onClick handler.
		// (deprecated, use `onClick(event)` instead)
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

		// HTML `title` attribute
		title           : PropTypes.string,

		// Set to `true` to stretch the button to full width
		stretch         : PropTypes.bool.isRequired,

		// CSS class name
		className       : PropTypes.string,

		// CSS style object for the button container
		style           : PropTypes.object
	}

	static defaultProps =
	{
		// Set to `true` to stretch the button to full width
		stretch : false
	}

	state =
	{
		showBusy : this.props.busy
	}

	componentDidUpdate(prevProps)
	{
		if (!prevProps.busy && this.props.busy)
		{
			clearTimeout(this.no_longer_busy_timeout)
			this.setState({ showBusy : true })
		}
		else if (prevProps.busy && !this.props.busy)
		{
			// Gives some time to CSS opacity transition to finish.
			this.no_longer_busy_timeout = setTimeout(() =>
			{
				if (this._isMounted) {
					this.setState({ showBusy : false })
				}
			},
			300)
		}
	}

	componentDidMount()
	{
		this._isMounted = true
	}

	componentWillUnmount()
	{
		this._isMounted = false
	}

	render()
	{
		const
		{
			link,
			title,
			busy,
			disabled,
			action,
			onClick,
			submit,
			stretch,
			style,
			className,
			children,
			...rest
		}
		= this.props

		const { showBusy } = this.state

		const properties =
		{
			...rest,
			ref : this.storeInstance,
			title,
			style,
			className : classNames('rrui__input', 'rrui__button-reset', 'rrui__button',
			{
				'rrui__button--busy'       : busy,
				'rrui__button--disabled'   : disabled,
				'rrui__button--stretch'    : stretch,
				'rrui__button-reset--link' : link
			},
			className)
		}

		if (link)
		{
			return (
				<a
					href={ link }
					onClick={ this.link_on_click }
					{ ...properties }>

					{ children }
				</a>
			)
		}

		return (
			<button
				type={ submit ? 'submit' : 'button' }
				disabled={ busy || disabled }
				onClick={ this.button_on_click }
				{ ...properties }>

				{ (busy || showBusy) &&
					<div
						className={ classNames('rrui__button__busy',
						{
							'rrui__button__busy--after-show' : busy && showBusy
						}) }/>
				}
				{ children }
			</button>
		)
	}

	storeInstance = (ref) => this.button = ref

	focus()
	{
		this.button.focus()
	}

	link_on_click = (event) =>
	{
		const
		{
			busy,
			disabled,
			action,
			onClick
		}
		= this.props

		// Only handle left mouse button clicks
		// ignoring those ones with a modifier key pressed.
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
		else if (onClick)
		{
			event.preventDefault()
			onClick()
		}
	}

	button_on_click = (event) =>
	{
		const { action, onClick } = this.props

		// Could be just a `<button type="submit"/>`
		// without any `action` supplied.
		if (action) {
			action()
		} else if (onClick) {
			onClick()
		}
	}
}