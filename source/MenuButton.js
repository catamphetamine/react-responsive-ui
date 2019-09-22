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

class MenuButton extends PureComponent {
	static propTypes = {
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

		// CSS class.
		className   : PropTypes.string,

		// CSS style object.
		style       : PropTypes.object
	}

	static defaultProps = {
		icon : MenuIcon
	}

	componentDidMount() {
		const { registerMenuButton } = this.props
		this.unregister = registerMenuButton({
			element: () => this.button,
			setCooldown: this.setCooldown
		})
	}

	componentWillUnmount() {
		this.unregister()
		clearTimeout(this.cooldownTimer)
	}

	onClick = (event) => {
		event.preventDefault()
		const { toggleMenu } = this.props
		// A workaround for Safari (both macOS and iOS) bug: `<button/>`s not getting focus.
		// https://stackoverflow.com/questions/20359962/jquery-mobile-focusout-event-for-relatedtarget-returns-incorrect-result-in-safar
		if (!this.cooldown) {
			toggleMenu()
		}
	}

	setCooldown = () => {
		// A workaround for Safari (both macOS and iOS) bug: `<button/>`s not getting focus.
		// https://stackoverflow.com/questions/20359962/jquery-mobile-focusout-event-for-relatedtarget-returns-incorrect-result-in-safar
		// Sets a small "cooldown" on hide on focus out.
		this.cooldown = true
		this.cooldownTimer = setTimeout(() => this.cooldown = false, 30)
	}

	storeButtonNode = (node) => this.button = node

	render() {
		const {
			link,
			className,
			icon: MenuButtonIcon,
			menuIsExpanded,

			// Getting "rest" properties.
			toggleMenu,
			registerMenuButton,
			...rest
		} = this.props

		const properties = {
			ref: this.storeButtonNode,
			onClick: this.onClick,
			// 'aria-label': 'Menu',
			// 'aria-haspopup': 'menu',
			'aria-expanded': menuIsExpanded ? true : false, // can be `undefined` to differentiate between "has been toggled yet"/"has not been toggled yet" to workaround the CSS animation bug.
			className: classNames('rrui__button-reset', 'rrui__outline', 'rrui__menu-button', className),
			...rest
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