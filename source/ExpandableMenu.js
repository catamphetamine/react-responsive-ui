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
		closeButtonIcon : PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf([false])]).isRequired
	}

	static defaultProps =
	{
		// The "x" button icon that closes the `<Select/>`
		// in fullscreen mode on mobile devices.
		closeButtonIcon : CloseIcon
	}

	onCollapse = ({ focusOut }) =>
	{
		if (!focusOut) {
			this.focus()
		}
	}

	focus = () => focus(this.toggler)

	expand   = () => this.list.expand()
	collapse = () => this.list.collapse()
	toggle   = () => this.list.toggle()

	storeListRef = (ref) => this.list = ref
	storeTogglerRef = (ref) => this.toggler = ref
	storeTogglerNode = (node) => this.togglerNode = node
	getTogglerNode = () => this.togglerNode

	onBlur = (event) => this.list && this.list.onBlur(event)

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
			children
		}
		= this.props

		const menuItems = React.Children.toArray(children)
		const toggler = menuItems.shift()

		return (
			<div
				style={ style }
				className={ classNames('rrui__menu', className) }>

				<div
					ref={ this.storeTogglerNode }
					onBlur={ this.onBlur }
					onClick={ this.toggle }
					onKeyDown={ this.onKeyDown }>

					{ React.cloneElement(toggler, { ref : this.storeTogglerRef }) }
				</div>

				<ExpandableList
					ref={this.storeListRef}
					upward={upward}
					alignment={alignment}
					scrollIntoView={scrollIntoView}
					scrollMaxItems={0}
					onCollapse={this.onCollapse}
					onExpand={this.onExpand}
					onClickOutside={this.collapse}
					onFocusOut={this.collapse}
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