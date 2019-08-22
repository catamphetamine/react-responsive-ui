import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { getOffset } from './utility/dom'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

// https://github.com/Dogfalo/materialize/blob/master/js/tooltip.js
export default class Tooltip extends PureComponent
{
	static propTypes =
	{
		// Tooltip placement.
		placement : PropTypes.oneOf([
			'top',
			'top-start',
			'top-end',
			'left',
			'left-start',
			'left-end',
			'bottom',
			'bottom-start',
			'bottom-end',
			'right',
			'right-start',
			'right-end'
		]).isRequired,

		// Tooltip content.
		content : PropTypes.node,

		// Tooltip content component.
		// Will have access to `hide()` property.
		component : PropTypes.func,
		componentProps : PropTypes.object,

		// Whether this element should be displayed as `inline-block`.
		// (is `true` by default)
		inline : PropTypes.bool.isRequired,

		// If `true` then the tooltip will be accessible via keyboard.
		// The tooltipped element will be wrapped in a focusable `<button/>`
		// that will show/hide the tooltip on click.
		// Tooltip contents will be focused upon being shown.
		// The tooltip will be closeable via `Esc` key.
		// The tooltip will still be shown/hidden on mouseover.
		// (is `false` by default)
		accessible : PropTypes.bool,

		// The delay before the tooltip is shown (in milliseconds)
		delay : PropTypes.number.isRequired,

		// The duration of the tooltip hiding animation.
		// The DOM element will retain `display: block` for this time period.
		// When changing this timeout also change `transition` time for
		// `.tooltip--after-show` and `.tooltip--before-hide` CSS classes.
		// Is `120` by default.
		hidingAnimationDuration : PropTypes.number.isRequired,

		// (`hideTimeout` is deprecated, use `hideDelay` instead)
		// The tooltip waits `hideTimeout` milliseconds before hiding
		// to support mouseovering over itself.
		hideTimeout : PropTypes.number,

		// The tooltip waits `hideDelay` milliseconds before hiding
		// to support mouseovering over itself.
		hideDelay : PropTypes.number.isRequired,

		// `container: () => DOMElement` property is optional
		// and is gonna be the parent DOM Element for the tooltip itself
		// (`document.body` by default).
		// (in which case make sure that `document.body` has no `margin`
		//  otherwise tooltip `left` and `top` positions will be slightly off).
		container : PropTypes.func,

		// CSS style object
		style : PropTypes.object,

		// CSS class name
		className : PropTypes.string,

		// Tooltip CSS class name
		tooltipClassName : PropTypes.string
	}

	static defaultProps =
	{
		placement: 'top',
		inline: true,
		delay: 350, // in milliseconds
		hidingAnimationDuration: 200, // in milliseconds
		hideDelay: 50, // in milliseconds
		container: () => document.body
	}

	state = {}

	componentDidMount() {
		this._isMounted = true
	}

	componentWillUnmount() {
		this._isMounted = false
		this.destroy_tooltip()
	}

	create_tooltip()
	{
		const {
			tooltipClassName,
			placement,
			accessible
		} = this.props

		this.tooltip = document.createElement('div')

		this.tooltip.style.position = 'absolute'
		this.tooltip.style.left = 0
		this.tooltip.style.top  = 0

		if (accessible) {
			// An "accessible" tooltip is focused upon being shown.
			this.tooltip.setAttribute('tabIndex', -1)
			this.tooltip.classList.add('rrui__outline')
			this.tooltip.addEventListener('focusout', this.onFocusOut)
		}

		this.tooltip.classList.add('rrui__tooltip')
		this.tooltip.classList.add(`rrui__tooltip--${getEdge(placement)}`)

		if (tooltipClassName) {
			for (const className of tooltipClassName.split(/\s+/)) {
				this.tooltip.classList.add(className)
			}
		}

		this.tooltip.addEventListener('mouseenter', this.onMouseEnterTooltip)
		this.tooltip.addEventListener('mouseleave', this.onMouseLeaveTooltip)
		this.tooltip.addEventListener('keydown', this.onKeyDown)

		this.container().appendChild(this.tooltip)
	}

