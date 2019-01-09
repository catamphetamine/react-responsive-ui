import React from 'react'
import classNames from 'classnames'

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