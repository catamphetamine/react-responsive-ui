import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Context, contextPropTypes } from './PageAndMenu'

const _Menu = (props) => (
	<Context.Consumer>
		{context => <Menu {...props} {...context}/>}
	</Context.Consumer>
)

export default _Menu

// Swipeable feature example source code:
// https://github.com/mui-org/material-ui/blob/v1-beta/packages/material-ui/src/SwipeableDrawer/SwipeableDrawer.js

// A slideout menu.
class Menu extends PureComponent
{
	static propTypes =
	{
		// Context.
		...contextPropTypes,

		// CSS style object
		style : PropTypes.object,

		// CSS class
		className : PropTypes.string
	}

	state = { show: false }

	componentDidMount()
	{
		const { registerMenu } = this.props
		const { show } = this.state

		// if (!slideout)
		// {
		// 	return
		// }

		this.unregister = registerMenu
		({
			hide    : () => this.setState({ show: false }),
			toggle  : (callback) => this.setState(state => ({ show: !state.show }), callback),
			isShown : () => this.state.show,
			element : () => this.menu
		})

		// Listen to `pushstate` and `popstate` events (navigation).
		window.addEventListener('pushstate', this.hide)
		window.addEventListener('popstate', this.hide)

		// this.calculate_width()
	}

	// componentDidUpdate(previous_props, previous_state)
	// {
	// 	// On menu toggle
	// 	if (this.state.show !== previous_state.show)
	// 	{
	// 		// Requires a corresponding `clearTimeout()`` in `componentWillUnmount()``
	// 		setTimeout(() =>
	// 		{
	// 			this.setState({ page_moved_aside: this.state.show })
	// 		},
	// 		menu_transition_duration)
	//
	// 		this.calculate_width()
	// 	}
	// }

	componentWillUnmount()
	{
		// const { slideout } = this.props

		// if (!slideout)
		// {
		// 	return
		// }

		this.unregister()

		// Listen to `pushstate` and `popstate` events (navigation).
		window.removeEventListener('pushstate', this.hide)
		window.removeEventListener('popstate', this.hide)
	}

	hide = () =>
	{
		const { toggleMenu } = this.props
		const { show } = this.state

		if (show) {
			toggleMenu()
		}
	}

	storeInstance = (ref) => this.menu = ref

	render()
	{
		const { className, style, children } = this.props
		const { show } = this.state

		return (
			<div
				ref={ this.storeInstance }
				className={ classNames('rrui__slideout-menu',
				{
					'rrui__slideout-menu--expanded': show
				},
				className) }
				style={ style }>
				{ children }
			</div>
		)
	}

	// calculate_width()
	// {
	// 	this.props.updateWidth(this.menu.offsetWidth)
	// }
}