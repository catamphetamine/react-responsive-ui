import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Context, contextPropTypes } from './PageAndMenu'

const _Page = (props) => (
	<Context.Consumer>
		{context => <Page {...props} menuIsExpanded={context.menuIsExpanded}/>}
	</Context.Consumer>
)

export default _Page

// // when adjusting this transition time also adjust it in styles/xs-m.scss
// const menu_transition_duration = 0 // 210 // milliseconds

class Page extends Component
{
	static propTypes =
	{
		...contextPropTypes
	}

	render()
	{
		const
		{
			menuIsExpanded,
			// children,
			// className,
			...rest
		}
		= this.props

		// className={ classNames(className,
		// {
		// 	'rrui__page--menu-overlay' : menuIsExpanded
		// }) }>

		// Slideout menu pushes the page to the right
		// const page_style_with_menu_expanded = { transform: `translate3d(${this.state.menu_width}px, 0px, 0px)` }
		//
		// style={ this.state.show_menu ? { ...style.page, ...page_style_with_menu_expanded } : style.page }
		//
		// `translate3d` animation won't work:
		// http://stackoverflow.com/questions/14732403/position-fixed-not-working-for-header/14732712#14732712

		// style={style.page}

		return (
			<div { ...rest }/>
		)
	}
}

// const style =
// {
// 	page:
// 	{
// 		position : relative
// 		z-index  : 0
// 		transition-duration : ${menu_transition_duration}ms
// 	}
// }