import React, { PureComponent, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import styler from 'react-styling/flat'
import classNames from 'classnames'

import Page_and_menu from './page and menu'
import Button from './button'

export default class Menu_button extends PureComponent
{
	static propTypes =
	{
		// A URL of the "Menu" page:
		// if a web browser has javascript disabled (e.g. Tor),
		// then the menu button will redirect to this Menu page URL.
		// If not set then won't redirect anywhere.
		link        : PropTypes.string,

		// HTML `title` attribute
		title       : PropTypes.string,

		// CSS class
		className   : PropTypes.string,

		// CSS style object
		style       : PropTypes.object,

		// CSS style object for the button
		buttonStyle : PropTypes.object
	}

	static contextTypes = Page_and_menu.childContextTypes

	componentDidMount()
	{
		this.unregister = this.context.react_responsive_ui_menu.register_menu_button
		({
			element : () => ReactDOM.findDOMNode(this.button)
		})
	}

	componentWillUnmount()
	{
		this.unregister()
	}

	render()
	{
		const { link, title, style, buttonStyle, className } = this.props

		// "Hamburger" icon (24x24)
		const svg_path = "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"

		const markup =
		(
			<Button
				ref={ref => this.button = ref}
				link={link}
				action={this.context.react_responsive_ui_menu.toggle}
				title={title}
				className={classNames('rrui__slideout-menu-button', className)}
				style={style}
				buttonStyle={buttonStyle}>
				{/*<div className="menu-icon"/>*/}
				<svg className="rrui__slideout-menu-button__icon" viewBox="0 0 24 24">
					<path d={svg_path}/>
				</svg>
			</Button>
		)

		return markup
	}
}