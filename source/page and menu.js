import React, { PureComponent, PropTypes } from 'react'

import { is_reachable } from './misc/dom'

export default class Page_and_menu extends PureComponent
{
	// static propTypes =
	// {
	// 	className: PropTypes.string,
	// 	style: PropTypes.object
	// }

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

	constructor(props)
	{
		super(props)

		this.hide_menu_on_click = this.hide_menu_on_click.bind(this)
		// this.toggle_menu        = this.toggle_menu.bind(this)
		// this.update_menu_width  = this.update_menu_width.bind(this)
	}

	render()
	{
		const { children, ...rest } = this.props

		const markup =
		(
			<div
				onTouchStart={this.hide_menu_on_click}
				onMouseDown={this.hide_menu_on_click}
				{...rest}>
				{children}
			</div>
		)

		return markup
	}

	hide_menu_on_click(event)
	{
		if (!this.menu || !this.menu_button)
		{
			return
		}

		// Hide the menu if clicked outside
		if (!is_reachable(event.target, this.menu.element())
			&& !is_reachable(event.target, this.menu_button.element()))
		{
			this.menu.hide()
		}
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