	destroy_tooltip()
	{
		clearTimeout(this.show_timeout)
		clearTimeout(this.hide_timeout)
		clearTimeout(this.hide_on_mouse_leave_timeout)

		if (this.tooltip)
		{
			// Won't throw an exception
			this.tooltip.parentNode.removeChild(this.tooltip)
			this.tooltip = undefined
		}
	}

	container()
	{
		const { container } = this.props
		return container()
	}

	calculate_coordinates()
	{
		const { placement } = this.props

		const width  = this.tooltip.offsetWidth
		const height = this.tooltip.offsetHeight

		const origin = getOffset(this.origin)

		let top
		let left

		switch (getEdge(placement)) {
			case 'top':
				top = origin.top - height
				break
			case 'bottom':
				top = origin.top + origin.height
				break
			case 'left':
				left = origin.left - width
				break
			case 'right':
				left = origin.left + origin.width
				break
		}

		switch (getEdge(placement)) {
			case 'top':
			case 'bottom':
				switch (getSide(placement)) {
					case 'start':
						left = origin.left
						break
					case 'end':
						left = origin.left + origin.width - width
						break
					// Default: "center".
					default:
						left = origin.left + (origin.width - width) / 2
						break
				}
				break
			case 'left':
			case 'right':
				switch (getSide(placement)) {
					case 'start':
						top = origin.top
						break
					case 'end':
						top = origin.top + origin.height - height
						break
					// Default: "center".
					default:
						top = origin.top + (origin.height - height) / 2
						break
				}
				break
		}

		return fitOnScreen(
			left,
			top - getOffset(this.container()).top,
			width,
			height
		)
	}

	show = () =>
	{
		this.isShown = true

		// Play tooltip showing animation
		let animate = false

		// If hiding animation is being played,
		// then cancel it, and cancel setting
		// `display` to `none` after it finishes playing.
		if (this.hide_timeout)
		{
			clearTimeout(this.hide_timeout)
			this.hide_timeout = undefined

			// Abort tooltip hiding animation.
			// It will automatically return to the "showing" state.
			this.tooltip.classList.remove('rrui__tooltip--before-hide')
		}
		// Otherwise, the tooltip is hidden (or never been shown)
		else
		{
			// Not creating in `componentDidMount()`
			// therefore create it here.
			if (!this.tooltip)
			{
				this.create_tooltip()
			}

			// Play tooltip showing animation
			animate = true
		}

		// Now that `this.tooltip` has been created,
		// re-render the component so that `ReactDOM.createPortal()` is called.
		return new Promise((resolve) => {
			this.setState({ isShown: true }, () => {
				const { accessible } = this.props
				const { x, y } = this.calculate_coordinates()

				this.tooltip.style.left = `${x}px`
				this.tooltip.style.top  = `${y}px`

				// Play tooltip showing animation
				// (doing it after setting position because
				//  setting position applies `display: block`)
				if (animate) {
					this.tooltip.classList.add('rrui__tooltip--after-show')
				}

				if (this.isTouchDevice) {
					document.addEventListener('touchstart', this.hideOnTouchOutside)
				}

				resolve()
			})
		})
	}

	hide = () =>
	{
		this.isShown = false

		const { hidingAnimationDuration } = this.props

		// If already hiding, or if already hidden, then do nothing.
		// if (this.hide_timeout || this.tooltip.style.display === 'none')
		if (this.hide_timeout || !this.tooltip) {
			return
		}

		if (this.isTouchDevice) {
			document.removeEventListener('touchstart', this.hideOnTouchOutside)
		}

		// Play tooltip hiding animation
		this.tooltip.classList.add('rrui__tooltip--before-hide')

		return new Promise((resolve) => {
			// Set the tooltip to `display: none`
			// after its hiding animation finishes.
			this.hide_timeout = setTimeout(() => {
				this.hide_timeout = undefined
				this.destroy_tooltip()
				if (this._isMounted) {
					this.setState({ isShown: false }, resolve)
				}
			}, hidingAnimationDuration)
		})
	}

