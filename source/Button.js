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

		// `wait` is an alias for `busy`.
		wait            : PropTypes.bool,

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

	state = {}

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
			wait,
			submit,
			title,
			stretch,
			style,
			className
		}
		= this.props

		return (
			<div
				className={ classNames('rrui__input', 'rrui__button',
				{
					'rrui__button--busy'     : busy || wait || this.state.wait,
					'rrui__button--disabled' : disabled,
					'rrui__button--stretch'  : stretch
				},
				className) }
				style={ style }>

				<ActivityIndicator
					className={ classNames('rrui__button__activity-indicator',
					{
						// CSS selector performance optimization
						'rrui__button__activity-indicator--busy' : busy || wait || this.state.wait
					}) }/>

				{ this.render_button() }
			</div>
		)
	}

	render_button()
	{
		const
		{
			link,
			linkDownload,
			title,
			busy,
			wait,
			disabled,
			submit,
			buttonStyle,
			children
		}
		= this.props

		const className = classNames('rrui__button-reset', 'rrui__button__button',
		{
			'rrui__button__button--link'     : link,
			// CSS selector performance optimization
			'rrui__button__button--busy'     : busy || wait || this.state.wait,
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
				'rrui__button__contents--busy' : busy || wait || this.state.wait
			}) }>
			{ children }
		</div>

		if (link)
		{
			return (
				<a
					href={ link }
					download={ linkDownload }
					onClick={ this.link_on_click }
					{ ...properties }>

					{ contents }
				</a>
			)
		}

		return (
			<button
				type={ submit ? 'submit' : 'button' }
				disabled={ busy || wait || this.state.wait || disabled }
				onClick={ this.button_on_click }
				{ ...properties }>

				{ contents }
			</button>
		)
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
			wait,
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

		if (busy || wait || this.state.wait || disabled)
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
			const result = action()

			if (result && typeof result.then === 'function')
			{
				this.setState({ wait: true })
				result.then(() => this.setState({ wait: false }), () => this.setState({ wait: false }))
			}
		}
	}
}