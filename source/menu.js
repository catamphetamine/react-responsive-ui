import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import styler from 'react-styling/flat'
import classNames from 'classnames'

// `react-router` must be installed in order for this component to work.
// Even though menu items may be not `react-router` `Link`s but any React elements.
// Maybe could be somehow refactored, or maybe not.
import { Link } from 'react-router'

import Page_and_menu from './page and menu'

// A slideout menu
export default class Menu extends Component
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

		// If `true`, then the menu is made a "slideout" one
		// (i.e. the usual "hamburger" button menu)
		slideout : PropTypes.bool
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

	constructor(props)
	{
		super(props)

		// this.document_clicked = this.document_clicked.bind(this)
	}

	componentDidMount()
	{
		const { slideout } = this.props

		if (!slideout)
		{
			return
		}

		if (this.context.history)
		{
			// Hide slideout menu on navigation
			this.unlisten_history = this.context.history.listen((location) =>
			{
				if (this.state.show)
				{
					this.context.react_responsive_ui_menu.toggle()
				}
			})
		}

		this.unregister = this.context.react_responsive_ui_menu.register
		({
			hide    : () => this.setState({ show: false }),
			toggle  : () => this.setState({ show: !this.state.show }),
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
		if (!this.props.slideout)
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
		const { slideout } = this.props
		const { show } = this.state

		if (!slideout)
		{
			const markup =
			(
				<ul className="rrui__menu" style={menu_style}>
					{this.render_menu_items()}
				</ul>
			)

			return markup
		}

		let menu_style = style.slideout

		if (show)
		{
			menu_style = { ...menu_style, ...style.slideout_shown }
		}

		if (this.props.style)
		{
			menu_style = { ...menu_style, ...this.props.style }
		}

		const markup =
		(
			<ul
				ref={ref => this.menu = ref}
				className={classNames('rrui__slideout-menu',
				{
					'rrui__slideout-menu--shown': show
				})}
				style={menu_style}>
				{this.render_menu_items()}
			</ul>
		)

		return markup
	}

	render_menu_items()
	{
		const { items } = this.props

		return items.map((item, i) => (
			<li key={i} style={style.menu_item}>
				{this.render_menu_link(item)}
			</li>
		))
	}

	render_menu_link(item)
	{
		// if (React.isValidElement(item))
		// {
		// 	return React.cloneElement(item,
		// 	{
		// 		className : classNames(item.props.className, 'rrui__menu__item'),
		// 		style     : item.props.style ? { ...style.menu_item_link, ...item.props.style } : style.menu_item_link
		// 	})
		// }

		// Inner links get rendered via `react-router` `<Link/>`s
		if (item.link[0] === '/')
		{
			const markup =
			(
				<Link
					to={item.link}
					style={style.menu_item_link}
					className="rrui__menu__item"
					activeClassName="rrui__menu__item--selected">
					{item.name}
				</Link>
			)

			return markup
		}

		const markup =
		(
			<a
				href={item.link}
				style={style.menu_item_link}
				className="rrui__menu__item">
				{item.name}
			</a>
		)

		return markup
	}

	// calculate_width()
	// {
	// 	const dom_node = ReactDOM.findDOMNode(this.menu)
	// 	this.props.updateWidth(dom_node.offsetWidth)
	// }
}

const style = styler
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
		display: inline-block

		min-height: 100%

		position : fixed
		left     : 0
		top      : 0
		bottom   : 0
		z-index  : 1

		overflow-y: auto

		opacity    : 0.9
		transform  : translate3d(-100%, 0, 0)
		transition : transform 120ms ease-out

	slideout_shown
		transform  : translate3d(0, 0, 0)
		box-shadow : 0 0 0.2em rgba(0, 0, 0, 0.4)
`