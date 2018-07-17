import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { polyfill as reactLifecyclesCompat } from 'react-lifecycles-compat'

import ScrollableList from './ScrollableList'
import Expandable from './Expandable'
import { findItemIndexByValue } from './List'

@reactLifecyclesCompat
export default class ExpandableList extends Component
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

		className : PropTypes.string
	}

	static defaultProps =
	{
		alignment : 'left',
		focusOnExpand : true
	}

	static getDerivedStateFromProps(props, state)
	{
		if (state.selectedItemValue !== props.selectedItemValue)
		{
			return {
				selectedItemIndex : props.selectedItemValue === undefined ? undefined : findItemIndexByValue(props.selectedItemValue, props.children)
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

	getFocusedItemIndex = () => this.list ? this.list.getFocusedItemIndex() : undefined
	focusItem = (index) => this.list.focusItem(index)

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

	onSelectItem = (value, index) =>
	{
		const { onSelectItem } = this.props

		if (onSelectItem) {
			onSelectItem(value, index)
		}

		this.setState
		({
			selectedItemIndex : index,
			// selectedItemValue : value
		})

		this.collapsedDueToItemBeingSelected = true
		this.collapse()
		this.collapsedDueToItemBeingSelected = undefined
	}

	onCollapse = () =>
	{
		const { onCollapse } = this.props

		if (onCollapse)
		{
			onCollapse
			({
				collapsedDueToItemBeingSelected : this.collapsedDueToItemBeingSelected
			})
		}

		this.list.unfocus()
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
			preload,
			onPreloadStateChange,
			getTogglerNode,
			onFocusOut,
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
					ref={ this.storeListRef }
					onSelectItem={ this.onSelectItem }>
					{ children }
				</ScrollableList>
			</Expandable>
		)
	}
}