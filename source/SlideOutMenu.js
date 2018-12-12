import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import createRef from 'react-create-ref'
import createContext from 'create-react-context'

import { Context as PageAndMenuContext } from './PageAndMenu'

export const Context = createContext()

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

export default class ContextAwareSlideoutMenu extends PureComponent {
	slideOutMenu = createRef()
	show = () => this.slideOutMenu.current.show()
	hide = () => this.slideOutMenu.current.hide()
	render() {
		return (
			<PageAndMenuContext.Consumer>
				{context => (
					<SlideoutMenu
						ref={this.slideOutMenu}
						{...this.props}
						registerMenu={context.registerMenu}
						toggleMenu={context.toggleMenu}/>
					)
				}
			</PageAndMenuContext.Consumer>
		)
	}
}

// const ContextAwareSlideoutMenu = (props) => (
// 	<PageAndMenuContext.Consumer>
// 		{context => (
// 			<SlideoutMenu
// 				{...props}
// 				registerMenu={context.registerMenu}
// 				toggleMenu={context.toggleMenu}/>
// 			)
// 		}
// 	</PageAndMenuContext.Consumer>
// )

// export default ContextAwareSlideoutMenu

// Swipeable feature example source code:
// https://github.com/mui-org/material-ui/blob/v1-beta/packages/material-ui/src/SwipeableDrawer/SwipeableDrawer.js

// A slideout menu.
class SlideoutMenu extends PureComponent
{
	static propTypes =
	{
		anchor : PropTypes.oneOf([
			'left',
			'right',
			'top',
			'bottom'
		]).isRequired,

		// isOpen : PropTypes.bool.isRequired,

		fullscreen : PropTypes.bool.isRequired,

		// A result of `React.createRef()`.
		// Will be focused when the menu is opened.
		menuRef : PropTypes.object,

		onCollapse : PropTypes.func,
		onExpand : PropTypes.func,

		toggleMenu   : PropTypes.func.isRequired,
		registerMenu : PropTypes.func.isRequired,

		// CSS style object
		style : PropTypes.object,

		// CSS class
		className : PropTypes.string
	}

	static defaultProps =
	{
		// isOpen : false,
		anchor : 'left',
		fullscreen : false
	}

	state = {
		// show: this.props.isOpen
		show: false
	}

	container = createRef()

	componentDidMount()
	{
		const { registerMenu, menuRef } = this.props
		const { show } = this.state

		this.unregister = registerMenu
		({
			hide    : () => this.setState({ show: false }),
			toggle  : this.toggle,
			isShown : () => this.state.show,
			element : () => this.container.current,
			menu    : () => menuRef ? menuRef.current : this.container.current
		})

		// // Hide on `Back`/`Forward` navigation.
		// window.addEventListener('popstate', this.hide)
	}

	componentWillUnmount()
	{
		this.unregister()

		// window.removeEventListener('popstate', this.hide)
	}

	// componentDidUpdate(prevProps)
	// {
	// 	const { isOpen } = this.props

	// 	if (prevProps.isOpen && !isOpen) {
	// 		this.hide()
	// 	} else if (!prevProps.isOpen && isOpen) {
	// 		this.show()
	// 	}
	// }

	toggle = (callback) => {
		const { onCollapse, onExpand } = this.props
		this.setState((state) => {
			if (state.show) {
				onCollapse && onCollapse()
			} else {
				onExpand && onExpand()
			}
			return {
				show: !state.show
			}
		}, callback)
	}

	hide = () =>
	{
		const { toggleMenu } = this.props
		const { show } = this.state

		if (show) {
			toggleMenu()
		}
	}

	onKeyDown = (event) => {
		const { toggleMenu } = this.props
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}
		switch (event.keyCode) {
			// Collapse on "Escape".
			case 27:
				event.preventDefault()
				return toggleMenu()
		}
	}

	render()
	{
		const {
			anchor,
			fullscreen,
			style,
			className,
			children
		} = this.props

		const { show } = this.state

		// ARIA menu notes:
		// https://www.w3.org/TR/wai-aria-practices/examples/menu-button/menu-button-links.html

		return (
			<div
				ref={ this.container }
				aria-hidden={ !show }
				tabIndex={ -1 }
				onKeyDown={ this.onKeyDown }
				style={ style }
				className={ classNames(
					className,
					/* Developers can define custom `:focus` style for the slideout menu. */
					/* (or better add `menuRef` property pointing to a component having `.focus()` method). */
					'rrui__outline',
					'rrui__slideout-menu',
					{
						'rrui__slideout-menu--left'       : anchor === 'left',
						'rrui__slideout-menu--right'      : anchor === 'right',
						'rrui__slideout-menu--top'        : anchor === 'top',
						'rrui__slideout-menu--bottom'     : anchor === 'bottom',
						'rrui__slideout-menu--fullscreen' : fullscreen,
						'rrui__slideout-menu--expanded'   : show
					}
				) }>
				{ children }
			</div>
		)
	}
}