import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import PageAndMenu from './PageAndMenu'

export default class Menu_button extends PureComponent
{
	static propTypes =
	{
		// A URL of the "Menu" page:
		// if a web browser has javascript disabled (e.g. Tor),
		// then the menu button will redirect to this Menu page URL.
		// If not set then won't redirect anywhere.
		link        : PropTypes.string.isRequired,

		// HTML `title` attribute
		title       : PropTypes.string,

		// CSS class
		className   : PropTypes.string,

		// CSS style object
		style       : PropTypes.object
	}

	static defaultProps =
	{
		link : '#'
	}

	static contextTypes = PageAndMenu.childContextTypes

	constructor()
	{
		super()

		this.on_click = this.on_click.bind(this)
	}

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

	on_click(event)
	{
		event.preventDefault()

		const
		{
			react_responsive_ui_menu:
			{
				toggle
			}
		}
		= this.context

		toggle()
	}

	render()
	{
		const
		{
			link,
			title,
			style,
			className
		}
		= this.props

		const markup =
		(
			<a
				ref={ ref => this.button = ref }
				href={ link }
				onClick={ this.on_click }
				title={ title }
				className={ classNames('rrui__slideout-menu-button', className) }
				style={ style }>

				<svg
					className="rrui__slideout-menu-button__icon"
					viewBox={ svg_canvas_dimensions }>

					<path
						d={ svg_path }
						className="rrui__slideout-menu-button__icon-path"/>
				</svg>
			</a>
		)

		return markup
	}
}

// "Hamburger" icon (24x24)
const svg_canvas_dimensions = "0 0 24 24"
const svg_path = "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"