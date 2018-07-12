import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { getScrollbarWidth } from './utility/dom'

export default class ScrollableList extends Component
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

		onSelectItem : PropTypes.func,

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
	unfocus = () => this.list.unfocus()
	onListItemsChanged = () => this.list.onListItemsChanged()
	onKeyDown = (event) => this.list.onKeyDown(event)
	getFocusedItemIndex = () => this.list.getFocusedItemIndex()
	focusItem = (index) => this.list.focusItem(index)

	onFocusItem = (index) => this.showItem(index)

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
		}

		this.setState(state)
	}

	calculateScrollableListHeight(height, verticalPadding)
	{
		const { scrollMaxItems, children } = this.props

		// Adding vertical padding here so that it shows `scrollMaxItems` items fully.
		// Also gives a peek on the `scrollMaxItems + 1`th item by showing a half of it.
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

		// getSelectedItemIndex={ this.getSelectedItemIndex }

		let itemStyle

		// on overflow the vertical scrollbar will take up space
		// reducing padding-right and the only way to fix that
		// is to add additional padding-right
		//
		// a hack to restore padding-right taken up by a vertical scrollbar
		if (this.isOverflown() && scrollBarPadding)
		{
			itemStyle = { marginRight: getScrollbarWidth() + 'px' }
		}

		return (
			<List
				ref={ this.storeListRef }
				onFocusItem={ this.onFocusItem }
				style={ listStyle }
				itemStyle={ itemStyle }
				className={ classNames(className,
				{
					'rrui__scrollable' : this.isOverflown()
				}) }
				{...rest}>
				{ children }
			</List>
		)
	}

	// renderItems()
	// {
	// 	const { items, scrollBarPadding } = this.props
	//
	// 	let itemStyle
	//
	// 	// on overflow the vertical scrollbar will take up space
	// 	// reducing padding-right and the only way to fix that
	// 	// is to add additional padding-right
	// 	//
	// 	// a hack to restore padding-right taken up by a vertical scrollbar
	// 	if (this.isOverflown() && scrollBarPadding)
	// 	{
	// 		itemStyle = { marginRight: getScrollbarWidth() + 'px' }
	// 	}
	//
	// 	return items.map(({ value, label, icon, content }, i) => (
	// 		<List.Item
	// 			key={ i }
	// 			value={ value }
	// 			label={ label }
	// 			icon={ icon }
	// 			content={ content }
	// 			style={ itemStyle }/>
	// 	))
	// }
}

// // There can be an `undefined` value,
// // so just `{ value }` won't do here.
// function getItemKey(value)
// {
// 	return valueIsEmpty(value) ? '@@rrui/select/undefined' : value
// }

// function valueIsEmpty(value)
// {
// 	return value === null || value === undefined
// }