import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import Page_and_menu from './page and menu'

// A slideout menu
export default class Menu extends PureComponent
{
	static propTypes =
	{
		// CSS style object
		style : PropTypes.object,

		// CSS class
		className : PropTypes.string
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

		// if (!slideout)
		// {
		// 	return
		// }

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
	// 		// Requires a corresponding `clearTimeout()`` in `componentWillUnmount()``
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
		// const { slideout } = this.props

		// if (!slideout)
		// {
		// 	return
		// }

		this.unregister()

		if (this.unlisten_history)
		{
			this.unlisten_history()
		}
	}

	render()
	{
		const { className, style, children } = this.props
		const { show } = this.state

		const markup =
		(
			<div
				ref={ ref => this.menu = ref }
				className={ classNames('rrui__slideout-menu',
				{
					'rrui__slideout-menu--shown': show
				},
				className) }
				style={ style }>
				{ children }
			</div>
		)

		return markup
	}

	// calculate_width()
	// {
	// 	const dom_node = ReactDOM.findDOMNode(this.menu)
	// 	this.props.updateWidth(dom_node.offsetWidth)
	// }
}