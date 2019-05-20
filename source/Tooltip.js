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

		// Whether this element should be displayed as `inline-block`.
		// (is `true` by default)
		inline : PropTypes.bool.isRequired,

		// The delay before the tooltip is shown (in milliseconds)
		delay : PropTypes.number.isRequired,

		// The duration of the tooltip hiding animation.
		// The DOM element will retain `display: block` for this time period.
		// When changing this timeout also change `transition` time for
		// `.tooltip--after-show` and `.tooltip--before-hide` CSS classes.
		// Is `120` by default.
		hidingAnimationDuration : PropTypes.number.isRequired,

		// The tooltip waits `hideTimeout` milliseconds before hiding
		// to support mouseovering over itself.
		hideTimeout : PropTypes.number.isRequired,

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
		hideTimeout: 50, // in milliseconds
		container: () => document.body
	}

	state = {}

	// componentDidMount()
	// {
	// 	this.create_tooltip()
	// }

	componentWillUnmount()
	{
		this.destroy_tooltip()
	}

	create_tooltip()
	{
		const { tooltipClassName, placement } = this.props

		this.tooltip = document.createElement('div')

		this.tooltip.style.position = 'absolute'
		this.tooltip.style.left = 0
		this.tooltip.style.top  = 0

		this.tooltip.classList.add('rrui__tooltip')
		this.tooltip.classList.add(`rrui__tooltip--${getEdge(placement)}`)

		if (tooltipClassName) {
			for (const className of tooltipClassName.split(/\s+/)) {
				this.tooltip.classList.add(className)
			}
		}

		this.tooltip.addEventListener('mouseenter', this.on_mouse_enter_tooltip)
		this.tooltip.addEventListener('mouseleave', this.on_mouse_leave_tooltip)

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
		this.setState({ isShown: true }, () =>
		{
			const { x, y } = this.calculate_coordinates()

			this.tooltip.style.left = `${x}px`
			this.tooltip.style.top  = `${y}px`

			// Play tooltip showing animation
			// (doing it after setting position because
			//  setting position applies `display: block`)
			if (animate)
			{
				this.tooltip.classList.add('rrui__tooltip--after-show')
			}
		})
	}

	hide = () =>
	{
		this.isShown = false

		const { hidingAnimationDuration } = this.props

		// If already hiding, or if already hidden, then do nothing.
		// if (this.hide_timeout || this.tooltip.style.display === 'none')
		if (this.hide_timeout || !this.tooltip)
		{
			return
		}

		// Play tooltip hiding animation
		this.tooltip.classList.add('rrui__tooltip--before-hide')

		// Set the tooltip to `display: none`
		// after its hiding animation finishes.
		this.hide_timeout = setTimeout(() =>
		{
			this.hide_timeout = undefined
			this.destroy_tooltip()
			this.setState({ isShown: false })
		},
		hidingAnimationDuration)
	}

	scheduleHide() {
		const { hideTimeout } = this.props
		// `window.rruiCollapseOnFocusOut` can be used
		// for debugging expandable contents.
		if (window.rruiCollapseOnFocusOut !== false) {
			this.hide_on_mouse_leave_timeout = setTimeout(this.hide, hideTimeout)
		}
	}

	cancelHide() {
		clearTimeout(this.hide_on_mouse_leave_timeout)
		this.hide_on_mouse_leave_timeout = undefined
	}

	on_mouse_enter_tooltip = () =>
	{
		// mouse enter and mouse leave events
		// are triggered on mobile devices too
		if (this.mobile) {
			return
		}
		if (this.isShown) {
			this.cancelHide()
		}
	}

	on_mouse_leave_tooltip = () =>
	{
		// mouse enter and mouse leave events
		// are triggered on mobile devices too
		if (this.mobile) {
			return
		}
		if (this.isShown) {
			this.scheduleHide()
		}
	}

	on_mouse_enter = () =>
	{
		const { content } = this.props

		// mouse enter and mouse leave events
		// are triggered on mobile devices too
		if (this.mobile) {
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

	on_mouse_leave = () =>
	{
		// mouse enter and mouse leave events
		// are triggered on mobile devices too
		if (this.mobile) {
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

	on_touch_start = () =>
	{
		const { content } = this.props

		// mouse enter events won't be processed from now on
		this.mobile = true

		// If the tooltip has no content
		// (e.g. `react-time-ago` first render)
		// or if React Portal API is not available
		// then don't show the tooltip.
		if (!content || !ReactDOM.createPortal)
		{
			return
		}

		this.show()
	}

	storeOriginNode = (ref) => this.origin = ref

	render()
	{
		// Shows tooltip on mouse over when on desktop.
		// Shows tooltip on touch when on mobile.

		const
		{
			content
		}
		= this.props

		// `ReactDOM.createPortal()` requires React >= 16.
		// If it's not available then it won't show the tooltip.

		const tooltip = this.tooltip && content && ReactDOM.createPortal && ReactDOM.createPortal(content, this.tooltip)

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
			inline,
			style,
			className,
			children
		}
		= this.props

		return (
			<div
				ref={ this.storeOriginNode }
				onMouseEnter={ this.on_mouse_enter }
				onMouseLeave={ this.on_mouse_leave }
				onTouchStart={ this.on_touch_start }
				onTouchMove={ this.hide }
				onTouchEnd={ this.hide }
				onTouchCancel={ this.hide }
				style={ inline ? (style ? { ...inline_style, ...style } : inline_style) : style }
				className={ classNames('rrui__tooltip__target', className) }>
				{ children }
				{ extraChildren }
			</div>
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