	hideOnTouchOutside = (event) => {
		if (this.isShown) {
			if (!this.tooltip.contains(event.target) &&
				!this.origin.contains(event.target)) {
				this.hide()
			}
		}
	}

	scheduleHide() {
		const { hideTimeout, hideDelay } = this.props
		// `window.rruiCollapseOnFocusOut` can be used
		// for debugging expandable contents.
		if (window.rruiCollapseOnFocusOut !== false) {
			this.hide_on_mouse_leave_timeout = setTimeout(this.hide, hideTimeout || hideDelay)
		}
	}

	cancelHide() {
		clearTimeout(this.hide_on_mouse_leave_timeout)
		this.hide_on_mouse_leave_timeout = undefined
	}

	onClick = () => {
		if (this.isShown) {
			this.hide()
		} else {
			this.show().then(() => {
				// An "accessible" tooltip is focused upon being shown.
				this.tooltip.focus()
			})
		}
	}

	onMouseEnterTooltip = () =>
	{
		// mouse enter and mouse leave events
		// are triggered on mobile devices too
		if (this.isTouchDevice) {
			return
		}
		if (this.isShown) {
			this.cancelHide()
		}
	}

	onMouseLeaveTooltip = () =>
	{
		// mouse enter and mouse leave events
		// are triggered on mobile devices too
		if (this.isTouchDevice) {
			return
		}
		if (this.isShown) {
			this.scheduleHide()
		}
	}

	onMouseEnter = () =>
	{
		const content = this.renderContent()

		// mouse enter and mouse leave events
		// are triggered on mobile devices too
		if (this.isTouchDevice) {
			return
		}

		if (this.isShown) {
			return this.cancelHide()
		}

		// If the tooltip has no content
		// (e.g. `react-time-ago` first render)
		// or if React Portal API is not available
		// then don't show the tooltip.
		if (!content || !ReactDOM.createPortal) {
			return
		}

		// Shouldn't happen, because
		// `mouse leave` event clears this timeout.
		if (this.show_timeout) {
			return
		}

		const { delay } = this.props

		// Don't show the tooltip immediately
		// but rather wait for the user to
		// "mouse over" it for a short time interval.
		// (prevents false positives)
		this.show_timeout = setTimeout(() => {
			this.show_timeout = undefined
			this.show()
		},
		delay)
	}

	onMouseLeave = () =>
	{
		// mouse enter and mouse leave events
		// are triggered on mobile devices too
		if (this.isTouchDevice) {
			return
		}

		// If tooltip hasn't been shown yet,
		// then cancel showing it.
		if (this.show_timeout) {
			clearTimeout(this.show_timeout)
			this.show_timeout = undefined
			return
		}

		// Otherwise, the tooltip is shown, so hide it.
		if (this.isShown) {
			this.scheduleHide()
		}
	}

	onTouchStartSetTouchDevice = () => this.isTouchDevice = true

	onTouchStart = () =>
	{
		const content = this.renderContent()

		// mouse enter events won't be processed from now on
		this.isTouchDevice = true

		// If the tooltip has no content
		// (e.g. `react-time-ago` first render)
		// or if React Portal API is not available
		// then don't show the tooltip.
		if (!content || !ReactDOM.createPortal) {
			return
		}

		if (this.isShown) {
			this.hide()
		} else {
			this.show()
		}
	}

	onTouchEnd = () => {}

	// Is used on the tooltip itself in "accessible" mode.
	onFocusOut = (event) => {
		if (!this.tooltip.contains(event.relatedTarget) &&
			!this.origin.contains(event.relatedTarget)) {
			this.hide()
		}
	}

