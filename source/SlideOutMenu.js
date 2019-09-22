import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import createRef from 'react-create-ref'
import createContext from 'create-react-context'

import { Context as PageAndMenuContext } from './PageAndMenu'
import OnFocusOutOrTapOutside from './OnFocusOutOrTapOutside'

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
						toggleMenu={context.toggleMenu}
						setTogglerCooldown={context.setTogglerCooldown}
						getTogglerNode={context.getTogglerNode}/>
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

		toggleMenu: PropTypes.func.isRequired,
		registerMenu: PropTypes.func.isRequired,
		setTogglerCooldown: PropTypes.func.isRequired,
		getTogglerNode: PropTypes.func.isRequired,

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
		// Should not be `undefined` because it's compared to
		// `show` argument in `.toggle(show)`.
		show: false
	}

	container = createRef()
	onFocusOutRef = createRef()

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

	componentWillUnmount() {
		this.unregister()
		// window.removeEventListener('popstate', this.hide)
	}

	toggle = (show, onAfterToggle) => {
		const { onCollapse, onExpand } = this.props
		if (show === this.state.show) {
			return
		}
		if (show === undefined) {
			show = !this.state.show
		}
		if (show) {
			this.onFocusOutRef.current.listenToTouches()
			onExpand && onExpand()
		} else {
			this.onFocusOutRef.current.stopListeningToTouches()
			onCollapse && onCollapse()
		}
		this.setState({ show }, onAfterToggle)
	}

	hide = () => {
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

	// Hide the menu on focus out.
	onFocusOut = () => {
		const { toggleMenu, setTogglerCooldown } = this.props
		// `window.rruiCollapseOnFocusOut` can be used
		// for debugging expandable contents.
		if (window.rruiCollapseOnFocusOut !== false) {
			toggleMenu(false)
			setTogglerCooldown()
		}
	}

	getContainerNode = () => this.container.current

	render()
	{
		const {
			anchor,
			fullscreen,
			getTogglerNode,
			className,
			children,
			// rest
			menuRef,
			onExpand,
			onCollapse,
			toggleMenu,
			registerMenu,
			...rest
		} = this.props

		const { show } = this.state

		// ARIA menu notes:
		// https://www.w3.org/TR/wai-aria-practices/examples/menu-button/menu-button-links.html

		// `tabIndex="-1"` is for calling `this.container.current.focus()`
		// when no `menuRef` is supplied.

		// `<OnFocusOutOrTapOutside/>` sets `onBlur` on the `<div/>`.
		return (
			<OnFocusOutOrTapOutside
				ref={this.onFocusOutRef}
				getContainerNode={this.getContainerNode}
				getTogglerNode={getTogglerNode}
				onFocusOut={this.onFocusOut}
				listenToTouches={false}>
				<div
					{ ...rest }
					ref={ this.container }
					aria-hidden={ !show }
					tabIndex={ -1 }
					onKeyDown={ this.onKeyDown }
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
			</OnFocusOutOrTapOutside>
		)
	}
}