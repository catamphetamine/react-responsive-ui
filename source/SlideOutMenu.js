import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import createRef from 'react-create-ref'
import createContext from 'create-react-context'

import { Context as PageAndMenuContext } from './PageAndMenu'
import OnFocusOutOrTapOutside from './OnFocusOutOrTapOutside'

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
						toggleMenu={context.toggleMenu}
						setTogglerCooldown={context.setTogglerCooldown}
						getTogglerNode={context.getTogglerNode}/>
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
		]),

		// isOpen : PropTypes.bool,

		fullscreen : PropTypes.bool,

		// A result of `React.createRef()`.
		// Will be focused when the menu is opened.
		menuRef : PropTypes.object,

		onCollapse : PropTypes.func,
		onExpand : PropTypes.func,

		toggleMenu: PropTypes.func.isRequired,
		registerMenu: PropTypes.func.isRequired,
		setTogglerCooldown: PropTypes.func.isRequired,
		getTogglerNode: PropTypes.func.isRequired,

		// If `scrollIntoView` is `true` (which is the default)
		// then these two are gonna define the delay after which it scrolls into view.
		expandAnimationDuration : PropTypes.number,

		// CSS style object
		style : PropTypes.object,

		// CSS class
		className : PropTypes.string
	}

	static defaultProps =
	{
		// isOpen : false,
		anchor : 'left',
		fullscreen : false,

		expandAnimationDuration : 220
	}

	state = {
		// Initializing it to `false` is required for `if (expand === expanded)`.
		//
		expanded: false
	}

	container = createRef()
	onFocusOutRef = createRef()

	componentDidMount()
	{
		const { registerMenu, menuRef } = this.props

		this.unregister = registerMenu
		({
			toggle  : this.toggle,
			element : () => this.container.current,
			menu    : () => menuRef ? menuRef.current : this.container.current
		})

		// // Hide on `Back`/`Forward` navigation.
		// window.addEventListener('popstate', this.hide)
	}

	componentWillUnmount() {
		this.unregister()
		// window.removeEventListener('popstate', this.hide)

		if (this.cancelProcess) {
			this.cancelProcess()
		}
	}

	toggle = (expand, { onCollapsed, onExpanded } = {}) => {
		// This code was copy-pasted from `source/Expandable.js`.

		const { onCollapse, onExpand } = this.props

		const { expanded } = this.state

		// If no `expand` argument provided then just toggle.
		const isExpandedState = (expanded && this.process !== 'unexpand') ||
			(this.process === 'expand')
		if (expand === undefined) {
			expand = !isExpandedState
		}

		// Don't collapse if already collapsed.
		// Don't expand if already expanded.

		if (expand === isExpandedState) {
			return Promise.resolve()
		}

		// if (this.isToggling) {
		// 	return Promise.resolve()
		// }

		if (this.cancelProcess) {
			this.cancelProcess()
		}

		let cancelled

		const reset = () => {
			this.process = undefined
			this.processPhase = undefined
			this.cancelProcess = undefined
		}

		const nextPhase = (phase) => {
			if (!cancelled) {
				this.processPhase = phase
				return true
			}
		}

		function endProcess() {
			nextPhase()
			reset()
		}

		const phaseCancellers = {}
		function onCancelPhase(phase, handler) {
			phaseCancellers[phase] = handler
		}

		this.cancelProcess = () => {
			if (phaseCancellers[this.processPhase]) {
				phaseCancellers[this.processPhase]()
			}
			cancelled = true
			reset()
		}

		if (expand) {
			// Expand.
			this.process = 'expand'
			onCancelPhase('scheduleExpand', () => clearTimeout(this.expandTimeout))
			return new Promise((resolve) => {
				if (!nextPhase('render')) {
					return
				}
				this.setState({
					shouldRender: true
				},
				// Without an artificial delay for some reason the CSS "expand" animation won't play.
				// Perhaps a browser decides to optimize two subsequent renders
				// and doesn't render "pre-expanded" and "expanded" states separately.
				// Even with a 0ms delay it would randomly play/not-play the expand animation.
				() => {
					if (!nextPhase('scheduleExpand')) {
						return
					}
					if (onExpand) {
						onExpand()
					}
					// Using `requestAnimationFrame()` instead of `setTimeout()`
					// because otherwise there would be a weird and strange delay.
					this.expandTimeout = setTimeout(() => {
						if (!nextPhase('expand')) {
							return
						}
						this.expandTimeout = undefined
						this.setState({ expanded: true }, () => {
							if (!nextPhase('expanded')) {
								return
							}
							if (onExpanded) {
								onExpanded()
							}
							if (this.onFocusOutRef.current) {
								this.onFocusOutRef.current.listenToTouches()
							}
							endProcess()
							resolve()
						})
					}, 0)
				})
			})
		} else {
			// Un-Expand.
			this.process = 'unexpand'
			onCancelPhase('unexpanded', () => clearTimeout(this.waitUnForExpandAnimationTimer))
			nextPhase('unexpand')
			if (this.onFocusOutRef.current) {
				this.onFocusOutRef.current.stopListeningToTouches()
			}
			if (onCollapse) {
				onCollapse()
			}
			// Set `expanded` to `false` to play the collapse CSS animation.
			// Once that animation is finished remove
			// the contents of the `<Expanded/>` from DOM.
			return new Promise((resolve) => {
				this.setState({ expanded: false }, () => {
					if (!nextPhase('unexpanded')) {
						return
					}
					if (onCollapsed) {
						onCollapsed()
					}
					const waitForUnExpandAnimation = () => {
						const { expandAnimationDuration } = this.props
						return new Promise((resolve) => {
							this.waitUnForExpandAnimationTimer = setTimeout(resolve, expandAnimationDuration * 1.1)
						})
					}
					waitForUnExpandAnimation().then(() => {
						if (!nextPhase('unrender')) {
							return
						}
						this.setState({ shouldRender: false }, endProcess)
					})
					// `resolve()` doesn't wait for `removeFromDOMAfterCollapsed`
					// because other components use it like `.toggle().then(focus)`
					// where it shouldn't wait for the final phases.
					resolve()
				})
			})
		}
	}

	show = () => {
		const { toggleMenu } = this.props
		toggleMenu(true)
	}

	hide = () => {
		const { toggleMenu } = this.props
		toggleMenu(false)
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
				return toggleMenu(false)
		}
	}

	// Hide the menu on focus out.
	onFocusOut = () => {
		const { toggleMenu, setTogglerCooldown } = this.props
		// `window.rruiCollapseOnFocusOut` can be used
		// for debugging expandable contents.
		if (window.rruiCollapseOnFocusOut !== false) {
			toggleMenu(false)
			setTogglerCooldown()
		}
	}

	getContainerNode = () => this.container.current

	render()
	{
		const {
			anchor,
			fullscreen,
			getTogglerNode,
			className,
			children,
			// rest
			menuRef,
			onExpand,
			onCollapse,
			toggleMenu,
			registerMenu,
			setTogglerCooldown,
			expandAnimationDuration,
			...rest
		} = this.props

		const {
			shouldRender,
			expanded
		} = this.state

		if (!shouldRender) {
			return null
		}

		// ARIA menu notes:
		// https://www.w3.org/TR/wai-aria-practices/examples/menu-button/menu-button-links.html

		// `tabIndex="-1"` is for calling `this.container.current.focus()`
		// when no `menuRef` is supplied.

		// `<OnFocusOutOrTapOutside/>` sets `onBlur` on the `<div/>`.
		return (
			<OnFocusOutOrTapOutside
				ref={this.onFocusOutRef}
				getContainerNode={this.getContainerNode}
				getTogglerNode={getTogglerNode}
				onFocusOut={this.onFocusOut}
				listenToTouches={false}>
				<div
					{ ...rest }
					ref={ this.container }
					aria-hidden={ !expanded }
					tabIndex={ -1 }
					onKeyDown={ this.onKeyDown }
					className={ classNames(
						className,
						/* Developers can define custom `:focus` style for the slideout menu. */
						/* (or better add `menuRef` property pointing to a component having `.focus()` method). */
						'rrui__outline',
						'rrui__slideout-menu',
						{
							'rrui__slideout-menu--left'       : anchor === 'left',
							'rrui__slideout-menu--right'      : anchor === 'right',
							'rrui__slideout-menu--top'        : anchor === 'top',
							'rrui__slideout-menu--bottom'     : anchor === 'bottom',
							'rrui__slideout-menu--fullscreen' : fullscreen,
							'rrui__slideout-menu--expanded'   : expanded
						}
					) }>
					{ children }
				</div>
			</OnFocusOutOrTapOutside>
		)
	}
}