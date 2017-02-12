import React, { PureComponent, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import styler from 'react-styling'
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
		history : PropTypes.object, // .isRequired, // `react-router` may not be used at all
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
			history,
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

		if (history)
		{
			// Hide slideout menu on navigation
			this.unlisten_history = history.listen((location) =>
			{
				if (show)
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

		let menu_style = styles.slideout

		if (show)
		{
			menu_style = { ...menu_style, ...styles.slideout_shown }
		}

		if (style)
		{
			menu_style = { ...menu_style, ...style }
		}

		const markup =
		(
			<ul
				ref={ ref => this.menu = ref }
				className={ classNames('rrui__slideout-menu', className,
				{
					'rrui__slideout-menu--shown': show
				}) }
				style={ menu_style }>
				{ this.render_menu_items() }
			</ul>
		)

		return markup
	}

	render_menu_items()
	{
		const { items } = this.props

		return items.map((item, i) => (
			<li key={ i } style={ styles.menu_item }>
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

function React_router_link({ to, children })
{
	const properties =
	{
		style     : styles.menu_item_link,
		className : 'rrui__menu__item'
	}

	// Inner links get rendered via `react-router` `<Link/>`s
	if (to && to[0] === '/')
	{
		const markup =
		(
			<Link
				to={ to }
				activeClassName="rrui__menu__item--selected"
				{ ...properties }>
				{ children }
			</Link>
		)

		return markup
	}

	const markup =
	(
		<a href={ to } { ...properties }>
			{ children }
		</a>
	)

	return markup
}

const styles = styler
`
	menu
		// Reset default <ul/> styling
		margin-top      : 0
		margin-bottom   : 0
		padding         : 0
		list-style-type : none

	menu_item_link
		display : block
		text-decoration : none

	slideout
		position : fixed
		left     : 0
		top      : 0
		bottom   : 0
		z-index  : 1
		min-height : 100%
		overflow-y : auto

		transform  : translate3d(-100%, 0, 0)
		transition : transform 120ms ease-out

	slideout_shown
		transform  : translate3d(0, 0, 0)
`