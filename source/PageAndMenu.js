import React, { Component } from 'react'
import PropTypes from 'prop-types'
import createContext from 'create-react-context'

export const Context = createContext()

// export const contextPropTypes = {
// 	menuIsExpanded     : PropTypes.bool.isRequired,
// 	toggleMenu         : PropTypes.func.isRequired,
// 	registerMenu       : PropTypes.func.isRequired,
// 	registerMenuButton : PropTypes.func.isRequired,
// 	setTogglerCooldown : PropTypes.func.isRequired,
// 	getTogglerNode     : PropTypes.func.isRequired
// }

export default class PageAndMenu extends Component {
	constructor() {
		super()
		// `state` is placed here to so that it's initialized
		// after all instance methods because it references them.
		this.state = {
			// Using `undefined` for `menuIsExpanded` instead of `false`
			// because menu icon uses it to determine whether
			// the button has been activated yet.
			menuIsExpanded     : undefined, // false,
			toggleMenu         : this.toggleMenu,
			registerMenu       : this.registerMenu,
			registerMenuButton : this.registerMenuButton,
			setTogglerCooldown : this.setTogglerCooldown,
			getTogglerNode     : this.getTogglerNode
		}
	}

	render() {
		const { as: Component, ...rest } = this.props;
		return (
			<Context.Provider value={this.state}>
				<Component {...rest}/>
			</Context.Provider>
		)
	}

	toggleMenu = (expand) => {
		this.menu.toggle(expand, {
			onCollapsed: () => {
				this._onDidShowMenu(false)
			},
			onExpanded: () => {
				this._onDidShowMenu(true)
			}
		})
	}

	_onDidShowMenu = (isShown) => {
		this.setState({
			menuIsExpanded: isShown
		})
		// Focus the menu when it's expanded.
		// Focus the menu button when menu is collapsed.
		if (isShown) {
			const menu = this.menu.menu()
			// If the menu element supports focus.
			// (for example, via `tabIndex={-1}`).
			if (menu && menu.focus) {
				menu.focus()
			}
		} else {
			// The menu button might get unmounted when the menu is unmounted.
			if (this.menuButton) {
				this.menuButton.element().focus()
			}
		}
	}

	registerMenu = (menu) => {
		if (this.menu) {
			throw new Error('[react-responsive-ui] There already is a menu registered for this page.')
		}
		this.menu = menu
		// Return `.unregister()`.
		return () => {
			this.menu = undefined
			this._onDidShowMenu(false)
		}
	}

	registerMenuButton = (menuButton) => {
		if (this.menuButton) {
			throw new Error('[react-responsive-ui] There already is a menu button registered for this page.')
		}
		this.menuButton = menuButton
		// Return `.unregister()`.
		return () => {
			this.menuButton = undefined
		}
	}

	setTogglerCooldown = () => this.menuButton.setCooldown()
	getTogglerNode = () => this.menuButton.element()
}

PageAndMenu.propTypes = {
	as: PropTypes.elementType.isRequired
};

PageAndMenu.defaultProps = {
	as: 'div'
};