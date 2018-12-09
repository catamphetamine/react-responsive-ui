import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import createRef from 'react-create-ref'
import createContext from 'create-react-context'

import { Context as PageAndMenuContext } from './PageAndMenu'

export const Context = createContext()

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

export default class ContextAwareSlideoutMenu extends PureComponent {
	slideOutMenu = createRef()
	show = () => this.slideOutMenu.current.show()
	hide = () => this.slideOutMenu.current.hide()
	render() {
		return (
			<PageAndMenuContext.Consumer>
				{context => (
					<SlideoutMenu
						ref={this.slideOutMenu}
						{...this.props}
						registerMenu={context.registerMenu}
						toggleMenu={context.toggleMenu}/>
					)
				}
			</PageAndMenuContext.Consumer>
		)
	}
}

// const ContextAwareSlideoutMenu = (props) => (
// 	<PageAndMenuContext.Consumer>
// 		{context => (
// 			<SlideoutMenu
// 				{...props}
// 				registerMenu={context.registerMenu}
// 				toggleMenu={context.toggleMenu}/>
// 			)
// 		}
// 	</PageAndMenuContext.Consumer>
// )

// export default ContextAwareSlideoutMenu

// Swipeable feature example source code:
// https://github.com/mui-org/material-ui/blob/v1-beta/packages/material-ui/src/SwipeableDrawer/SwipeableDrawer.js

// A slideout menu.
class SlideoutMenu extends PureComponent
{
	static propTypes =
	{
		anchor : PropTypes.oneOf([
			'left',
			'right',
			'top',
			'bottom'
		]).isRequired,

		// isOpen : PropTypes.bool.isRequired,

		fullscreen : PropTypes.bool.isRequired,

		// A result of `React.createRef()`.
		// Will be focused when the menu is opened.
		menuRef : PropTypes.object,

		toggleMenu   : PropTypes.func.isRequired,
		registerMenu : PropTypes.func.isRequired,

		// CSS style object
		style : PropTypes.object,

		// CSS class
		className : PropTypes.string
	}

	static defaultProps =
	{
		// isOpen : false,
		anchor : 'left',
		fullscreen : false
	}

	state = {
		// show: this.props.isOpen
		show: false
	}

	container = createRef()
	menu = createRef()

	componentDidMount()
	{
		const { registerMenu, menuRef } = this.props
		const { show } = this.state

		this.unregister = registerMenu
		({
			hide    : () => this.setState({ show: false }),
			toggle  : (callback) => this.setState(state => ({ show: !state.show }), callback),
			isShown : () => this.state.show,
			element : () => this.container.current,
			menu    : () => menuRef ? menuRef.current : this.menu.current
		})

		// // Hide on `Back`/`Forward` navigation.
		// window.addEventListener('popstate', this.hide)
	}

	componentWillUnmount()
	{
		this.unregister()

		// window.removeEventListener('popstate', this.hide)
	}

	// componentDidUpdate(prevProps)
	// {
	// 	const { isOpen } = this.props

	// 	if (prevProps.isOpen && !isOpen) {
	// 		this.hide()
	// 	} else if (!prevProps.isOpen && isOpen) {
	// 		this.show()
	// 	}
	// }

	hide = () =>
	{
		const { toggleMenu } = this.props
		const { show } = this.state

		if (show) {
			toggleMenu()
		}
	}

	onKeyDown = (event) => {
		const { toggleMenu } = this.props
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}
		switch (event.keyCode) {
			// Collapse on "Escape".
			case 27:
				event.preventDefault()
				return toggleMenu()
		}
	}

	render()
	{
		const {
			anchor,
			fullscreen,
			className,
			style
		} = this.props

		const { show } = this.state

		return (
			<div
				ref={ this.container }
				aria-hidden={ !show }
				onKeyDown={ this.onKeyDown }
				className={ classNames('rrui__slideout-menu',
				{
					'rrui__slideout-menu--left'       : anchor === 'left',
					'rrui__slideout-menu--right'      : anchor === 'right',
					'rrui__slideout-menu--top'        : anchor === 'top',
					'rrui__slideout-menu--bottom'     : anchor === 'bottom',
					'rrui__slideout-menu--fullscreen' : fullscreen,
					'rrui__slideout-menu--expanded'   : show
				},
				className) }
				style={ style }>
				{ this.renderChildren() }
			</div>
		)
	}

	renderChildren() {
		const { menuRef, children } = this.props
		if (menuRef) {
			return children
		}
		if (React.Children.count(children) === 1) {
			return React.cloneElement(children, { ref: this.menu, tabIndex: -1 })
		}
		return children
	}
}