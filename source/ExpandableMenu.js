import React, { useState, useCallback, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import createRef from 'react-create-ref'

import ExpandableList from './ExpandableList'
import List from './List'
import Close, { CloseIcon } from './Close'

import { focus as focusElement } from './utility/focus'

// `ignoreClicksOnTheToggleButtonDuration` is a workaround for Safari (both macOS and iOS) bug:
// When closing an expanded list by tapping on the toggler `<button/>`,
// that `<button/>` doesn't receive focus (`document.activeElement` is `<body/>`).
// The tap on the toggler button triggers a "blur" event on the expanded list
// (which is an `<Expandable/>`'s `<div/>`).
// That "blur" event calls `onBlur` function in this component,
// which, in turn, calls `onBlur` of `<OnFocusOut/>`,
// which calls `onBlur()` function from `source/utility/focus.js`.
// That function examines `event.relatedTarget` which is `null` in case of Safari:
// https://stackoverflow.com/questions/20359962/jquery-mobile-focusout-event-for-relatedtarget-returns-incorrect-result-in-safar
// That results in the click on the toggler button to unexpand the expanded menu,
// after which `onClick()` function of the toggler button is called, which calls `toggle()`,
// and that results in the menu to re-expand again. The result is that the user is unable
// to close the expanded menu by clicking on the toggle button.
// To work around that bug of Safari, a special timer is used
// to skip executing the `onClick()` handler.
const ignoreClicksOnTheToggleButtonDuration = 30

export default function ExpandableMenu(props) {
	const [isExpanded, setExpanded] = useState(false)

	// The DOM Element reference is only used to determine
	// whether the focus is "inside" the component or "outside" of it,
	// and also for focusing the `<button/>` when closing expandable menu.
	const buttonRef = useRef()

	const listRef = useRef()

	// (legacy) (deprecated)
	// Is used to focus legacy togglers.
	const togglerRef = useRef()

	const { buttonRef: buttonRefExternal } = props

	const setToggleButtonRef = useCallback((instance) => {
		buttonRef.current = instance
		if (buttonRefExternal) {
			if (typeof buttonRefExternal === 'function') {
				buttonRefExternal(instance)
			} else {
				buttonRefExternal.current = instance
			}
		}
	}, [buttonRefExternal])

	const focus = useCallback(() => {
		// `togglerRef` is deprecated.
		focusElement(togglerRef.current || buttonRef.current)
	}, [])

	// A workaround for Safari (both macOS and iOS) bug.
	// See the notes on the `ignoreClicksOnTheToggleButtonDuration` variable for more info.
	const ignoreClicksOnTheToggleButton = useRef(false)
	const ignoreClicksOnTheToggleButtonEndTimer = useRef()
	useEffect(() => {
		return () => {
			if (ignoreClicksOnTheToggleButtonEndTimer.current) {
				clearTimeout(ignoreClicksOnTheToggleButtonEndTimer.current)
			}
		}
	}, [])

	// Returns a `Promise`.
	const expand = useCallback(() => listRef.current.expand(), [listRef])

	// Returns a `Promise`.
	const collapse = useCallback(() => listRef.current.collapse(), [listRef])

	// Returns a `Promise`.
	const toggle = useCallback(() => listRef.current.toggle(), [listRef])

	const onExpand = useCallback(() => {
		setExpanded(true)
	}, [])

	const onCollapse = useCallback(({ focusOut }) => {
		if (!focusOut) {
			focus()
		}
		setExpanded(false)
		// A workaround for Safari (both macOS and iOS) bug.
		// See the notes on the `ignoreClicksOnTheToggleButtonDuration` variable for more info.
		ignoreClicksOnTheToggleButton.current = true
		ignoreClicksOnTheToggleButtonEndTimer.current = setTimeout(() => {
			ignoreClicksOnTheToggleButtonEndTimer.current = undefined
			ignoreClicksOnTheToggleButton.current = false
		}, ignoreClicksOnTheToggleButtonDuration)
	}, [focus])

	const onFocusOut = useCallback(() => {
		// `window.rruiCollapseOnFocusOut` can be used
		// for debugging expandable contents.
		if (window.rruiCollapseOnFocusOut !== false) {
			collapse()
		}
	}, [collapse])

	const getButtonElement = useCallback(() => buttonRef.current, [])

	const onBlur = useCallback((event) => {
		if (listRef.current) {
			listRef.current.onBlur(event)
		}
	}, [])

	const onClick = useCallback((event) => {
		// A workaround for Safari (both macOS and iOS) bug.
		// See the notes on the `ignoreClicksOnTheToggleButtonDuration` variable for more info.
		if (!ignoreClicksOnTheToggleButton.current) {
			toggle()
		}
	}, [
		toggle
	])

	const onKeyDown = useCallback((event) => {
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
				return listRef.current.onKeyDown(event)

			// "Enter".
			case 13:
				// Submit containing `<form/>`.
				// Expand otherwise.
				expand()
				return event.preventDefault()
		}
	}, [
		expand
	])

	const {
		buttonTitle,
		disabled,
		style,
		className,
		button,
		buttonComponent,
		buttonProps,
		buttonClassName,
		toggleElement,
		toggler,
		togglerAriaLabel,
		togglerAriaHasPopup,
		togglerClassName,
		children,
		...rest
	} = props

	// `button` is a legacy property name.
	// `buttonComponent` is a new property name.
	const CustomButtonComponent = buttonComponent || button

	let menuToggler
	let menuItems

	if (CustomButtonComponent || buttonProps || toggleElement || toggler) {
		menuItems = children

		const DefaultButtonComponent = 'button'
		const defaultButtonComponentClassNames = 'rrui__button-reset' + ' ' + 'rrui__outline'
		const defaultButtonComponentProps = { type: 'button' }

		const isDefaultButtonComponent = !CustomButtonComponent

		const ButtonComponent = isDefaultButtonComponent ? 'button' : CustomButtonComponent
		const buttonComponentChildren = toggleElement || (buttonProps ? buttonProps.children : null) || (toggler ? React.createElement(toggler) : null)

		menuToggler = (
			<ButtonComponent
				aria-haspopup={ togglerAriaHasPopup }
				aria-label={ togglerAriaLabel }
				title={ buttonTitle }
				disabled={ disabled }
				className={ classNames(togglerClassName, buttonClassName, isDefaultButtonComponent ? defaultButtonComponentClassNames : undefined) }
				{...(isDefaultButtonComponent ? defaultButtonComponentProps : buttonProps)}
				ref={ setToggleButtonRef }
				onClick={ onClick }
				onKeyDown={ onKeyDown }
				onBlur={ onBlur }
				aria-expanded={ isExpanded }>
				{ buttonComponentChildren }
			</ButtonComponent>
		)
	} else {
		// Legacy way: the first child was the toggler.
		menuItems = React.Children.toArray(children)
		menuToggler = menuItems.shift()
		menuToggler = (
			<div
				ref={ buttonRef }
				onClick={ onClick }
				onKeyDown={ onKeyDown }
				onBlur={ onBlur }>
				{ React.cloneElement(menuToggler, { ref: togglerRef }) }
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
				ref={listRef}
				aria-label={props['aria-label']}
				tabbable={false}
				scrollMaxItems={0}
				onCollapse={onCollapse}
				onExpand={onExpand}
				onFocusOut={onFocusOut}
				getTogglerNode={getButtonElement}
				focusSelectedItem={false}
				className="rrui__shadow">
				{menuItems}
			</ExpandableList>
		</div>
	)
}

ExpandableMenu.propTypes =
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
	buttonComponent : PropTypes.elementType,
	// `button` is a legacy property name.
	// `buttonComponent` is a new property name.
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

	// A `ref` for the toggle button
	buttonRef: PropTypes.object,

	buttonTitle: PropTypes.string,

	alignment : PropTypes.oneOf(['left', 'right']),

	disabled: PropTypes.bool
}

ExpandableMenu.defaultProps =
{
	// The "x" button icon that closes the `<Select/>`
	// in fullscreen mode on mobile devices.
	closeButtonIcon : CloseIcon
}
