import React from 'react'
import PropTypes from 'prop-types'
import createRef from 'react-create-ref'

import OnFocusOut from './OnFocusOut'
import OnTapOutside from './OnTapOutside'

/**
 * `<OnFocusOutOrTapOutside/>` sets `onBlur` on the child element.
 * Calls `onFocusOut` on focus out or tap outside.
 */
export default class OnFocusOutOrTapOutside extends React.Component {
	onFocusOutRef = createRef()
	onTapOutsideRef = createRef()

	componentWillUnmount() {
		clearTimeout(this.onTapOutsideTimer)
	}

	// These're called from outside in `<Expandable/>`.
	stopListeningToTouches = () => this.onTapOutsideRef.current.stopListeningToTouches()
	listenToTouches = () => this.onTapOutsideRef.current.listenToTouches()
	onBlur = (event) => this.onFocusOutRef.current.onBlur(event)

	onFocusOut = (event) => {
		// `onFocusOut` is triggered right after `onTapOutside`.
		// This workaround prevents duplicate `onFocusOut` call.
		if (this.onTapOutsideTimer) {
			clearTimeout(this.onTapOutsideTimer)
			this.onTapOutsideTimer = undefined
		}
		this.onBlur(event)
	}

	onBlur = (event) => {
		const { onFocusOut } = this.props
		onFocusOut(event)
	}

	onTapOutside = (event) => {
		const { onTapOutsideDelay } = this.props
		clearTimeout(this.onTapOutsideTimer)
		this.onTapOutsideTimer = setTimeout(() => {
			// `onFocusOut` is triggered right after `onTapOutside`.
			// This workaround prevents duplicate `onFocusOut` call.
			if (this.onTapOutsideTimer) {
				this.onTapOutsideTimer = undefined
				this.onBlur(event)
			}
		}, onTapOutsideDelay)
	}

	render() {
		const { getTogglerNode, getContainerNode } = this.props
		let { children } = this.props

		children = React.cloneElement(children, {
			onBlur: this.onFocusOutRef.current && this.onFocusOutRef.current.onBlur
		})

		children = (
			<OnFocusOut
				ref={this.onFocusOutRef}
				getContainerNode={getContainerNode}
				getTogglerNode={getTogglerNode}
				onFocusOut={this.onFocusOut}>
				{children}
			</OnFocusOut>
		)

		return (
			<OnTapOutside
				ref={this.onTapOutsideRef}
				getContainerNode={getContainerNode}
				getTogglerNode={getTogglerNode}
				onTapOutside={this.onTapOutside}>
				{children}
			</OnTapOutside>
		)
	}
}

OnFocusOutOrTapOutside.propTypes = {
	getContainerNode: PropTypes.func.isRequired,
	getTogglerNode: PropTypes.func.isRequired,
	onFocusOut: PropTypes.func.isRequired,
	onTapOutsideDelay: PropTypes.number.isRequired,
	children: PropTypes.node.isRequired
}

OnFocusOutOrTapOutside.defaultProps = {
	// `onFocusOut` is triggered right after `onTapOutside`.
	// This workaround prevents duplicate `onFocusOut` call.
	onTapOutsideDelay: 30
}