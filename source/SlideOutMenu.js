import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Context } from './PageAndMenu'

const ContextAwareSlideoutMenu = (props) => (
	<Context.Consumer>
		{context => (
			<SlideoutMenu
				{...props}
				registerMenu={context.registerMenu}
				toggleMenu={context.toggleMenu}/>
			)
		}
	</Context.Consumer>
)

export default ContextAwareSlideoutMenu

// Swipeable feature example source code:
// https://github.com/mui-org/material-ui/blob/v1-beta/packages/material-ui/src/SwipeableDrawer/SwipeableDrawer.js

// A slideout menu.
class SlideoutMenu extends PureComponent
{
	static propTypes =
	{
		toggleMenu   : PropTypes.func.isRequired,
		registerMenu : PropTypes.func.isRequired,

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
	}

	componentWillUnmount()
	{
		this.unregister()

		// Stop listening to `pushstate` and `popstate` events (navigation).
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
}