import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { polyfill as reactLifecyclesCompat } from 'react-lifecycles-compat'

import Divider from './Divider'

import { submitFormOnCtrlEnter } from './utility/dom'

@reactLifecyclesCompat
export default class List extends Component
{
	static propTypes =
	{
		selectedItemValue : PropTypes.any,

		onFocusItem : PropTypes.func,
		onKeyDown : PropTypes.func,
		onSpaceBar : PropTypes.func,

		tabbable : PropTypes.bool.isRequired,
		shouldFocus : PropTypes.bool.isRequired,
		focusFirstItemWhenItemsChange : PropTypes.bool.isRequired
	}

	static defaultProps =
	{
		tabbable : true,
		shouldFocus : true,
		focusFirstItemWhenItemsChange : false
	}

	static getDerivedStateFromProps(props, state)
	{
		const newState =
		{
			items : props.items
		}

		// If `items` property is supplied
		// then it's used to detect "on items changed" event.
		if (state.items && state.items !== props.items)
		{
			newState.items = props.items

			// Focus the first item.
			if (props.focusFirstItemWhenItemsChange)
			{
				newState.focusedItemValue = props.items[0].value
				newState.focusedItemIndex = 0
			}
		}

		if (state.selectedItemValue !== props.selectedItemValue)
		{
			newState.selectedItemValue = props.selectedItemValue

			newState.focusedItemValue = props.selectedItemValue
			newState.focusedItemIndex = props.selectedItemValue === undefined ? undefined : findItemIndexByValue(props.selectedItemValue, props.children)
		}

		return newState
	}

	state = {}

	// `ref`s of all items currently rendered.
	itemRefs = {}

	getFocusedItemIndex = () =>
	{
		const { focusedItemIndex } = this.state
		return focusedItemIndex
	}

	unfocus = () =>
	{
		this.setState
		({
			focusedItemIndex : undefined,
			focusedItemValue : undefined
		})
	}

	// Focuses on the list.
	focus = () =>
	{
		const { focusedItemIndex } = this.state

		if (focusedItemIndex !== undefined) {
			return this.focusItem(focusedItemIndex)
		}

		// Focus the first focusable list item.
		this.focusAny()
	}

	getFirstFocusableItemIndex()
	{
		for (const index of Object.keys(this.itemRefs))
		{
			if (this.itemRefs[index]) {
				return parseInt(index)
			}
		}
	}

	findItemIndexByValue(value)
	{
		return findItemIndexByValue(value, this.props.children)
	}

	getItemValue(index)
	{
		const { children } = this.props

		const item = React.Children.toArray(children)[index]
		return item.props.value
	}

	focusItem = (focusedItemIndex) =>
	{
		const { onFocusItem, shouldFocus } = this.props

		this.setState
		({
			// Focus the item.
			focusedItemIndex,
			// Store the focused item value.
			// This is used for cases like autocomplete
			// where the list of options changes but
			// the focused option stays focused.
			focusedItemValue: focusedItemIndex === undefined ? undefined : this.getItemValue(focusedItemIndex)
		},
		() =>
		{
			if (focusedItemIndex !== undefined)
			{
				if (shouldFocus) {
					this.itemRefs[focusedItemIndex].focus()
				}

				if (onFocusItem) {
					onFocusItem(focusedItemIndex)
				}
			}
		})
	}

	onItemSelect = (index, value, onSelect) =>
	{
		const { onSelectItem } = this.props

		if (onSelectItem) {
			onSelectItem(value, index)
		}

		if (onSelect) {
			onSelect()
		}

		// this.focusItem(index)

		// // Collapse the `<Select/>`.
		// // Doing `setValue` in a callback
		// // because otherwise `setValue()` would result in
		// // updating props and calling `getDerivedStateFromProps()`
		// // which reads `autocomplete_value` which is being reset inside `.toggle()`.
		// this.collapse().then(() => this.setValue(value))
	}

	onKeyDown = (event) =>
	{
		const { onKeyDown, onSelectItem, onSpaceBar, children } = this.props
		const { focusedItemIndex } = this.state

		if (onKeyDown) {
			onKeyDown(event)
		}

		if (event.defaultPrevented) {
			return
		}

		if (submitFormOnCtrlEnter(event, this.input)) {
			return
		}

		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}

