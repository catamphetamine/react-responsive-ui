import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

// Sits at the bottom of a page and displays notifications
export default class Snackbar extends PureComponent
{
	static propTypes =
	{
		// Snackbar value (either a message, or an object)
		value : PropTypes.oneOfType
		([
			PropTypes.string,
			PropTypes.shape
			({
				content  : PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
				type     : PropTypes.string,
				duration : PropTypes.number
			})
		]),

		// Must reset the `value`.
		reset : PropTypes.func.isRequired,

		// "Snack" hiding CSS animation duration.
		// Is 400 milliseconds by default.
		hideAnimationDuration : PropTypes.number.isRequired,

		// The total display duration (in milliseconds) of a snack
		// is `minTime + message.length * lengthTimeFactor`
		minTime          : PropTypes.number.isRequired,
		lengthTimeFactor : PropTypes.number.isRequired
	}

	static defaultProps =
	{
		hideAnimationDuration : 400,
		minTime          : 1200,
		lengthTimeFactor : 60
	}

	state =
	{
		values: []
	}

	componentWillUnmount()
	{
		if (this.auto_hide_timer)
		{
			clearTimeout(this.auto_hide_timer)
			this.auto_hide_timer = undefined
		}

		if (this.show_next_snack_timeout)
		{
			clearTimeout(this.show_next_snack_timeout)
			this.show_next_snack_timeout = undefined
		}

		if (this.show_snack_timeout)
		{
			clearTimeout(this.show_snack_timeout)
			this.show_snack_timeout = undefined
		}
	}

	componentWillReceiveProps(new_props)
	{
		let { value, reset } = new_props

		// Redux has an optimization built in:
		// it won't rerender a `@connect`ed component
		// if its new `props` are shallowly equal to the previous ones.
		// Therefore, manually resetting the `value` property here
		// immediately after receiving it (a non-`undefined` value)
		// so that the same notification message could later be displayed.
		if (value)
		{
			// Normalize value (make it a plain javascript object)
			// if it's a string or a react element.
			if (!(typeof value === 'object' && !value.props))
			{
				value = { content: value }
			}

			// Add the notification to the queue
			this.push(value)
			// Reset the `value` property immediately
			reset()
		}
	}

	// Adds a notification to the queue
	push(new_value)
	{
		const { values, value } = this.state

		// Add the notification to the queue
		values.push(new_value)

		// If the notification queue was empty
		// then kick-start it.
		if (!value)
		{
			this.next()
		}
	}

	// Displays the next notification in the queue
	next = () =>
	{
		const { values } = this.state

		const
		{
			hideAnimationDuration,
			minTime,
			lengthTimeFactor
		}
		= this.props

		// Get the next notification from the queue
		// (will be `undefined` if the queue is empty)
		const value = values.shift()

		// Reset the notification display
		this.setState({ value, height: undefined, hiding: false })

		// If the queue is empty, then just exit
		if (!value)
		{
			return
		}

		// `state.show` will be set to `true` later,
		// when the height of the element is measured
		// (which is after it renders)

		// Hide the notification after it expires
		this.auto_hide_timer = setTimeout(() =>
		{
			// Clearing memory
			this.auto_hide_timer = undefined

			// Start the hiding animation for the notification
			this.setState({ show: false, hiding: true })

			// Display the next notification
			// after the currently being hidden one
			// finishes its hiding animation.
			this.show_next_snack_timeout = setTimeout(() =>
			{
				this.show_next_snack_timeout = undefined
				this.next()
			},
			hideAnimationDuration)
		},
		// The total display duration (in milliseconds) of a snack
		// is `minTime + message.length * lengthTimeFactor`
		value.duration || (minTime + (typeof value.content === 'string' ? value.content.length * lengthTimeFactor : 0)))
	}

	componentDidUpdate()
	{
		let { height, value } = this.state

		// The notification DOM element has just been rendered
		// which means its dimensions are set by now.
		// Calculate the notification container DOM element height
		// so that the slide-from-bottom animation knows
		// its target Y-position for the CSS `translate` transform.
		if (height === undefined && value)
		{
			height = ReactDOM.findDOMNode(this.snackbar).offsetHeight
			const anti_lag_timeout = 100 // Otherwise it would jump to fully shown in Chrome when there's a queue of snacks waiting to be shown
			this.setState({ height }, () =>
			{
				this.show_snack_timeout = setTimeout(() =>
				{
					this.show_snack_timeout = undefined
					this.setState({ show: true })
				},
				anti_lag_timeout)
			})
		}
	}

	render()
	{
		const { hideAnimationDuration, type } = this.props
		const { show, value, height, hiding } = this.state

		let y = 0

		// If no snack is being shown,
		// or if a snack is about to be shown,
		// then shift it under the screen's bottom border
		// to show the slide-from-bottom animation at the next step.
		if (!show && height !== undefined)
		{
			y = `${height}px`
		}

		const container_style =
		{
			visibility : show ? 'visible' : 'hidden',
			transform  : `translateY(${y})`,
			transition : `transform ${hideAnimationDuration}ms ease-out, visibility ${hideAnimationDuration}ms ease-out`
		}

		if (!show && !hiding)
		{
			container_style.transition = 'none'
		}

		const snackbar_text_style =
		{
			opacity    : show ? 1 : 0,
			transition : `opacity ${hideAnimationDuration}ms cubic-bezier(0.23, 1, 0.32, 1) 0ms`,
			overflow   : 'hidden'
		}

		const markup =
		(
			<div
				style={ container_style }
				className="rrui__snackbar__container">

				<div
					ref={ ref => this.snackbar = ref }
					className={ classNames('rrui__snackbar', value && value.type && `rrui__snackbar--${value.type}`) }>

					<div
						style={ snackbar_text_style }
						className="rrui__snackbar__text">
						{ value && value.content }
					</div>
				</div>
			</div>
		)

		return markup
	}
}