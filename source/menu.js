import React, { PureComponent, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

// Either provide custom `itemComponent` or `react-router`'s `<Link/>` is used by default
import { Link } from 'react-router'

import Page_and_menu from './page and menu'

// A slideout menu
export default class Menu extends PureComponent
{
	static propTypes =
	{
		// Menu items
		items : PropTypes.arrayOf(PropTypes.shape
		({
			// Menu item title
			name : PropTypes.string.isRequired,
			// Menu item redirect URL
			link : PropTypes.string.isRequired
		}))
		.isRequired,

		// Is `<Link/>` by default
		itemComponent : PropTypes.func.isRequired,

		// If `true`, then the menu is made a "slideout" one
		// (i.e. the usual "hamburger" button menu)
		slideout : PropTypes.bool,

		// CSS style object
		style : PropTypes.object,

		// CSS class
		className : PropTypes.string
	}

	static defaultProps =
	{
		// Is `<Link/>` by default
		itemComponent : React_router_link
	}

	static contextTypes =
	{
		router : PropTypes.object, // .isRequired, // `react-router` may not be used at all
		...Page_and_menu.childContextTypes
	}

	state =
	{
		show: false
	}

	componentDidMount()
	{
		const { slideout } = this.props

		const
		{
			router,
			react_responsive_ui_menu:
			{
				register,
				toggle
			}
		}
		= this.context

		const { show } = this.state

		if (!slideout)
		{
			return
		}

		// If `react-router` is being used
		if (router)
		{
			// Hide slideout menu on navigation
			this.unlisten_history = router.listen((location) =>
			{
				if (this.state.show)
				{
					toggle()
				}
			})
		}

		this.unregister = register
		({
			hide    : () => this.setState({ show: false }),
			toggle  : () => this.setState(state => ({ show: !state.show })),
			element : () => ReactDOM.findDOMNode(this.menu)
		})

		// this.calculate_width()
	}

	// componentDidUpdate(previous_props, previous_state)
	// {
	// 	// On menu toggle
	// 	if (this.state.show !== previous_state.show)
	// 	{
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
		const { slideout } = this.props

		if (!slideout)
		{
			return
		}

		this.unregister()

		if (this.unlisten_history)
		{
			this.unlisten_history()
		}
	}

	render()
	{
		const { slideout, style, className } = this.props
		const { show } = this.state

		if (!slideout)
		{
			const markup =
			(
				<ul className="rrui__menu" style={ style }>
					{ this.render_menu_items() }
				</ul>
			)

			return markup
		}

		const markup =
		(
			<ul
				ref={ ref => this.menu = ref }
				className={ classNames('rrui__slideout-menu',
				{
					'rrui__slideout-menu--shown': show
				},
				className) }
				style={ style }>
				{ this.render_menu_items(true) }
			</ul>
		)

		return markup
	}

	render_menu_items(slideout)
	{
		const { items } = this.props

		return items.map((item, i) => (
			<li
				key={ i }
				className={ classNames('rrui__menu-list-item',
				{
					'rrui__slideout-menu-list-item' : slideout
				},
				item.className) }>
				{ this.render_menu_link(item) }
			</li>
		))
	}

	render_menu_link(item)
	{
		const { itemComponent } = this.props
		const Component = itemComponent
		return <Component to={ item.link }>{ item.name }</Component>
	}

	// calculate_width()
	// {
	// 	const dom_node = ReactDOM.findDOMNode(this.menu)
	// 	this.props.updateWidth(dom_node.offsetWidth)
	// }
}

function React_router_link({ to, children, linkClassName })
{
	// Inner links get rendered via `react-router` `<Link/>`s
	if (to && to[0] === '/')
	{
		const markup =
		(
			<Link
				to={ to }
				className={ classNames('rrui__menu__item', linkClassName) }
				activeClassName="rrui__menu__item--selected">
				{ children }
			</Link>
		)

		return markup
	}

	const markup =
	(
		<a
			href={ to }
			className="rrui__menu__item">
			{ children }
		</a>
	)

	return markup
}