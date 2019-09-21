import React from 'react'
import PropTypes from 'prop-types'

import { onBlur } from './utility/focus'

/**
 * This "component" is only used to call its
 * `.onBlur()` method manually through a `ref`.
 */
export default class OnFocusOut extends React.Component
{
	static propTypes = {
		onFocusOut: PropTypes.func.isRequired,
		getTogglerNode: PropTypes.func,
		getContainerNode: PropTypes.func.isRequired
	}

	componentWillUnmount() {
		clearTimeout(this.blurTimer)
	}

	onBlur = (event) => {
		const {
			getContainerNode,
			getTogglerNode,
			onFocusOut
		} = this.props

		if (getContainerNode()) {
			clearTimeout(this.blurTimer)
			const result = onBlur(event, onFocusOut, getContainerNode, getTogglerNode)
			if (typeof result === 'number') {
				this.blurTimer = result
			}
		}
	}

	render() {
		const { children } = this.props
		return children
	}
}