		if (React.Children.count(children) > 0)
		{
			switch (event.keyCode)
			{
				// "Up" arrow.
				// Select the previous item (if present).
				case 38:
					event.preventDefault()

					const previousIndex = this.getPreviousFocusableItemIndex()

					if (previousIndex !== undefined)
					{
						this.focusItem(previousIndex)
					}

					return

				// "Down" arrow.
				// Select the next item (if present).
				case 40:
					event.preventDefault()

					const nextIndex = this.getNextFocusableItemIndex()

					if (nextIndex !== undefined)
					{
						this.focusItem(nextIndex)
					}

					return

				// "Enter".
				case 13:
					// Choose the focused item on Enter
					event.preventDefault()

					if (focusedItemIndex !== undefined) {
						this.itemRefs[focusedItemIndex].click()
					}

					return

				// "Spacebar".
				case 32:
					// Choose the focused item on Spacebar.
					if (focusedItemIndex !== undefined)
					{
						if (this.itemRefs[focusedItemIndex].tagName.toLowerCase() !== 'button')
						{
							event.preventDefault()
							this.itemRefs[focusedItemIndex].click()
						}
					}

					return
			}
		}
	}

	// refocusThePreviouslyFocusedItem()
	// {
	// 	const { children } = this.props
	// 	const { focusedItemIndex, focusedItemValue } = this.state

	// 	if (focusedItemIndex === undefined) {
	// 		return
	// 	}

	// 	const listItems = React.Children.toArray(children)

	// 	// Re-focus the prevously focused item, if it's present.
	// 	if (focusedItemValue !== undefined)
	// 	{
	// 		let i = 0
	// 		for (const item of listItems)
	// 		{
	// 			if (item.props.value === focusedItemValue)
	// 			{
	// 				return this.setState({
	// 					focusedItemIndex: i
	// 				})
	// 			}
	// 			i++
	// 		}

	// 		// Focus the first focusable list item.
	// 		this.focusAny()
	// 	}

	// 	// If the previously focused option is no longer available
	// 	// (or is not focusable), then focus the first focusable list item.
	// 	if (!this.itemRefs[focusedItemIndex])
	// 	{
	// 		// Focus the first focusable list item.
	// 		this.focusAny()
	// 	}
	// }

	focusAny()
	{
		// Focus the first focusable list item.
		const i = this.getFirstFocusableItemIndex()
		return this.setState
		({
			focusedItemIndex: i,
			focusedItemValue: this.getItemValue(i)
		})
	}

	// Get the previous option (relative to the currently focused option)
	getPreviousFocusableItemIndex()
	{
		const { children } = this.props
		let { focusedItemIndex } = this.state

		if (focusedItemIndex === undefined) {
			focusedItemIndex = React.Children.count(children)
		}

		while (focusedItemIndex > 0) {
			focusedItemIndex--
			if (this.isFocusableItemIndex(focusedItemIndex)) {
				return focusedItemIndex
			}
		}
	}

	// Get the next option (relative to the currently focused option)
	getNextFocusableItemIndex()
	{
		const { children } = this.props
		let { focusedItemIndex } = this.state

		if (focusedItemIndex === undefined) {
			focusedItemIndex = -1
		}

		while (focusedItemIndex < React.Children.count(children) - 1) {
			focusedItemIndex++
			if (this.isFocusableItemIndex(focusedItemIndex)) {
				return focusedItemIndex
			}
		}
	}

	isFocusableItemIndex = (index) => this.itemRefs[index] !== undefined
	isFocusableItem = (item) => item.type !== Divider

	// `this.list` is also being accessed from `<ScrollableList/>`.
	storeListNode = (node) => this.list = node

	render()
	{
		const
		{
			alignment,
			upward,
			disabled,
			tabbable,
			getItemValue,
			className,
			style,
			itemStyle,
			children
		}
		= this.props

		const
		{
			focusedItemIndex
		}
		= this.state

		return (
			<ul
				ref={ this.storeListNode }
				onKeyDown={ this.onKeyDown }
				style={ style }
				className={ classNames
				(
					className,
					'rrui__list'
				) }>
				{ React.Children.map(children, (item, i) =>
				{
					return React.cloneElement(item,
					{
						key          : i, // this.getItemKey(i),
						index        : i,
						itemRef      : this.isFocusableItem(item) ? ref => this.itemRefs[i] = ref : undefined, // this.itemRefs[this.getItemKey(i)] = ref,
						style        : item.props.style ? (itemStyle ? { ...item.props.style, ...itemStyle } : item.props.style) : itemStyle,
						tabIndex     : tabbable && (focusedItemIndex === undefined ? i === 0 : focusedItemIndex === i) ? 0 : -1,
						focus        : this.focusItem,
						focused      : focusedItemIndex === i,
						selected     : getItemValue && item.value === getItemValue(i),
						disabled     : disabled || item.props.disabled,
						isSelectable : item.type !== Divider,
						// onMouseDown  : item.type === Divider ? event => event.preventDefault() : undefined,
						onSelect     : item.type === Divider ? undefined : (index, value) => this.onItemSelect(index, value, item.props.onSelect),
						className    : item.type === Divider ? classNames(item.props.className, 'rrui__divider--list') : item.props.className
					})
				}) }
			</ul>
		)
	}
}