	// This handler is used both on tooltip toggle button
	// and the tooltip itself.
	onKeyDown = (event) => {
		if (event.defaultPrevented) {
			return
		}
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}
		switch (event.keyCode) {
			// Hide on "Escape".
			case 27:
				event.preventDefault()
				// Hide (if not already hidden).
				this.hide()
				const { accessible } = this.props
				if (accessible) {
					this.origin.focus()
				}
				return
		}
	}

	storeOriginNode = (ref) => this.origin = ref

	renderContent() {
		const {
			content,
			component: Component,
			componentProps
		} = this.props
		if (content) {
			return content
		}
		if (Component) {
			return (
				<Component
					{...componentProps}
					hide={this.hide}/>
			)
		}
		return null
	}

	render()
	{
		// Shows tooltip on mouse over when on desktop.
		// Shows tooltip on touch when on mobile.

		// `ReactDOM.createPortal()` requires React >= 16.
		// If it's not available then it won't show the tooltip.

		const content = this.renderContent()

		const tooltip = this.tooltip && content && ReactDOM.createPortal &&
			ReactDOM.createPortal(content, this.tooltip)

		// For React >= 16.2.
		// Disable React portal event bubbling.
		// https://github.com/facebook/react/issues/11387#issuecomment-340019419
		if (React.Fragment) {
			return (
				<React.Fragment>
					{this._render()}
					{tooltip}
				</React.Fragment>
			)
		} else {
			// Legacy version support.
			// Can be a bit buggy in some rare cases of mouseentering and mouseleaving.
			// Will be removed in some future major version release.
			return this._render(tooltip)
		}
	}

	_render(extraChildren) {
		const
		{
			accessible,
			inline,
			style,
			className,
			children,
			// Rest.
			placement,
			content,
			container,
			component,
			componentProps,
			delay,
			hideDelay,
			hideTimeout,
			hidingAnimationDuration,
			tooltipClassName,
			...rest
		}
		= this.props

		const { isShown } = this.state

		const Component = accessible ? 'button' : 'div'

		// There's no WAI-ARIA example of an `aria-role="tooltip"` widget.
		// https://www.w3.org/TR/wai-aria-practices-1.1/#tooltip
		//
		// `aria-haspopup`:
		// https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup
		// WAI-ARIA 1.1 is not yet supported, so not using `aria-haspopup="..."`.

		return (
			<Component
				{...rest}
				ref={ this.storeOriginNode }
				onMouseEnter={ this.onMouseEnter }
				onMouseLeave={ this.onMouseLeave }
				onClick={ accessible ? this.onClick : undefined }
				onTouchStart={ accessible ? this.onTouchStartSetTouchDevice : this.onTouchStart }
				onTouchEnd={ accessible ? undefined : this.onTouchEnd }
				onTouchMove={ accessible ? undefined : this.hide }
				onTouchCancel={ accessible ? undefined : this.hide }
				aria-expanded={ accessible ? isShown : undefined}
				style={ inline ? (style ? { ...inline_style, ...style } : inline_style) : style }
				className={ classNames(className, 'rrui__tooltip__target', {
					'rrui__button-reset': accessible
				}) }>
				{ children }
				{ extraChildren }
			</Component>
		)
	}
}

function fitOnScreen(x, y, width, height)
{
	const minimal_margin = 4 // in pixels

	if (x < minimal_margin)
	{
		x = minimal_margin
	}
	else if (x + width + minimal_margin > window.innerWidth)
	{
		x -= (x + width + minimal_margin) - window.innerWidth
	}

	if (y < window.pageYOffset + minimal_margin)
	{
		y = window.pageYOffset + minimal_margin
	}
	else if (y + height + minimal_margin > window.pageYOffset + window.innerHeight)
	{
		y -= (y + height + minimal_margin) - (window.pageYOffset + window.innerHeight)
	}

	return { x, y }
}

const inline_style =
{
	display : 'inline-block'
}

/**
 * @param  {string} placement
 * @return {string} One of: "top", "right", "bottom", "left".
 */
function getEdge(placement) {
	const dashIndex = placement.indexOf('-')
	if (dashIndex >= 0) {
		return placement.slice(0, dashIndex)
	}
	return placement
}

/**
 * @param  {string} placement
 * @return {string} One of: "start", "center", "end".
 */
function getSide(placement) {
	const dashIndex = placement.indexOf('-')
	if (dashIndex >= 0) {
		return placement.slice(dashIndex + '-'.length)
	}
	return 'center'
}