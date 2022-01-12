import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// For some weird reason, in Chrome, `setTimeout()` would lag up to a second (or more) behind.
// Turns out, Chrome developers have deprecated `setTimeout()` API entirely without asking anyone.
// Replacing `setTimeout()` with `requestAnimationFrame()` can work around that Chrome bug.
// https://github.com/bvaughn/react-virtualized/issues/722
import { setTimeout, clearTimeout } from 'request-animation-frame-timeout'

import { Context } from './PageAndMenu'
import MenuIcon from './MenuIcon'

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

class MenuButton extends React.PureComponent {
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

		// Menu button component.
		component   : PropTypes.elementType,

		// Menu button icon component.
		icon        : PropTypes.func,

		// CSS class.
		className   : PropTypes.string,

		// CSS style object.
		style       : PropTypes.object,

		children    : PropTypes.oneOfType([
			PropTypes.node,
			PropTypes.func
		])
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

	getChildren() {
		const {
			menuIsExpanded,
			children,
			icon
		} = this.props;

		if (children) {
			if (typeof children === 'function') {
				return children({ expanded: menuIsExpanded })
			}
			return children
		}

		return React.createElement(icon || MenuIcon, { expanded: menuIsExpanded })
	}

	getButtonProps() {
		const { menuIsExpanded } = this.props
		return {
			ref: this.storeButtonNode,
			onClick: this.onClick,
			// 'aria-label': 'Menu',
			// 'aria-haspopup': 'menu',
			// `menuIsExpanded` property can be `undefined` to differentiate
			// between "has been toggled yet"/"has not been toggled yet"
			// to workaround the CSS animation bug.
			'aria-expanded': menuIsExpanded ? true : false,
		}
	}

	render() {
		const {
			link,
			className,
			component,

			// Getting "rest" properties.
			icon: MenuButtonIcon,
			children,
			menuIsExpanded,
			toggleMenu,
			registerMenuButton,
			...rest
		} = this.props

		const properties = {
			...rest,
			...this.getButtonProps()
		}

		if (component) {
			return React.createElement(component, properties)
		}

		properties.className = classNames('rrui__button-reset', 'rrui__outline', className, {
			// Only when using an `icon` component.
			'rrui__menu-button': !component && !children
		})

		// A link.
		if (link) {
			return React.createElement(
				'a',
				{
					...properties,
					href: link
				},
				this.getChildren()
			)
		}

		// A button.
		return React.createElement(
			'button',
			{
				...properties,
				type: 'button'
			},
			this.getChildren()
		)
	}
}