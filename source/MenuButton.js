import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Context } from './PageAndMenu'
import MenuButtonIconLinesCloseAnimated from './MenuButtonIconLinesCloseAnimated'

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
		menuIsExpanded : PropTypes.bool.isRequired,

		// A URL of the "Menu" page:
		// if a web browser has javascript disabled (e.g. Tor),
		// then the menu button will redirect to this Menu page URL.
		// If not set then won't redirect anywhere.
		link        : PropTypes.string.isRequired,

		// HTML `title` attribute.
		title       : PropTypes.string,

		// Menu button icon component.
		icon        : PropTypes.func.isRequired,

		// CSS class.
		className   : PropTypes.string,

		// CSS style object.
		style       : PropTypes.object
	}

	static defaultProps =
	{
		link : '#',
		icon : MenuButtonIconLinesCloseAnimated
	}

	componentDidMount()
	{
		const { registerMenuButton } = this.props

		this.unregister = registerMenuButton
		({
			element : () => this.button
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

	storeButtonNode = (node) => this.button = node

	render()
	{
		const
		{
			link,
			className,
			icon : MenuButtonIcon,
			menuIsExpanded,

			// Getting "rest" properties.
			toggleMenu,
			registerMenuButton,
			...rest
		}
		= this.props

		return (
			<a
				ref={ this.storeButtonNode }
				href={ link }
				onClick={ this.onClick }
				className={ classNames('rrui__menu-button', className,
				{
					'rrui__menu-button--expanded' : menuIsExpanded
				}) }
				{ ...rest }>

				<MenuButtonIcon/>
			</a>
		)
	}
}