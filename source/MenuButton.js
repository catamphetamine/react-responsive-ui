import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import { Context } from './PageAndMenu'

const _MenuButton = (props) => (
	<Context.Consumer>
		{context => <MenuButton {...props} {...context}/>}
	</Context.Consumer>
)

export default _MenuButton

class MenuButton extends PureComponent
{
	static propTypes =
	{
		// Context.
		registerMenuButton : PropTypes.func.isRequired,
		toggleMenu : PropTypes.func.isRequired,

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

	componentDidMount()
	{
		const { registerMenuButton } = this.props

		this.unregister = registerMenuButton
		({
			element : () => ReactDOM.findDOMNode(this.button)
		})
	}

	componentWillUnmount()
	{
		this.unregister()
	}

	onClick = (event) =>
	{
		event.preventDefault()

		const { toggleMenu } = this.props

		toggleMenu()
	}

	storeInstance = (ref) => this.button = ref

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

		return (
			<a
				ref={ this.storeInstance }
				href={ link }
				onClick={ this.onClick }
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
	}
}

// "Hamburger" icon (24x24)
const svg_canvas_dimensions = "0 0 24 24"
const svg_path = "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"