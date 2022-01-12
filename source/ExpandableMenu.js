import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import createRef from 'react-create-ref'

import ExpandableList from './ExpandableList'
import List from './List'
import Close, { CloseIcon } from './Close'

import { focus } from './utility/focus'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

export default class ExpandableMenu extends PureComponent
{
	static propTypes =
	{
		// Component CSS class
		className  : PropTypes.string,

		// CSS style object
		style      : PropTypes.object,

		// `aria-label` for the "Close" button
		// (which is an "x" visible in fullscreen mode).
		closeLabel : PropTypes.string,

		// The "x" button icon that closes the `<Select/>`
		// in fullscreen mode on mobile devices.
		closeButtonIcon : PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf([false])]).isRequired,

		// Must accept a `ref`.
		// Receives properties: `onClick`, `onKeyDown`, `onBlur`, `aria-expanded`.
		button : PropTypes.elementType,
		buttonProps : PropTypes.object,
		buttonClassName : PropTypes.string,

		toggleElement : PropTypes.node,

		// (deprecated, use `button` component instead)
		toggler : PropTypes.func,

		// (deprecated, use `buttonProps` instead)
		togglerAriaLabel : PropTypes.string,

		// (deprecated, use `buttonProps` instead)
		togglerAriaHasPopup : PropTypes.string,

		// (deprecated, use `buttonProps` instead)
		togglerClassName : PropTypes.string,

		buttonTitle: PropTypes.string,
		disabled: PropTypes.bool
	}

	static defaultProps =
	{
		// The "x" button icon that closes the `<Select/>`
		// in fullscreen mode on mobile devices.
		closeButtonIcon : CloseIcon
	}

	state = {}

	// The DOM Element reference is only used to determine
	// whether the focus is "inside" the component or "outside" of it,
	// and also for focusing the `<button/>` when closing expandable menu.
	button = createRef()

	// componentWillUnmount() {
	// 	clearTimeout(this.cooldownTimer)
	// }

	onExpand = () => this.setState({ isExpanded: true })

	onCollapse = ({ focusOut }) => {
		if (!focusOut) {
			this.focus()
		}
		this.setState({ isExpanded: false })
		// // A workaround for Safari (both macOS and iOS) bug: `<button/>`s not getting focus.
		// // https://stackoverflow.com/questions/20359962/jquery-mobile-focusout-event-for-relatedtarget-returns-incorrect-result-in-safar
		// this.cooldown = true
		// this.cooldownTimer = setTimeout(() => this.cooldown = false, 30)
	}

	// `this.toggler` is deprecated.
	focus = () => focus(this.toggler || this.button.current)

	expand   = () => this.list.expand()
	collapse = () => this.list.collapse()
	toggle   = () => this.list.toggle()

	onFocusOut = () => {
		// `window.rruiCollapseOnFocusOut` can be used
		// for debugging expandable contents.
		if (window.rruiCollapseOnFocusOut !== false) {
			this.collapse()
		}
	}

	storeListRef = (ref) => this.list = ref

	// (legacy) (deprecated)
	// Is used to focus legacy togglers.
	storeTogglerRef = (ref) => this.toggler = ref

	getButton = () => this.button.current

	onBlur = (event) => this.list && this.list.onBlur(event)

	onClick = (event) => {
		// // A workaround for Safari (both macOS and iOS) bug: `<button/>`s not getting focus.
		// // https://stackoverflow.com/questions/20359962/jquery-mobile-focusout-event-for-relatedtarget-returns-incorrect-result-in-safar
		// if (!this.cooldown) {
			this.toggle()
		// }
	}

	onKeyDown = (event) => {
		if (event.defaultPrevented) {
			return
		}
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}
		switch (event.keyCode) {
			// "Up" arrow.
			// Select the previous item (if present).
			case 38:
			// "Down" arrow.
			// Select the next item (if present).
			case 40:
				return this.list.onKeyDown(event)

			// "Enter".
			case 13:
				// Submit containing `<form/>`.
				// Expand otherwise.
				this.expand()
				return event.preventDefault()
		}
	}

	render() {
		const {
			buttonTitle,
			disabled,
			style,
			className,
			toggler,
			button,
			buttonProps,
			buttonClassName,
			toggleElement,
			togglerAriaLabel,
			togglerAriaHasPopup,
			togglerClassName,
			children,
			...rest
		} = this.props

		const { isExpanded } = this.state

		let menuToggler
		let menuItems

		if (toggler || button || toggleElement) {
			// "button" string is used instead of a `DefaultTogglerButton`
			// so that the `ref` is the `<button/>` DOM Element.
			// (`.focus()`, `.contains()`).
			const TogglerButton = button || 'button'
			const togglerElement = toggleElement || (toggler ? React.createElement(toggler) : null)
			menuItems = children
			menuToggler = (
				<TogglerButton
					type={button ? undefined : 'button'}
					aria-haspopup={ togglerAriaHasPopup }
					aria-label={ togglerAriaLabel }
					className={ classNames(togglerClassName, buttonClassName, {
						'rrui__button-reset': toggleElement,
						'rrui__outline': toggleElement
					}) }
					{...buttonProps}
					ref={ this.button }
					onClick={ this.onClick }
					onKeyDown={ this.onKeyDown }
					onBlur={ this.onBlur }
					aria-expanded={ isExpanded ? true : false }
					title={ buttonTitle }
					disabled={ disabled }>
					{ togglerElement }
				</TogglerButton>
			)
		} else {
			// Legacy way: the first child was the toggler.
			menuItems = React.Children.toArray(children)
			menuToggler = menuItems.shift()
			menuToggler = (
				<div
					ref={ this.button }
					onClick={ this.onClick }
					onKeyDown={ this.onKeyDown }
					onBlur={ this.onBlur }>
					{ React.cloneElement(menuToggler, { ref : this.storeTogglerRef }) }
				</div>
			)
		}

		return (
			<div
				style={ style }
				className={ classNames('rrui__menu', className) }>

				{menuToggler}

				<ExpandableList
					{...rest}
					animation="fade-up"
					ref={this.storeListRef}
					aria-label={this.props['aria-label']}
					tabbable={false}
					scrollMaxItems={0}
					onCollapse={this.onCollapse}
					onExpand={this.onExpand}
					onFocusOut={this.onFocusOut}
					getTogglerNode={this.getButton}
					focusSelectedItem={false}
					className="rrui__shadow">
					{menuItems}
				</ExpandableList>
			</div>
		)
	}
}