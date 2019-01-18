import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { polyfill as reactLifecyclesCompat } from 'react-lifecycles-compat'

import ScrollableList from './ScrollableList'
import Expandable from './Expandable'
import { findItemIndexByValue } from './List'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

@reactLifecyclesCompat
export default class ExpandableList extends PureComponent
{
	static propTypes =
	{
		// Maximum items fitting the list height (scrollable).
		scrollMaxItems : PropTypes.number,

		// Whether should add `margin-right` for scrollbar width on overflow.
		scrollBarPadding : PropTypes.bool,

		// Preloads the contents of the expandable list
		// before it's expanded. Must return a `Promise`.
		preload : PropTypes.func,

		// Whether the list items should be focused upon expand.
		focusOnExpand : PropTypes.bool.isRequired,
		focusSelectedItem : PropTypes.bool.isRequired,

		className : PropTypes.string
	}

	static defaultProps =
	{
		alignment : 'left',
		focusOnExpand : true,
		focusSelectedItem : true
	}

	static getDerivedStateFromProps(props, state)
	{
		// Using `!state.hasOwnProperty()` as "not initialized"
		// because when there's an empty option `props.value` is `undefined`.
		if (!state.hasOwnProperty('selectedItemValue') || state.selectedItemValue !== props.value)
		{
			return {
				selectedItemValue : props.value,
				// `findItemIndexByValue()` must return `undefined` for "no such item".
				selectedItemIndex : findItemIndexByValue(props.value, props.children)
			}
		}

		return null
	}

	state = {}

	toggle     = () => this.expandable.toggle()
	expand     = (parameters) => this.expandable.expand(parameters)
	collapse   = () => this.expandable.collapse()
	isExpanded = () => this.expandable.isExpanded()
	preload    = () => this.expandable.preload()
	onBlur     = (event) => this.expandable.onBlur(event)

	chooseFocusedItem = () => this.list && this.list.chooseFocusedItem()
	getFocusedItemIndex = () => this.list ? this.list.getFocusedItemIndex() : undefined
	focusItem = (index) => this.list.focusItem(index)
	clearFocus = () => this.list.clearFocus()

	onKeyDown = (event) =>
	{
		const { onEnter } = this.props

		switch (event.keyCode)
		{
			// "Escape".
			// Collapse.
			case 27:
				event.preventDefault()
				// Collapse the list if it's expanded.
				return this.expandable.collapse()

			// "Up" arrow.
			// Select the previous item (if present).
			case 38:
			// "Down" arrow.
			// Select the next item (if present).
			case 40:
				if (this.isExpanded())
				{
					// Navigate the list (if it was already expanded).
					this.list.onKeyDown(event)
				}
				else
				{
					// Expand the list if it's collapsed.
					event.preventDefault()
					this.expandable.expand()
				}
				return

			// "Enter".
			case 13:
				// Select the currently focused item.
				return this.list && this.list.onKeyDown(event)
		}
	}

	storeExpandableRef = (ref) => this.expandable = ref
	storeListRef = (ref) => this.list = ref

	onChange = (value, index) =>
	{
		const { onChange, focusSelectedItem } = this.props

		if (onChange) {
			onChange(value, index)
		}

		if (focusSelectedItem)
		{
			this.setState({
				selectedItemIndex : index
			})
		}

		this.collapsedDueToItemBeingSelected = true
		this.collapse()
		this.collapsedDueToItemBeingSelected = undefined
	}

	// If a `<List/>` has `onChange` then it wraps `<List.Item/>`s with `<button/>`s.
	// The `onChange` added by `<ExpandableList/>` overrides the original `onChange`.
	// If there was no `onChange` — there will be one.
	// So to retain that info `hasOnChange` property is used as a workaround.
	hasOnChange = () => {
		const { onChange } = this.props
		return !!onChange
	}

	onCollapse = (parameters) =>
	{
		const { onCollapse } = this.props

		if (onCollapse)
		{
			onCollapse
			({
				...parameters,
				collapsedDueToItemBeingSelected : this.collapsedDueToItemBeingSelected
			})
		}

		this.list && this.list.clearFocus()
	}

	onExpand = () =>
	{
		const
		{
			focusOnExpand,
			onExpand,
			children
		}
		= this.props

		const { selectedItemIndex } = this.state

		if (onExpand) {
			onExpand()
		}

		if (focusOnExpand)
		{
			if (selectedItemIndex === undefined) {
				this.list.focus()
			} else {
				this.list.focusItem(selectedItemIndex)
			}
		}

		// Re-calculate `<ScrollableList/>` height.
		this.list.calculateHeight()
	}

	render()
	{
		const
		{
			alignment,
			upward,
			scrollIntoView,
			preload,
			onPreloadStateChange,
			getTogglerNode,
			onFocusOut,
			onChange,
			highlightSelectedItem,
			closeLabel,
			closeButtonIcon,
			className,
			children,
			...rest
		}
		= this.props

		return (
			<Expandable
				ref={ this.storeExpandableRef }
				alignment={ alignment }
				upward={ upward }
				scrollIntoView={ scrollIntoView }
				preload={ preload }
				onPreloadStateChange={ onPreloadStateChange }
				onExpand={ this.onExpand }
				onCollapse={ this.onCollapse }
				getTogglerNode={ getTogglerNode }
				onFocusOut={ onFocusOut }
				closeLabel={ closeLabel }
				closeButtonIcon={ closeButtonIcon }
				className={ classNames(className, 'rrui__expandable-list',
				{
					'rrui__expandable-list--left-aligned'  : alignment === 'left',
					'rrui__expandable-list--right-aligned' : alignment === 'right'
				}) }>

				<ScrollableList
					{...rest}
					expandable
					ref={ this.storeListRef }
					onChange={ this.onChange }
					hasOnChange={ this.hasOnChange() }
					highlightSelectedItem={ onChange === undefined && highlightSelectedItem === undefined ? false : highlightSelectedItem }>
					{ children }
				</ScrollableList>
			</Expandable>
		)
	}
}