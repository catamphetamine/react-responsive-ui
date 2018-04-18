import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import PageAndMenu from './PageAndMenu'

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
		...PageAndMenu.childContextTypes
	}

	state =
	{
		show: false
	}

	componentDidMount()
	{
		const
		{
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

		this.unregister = register
		({
			hide    : () => this.setState({ show: false }),
			toggle  : () => this.setState(state => ({ show: !state.show })),
			element : () => ReactDOM.findDOMNode(this.menu)
		})

		// Listen to `pushstate` and `popstate` events (navigation).
		window.addEventListener('pushstate', this.hide)
		window.addEventListener('popstate', this.hide)

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

		// Listen to `pushstate` and `popstate` events (navigation).
		window.removeEventListener('pushstate', this.hide)
		window.removeEventListener('popstate', this.hide)
	}

	hide = () =>
	{
		const
		{
			react_responsive_ui_menu:
			{
				toggle
			}
		}
		= this.context

		const { show } = this.state

		if (show) {
			toggle()
		}
	}

	render()
	{
		const { className, style, children } = this.props
		const { show } = this.state

		return (
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
	}

	// calculate_width()
	// {
	// 	const dom_node = ReactDOM.findDOMNode(this.menu)
	// 	this.props.updateWidth(dom_node.offsetWidth)
	// }
}