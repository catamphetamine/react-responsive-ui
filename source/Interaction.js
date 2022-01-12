import React from 'react'
import classNames from 'classnames'

// For some weird reason, in Chrome, `setTimeout()` would lag up to a second (or more) behind.
// Turns out, Chrome developers have deprecated `setTimeout()` API entirely without asking anyone.
// Replacing `setTimeout()` with `requestAnimationFrame()` can work around that Chrome bug.
// https://github.com/bvaughn/react-virtualized/issues/722
import { setTimeout, clearTimeout } from 'request-animation-frame-timeout'

/**
 * .rrui__interaction--pointer {
 *   outline: none;
 *   box-shadow: none;
 * }
 * <Interaction><input .../></Interaction>
 * <Interaction><button .../></Interaction>
 */
export default class Interaction extends React.Component {
	state = {}
	onFocus = (event) => {
		if (this.mouseInteraction || this.touchInteraction) {
			this.setState({
				pointerInteraction: true
			})
		}
	}
	onMouseDown = (event) => {
		this.mouseInteraction = true
		this.mouseTimer = setTimeout(() => this.mouseInteraction = false, 0)
	}
	onTouchEnd = (event) => {
		this.touchInteraction = true
		this.touchTimer = setTimeout(() => this.touchInteraction = false, 0)
	}
	componentWillUnmount() {
		clearTimeout(this.mouseTimer)
		clearTimeout(this.touchTimer)
	}
	render() {
		const { children } = this.props
		const { pointerInteraction } = this.state
		return React.cloneElement(children, {
			onFocus,
			onMouseDown,
			onTouchEnd,
			className: classNames(children.props.className, {
				'rrui__interaction--pointer': pointerInteraction
			})
		})
	}
}