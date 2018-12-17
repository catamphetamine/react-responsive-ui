import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

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

		toggler : PropTypes.func,
		togglerAriaLabel : PropTypes.string,
		togglerAriaHasPopup : PropTypes.string,
		togglerClassName : PropTypes.string
	}

	static defaultProps =
	{
		// The "x" button icon that closes the `<Select/>`
		// in fullscreen mode on mobile devices.
		closeButtonIcon : CloseIcon
	}

	state = {}

	onExpand = () => this.setState({ isExpanded: true })

	onCollapse = ({ focusOut }) =>
	{
		if (!focusOut) {
			this.focus()
		}
		this.setState({ isExpanded: false })
	}

	// `this.toggler` is deprecated.
	focus = () => focus(this.toggler || this.togglerNode)

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

	// `this.togglerNode` is only used to determine
	// whether the focus is "inside" the component or "outside" of it.
	storeTogglerNode = (node) => this.togglerNode = node
	getTogglerNode = () => this.togglerNode

	render()
	{
		const
		{
			upward,
			alignment,
			scrollIntoView,
			closeButtonIcon,
			closeLabel,
			style,
			className,
			toggler,
			togglerAriaLabel,
			togglerAriaHasPopup,
			togglerClassName,
			children
		}
		= this.props

		const { isExpanded } = this.state

		let menuToggler
		let menuItems

		if (toggler) {
			menuItems = children
			const togglerElement = React.createElement(toggler)
			menuToggler = (
				<button
					ref={ this.storeTogglerNode }
					onClick={ this.onClick }
					onKeyDown={ this.onKeyDown }
					onBlur={ this.onBlur }
					aria-haspopup={ togglerAriaHasPopup }
					aria-label={ togglerAriaLabel }
					aria-expanded={ isExpanded ? true : false }
					className={ togglerClassName }>
					{ togglerElement }
				</button>
			)
		} else {
			menuItems = React.Children.toArray(children)
			menuToggler = menuItems.shift()
			menuToggler = (
				<div
					ref={ this.storeTogglerNode }
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
					ref={this.storeListRef}
					upward={upward}
					alignment={alignment}
					scrollIntoView={scrollIntoView}
					scrollMaxItems={0}
					onCollapse={this.onCollapse}
					onExpand={this.onExpand}
					onTapOutside={this.onFocusOut}
					onFocusOut={this.onFocusOut}
					getTogglerNode={this.getTogglerNode}
					closeButtonIcon={closeButtonIcon}
					closeLabel={closeLabel}
					focusSelectedItem={false}
					className="rrui__shadow">
					{menuItems}
				</ExpandableList>
			</div>
		)
	}

	onBlur = (event) => this.list && this.list.onBlur(event)

	onClick = (event) =>
	{
		const { disabled } = this.props

		if (!disabled) {
			this.toggle()
		}
	}

	onKeyDown = (event) =>
	{
		const { disabled } = this.props

		if (disabled) {
			return
		}

		if (event.defaultPrevented) {
			return
		}

		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}

		switch (event.keyCode)
		{
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
}