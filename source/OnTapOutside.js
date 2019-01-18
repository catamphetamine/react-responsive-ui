import React from 'react'
import PropTypes from 'prop-types'

export default class OnTapOutside extends React.Component
{
	static propTypes = {
		onTapOutside: PropTypes.func.isRequired,
		getTogglerNode: PropTypes.func,
		getContainerNode: PropTypes.func.isRequired,
		moveThreshold: PropTypes.number.isRequired
	}

	static defaultProps = {
		moveThreshold: 5
	}

	listenToTouches()
	{
		document.addEventListener('touchstart', this.onTouchStart)
		document.addEventListener('touchmove', this.onTouchMove)
		document.addEventListener('touchend', this.onTouchEnd)
		document.addEventListener('touchcancel', this.onTouchCancel)
	}

	stopListeningToTouches()
	{
		document.removeEventListener('touchstart', this.onTouchStart)
		document.removeEventListener('touchmove', this.onTouchMove)
		document.removeEventListener('touchend', this.onTouchEnd)
		document.removeEventListener('touchcancel', this.onTouchCancel)
	}

	componentWillUnmount()
	{
		this.stopListeningToTouches()
	}

	onTouchStart = (event) =>
	{
		// Ignore multitouch.
		if (event.touches.length > 1)
		{
			// Reset.
			return this.onTouchCancel()
		}

		this.initialTouchX = event.changedTouches[0].clientX
		this.initialTouchY = event.changedTouches[0].clientY
		this.tapping = true
	}

	onTouchMove = (event) =>
	{
		const { moveThreshold } = this.props

		// Ignore multitouch.
		if (!this.tapping) {
			return
		}

		const deltaX = Math.abs(event.changedTouches[0].clientX - this.initialTouchX)
		const deltaY = Math.abs(event.changedTouches[0].clientY - this.initialTouchY)

		if (deltaX > moveThreshold || deltaY > moveThreshold)
		{
			// Reset.
			this.onTouchCancel()
		}
	}

	onTouchEnd = (event) =>
	{
		// Ignore multitouch.
		if (!this.tapping) {
			return
		}

		// Reset.
		this.onTouchCancel()

		this.onTap(event)
	}

	onTouchCancel = () =>
	{
		this.initialTouchX = undefined
		this.initialTouchY = undefined
		this.tapping = false
	}

	// On mobile devices "blur" event isn't triggered
	// when a user taps outside. This is to allow touch scrolling
	// while not losing focus on an input field or a button.
	// Adding a manual "on click" listener to emulate
	// "on blur" event when user taps outside (to collapse the expandable).
	onTap = (event) =>
	{
		const { getContainerNode, getTogglerNode, onTapOutside } = this.props

		if (getContainerNode().contains(event.target)) {
			return
		}

		if (getTogglerNode) {
			if (getTogglerNode().contains(event.target)) {
				return
			}
		}

		if (onTapOutside) {
			this.focusOut = true
			onTapOutside(event)
			this.focusOut = undefined
		}
	}

	render() {
		const { children } = this.props
		return children
	}
}