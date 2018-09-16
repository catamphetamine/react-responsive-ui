import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

// Sits at the bottom of a page and displays notifications
export default class Snackbar extends PureComponent
{
	static propTypes =
	{
		// Snackbar value (either a message, or an object)
		value : PropTypes.shape
		({
			// Notification content.
			content : PropTypes.oneOfType
			([
				PropTypes.string,
				PropTypes.node
			]),

			// Instead of `content` property one may supply `component` property
			// which must be a React component which receives all "rest" `value` properties
			// and also `hide`property (a function that hides the notification).
			component : PropTypes.func,

			// `props` are passed to `component`.
			props : PropTypes.object,

			// If `content` is a `string` then its `length` is calculated automatically.
			// Otherwise one may pass `length` manually.
			// It's used for calculating notification `duration`.
			length : PropTypes.number,

			// `type` is appended as a BEM modifier to `.rrui__snackbar` CSS class.
			// E.g. `.rrui__snackbar--error` for `{ type: "error" }`.
			type : PropTypes.string,

			// How long does the notification stay.
			// Pass `-1` for it to stay until it's closed manually.
			duration : PropTypes.number
		}),

		// // "Snack" showing CSS animation duration.
		// // Is 225 milliseconds by default.
		// showAnimationDuration : PropTypes.number.isRequired,

		// "Snack" hiding CSS animation duration.
		// Is 195 milliseconds by default.
		hideAnimationDuration : PropTypes.number.isRequired,

		// The total display duration (in milliseconds) of a snack
		// is `minTime + message.length * lengthTimeFactor`
		minTime          : PropTypes.number.isRequired,
		lengthTimeFactor : PropTypes.number.isRequired
	}

	static defaultProps =
	{
		// showAnimationDuration : 225,
		hideAnimationDuration : 195,
		minTime : 1200,
		lengthTimeFactor : 60
	}

	state =
	{
		values: []
	}

	componentWillUnmount()
	{
		clearTimeout(this.auto_hide_timer)
		clearTimeout(this.show_next_snack_timeout)
		clearTimeout(this.show_snack_timeout)
	}

	receiveNewValue(prevProps)
	{
		const { value } = this.props

		// If `value` has changed then push it to the queue.
		if (value && value !== prevProps.value)
		{
			// Add the notification to the queue
			this.push(value)
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
			minTime,
			lengthTimeFactor
		}
		= this.props

		// Get the next notification from the queue
		// (will be `undefined` if the queue is empty)
		const value = values.shift()

		// Reset the notification display
		this.setState({ value, height: undefined, wide: undefined, hiding: false })

		// If the queue is empty, then just exit
		if (!value)
		{
			return
		}

		// `state.show` will be set to `true` later,
		// when the height of the element is measured
		// (which is after it renders)

		if (value.duration === -1)
		{
			return
		}

		// The total display duration (in milliseconds) of a snack
		// is `minTime + message.length * lengthTimeFactor`
		const length = typeof value.content === 'string' ? value.content.length : value.length || 0
		const duration = value.duration || (minTime + length * lengthTimeFactor)

		// Hide the notification after it expires
		this.auto_hide_timer = setTimeout(this.hide, duration)
	}

	hide = () =>
	{
		const { hideAnimationDuration } = this.props

		// Start the hiding animation for the notification
		this.setState({ show: false, hiding: true })

		// Display the next notification
		// after the currently being hidden one
		// finishes its hiding animation.
		this.show_next_snack_timeout = setTimeout(this.next, hideAnimationDuration)
	}

	componentDidUpdate(prevProps)
	{
		let { height, value } = this.state

		// If `value` got updated then push it to the list of `values`.
		this.receiveNewValue(prevProps)

		// The notification DOM element has just been rendered
		// which means its dimensions are set by now.
		// Calculate the notification container DOM element height
		// so that the slide-from-bottom animation knows
		// its target Y-position for the CSS `translate` transform.
		if (height === undefined && value)
		{
			height = this.snackbar.offsetHeight
			const wide = this.snackbar.offsetWidth === document.documentElement.clientWidth
			const marginBottom = parseInt(getComputedStyle(this.container).marginBottom)
			const anti_lag_timeout = 100 // Otherwise it would jump to fully shown in Chrome when there's a queue of snacks waiting to be shown
			this.setState({ height, wide, marginBottom }, () =>
			{
				this.show_snack_timeout = setTimeout(() => this.setState({ show: true }), anti_lag_timeout)
			})
		}
	}

	storeContainerNode = (node) => this.container = node
	storeSnackbarNode  = (node) => this.snackbar = node

	renderContent(value)
	{
		if (value.component) {
			return value.component({ ...value.props, hide: this.hide })
		}
		return null
	}

	render()
	{
		const { type } = this.props
		const { show, value, height, wide, marginBottom, hiding } = this.state

		const container_style = {}

		if (!show)
		{
			// If no snack is being shown,
			// or if a snack is about to be shown,
			// then shift it under the screen's bottom border
			// to show the slide-from-bottom animation at the next step.
			if (height !== undefined)
			{
				container_style.transform = `translateY(${height + marginBottom}px)`
			}

			if (!hiding)
			{
				container_style.transition = 'none'
			}
		}

		return (
			<div
				ref={ this.storeContainerNode }
				style={ container_style }
				className={ classNames('rrui__snackbar__container',
				{
					'rrui__snackbar__container--hidden' : !show,
					'rrui__snackbar__container--wide' : wide
				}) }>

				<div
					ref={ this.storeSnackbarNode }
					className={ classNames('rrui__snackbar', value && value.type && `rrui__snackbar--${value.type}`) }>

					<div
						className="rrui__snackbar__text">
						{ value && (value.content !== undefined ? value.content : this.renderContent(value)) }
					</div>
				</div>
			</div>
		)
	}
}