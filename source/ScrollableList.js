import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import List from './List'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

export default class ScrollableList extends PureComponent
{
	static propTypes =
	{
		// // A list of items.
		// items : PropTypes.arrayOf
		// (
		// 	PropTypes.shape
		// 	({
		// 		// Item value (may be `undefined`).
		// 		value : PropTypes.any,
		// 		// Item label (may be `undefined`).
		// 		label : PropTypes.string,
		// 		// Item icon component.
		// 		icon  : PropTypes.func,
		// 		// Render custom content (a React component).
		// 		// Receives `{ value, label }` properties.
		// 		content : PropTypes.func
		// 	})
		// ),

		// Maximum items fitting the list height (scrollable).
		// Set to `0` to disable overflow.
		// Is `6` by default.
		scrollMaxItems : PropTypes.number.isRequired,

		// Whether should add `margin-right` for scrollbar width on overflow.
		// Is `true` by default.
		scrollBarPadding : PropTypes.bool,

		className : PropTypes.string
	}

	static defaultProps =
	{
		scrollMaxItems : 6,
		scrollBarPadding : true
	}

	state =
	{
		// Is initialized during the first `componentDidUpdate()` call.
		verticalPadding : 0
	}

	// Proxy `<List/>` methods.
	focusItem = (index) => this.list.focusItem(index)
	focus = () => this.list.focus()
	clearFocus = () => this.list.clearFocus()
	onListItemsChanged = () => this.list.onListItemsChanged()
	onKeyDown = (event) => this.list.onKeyDown(event)
	chooseFocusedItem = () => this.list.chooseFocusedItem()
	getFocusedItemIndex = () => this.list.getFocusedItemIndex()
	focusItem = (index) => this.list.focusItem(index)

	onFocusItem = (index, options) => {
		const { onFocusItem } = this.props
		if (onFocusItem) {
			onFocusItem(index, options)
		}
		// When `<List/>` calls `.focusItem()` in `componentDidMount()`
		// `this.list` doesn't exist yet, hence the check.
		if (index !== undefined && this.list) {
			this.showItem(index)
		}
	}

	getListNode = () => this.list.list

	// Fully shows an option having the `value` (scrolls to it if neccessary)
	showItem(index, edge = 'top')
	{
		const { children } = this.props

		const itemElement = this.list.itemRefs[index]

		const isFirstItem = index === 0
		const isLastItem  = index === React.Children.count(children) - 1

		if (isFirstItem) {
			return this.showTopLine(itemElement, true)
		} else if (isLastItem) {
			return this.showBottomLine(itemElement, true)
		}

		switch (edge)
		{
			case 'top':
				return this.showTopLine(itemElement)
			case 'bottom':
				return this.showBottomLine(itemElement)
		}
	}

	showTopLine(itemElement, isFirstItem)
	{
		const { verticalPadding } = this.state

		let topLine = itemElement.offsetTop

		if (isFirstItem) {
			topLine -= verticalPadding
		}

		if (topLine < this.getListNode().scrollTop) {
			this.getListNode().scrollTop = topLine
		}
	}

	showBottomLine(itemElement, isLastItem)
	{
		const { verticalPadding } = this.state

		let bottomLine = itemElement.offsetTop + itemElement.offsetHeight

		if (isLastItem) {
			bottomLine += verticalPadding
		}

		if (bottomLine > this.getListNode().scrollTop + this.getListNode().offsetHeight) {
			this.getListNode().scrollTop = bottomLine - this.getListNode().offsetHeight
		}
	}

	storeListRef = (ref) => this.list = ref

	itemOnClick(value, event)
	{
		// Collapse the `<Select/>`.
		// Doing `setValue` in a callback
		// because otherwise `setValue()` would result in
		// updating props and calling `getDerivedStateFromProps()`
		// which reads `autocomplete_value` which is being reset inside `.toggle()`.
		this.expandable.collapse().then(() => this.setValue(value))
	}

	// Calculates height of the item list.
	calculateHeight()
	{
		const { children } = this.props

		const height = this.getListNode().scrollHeight
		const verticalPadding = parseInt(window.getComputedStyle(this.getListNode()).paddingTop)

		const state = { height, verticalPadding }

		// Calculate the appropriate list height.
		if (this.isOverflown()) {
			state.maxHeight = this.calculateScrollableListHeight(height, verticalPadding)
			// Update `max-height` immediately, without waiting for the next React render cycle.
			this.list.getDOMNode().style.maxHeight = state.maxHeight + 'px'
		}

		this.setState(state)
	}

	calculateScrollableListHeight(height, verticalPadding)
	{
		const { scrollMaxItems, children } = this.props

		// Adding vertical padding here so that it shows `scrollMaxItems` items fully.
		// Also gives a peek on the `scrollMaxItems + 1`th item by showing a half of it.
		// Assumes items having equal height.
		return (height - 2 * verticalPadding) * ((scrollMaxItems + 0.5) / React.Children.count(children)) + verticalPadding
	}

	isOverflown()
	{
		const { scrollMaxItems, children } = this.props
		return scrollMaxItems > 0 && React.Children.count(children) > scrollMaxItems
	}

	componentDidMount()
	{
		this.calculateHeight()
	}

	render()
	{
		const
		{
			scrollBarPadding,
			className,
			children,
			...rest
		}
		= this.props

		const { maxHeight } = this.state

		let listStyle

		// Makes the list scrollable if it's max height is constrained.
		if (maxHeight !== undefined)
		{
			listStyle = { maxHeight: `${maxHeight}px` }
		}

		return (
			<List
				{...rest}
				ref={ this.storeListRef }
				onFocusItem={ this.onFocusItem }
				style={ listStyle }
				className={ classNames(className,
				{
					'rrui__scrollable' : this.isOverflown()
				}) }>
				{ children }
			</List>
		)
	}
}