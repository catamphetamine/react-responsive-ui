import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { polyfill as reactLifecyclesCompat } from 'react-lifecycles-compat'

import Divider from './Divider'

import { submitFormOnCtrlEnter } from './utility/dom'
import { focus } from './utility/focus'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

// Workaround for `react-hot-loader`.
// https://github.com/gaearon/react-hot-loader#checking-element-types
const DividerType = <Divider/>.type

@reactLifecyclesCompat
export default class List extends PureComponent
{
	static propTypes =
	{
		value : PropTypes.any,
		onChange : PropTypes.func,
		// Legacy method, use `onChange` instead.
		onSelectItem : PropTypes.func,
		highlightSelectedItem : PropTypes.bool.isRequired,

		onFocusItem : PropTypes.func,
		onKeyDown : PropTypes.func,

		tabbable : PropTypes.bool.isRequired,
		shouldFocus : PropTypes.bool.isRequired,
		focusFirstItemWhenItemsChange : PropTypes.bool.isRequired,
		shouldCreateButtons : PropTypes.bool.isRequired
	}

	static defaultProps =
	{
		tabbable : true,
		shouldFocus : true,
		focusFirstItemWhenItemsChange : false,
		shouldCreateButtons : true,
		highlightSelectedItem : true
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

		if (state.selectedItemValue !== props.value)
		{
			newState.selectedItemValue = props.value

			newState.focusedItemValue = props.value
			newState.focusedItemIndex = props.value === undefined ? undefined : findItemIndexByValue(props.value, props.children)
		}

		return newState
	}

	state = {}

