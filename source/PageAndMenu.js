import React, { Component } from 'react'
import PropTypes from 'prop-types'
import createContext from 'create-react-context'

export const Context = createContext()

// export const contextPropTypes =
// {
// 	toggleMenu         : PropTypes.func.isRequired,
// 	isMenuExpanded     : PropTypes.func.isRequired,
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

	render()
	{
		const { children, ...rest } = this.props

		return (
			<Context.Provider value={ this.getContext() }>
				<div
					onTouchStart={ this.hide_menu_on_mouse_down }
					onMouseDown={ this.hide_menu_on_mouse_down }
					{ ...rest }>
					{ children }
				</div>
			</Context.Provider>
		)
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

		this.menu.hide()
	}

	// toggle_menu()
	// {
	// 	if (!this.state.show_menu)
	// 	{
	// 		return this.setState({ show_menu: !this.state.show_menu, page_moved_aside: !this.state.page_moved_aside })
	// 	}
	//
	// 	this.setState({ show_menu: !this.state.show_menu }, () =>
	// 	{
	// 		// Requires a corresponding `clearTimeout()`` in `componentWillUnmount()``
	// 		setTimeout(() =>
	// 		{
	// 			this.setState({ page_moved_aside: this.state.show_menu })
	// 		},
	// 		menu_transition_duration)
	// 	})
	// }

	// update_menu_width(width)
	// {
	// 	this.setState({ menu_width: width })
	// }

	// The functions are bound to the React component instance.
	getContext()
	{
		return {
			toggleMenu: () => this.menu.toggle(),

			isMenuExpanded: () => this.menu && this.menu.isShown(),

			registerMenu: (menu) =>
			{
				if (this.menu) {
					throw new Error('[react-responsive-ui] There already is a menu registered for this page.')
				}

				this.menu = menu

				// Return `.unregister()`.
				return () => this.menu = undefined
			},

			registerMenuButton: (menuButton) =>
			{
				if (this.menuButton) {
					throw new Error('[react-responsive-ui] There already is a menu button registered for this page.')
				}

				this.menuButton = menuButton

				// Return `.unregister()`.
				return () => this.menuButton = undefined
			}
		}
	}
}