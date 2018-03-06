import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class PageAndMenu extends Component
{
	static childContextTypes =
	{
		react_responsive_ui_menu : PropTypes.shape
		({
			toggle   : PropTypes.func.isRequired,
			register : PropTypes.func.isRequired
		})
		.isRequired
	}

	// state =
	// {
	// 	show_menu  : false,
	// 	menu_width : 0,
	// 	page_moved_aside : false
	// }

	constructor()
	{
		super()

		this.hide_menu_on_mouse_down = this.hide_menu_on_mouse_down.bind(this)
		// this.toggle_menu        = this.toggle_menu.bind(this)
		// this.update_menu_width  = this.update_menu_width.bind(this)
	}

	render()
	{
		const { children, ...rest } = this.props

		return (
			<div
				onTouchStart={ this.hide_menu_on_mouse_down }
				onMouseDown={ this.hide_menu_on_mouse_down }
				{ ...rest }>
				{ children }
			</div>
		)
	}

	hide_menu_on_mouse_down(event)
	{
		if (!this.menu || !this.menu_button)
		{
			return
		}

		// Hide the menu only if clicked outside
		if (this.menu.element().contains(event.target)
			|| this.menu_button.element().contains(event.target))
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

	getChildContext()
	{
		const context =
		{
			react_responsive_ui_menu:
			{
				toggle : () => this.menu.toggle(),

				register: (menu) =>
				{
					if (this.menu)
					{
						throw new Error('There already is a menu registered for this page')
					}

					this.menu = menu

					return () => this.menu = undefined
				},

				register_menu_button: (menu_button) =>
				{
					if (this.menu_button)
					{
						throw new Error('There already is a menu button registered for this page')
					}

					this.menu_button = menu_button

					return () => this.menu_button = undefined
				}
			}
		}

		return context
	}
}