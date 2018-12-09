import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Context } from './PageAndMenu'
import MenuIcon from './MenuIcon'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

const ContextAwareMenuButton = (props) => (
	<Context.Consumer>
		{(context) => (
			<MenuButton
				{...props}
				registerMenuButton={context.registerMenuButton}
				toggleMenu={context.toggleMenu}
				menuIsExpanded={context.menuIsExpanded}/>
		)}
	</Context.Consumer>
)

export default ContextAwareMenuButton

class MenuButton extends PureComponent
{
	static propTypes =
	{
		// Context.
		registerMenuButton : PropTypes.func.isRequired,
		toggleMenu : PropTypes.func.isRequired,
		menuIsExpanded : PropTypes.bool, //.isRequired,

		// A URL of the "Menu" page:
		// if a web browser has javascript disabled (e.g. Tor),
		// then the menu button will redirect to this Menu page URL.
		// If not set then won't redirect anywhere.
		link        : PropTypes.string,

		// HTML `title` attribute.
		title       : PropTypes.string,

		// Menu button icon component.
		icon        : PropTypes.func.isRequired,

		// `aria-label`.
		label       : PropTypes.string.isRequired,

		// CSS class.
		className   : PropTypes.string,

		// CSS style object.
		style       : PropTypes.object
	}

	static defaultProps =
	{
		icon : MenuIcon,
		label : 'Menu'
	}

	componentDidMount()
	{
		const { registerMenuButton } = this.props

		this.unregister = registerMenuButton({
			element : () => this.button
		})
	}

	componentWillUnmount()
	{
		this.unregister()
	}

	onClick = (event) =>
	{
		const { toggleMenu } = this.props
		event.preventDefault()
		toggleMenu()
	}

	storeButtonNode = (node) => this.button = node

	render()
	{
		const
		{
			link,
			label,
			className,
			icon : MenuButtonIcon,
			menuIsExpanded,

			// Getting "rest" properties.
			toggleMenu,
			registerMenuButton,
			...rest
		}
		= this.props

		const properties = {
			...rest,
			ref: this.storeButtonNode,
			onClick: this.onClick,
			'aria-label': label,
			'aria-haspopup': 'menu',
			'aria-expanded': menuIsExpanded,
			className: classNames('rrui__button-reset', 'rrui__menu-button', className)
		}

		const children = <MenuButtonIcon expanded={menuIsExpanded}/>

		// A link.
		if (link) {
			return React.createElement(
				'a',
				{
					...properties,
					href: link
				},
				children
			)
		}

		// A button.
		return React.createElement(
			'button',
			{
				...properties,
				type: 'button'
			},
			children
		)
	}
}