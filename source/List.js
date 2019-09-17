import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Divider from './Divider'

import { submitFormOnCtrlEnter } from './utility/dom'
import { onBlur, focus } from './utility/focus'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

export default class List extends PureComponent
{
	static propTypes =
	{
		// (optional) HTML `id` attribute.
		// Can be used for WAI-ARIA stuff.
		// Example: `<input role="combobox"/>` with `aria-owns={listId}`.
		id : PropTypes.string,

		value : PropTypes.any,
		onChange : PropTypes.func,

		// If a `<List/>` has `onChange` then it wraps `<List.Item/>`s with `<button/>`s.
		// The `onChange` added by `<ExpandableList/>` overrides the original `onChange`.
		// If there was no `onChange` — there will be one.
		// So to retain that info `hasOnChange` property is used as a workaround.
		// `undefined` means "ignore this property".
		hasOnChange : PropTypes.bool,

		// If `items` property is supplied then it's used to
		// detect "on items changed" event in `getDerivedStateFromProps`.
		// It seems to be the only usage of the `items` property.
		items : PropTypes.arrayOf(PropTypes.object),

		// Legacy method, use `onChange` instead.
		onSelectItem : PropTypes.func,
		highlightSelectedItem : PropTypes.bool.isRequired,

		onFocusIn : PropTypes.func,
		onFocusItem : PropTypes.func,
		onKeyDown : PropTypes.func,

		// ARIA `role` attribute.
		role : PropTypes.string,

		// If a `<List/>` is `expandable`
		// then it won't be `.rrui__list:not(.rrui__list--focus)`.
		// `.rrui__list:not(.rrui__list--focus)` is only for standalone lists.
		expandable : PropTypes.bool,

		tabbable : PropTypes.bool.isRequired,
		shouldFocus : PropTypes.bool.isRequired,
		highlightFirstItem : PropTypes.bool.isRequired,
		createButtons : PropTypes.bool.isRequired,

		// For select options list keyboard navigation via typing.
		resetInputTimeout : PropTypes.number.isRequired
	}

	static defaultProps =
	{
		tabbable : true,
		shouldFocus : true,
		highlightFirstItem : false,
		createButtons : true,
		highlightSelectedItem : true,
		resetInputTimeout : 1000
	}

	state = {
		items: this.props.items
	}

	// `ref`s of all items currently rendered.
	itemRefs = []

	// For select options list keyboard navigation via typing.
	input = ''

	componentDidMount()
	{
		const {
			highlightFirstItem
		} = this.props

		if (highlightFirstItem) {
			this.focusItem(0)
		}

		this._isMounted = true
	}

	componentDidUpdate(prevProps, prevState)
	{
		const {
			value,
			items,
			children,
			highlightSelectedItem,
			highlightFirstItem
		} = this.props

		// If `items` property is supplied
		// then it's used to detect "on items changed" event.
		if (prevState.items && prevState.items !== items)
		{
			this.setState({ items })
			// `findItemIndexByValue()` must return `undefined` for "no such item".
			const selectedItemIndex = highlightSelectedItem ? findItemIndexByValue(value, children) : undefined
			this.focusItem(selectedItemIndex === undefined ? (highlightFirstItem ? 0 : undefined) : selectedItemIndex)
		}
	}

	componentWillUnmount()
	{
		this._isMounted = false
		clearTimeout(this.blurTimer)
		clearTimeout(this.resetInputTimer)
	}

	chooseFocusedItem() {
		const { focusedItemIndex } = this.state
		if (focusedItemIndex !== undefined) {
			const itemRef = this.itemRefs[focusedItemIndex]
			if (itemRef.click) {
				itemRef.click()
			}
		}
	}

	getFocusedItemIndex = () => this.state.focusedItemIndex
	clearFocus = () => this.focusItem()
	// Deprecated method name.
	unfocus = this.clearFocus

	// Focuses the list.
	focus = () => {
		const { focusedItemIndex } = this.state
		if (focusedItemIndex !== undefined) {
			return this.focusItem(focusedItemIndex)
		}
		// // Focus the first focusable list item.
		// this.focusItem(this.getFirstFocusableItemIndex())
		this.list.focus()
	}

