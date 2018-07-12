import React, { Component } from 'react'
import PropTypes from 'prop-types'
import createContext from 'create-react-context'

export const Context = createContext()

// export const contextPropTypes =
// {
// 	menuIsExpanded     : PropTypes.bool.isRequired,
// 	toggleMenu         : PropTypes.func.isRequired,
// 	registerMenu       : PropTypes.func.isRequired,
// 	registerMenuButton : PropTypes.func.isRequired
// }

export default class PageAndMenu extends Component
{
	// state =
	// {
	// 	show_menu  : false,
	// 	menu_width : 0,
	// 	page_moved_aside : false
	// }

	constructor()
	{
		super()

		// `state` is placed here to so that it's initialized
		// after all instance methods because it references them.
		this.state =
		{
			menuIsExpanded     : false,
			toggleMenu         : this.toggleMenu,
			registerMenu       : this.registerMenu,
			registerMenuButton : this.registerMenuButton
		}
	}

	render()
	{
		return (
			<Context.Provider value={ this.state }>
				<div
					onTouchStart={ this.hide_menu_on_mouse_down }
					onMouseDown={ this.hide_menu_on_mouse_down }
					{ ...this.props }/>
			</Context.Provider>
		)
	}

	toggleMenu = () =>
	{
		this.menu.toggle(() =>
		{
			this.setState({
				menuIsExpanded : this.menu.isShown()
			})
		})
	}

	registerMenu = (menu) =>
	{
		if (this.menu) {
			throw new Error('[react-responsive-ui] There already is a menu registered for this page.')
		}

		this.menu = menu

		// Return `.unregister()`.
		return () => this.menu = undefined
	}

	registerMenuButton = (menuButton) =>
	{
		if (this.menuButton) {
			throw new Error('[react-responsive-ui] There already is a menu button registered for this page.')
		}

		this.menuButton = menuButton

		// Return `.unregister()`.
		return () => this.menuButton = undefined
	}

	hide_menu_on_mouse_down = (event) =>
	{
		if (!this.menu || !this.menuButton)
		{
			return
		}

		// Hide the menu only if clicked outside
		if (this.menu.element().contains(event.target)
		|| this.menuButton.element().contains(event.target))
		{
			return
		}

		if (this.menu.isShown()) {
			this.toggleMenu()
		}
	}
}