	// `ref`s of all items currently rendered.
	itemRefs = []

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
		let i = 0
		while (i < this.itemRefs.length)
		{
			if (this.itemRefs[i]) {
				return i
			}
		}
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
					focus(this.itemRefs[focusedItemIndex])
				}

				if (onFocusItem) {
					onFocusItem(focusedItemIndex)
				}
			}
		})
	}

	onKeyDown = (event) =>
	{
		const { onKeyDown, children } = this.props
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

					if (previousIndex !== undefined) {
						this.focusItem(previousIndex)
					}

					return

				// "Down" arrow.
				// Select the next item (if present).
				case 40:
					event.preventDefault()

					const nextIndex = this.getNextFocusableItemIndex()

					if (nextIndex !== undefined) {
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

	isFocusableItem = (item) => item.type !== DividerType

	// `this.list` is also being accessed from `<ScrollableList/>`.
	storeListNode = (node) => this.list = node

	storeItemRef = (ref, i) => this.itemRefs[i] = ref

	render()
	{
		const
		{
			disabled,
			tabbable,
			value,
			onChange,
			// `onSelectItem` is deprecated, use `onChange` instead.
			onSelectItem,
			highlightSelectedItem,
			shouldCreateButtons,
			className,
			style,
			children
		}
		= this.props

		const { focusedItemIndex } = this.state

		return (
			<ul
				ref={ this.storeListNode }
				onKeyDown={ this.onKeyDown }
				style={ style }
				className={ classNames(className, 'rrui__list') }>

				{ React.Children.map(children, (item, i) =>
				{
					if (item.type !== ItemType) {
						throw new Error(`Only <List.Item/>s can be placed inside a <List/> (and remove any whitespace).`)
					}

					return React.cloneElement(item,
					{
						key       : i,
						index     : i,
						itemRef   : this.isFocusableItem(item) ? this.storeItemRef : undefined,
						focus     : this.focusItem,
						focused   : focusedItemIndex === i,
						disabled  : disabled || item.props.disabled,
						tabIndex  : tabbable && (focusedItemIndex === undefined ? i === 0 : focusedItemIndex === i) ? 0 : -1,
						shouldCreateButton : shouldCreateButtons,
						onSelectItem : onChange || onSelectItem,
						selectedItemValue : value,
						highlightSelectedItem : (onChange || onSelectItem) && highlightSelectedItem
					})
				}) }
			</ul>
		)
	}
}

export class Item extends React.Component
{
	static propTypes =
	{
		value : PropTypes.any,
		index : PropTypes.number,
		focused : PropTypes.bool,
		onSelect : PropTypes.func,
		onSelectItem : PropTypes.func,
		selectedItemValue : PropTypes.any,
		highlightSelectedItem : PropTypes.bool,
		shouldCreateButton : PropTypes.bool
	}

	onMouseDown = (event) =>
	{
		const
		{
			value,
			index,
			focus,
			children
		}
		= this.props

		const onMouseDown = this.shouldCreateButton() ? this.props.onMouseDown : children.props.onMouseDown

		// Without this Safari (both mobile and desktop)
		// won't select any item in an expanded list
		// because it will collapse the list immediately
		// on `mouseDown` due to `blur` event being fired.
		event.preventDefault()

		if (this.isSelectable()) {
			focus(index)
		}

		if (onMouseDown) {
			onMouseDown(event)
		}
	}

	onFocus = (event) =>
	{
		const
		{
			value,
			focus,
			index,
			children
		}
		= this.props

		const onFocus = this.shouldCreateButton() ? this.props.onFocus : children.props.onFocus

		if (this.isSelectable()) {
			focus(index)
		}

		if (onFocus) {
			onFocus(event)
		}
	}

	onClick = (event) =>
	{
		const
		{
			onSelect,
			onSelectItem,
			index,
			value,
			children
		}
		= this.props

		const onClick = this.shouldCreateButton() ? this.props.onClick : children.props.onClick

		if (this.isSelectable())
		{
			if (onSelect) {
				onSelect(value, index)
			}
			if (onSelectItem) {
				onSelectItem(value, index)
			}
		}

		if (onClick) {
			onClick(event)
		}
	}

	isSelectable()
	{
		const { children } = this.props
		return children.type !== DividerType
	}

	focus = () =>
	{
		const { children } = this.props

		focus(React.Children.toArray(children)[0])
	}

	storeRef = (ref) =>
	{
		const { itemRef, index } = this.props

		if (itemRef) {
			itemRef(ref, index)
		}
	}

	shouldCreateButton()
	{
		const { onSelect, onSelectItem, shouldCreateButton } = this.props

		return this.isSelectable() && (onSelect || (onSelectItem && shouldCreateButton))
	}

	render()
	{
		const
		{
			value,
			icon,
			focused,
			disabled,
			className,
			tabIndex,
			highlightSelectedItem,
			selectedItemValue,
			children
		}
		= this.props

		// Throws an error for some weird reason.
		// React.Children.only(children)

		if (React.Children.count(children) !== 1) {
			throw new Error(`Each <List.Item/> must have a single child (and remove any whitespace).`)
		}

		const properties =
		{
			ref          : this.storeRef,
			onMouseDown  : this.onMouseDown,
			onClick      : this.onClick,
			onFocus      : this.onFocus,
			className    : classNames
			(
				className,
				'rrui__list__item',
				{
					'rrui__list__item--focused'  : focused,
					'rrui__list__item--selected' : highlightSelectedItem && this.shouldCreateButton() && value === selectedItemValue,
					'rrui__list__item--disabled' : disabled,
					'rrui__list__item--divider'  : children.type === DividerType
				}
			)
		}

		let ItemComponent
		let itemChildren
		let label

		if (this.shouldCreateButton())
		{
			ItemComponent = 'button'
			label = this.props.label || children
			properties.type = 'button'
			properties['aria-label'] = label
			properties.tabIndex = tabIndex
			properties.disabled = disabled
			properties.className = classNames(properties.className, 'rrui__button-reset', 'rrui__list__item--button')

			// Replace `itemChildren` array with `<React.Fragment/>`
			// in some future when React >= 16.2.0 is common.
			//
			// <React.Fragment>
			// 	{/* Icon. */}
			// 	{ icon &&
			// 		<div className="rrui__list__item-icon">
			// 			{ React.createElement(icon, { value, label }) }
			// 		</div>
			// 	}
			//
			// 	{/* Label (or content). */}
			// 	{ children }
			// </React.Fragment>

			// Label (or content).
			itemChildren = React.Children.toArray(children)

			// Icon.
			if (icon)
			{
				itemChildren.unshift((
					<div key='icon' className="rrui__list__item-icon">
						{ React.createElement(icon, { value, label }) }
					</div>
				))
			}
		}
		else
		{
			// Don't overwrite `className` already defined on the `children`.
			properties.className = classNames(properties.className, children.props && children.props.className)
		}

		return (
			<li className="rrui__list__list-item">
				{ ItemComponent && React.createElement(ItemComponent, properties, itemChildren) }
				{ !ItemComponent && React.cloneElement(children, properties) }
			</li>
		)
	}
}

List.Item = Item

// Workaround for `react-hot-loader`.
// https://github.com/gaearon/react-hot-loader#checking-element-types
const ItemType = <Item/>.type

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

	console.error(`Item with value ${value} not found in a <List/>. Available values: ${items.length > 0 ? items.map(_ => _.props.value).join(', ') : '(none)'}.`)
}