	getFirstFocusableItemIndex()
	{
		let i = 0
		while (i < this.itemRefs.length) {
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

	// Can be public API for programmatically focusing a certain `<List.Item/>`.
	focusItem = (focusedItemIndex, options = {}) =>
	{
		const { onFocusItem, shouldFocus } = this.props

		if (onFocusItem) {
			onFocusItem(focusedItemIndex, options)
		}

		this.setState({
			// Focus the item.
			focusedItemIndex,
			// Store the focused item value.
			// This is used for cases like autocomplete
			// where the list of options changes but
			// the focused option stays focused.
			focusedItemValue: focusedItemIndex === undefined ? undefined : this.getItemValue(focusedItemIndex)
		}, () => {
			// Actually focus the item.
			if (focusedItemIndex !== undefined) {
				if (shouldFocus && this._isMounted) {
					if (!focus(this.itemRefs[focusedItemIndex])) {
						console.error(`<List.Item/> #${focusedItemIndex + 1}'s child component doesn't have a ".focus()" method.`)
					}
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
						this.focusItem(previousIndex, { interaction: true })
					}

					return

				// "Down" arrow.
				// Select the next item (if present).
				case 40:
					event.preventDefault()

					const nextIndex = this.getNextFocusableItemIndex()

					if (nextIndex !== undefined) {
						this.focusItem(nextIndex, { interaction: true })
					}

					return
			}
		}
	}

	onKeyPress = (event) => {
		const { resetInputTimeout } = this.props
		const characters = event.char || String.fromCharCode(event.charCode)
		if (characters) {
			this.input += characters
			this.onInput()
			clearTimeout(this.resetInputTimer)
			this.resetInputTimer = setTimeout(this.resetInput, resetInputTimeout)
		}
	}

	onInput() {
		const { children } = this.props
		const index = findItemIndexByLabel(this.input, children)
		if (index !== undefined) {
			this.focusItem(index)
		}
	}

	resetInput = () => this.input = ''
	isInputInProgress = () => this.input !== ''

	onInputSpacebar = () => {
		if (this.input) {
			this.input += ' '
		}
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

	onItemFocus = (event) => {
		const { expandable } = this.props
		if (expandable) {
			return
		}
		this.onFocusIn()
	}

	onBlur = (event) => {
		const { expandable } = this.props
		if (expandable) {
			return
		}
		clearTimeout(this.blurTimer)
		const result = onBlur(event, this.onFocusOut, () => this.list)
		if (typeof result === 'number') {
			this.blurTimer = result
		}
	}

	onFocusIn = () => {
		const { onFocusIn } = this.props
		if (onFocusIn) {
			onFocusIn()
		}
		this.setState({
			isFocused: true
		})
	}

	onFocusOut = () => {
		const { value } = this.props
		if (value === undefined) {
			this.clearFocus()
		}
		this.setState({
			isFocused: false
		})
	}

	isFocusableItemIndex = (index) => this.itemRefs[index] !== undefined

	isFocusableItem = (item) => !isDivider(item)

	// `this.list` is also being accessed from `<ScrollableList/>`.
	storeListNode = (node) => this.list = node

	storeItemRef = (ref, i) => this.itemRefs[i] = ref

	render()
	{
		const
		{
			id,
			expandable,
			disabled,
			tabbable,
			value,
			hasOnChange,
			onChange,
			// `onSelectItem` is deprecated, use `onChange` instead.
			onSelectItem,
			highlightSelectedItem,
			createButtons,
			className,
			style,
			children
		}
		= this.props

		let { role } = this.props

		const {
			focusedItemIndex,
			isFocused
		} = this.state

		// ARIA (accessibility) roles info:
		// https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html
		if (!role && (onChange || onSelectItem)) {
			role = 'listbox'
		}

		// if (this.props['aria-hidden']) {
		// 	role = undefined
		// }

		// `tabIndex={ -1 }` makes the `<ul/>` focusable.
		// So that `<Expandable/>` doesn't collapse on click inside it (top, bottom).

		return (
			<ul
				ref={ this.storeListNode }
				id={ id }
				role={ role }
				aria-label={ this.props['aria-label'] }
				aria-hidden={ this.props['aria-hidden'] }
				aria-required={ this.props['aria-required'] }
				aria-invalid={ this.props['aria-invalid'] }
				onFocus={ this.onFocusIn }
				onKeyDown={ this.onKeyDown }
				onKeyPress={ this.onKeyPress }
				tabIndex={ -1 }
				style={ style }
				className={ classNames(className, 'rrui__outline', 'rrui__list', {
					'rrui__list--focus': isFocused
				}) }>

				{ React.Children.map(children, (item, i) =>
				{
					// Workaround for `react-hot-loader`.
					// https://github.com/gaearon/react-hot-loader#checking-element-types
					if (item.type.displayName !== 'ListItem') {
						throw new Error(`Only <List.Item/>s can be placed inside a <List/> (and remove any whitespace).`)
					}

					return React.cloneElement(item,
					{
						key       : i,
						index     : i,
						itemRef   : this.isFocusableItem(item) ? this.storeItemRef : undefined,
						role      : role === 'listbox' ? 'option' : item.props.role,
						focus     : this.focusItem,
						focused   : (expandable || isFocused) && focusedItemIndex === i,
						disabled  : disabled || item.props.disabled,
						tabIndex  : tabbable && (focusedItemIndex === undefined ? i === 0 : i === focusedItemIndex) ? 0 : -1,
						createButton : createButtons,
						isInputInProgress : this.isInputInProgress,
						onInputSpacebar : this.onInputSpacebar,
						onItemFocus : this.onItemFocus,
						onItemBlur : this.onBlur,
						onSelectItem : onChange || onSelectItem,
						hasOnSelectItem : hasOnChange,
						selectedItemValue : value,
						highlightSelectedItem : (onChange || onSelectItem) && highlightSelectedItem
					})
				}) }
			</ul>
		)
	}
}

export class ListItem extends React.Component
{
	static propTypes =
	{
		// (optional) HTML `id` attribute.
		// Can be used for WAI-ARIA stuff.
		// Example: `<input role="combobox"/>` with `aria-activedescendant={focusedListItemId}`.
		id : PropTypes.string,

		value : PropTypes.any,
		index : PropTypes.number,
		focused : PropTypes.bool,
		onClick : PropTypes.func,
		// `onSelect` is deprecated, use `onClick` instead.
		onSelect : PropTypes.func,
		onSelectItem : PropTypes.func,
		// If a `<List/>` has `onChange` then it wraps `<List.Item/>`s with `<button/>`s.
		// The `onChange` added by `<ExpandableList/>` overrides the original `onChange`.
		// If there was no `onChange` — there will be one.
		// So to retain that info `hasOnChange` property is used as a workaround.
		// `undefined` means "ignore this property".
		hasOnSelectItem : PropTypes.bool,
		selectedItemValue : PropTypes.any,
		highlightSelectedItem : PropTypes.bool,
		createButton : PropTypes.bool,
		// Deprecated. Use `createButton` instead.
		shouldCreateButton : PropTypes.bool,
		// The button won't be pressed on "Space" key
		// if the user is currently typing.
		isInputInProgress : PropTypes.func,
		onInputSpacebar : PropTypes.func
	}

	onButtonKeyDown = (event) =>
	{
		const { isInputInProgress, onInputSpacebar } = this.props

		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}

		switch (event.keyCode) {
			// "Spacebar".
			case 32:
				// If the user is currently typing.
				if (isInputInProgress()) {
					// Don't press the option button.
					event.preventDefault()
					// Append space character.
					onInputSpacebar()
				}
		}
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

		// If `<List.Item/>` child element gets wrapped in a `<button/>`
		// then call `onMouseDown` defined on the `<List.Item/>`.
		// If `<List.Item/>` child element doesn't get wrapped in a `<button/>`
		// then manually call `onMouseDown` defined on the `<List.Item/>` child element
		// because `onMouseDown` gets overridden for `<List.Item/>` child element.

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
			focus,
			index,
			onItemFocus,
			children
		}
		= this.props

		// If `<List.Item/>` child element gets wrapped in a `<button/>`
		// then call `onFocus` defined on the `<List.Item/>`.
		// If `<List.Item/>` child element doesn't get wrapped in a `<button/>`
		// then manually call `onFocus` defined on the `<List.Item/>` child element
		// because `onFocus` gets overridden for `<List.Item/>` child element.

		const onFocus = this.shouldCreateButton() ? this.props.onFocus : children.props.onFocus

		if (this.isSelectable()) {
			focus(index)
		}

		if (onFocus) {
			onFocus(event)
		}

		if (onItemFocus) {
			onItemFocus(event)
		}
	}

	onBlur = (event) =>
	{
		const { onItemBlur, children } = this.props

		// If `<List.Item/>` child element gets wrapped in a `<button/>`
		// then call `onBlur` defined on the `<List.Item/>`.
		// If `<List.Item/>` child element doesn't get wrapped in a `<button/>`
		// then manually call `onFocus` defined on the `<List.Item/>` child element
		// because `onBlur` gets overridden for `<List.Item/>` child element.

		const onBlur = this.shouldCreateButton() ? this.props.onBlur : children.props.onBlur

		if (onBlur) {
			onBlur(event)
		}

		if (onItemBlur) {
			onItemBlur(event)
		}
	}

	onClick = (event) =>
	{
		const
		{
			onClick,
			onSelect,
			onSelectItem,
			index,
			value,
			children
		}
		= this.props

		// If `<List.Item/>` child element gets wrapped in a `<button/>`
		// then call `onClick` defined on the `<List.Item/>`.
		// If `<List.Item/>` child element doesn't get wrapped in a `<button/>`
		// then manually call `onClick` defined on the `<List.Item/>` child element
		// because `onClick` gets overridden for `<List.Item/>` child element,
		// and also call `onClick` defined on the `<List.Item/>` (if any).

		if (onClick) {
			onClick(event)
		}

		if (!this.shouldCreateButton()) {
			// Since `onClick` gets overridden
			// for `<List.Item/>` child element
			// call its original `onClick` manually here.
			if (children.props.onClick) {
				children.props.onClick(event)
			}
		}

		if (this.isSelectable())
		{
			if (onSelect) {
				onSelect(value, index)
			}
			if (onSelectItem) {
				onSelectItem(value, index)
			}
		}
	}

	isSelectable()
	{
		return isSelectableItem(this)
	}

	// Perhaps this is called by `focus()` utility function.
	// Something like: `focus(this.itemRefs[i])`.
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
		const {
			onClick,
			onSelect,
			onSelectItem,
			hasOnSelectItem,
			createButton,
			// Deprecated. Use `createButton` instead.
			shouldCreateButton
		} = this.props

		return this.isSelectable() && (
			onClick ||
			onSelect ||
			(
				onSelectItem &&
				(hasOnSelectItem === undefined ? true : hasOnSelectItem) &&
				(createButton || shouldCreateButton)
			)
		)
	}

	render()
	{
		const
		{
			id,
			value,
			icon,
			item,
			role,
			focused,
			disabled,
			className,
			tabIndex,
			highlightSelectedItem,
			selectedItemValue,
			component: Component,
			children
		}
		= this.props

		// Throws an error for some weird reason.
		// React.Children.only(children)

		if (!Component) {
			if (React.Children.count(children) !== 1) {
				throw new Error(`Each <List.Item/> must have a single child (and remove any whitespace).`)
			}
		}

		const isSelected = this.shouldCreateButton() && value === selectedItemValue

		const properties =
		{
			ref          : this.storeRef,
			onMouseDown  : this.onMouseDown,
			onClick      : this.onClick,
			onFocus      : this.onFocus,
			onBlur       : this.onBlur,
			className    : classNames
			(
				className,
				'rrui__list__item',
				{
					/* `--focused` modifier is deprecated, use `--focus` instead. */
					'rrui__list__item--focused'  : focused,
					'rrui__list__item--focus'    : focused,
					'rrui__list__item--selected' : isSelected && highlightSelectedItem,
					'rrui__list__item--disabled' : disabled,
					'rrui__list__item--divider'  : !Component && isDivider(children)
				}
			)
		}

		if (id !== undefined) {
			properties.id = id
		}

		if (tabIndex !== undefined) {
			properties.tabIndex = tabIndex
		}

		let ItemComponent
		let itemChildren
		let label

		if (this.shouldCreateButton())
		{
			ItemComponent = 'button'
			label = getItemLabel(this)
			properties.type = 'button'
			properties.role = role
			properties['aria-selected'] = isSelected
			properties['aria-label'] = this.props.label || (Component ? undefined : (typeof children !== 'string' && children && children.props ? children.props['aria-label'] : undefined))
			properties.disabled = disabled
			properties.onKeyDown = this.onButtonKeyDown
			properties.className = classNames(
				properties.className,
				'rrui__button-reset',
				'rrui__outline',
				// Resets `white-space: nowrap` set by `.rrui__button-reset`.
				Component && 'rrui__button-reset--wrap',
				// Resets `white-space: nowrap` set by `.rrui__list__item`.
				Component && 'rrui__list__item--wrap',
				// `.rrui__list__item--button` only sets the fixed `height`.
				!Component && 'rrui__list__item--button'
			)

			itemChildren = Component ?
				<Component
					{...item}
					selected={isSelected && highlightSelectedItem}
					focused={focused}
					disabled={disabled}/> :
				renderListItemComponent({ value, label, icon, children })
		}
		else
		{
			// Don't overwrite `className` already defined on the `children`.
			properties.className = classNames(
				properties.className,
				children.props && children.props.className
			)
		}

		return (
			<li
				role={this.shouldCreateButton() || isDivider(children) ? 'presentation' : role}
				aria-selected={this.shouldCreateButton() ? undefined : (role && role !== 'presentation' ? isSelected : undefined)}
				aria-label={this.shouldCreateButton() ? undefined : label}
				className="rrui__list__list-item">
				{ ItemComponent && React.createElement(ItemComponent, properties, itemChildren) }
				{ !ItemComponent && React.cloneElement(children, properties) }
			</li>
		)
	}
}

// Workaround for `react-hot-loader`.
// https://github.com/gaearon/react-hot-loader#checking-element-types
ListItem.displayName = 'ListItem'

List.Item = ListItem


// Replace `itemChildren` array with `<React.Fragment/>`
// in some future when React >= 16.2.0 is common.
//
// <React.Fragment>
// 	{/* Icon. */}
// 	{icon &&
// 		<div className="rrui__list__item-icon">
// 			{ React.createElement(icon, { value, label }) }
// 		</div>
// 	}
// 	{/* Label (or content). */}
// 	{children}
// </React.Fragment>
function renderListItemComponent({
	value,
	label,
	icon,
	children
}) {
	// Label (or content).
	const itemChildren = React.Children.toArray(children)
	// Icon.
	if (icon) {
		itemChildren.unshift((
			<span key="icon" aria-hidden className="rrui__list__item-icon">
				{React.createElement(icon, { value, label })}
			</span>
		))
	}
	return itemChildren
}

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
		if (isSelectableItem(item) && item.props.value === value) {
			return i
		}
		i++
	}
}

function findItemIndexByLabel(value, children)
{
	const items = React.Children.toArray(children)

	let i = 0
	for (const item of items)
	{
		if (isSelectableItem(item)) {
			const itemLabel = getItemLabel(item)
			if (itemLabel && itemLabel.toLowerCase().indexOf(value.toLowerCase()) === 0) {
				return i
			}
		}
		i++
	}
}

function getItemLabel(item) {
	return item.props.label || (typeof item.props.children === 'string' ? item.props.children : undefined)
}

function isSelectableItem(item) {
	return item.props.component ? true : (item.props.children && !isDivider(item.props.children))
}

function isDivider(element) {
	// Workaround for `react-hot-loader`.
	// https://github.com/gaearon/react-hot-loader#checking-element-types
	return element.type && element.type.displayName === 'Divider'
}