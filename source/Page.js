import React from 'react'

// // when adjusting this transition time also adjust it in styles/xs-m.scss
// const menu_transition_duration = 0 // 210 // milliseconds

export default function Page(props)
{
	const { children, ...rest } = props

	// Slideout menu pushes the page to the right
	// const page_style_with_menu_expanded = { transform: `translate3d(${this.state.menu_width}px, 0px, 0px)` }
	//
	// style={ this.state.show_menu ? { ...style.page, ...page_style_with_menu_expanded } : style.page }
	//
	// `translate3d` animation won't work:
	// http://stackoverflow.com/questions/14732403/position-fixed-not-working-for-header/14732712#14732712

	// style={style.page}

	const markup =
	(
		<div { ...rest }>
			{ children }
		</div>
	)

	return markup
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