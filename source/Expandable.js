import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import scrollIntoView from 'scroll-into-view-if-needed'
import createRef from 'react-create-ref'

// For some weird reason, in Chrome, `setTimeout()` would lag up to a second (or more) behind.
// Turns out, Chrome developers have deprecated `setTimeout()` API entirely without asking anyone.
// Replacing `setTimeout()` with `requestAnimationFrame()` can work around that Chrome bug.
// https://github.com/bvaughn/react-virtualized/issues/722
import { setTimeout, clearTimeout } from 'request-animation-frame-timeout'

import Close, { CloseIcon } from './Close'
import OnFocusOutOrTapOutside from './OnFocusOutOrTapOutside'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

/**
 * Usage:
 *
 * <button onClick={() => this.expandable.toggle()}>
 *   Toggle
 * </button>
 *
 * <Expandable ref={ref => this.expandable = ref}>
 *   ...
 * </Expandable>
 *
 * Methods:
 * * `.toggle()`
 * * `.expand()`
 * * `.collapse()`
 * * `.isExpanded()`
 */
export default class Expandable extends PureComponent
{
	static propTypes =
	{
		// The default animation could be called "expand".
		animation: PropTypes.oneOf(['fade-up']),

		// Can optionally preload `<Expandable/>` contents before expanding it.
		// Must return a `Promise`.
		preload : PropTypes.func,
		onPreloadStateChange : PropTypes.func,
		onPreloadError : PropTypes.func,

		onExpand : PropTypes.func,
		onCollapse : PropTypes.func,

		// Whether the `<Expandable/>` expands upwards or downwards.
		alignment : PropTypes.oneOf(['left', 'right']),

		// If this flag is set to `true`,
		// then the dropdown expands itself upward.
		// (as opposed to the default downward)
		upward : PropTypes.bool,

		// ARIA `role` (accessibility).
		role : PropTypes.string,

		// CSS style object.
		style : PropTypes.object,

		// CSS class.
		className : PropTypes.string,

		// When the `<Expandable/>` is expanded
		// its content may not fit on the screen.
		// If `scrollIntoView` is `true` (which is the default)
		// then the browser will automatically scroll
		// so that the expanded content fits on the screen.
		scrollIntoView : PropTypes.bool.isRequired,

		// If `scrollIntoView` is `true` (which is the default)
		// then these two are gonna define the delay after which it scrolls into view.
		expandAnimationDuration : PropTypes.number.isRequired,

		scrollIntoViewDelay : PropTypes.number.isRequired,

		getTogglerNode : PropTypes.func,
		onFocusOut : PropTypes.func,

		// `aria-label` for the "Close" button
		// (which is an "x" visible in fullscreen mode).
		closeLabel : PropTypes.string,

		// The "x" button icon that closes the `<Select/>`
		// in fullscreen mode on mobile devices.
		closeButtonIcon : PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf([false])]).isRequired
	}

	static defaultProps =
	{
		scrollIntoView : true,
		expandAnimationDuration : 150,
		scrollIntoViewDelay : 0,

		// The "x" button icon that closes the `<Select/>`
		// in fullscreen mode on mobile devices.
		closeButtonIcon : CloseIcon
	}

	state = {
		// This initialization is required for `if (expand === expanded)`.
		expanded: false
	}

	onFocusOutRef = createRef()

	componentWillUnmount() {
		if (this.cancelProcess) {
			this.cancelProcess()
		}
	}

	isExpanded = () => this.state.expanded

	expand   = (parameters) => this.toggle(true, parameters)
	collapse = () => this.toggle(false)

	toggle = (expand, parameters = {}) =>
	{
		const {
			onExpand,
			onExpanded,
			onCollapse,
			onCollapsed
		} = this.props

		const { expanded } = this.state

		// If no `expand` argument provided then just toggle.
		const isExpandedState = (expanded && this.process !== 'unexpand') ||
			(this.process === 'expand')
		if (expand === undefined) {
			expand = !isExpandedState
		}

		// Don't collapse if already collapsed.
		// Don't expand if already expanded
		// unless manually forcing a refresh of content.

		let refreshingExpanded
		if (expand && isExpandedState && parameters.refresh) {
			refreshingExpanded = true
		}

		if (expand === isExpandedState && !refreshingExpanded) {
			return Promise.resolve()
		}

		// if (this.isToggling && !refreshingExpanded) {
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
			onCancelPhase('expanded', () => clearTimeout(this.scrollIntoViewTimer))
			nextPhase('preload')
			return this.preload().then(() => new Promise((resolve) => {
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
							this.scrollIntoView().then(endProcess)
							// `resolve()` doesn't wait for `scrollIntoView`
							// because other components use it like `.toggle().then(focus)`
							// where it shouldn't wait for the final phases like "scroll into view".
							resolve()
						})
					}, 0)
				})
			}))
		} else {
			// Un-Expand.
			this.process = 'unexpand'
			onCancelPhase('unexpand', () => clearTimeout(this.scrollIntoViewTimer))
			onCancelPhase('unexpanded', () => clearTimeout(this.waitUnForExpandAnimationTimer))
			nextPhase('unexpand')
			if (this.onFocusOutRef.current) {
				this.onFocusOutRef.current.stopListeningToTouches()
			}
			if (onCollapse) {
				onCollapse({ focusOut: this.focusOut })
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
					// where it shouldn't wait for the final phases like "scroll into view".
					resolve()
				})
			})
		}
	}

	// Preload `<Expanded/>` content (if required).
	preload()
	{
		const { preload, onPreloadStateChange } = this.props

		if (preload) {
			this.setState({
				isPreloading: true
			})
			if (onPreloadStateChange) {
				onPreloadStateChange(true)
			}
		}

		return (preload ? preload() : Promise.resolve())
			.then(() =>
			{
				if (onPreloadStateChange) {
					onPreloadStateChange(false)
				}
				this.setState({
					isPreloading: false
				})
			},
			(error) =>
			{
				console.error(error)
				// if (onPreloadError) {
				// 	onPreloadError(error)
				// }
				if (onPreloadStateChange) {
					onPreloadStateChange(false)
				}
				this.setState({
					isPreloading: false
				})
			})
	}

	scrollIntoView() {
		const {
			scrollIntoView: shouldScrollIntoView,
			scrollIntoViewDelay,
			expandAnimationDuration
		} = this.props
		if (!shouldScrollIntoView) {
			return Promise.resolve()
		}
		return new Promise((resolve) => {
			this.scrollIntoViewTimer = setTimeout(() => {
				// https://github.com/stipsan/scroll-into-view-if-needed/issues/359
				// scrollIntoView(this.container, false, { duration: 300 })
				scrollIntoView(this.container, {
					scrollMode: 'if-needed',
					behavior: 'smooth',
					block: 'nearest',
					inline: 'nearest'
				})
				resolve()
			}, Math.max(scrollIntoViewDelay, expandAnimationDuration) * 1.1)
		})
	}

	onKeyDown = (event) =>
	{
		if (event.defaultPrevented) {
			return
		}

		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}

		switch (event.keyCode)
		{
			// Collapse on "Escape".
			case 27:
				event.preventDefault()
				// Collapse the list if it's expanded
				return this.collapse()
		}
	}

	storeContainerNode = (node) => this.container = node
	getContainerNode = () => this.container

	// This function is called from outside in `<ExpandableList/>`.
	onBlur = (event) => {
		return this.onFocusOutRef.current && this.onFocusOutRef.current.onBlur(event)
	}

	onFocusOut = (event) => {
		const { onFocusOut } = this.props
		this.focusOut = true
		onFocusOut(event)
		this.focusOut = undefined
	}

	render()
	{
		const
		{
			animation,
			alignment,
			upward,
			onFocusOut,
			getTogglerNode,
			closeLabel,
			closeButtonIcon : CloseButtonIcon,
			role,
			style,
			className,
			children
		}
		= this.props

		const
		{
			shouldRender,
			expanded
		}
		= this.state

		if (!shouldRender) {
			return null
		}

		// `tabIndex={ -1 }` makes the `<div/>` focusable.
		// So that `<Expandable/>` doesn't collapse on click inside it (top, bottom).

		// `aria-hidden={true/false}` is not set automatically here
		// because when `<Expandable/>` is collapsed then it's not rendered.

		// tabIndex={ -1 }

		let element = (
			<div
				ref={ this.storeContainerNode }
				onKeyDown={ this.onKeyDown }
				role={ role }
				aria-hidden={ this.props['aria-hidden'] }
				aria-label={ this.props['aria-label'] }
				style={ style }
				className={ classNames
				(
					className,
					'rrui__shadow',
					'rrui__expandable',
					'rrui__expandable--overlay',
					animation && `rrui__expandable--${animation}`,
					animation && expanded && `rrui__expandable--expanded--${animation}`,
					{
						'rrui__expandable--expanded'      : expanded,
						'rrui__expandable--left-aligned'  : alignment === 'left',
						'rrui__expandable--right-aligned' : alignment === 'right',
						'rrui__expandable--upward'        : upward,
						'rrui__expandable--downward'      : !upward
					}
				) }>
				{ React.Children.map(children, (child) =>
				{
					return React.cloneElement(child,
					{
						className: classNames
						(
							child.props.className,
							'rrui__expandable__content',
							animation && `rrui__expandable__content--${animation}`,
							{
								'rrui__expandable__content--expanded' : expanded
							}
						)
					})
				}) }

				{/* The "x" button to hide the fullscreen expandable on mobile devices */}
				{ expanded && CloseButtonIcon &&
					<Close
						onClick={this.collapse}
						closeLabel={closeLabel}
						className={classNames('rrui__close--bottom-right', 'rrui__expandable__close')}>
						<CloseButtonIcon/>
					</Close>
				}
			</div>
		)

		if (onFocusOut) {
			// `<OnFocusOutOrTapOutside/>` sets `onBlur` on the `<div/>`.
 			// `<Expandable/>` calls `.listenToTouches()` / `.stopListeningToTouches()` manually.
			element = (
				<OnFocusOutOrTapOutside
					ref={this.onFocusOutRef}
					getContainerNode={this.getContainerNode}
					getTogglerNode={getTogglerNode}
					onFocusOut={this.onFocusOut}
					listenToTouches={false}>
					{element}
				</OnFocusOutOrTapOutside>
			)
		}

		return element
	}
}