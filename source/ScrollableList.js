import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import List from './List'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

export default class ScrollableList_ extends PureComponent {
	// Proxy `<List/>` methods.
	focusItem = (index) => this.list.focusItem(index)
	focus = () => this.list.focus()
	clearFocus = () => this.list.clearFocus()
	onListItemsChanged = () => this.list.onListItemsChanged()
	onKeyDown = (event) => this.list.onKeyDown(event)
	chooseFocusedItem = () => this.list.chooseFocusedItem()
	getFocusedItemIndex = () => this.list.getFocusedItemIndex()
	focusItem = (index) => this.list.focusItem(index)

	// Re-calculates `<ScrollableList/>` `height`/`maxHeight`/`verticalPadding`.
	state = {}
	onExpand = () => {
		this.setState({
			calculateLayoutTrigger: {}
		})
	}

	storeListRef = (ref) => this.list = ref

	render() {
		return (
			<ScrollableList
				listRef={this.storeListRef}
				calculateLayoutTrigger={this.state.calculateLayoutTrigger}
				{...this.props}
			/>
		)
	}
}

const ScrollableList = React.forwardRef(({
	listRef,
	onFocusItem: onFocusItem_,
	scrollBarPadding,
	scrollMaxItems,
	ScrollableContainer,
	calculateLayoutTrigger,
	className,
	children,
	...rest
}, ref) => {
	const list = useRef()

	const storeListRef = useCallback((instance) => {
		if (listRef) {
			if (typeof listRef === 'function') {
				listRef(instance)
			} else {
				listRef.current = instance
			}
		}
		list.current = instance
	}, [])

	// Is initialized during the first `componentDidUpdate()` call.
	const [verticalPadding, setVerticalPadding] = useState(0)

	const [height, setHeight] = useState()
	const [maxHeight, setMaxHeight] = useState()

	const getListNode = useCallback(() => list.current.list, [])

	const showTopLine = useCallback((itemElement, isFirstItem) =>
	{
		let topLine = itemElement.offsetTop

		if (isFirstItem) {
			topLine -= verticalPadding
		}

		if (topLine < getListNode().scrollTop) {
			getListNode().scrollTop = topLine
		}
	}, [
		verticalPadding,
		getListNode
	])

	const showBottomLine = useCallback((itemElement, isLastItem) =>
	{
		let bottomLine = itemElement.offsetTop + itemElement.offsetHeight

		if (isLastItem) {
			bottomLine += verticalPadding
		}

		if (bottomLine > getListNode().scrollTop + getListNode().offsetHeight) {
			getListNode().scrollTop = bottomLine - getListNode().offsetHeight
		}
	}, [
		verticalPadding,
		getListNode
	])

	// Fully shows an option having the `value` (scrolls to it if neccessary)
	const showItem = useCallback((index, edge = 'top') =>
	{
		const itemElement = list.current.itemRefs[index]

		const isFirstItem = index === 0
		const isLastItem  = index === React.Children.count(children) - 1

		if (isFirstItem) {
			return showTopLine(itemElement, true)
		} else if (isLastItem) {
			return showBottomLine(itemElement, true)
		}

		switch (edge) {
			case 'top':
				return showTopLine(itemElement)
			case 'bottom':
				return showBottomLine(itemElement)
		}
	}, [
		showTopLine,
		showBottomLine,
		children
	])

	const onFocusItem = useCallback((index, options) => {
		if (onFocusItem_) {
			onFocusItem_(index, options)
		}
		// When `<List/>` calls `.focusItem()` in `componentDidMount()`
		// `list.current` doesn't exist yet, hence the check.
		if (index !== undefined && list.current) {
			showItem(index)
		}
	}, [
		onFocusItem_,
		showItem
	])

	const isOverflown = () =>
	{
		return scrollMaxItems > 0 && React.Children.count(children) > scrollMaxItems
	}

	const calculateScrollableListHeight = (height, verticalPadding) =>
	{
		// Adding vertical padding here so that it shows `scrollMaxItems` items fully.
		// Also gives a peek on the `scrollMaxItems + 1`th item by showing a half of it.
		// Assumes items having equal height.
		return (height - 2 * verticalPadding) * ((scrollMaxItems + 0.5) / React.Children.count(children)) + verticalPadding
	}

	// Calculates height of the item list.
	const calculateLayout = () =>
	{
		const height = getListNode().scrollHeight
		const verticalPadding = parseInt(window.getComputedStyle(getListNode()).paddingTop)

		// Calculate the appropriate list height.
		if (isOverflown()) {
			const maxHeight = calculateScrollableListHeight(height, verticalPadding)

			if (!ScrollableContainer) {
				// Update `max-height` immediately, without waiting for the next React render cycle.
				list.current.getDOMNode().style.maxHeight = maxHeight + 'px'
			}

			setMaxHeight(maxHeight)
		}

		setHeight(height)
		setVerticalPadding(verticalPadding)
	}

	useEffect(() => {
		calculateLayout()
	}, [calculateLayoutTrigger])

	const maxHeightStyle = useMemo(() => {
		if (maxHeight !== undefined) {
			// Makes the list scrollable if it's max height is constrained.
			return {
				maxHeight: `${maxHeight}px`
			}
		}
	}, [maxHeight])

	const listElement = (
		<List
			{...rest}
			ref={storeListRef}
			onFocusItem={onFocusItem}
			style={ScrollableContainer ? undefined : maxHeightStyle}
			className={classNames(className, {
				'rrui__scrollable': ScrollableContainer ? undefined : isOverflown()
			})}>
			{children}
		</List>
	)

	if (ScrollableContainer) {
		return (
			<ScrollableContainer style={maxHeightStyle} maxHeight={maxHeight}>
				{listElement}
			</ScrollableContainer>
		)
	}

	return listElement
})

ScrollableList.propTypes =
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

	ScrollableContainer : PropTypes.elementType,

	listRef : PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object
	]),

	className : PropTypes.string
}

ScrollableList.defaultProps =
{
	scrollMaxItems : 6,
	scrollBarPadding : true
}
