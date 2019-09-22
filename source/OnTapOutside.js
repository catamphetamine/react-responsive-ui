import React from 'react'
import PropTypes from 'prop-types'

/**
 * This "component" is only used to call its
 * `.listenToTouches()` and `.stopListeningToTouches()`
 * methods manually through a `ref`.
 */
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

	onTouchStart = (event) => {
		// Ignore multitouch.
		if (event.touches.length > 1) {
			// Reset.
			return this.onTouchCancel()
		}
		const touch = event.changedTouches[0]
		this.initialTouchX = touch.clientX
		this.initialTouchY = touch.clientY
		this.touchId = touch.identifier
		this.tapping = true
	}

	onTouchMove = (event) =>
	{
		const { moveThreshold } = this.props

		if (!this.tapping) {
			return
		}

		let x
		let y
		for (const touch of event.changedTouches) {
			if (touch.identifier === this.touchId) {
				x = touch.clientX
				y = touch.clientY
				break
			}
		}

		// If not the touch.
		if (x === undefined) {
			return
		}

		const deltaX = Math.abs(x - this.initialTouchX)
		const deltaY = Math.abs(y - this.initialTouchY)

		// Reset on touch move.
		if (deltaX > moveThreshold || deltaY > moveThreshold) {
			this.onTouchCancel()
		}
	}

	onTouchEnd = (event) =>
	{
		if (!this.tapping) {
			return
		}

		for (const touch of event.changedTouches) {
			if (touch.identifier === this.touchId) {
				// Reset.
				this.onTouchCancel()
				// Handle the tap.
				// https://developer.mozilla.org/en-US/docs/Web/API/Touch
				this.onTap(event, touch.target)
				break
			}
		}
	}

	onTouchCancel = () =>
	{
		this.initialTouchX = undefined
		this.initialTouchY = undefined
		this.touchId = undefined
		this.tapping = false
	}

	// On mobile devices "blur" event isn't triggered
	// when a user taps outside. This is to allow touch scrolling
	// while not losing focus on an input field or a button.
	// Adding a manual "on click" listener to emulate
	// "on blur" event when user taps outside (to collapse the expandable).
	onTap = (event, target) =>
	{
		const {
			getContainerNode,
			getTogglerNode,
			onTapOutside
		} = this.props

		if (getContainerNode().contains(target)) {
			return
		}

		if (getTogglerNode) {
			if (getTogglerNode().contains(target)) {
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