export class Item extends React.Component
{
	onMouseDown = (event) =>
	{
		const { isSelectable, focus, index } = this.props

		// Without this Safari (both mobile and desktop)
		// won't select any item in an expanded list
		// because it will collapse the list immediately
		// on `mouseDown` due to `blur` event being fired.
		event.preventDefault()

		if (isSelectable) {
			focus(index)
		}
	}

	onFocus = (event) =>
	{
		const { isSelectable, focus, index } = this.props

		if (isSelectable) {
			focus(index)
		}
	}

	onClick = (event) =>
	{
		const { isSelectable, onSelect, index, value } = this.props

		if (isSelectable) {
			onSelect(index, value)
		}
	}

	render()
	{
		const
		{
			itemRef,
			value,
			content,
			label,
			icon,
			link,
			focused,
			selected,
			disabled,
			className,
			children,
			// Rest.
			index,
			focus,
			isSelectable,
			...rest
		}
		= this.props

		const specificProps = {}

		if (link) {
			specificProps.href = link
		} else {
			specificProps.type = 'button'
		}

		const ItemComponent = link ? 'a' : 'button'

		return (
			<li className="rrui__list__list-item">
				<ItemComponent
					ref={ itemRef }
					onMouseDown={ this.onMouseDown }
					onClick={ this.onClick }
					onFocus={ this.onFocus }
					disabled={ disabled }
					aria-label={ label }
					className={ classNames
					(
						className,
						'rrui__list__item',
						'rrui__button-reset',
						{
							'rrui__button-reset--link'   : link,
							'rrui__list__item--selected' : selected,
							'rrui__list__item--focused'  : focused,
							'rrui__list__item--disabled' : disabled
						}
					) }
					{...specificProps}
					{...rest}>

					{/* Icon. */}
					{ icon &&
						<div className="rrui__list__item-icon">
							{React.createElement(icon, { value, label })}
						</div>
					}

					{/* Label (or content). */}
					{ children || (content ? content({ value, label }) : <span className="rrui__list__item-label">{label}</span>) }
				</ItemComponent>
			</li>
		)
	}
}

List.Item = Item

function haveItemsChanged(props, prevProps)
{
	const items     = React.Children.toArray(props.children)
	const prevItems = React.Children.toArray(prevProps.children)

	if (items.length !== prevItems.length) {
		return true
	}

	let i = 0
	while (i < items.length)
	{
		if (items[i].props.value !== prevItems[i].props.value) {
			return true
		}
		i++
	}

	return false
}

export function findItemIndexByValue(value, children)
{
	const items = React.Children.toArray(children)

	let i = 0
	for (const item of items)
	{
		if (item.props.value === value) {
			return i
		}
		i++
	}
}