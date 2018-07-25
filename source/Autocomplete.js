import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { polyfill as reactLifecyclesCompat } from 'react-lifecycles-compat'
import classNames from 'classnames'

import ExpandableList from './ExpandableList'
import List from './List'
import Label from './TextInputLabel'
import TextInput from './TextInputInput'
import Ellipsis from './Ellipsis'

import { onBlurForReduxForm } from './utility/redux-form'

import
{
	submitFormOnCtrlEnter,
	submitContainingForm
}
from './utility/dom'

const empty_value_option_value = ''

@reactLifecyclesCompat
export default class Autocomplete extends PureComponent
{
	static propTypes =
	{
		// A list of selectable options
		options : PropTypes.arrayOf
		(
			PropTypes.shape
			({
				// Option value (may be `undefined`)
				value : PropTypes.any,
				// Option label (may be `undefined`)
				label : PropTypes.string,
				// Option icon
				icon  : PropTypes.oneOfType
				([
					PropTypes.node,
					PropTypes.func
				]),
				// Render custom content (a React component).
				// Receives `{ value, label }` properties.
				content : PropTypes.func
			})
		)
		.isRequired,

		// An alternative way of getting `options`.
		// If it's an `autocomplete` then this function
		// receives the `query : string` argument.
		// Is only for `autocomplete` mode.
		// Must return a `Promise`.
		getOptions : PropTypes.func,

		// Can be supplied when supplying `options` prop.
		// By default filters by substring inclusion (case-insensitive).
		filterOptions : PropTypes.func,

		// Throttle `async getOptions()` invocations.
		throttle : PropTypes.number.isRequired,

		// Throttle `async getOptions()` invocations.
		minCharactersToStartThrottling : PropTypes.number.isRequired,

		// HTML form input `name` attribute
		name       : PropTypes.string,

		// Label which is placed above the select
		label      : PropTypes.string,

		// Placeholder (like "Choose")
		placeholder : PropTypes.string,

		// Show icon only for selected item,
		// and only if `icon` is `true`.
		saveOnIcons : PropTypes.bool,

		// Disables this control
		disabled   : PropTypes.bool,

		// Set to `true` to mark the field as required
		required   : PropTypes.bool.isRequired,

		// Selected option value
		value      : PropTypes.any,

		// Is called when an option is selected
		onChange   : PropTypes.func,

		// Is called when the select is blurred.
		// This `onBlur` interceptor is a workaround for `redux-form`,
		// so that it gets the parsed `value` in its `onBlur` handler,
		// not the formatted text.
		onBlur     : PropTypes.func,

		// If `scroll` is `false`, then options list
		// is not limited in height.
		// Is `true` by default (scrollable).
		scroll     : PropTypes.bool.isRequired,

		// Component CSS class
		className  : PropTypes.string,

		// Autocomplete `<input/>` CSS class
		inputClassName : PropTypes.string,

		// CSS style object
		style      : PropTypes.object,

		// If this flag is set to `true`,
		// and `icon` is specified for a selected option,
		// then the selected option will be displayed
		// as icon only, without the label.
		icon       : PropTypes.bool,

		// If this flag is set to `true`,
		// then it makes `<Autocomplete/>` not stretch itself
		// to 100% width by making it `inline-block`.
		// Is set to `true` when `icon` is `true`
		// because it makes sense.
		compact    : PropTypes.bool,

		// HTML `tabindex` attribute
		tabIndex   : PropTypes.number,

		// If set to `true`, autocomple will show all
		// matching options instead of just `maxItems`.
		showAllMatchingOptions : PropTypes.bool,

		// `<Autocomplete/>` loads `async getOptions()` after it has been mounted.
		// Until then `<Autocomplete/>` doesn't display any selected option.
		// One may supply an already pre-loaded currently selected option
		// to display the currently selected option sooner (e.g. Server-Side Rendering).
		selectedOption : PropTypes.object
	}

	static defaultProps =
	{
		// Set to `true` to mark the field as required
		required : false,

		// Show `error` (if passed).
		indicateInvalid : true,

		// Set to `true` to display the loading indicator
		loading : false,

		// Will show scrollbar on overflow.
		scroll : true,

		alignment : 'left',

		// `async getOptions()` throttle period.
		throttle : 200,

		// `async getOptions()` throttle threshold (in characters).
		minCharactersToStartThrottling : 4,

		// Filters options by substring inclusion (case-insensitive).
		filterOptions
	}

	state =
	{
		// The sequential counter for `async getOptions()`:
		// the `options` with the highest counter are shown
		// to prevent "race condition" inconsistency.
		// Older options can only be overwritten with newer ones.
		optionsCounter : 0,
		matchesCounter : 0,

		inputValue : '',
		options: [],

		// `prevProps` for `getDerivedStateFromProps()`.
		props: {}
	}

	// Latest `async getOptions()` invocation timestamp (for throttling).
	latestFetchOptionsCallTimestamp = 0

	// Older options can only be overwritten with newer ones.
	// (in case of `async getOptions()`).
	counter = new Counter()

	// Handles changing `value` externally for an `<Autocomplete/>`.
	static getDerivedStateFromProps({ value, options }, state)
	{
		const newState =
		{
			// `prevProps`.
			props:
			{
				value
			}
		}

		// Changing `value` externally for an `<Autocomplete/>`
		// with `async getOptions()` is not supported.
		if (Array.isArray(options))
		{
			// `<Autocomplete/>`'s selected option label
			// is stored in a special `selectedOptionLabel` variable in `state`.
			if (value !== state.props.value)
			{
				newState.selectedOption = options.filter(_ => _.value === value)[0]
				newState.inputValue = newState.selectedOption ? newState.selectedOption.label : ''
			}
		}

		return newState
	}

	componentDidMount()
	{
		const { value, getOption } = this.props

		if (!isEmptyValue(value) && getOption)
		{
			this.setState
			({
				isFetchingInitiallySelectedOption : true
			})

			getOption(value).then((option) =>
			{
				this.setState
				({
					selectedOption : option,
					inputValue : option ? option.label : '',
					isFetchingInitiallySelectedOption : false
				})
			},
			(error) =>
			{
				console.error(error)
				this.setState({
					isFetchingInitiallySelectedOption : false
				})
			})
		}
	}

	componentWillUnmount()
	{
		clearTimeout(this.nextFetchOptionsCallTimeout)
	}

	onPreloadStateChange = (isPreloading) => this.setState({ isFetchingOptions : isPreloading })

	focus = () => this.input.focus()

	onCollapse = ({ collapsedDueToItemBeingSelected, focusOut }) =>
	{
		const { options, selectedOption } = this.state

		this.setState
		({
			isExpanded : false,
			matches : undefined
		})

		if (!collapsedDueToItemBeingSelected && !this.collapsedDueToEmptyValueOnEnter)
		{
			this.setState
			({
				inputValue : selectedOption ? selectedOption.label : ''
			})
		}

		if (!focusOut)
		{
			this.dontExpandOnFocus = true
			this.focus()
			this.dontExpandOnFocus = false
		}
	}

	onExpand = (options = {}) =>
	{
		this.setState({ isExpanded: true })
	}

	expand = () =>
	{
		// Reset the "matches" state before expanding.
		this.setState({ matches: true }, this._expand)
	}

	_expand  = (parameters) => this.list.expand(parameters)
	collapse = () => this.list.collapse()
	toggle   = () => this.list.toggle()

	storeListRef = (ref) => this.list = ref
	storeInput = (node) => this.input = node
	storeInputComponentNode = (node) => this.inputComponentNode = node

	getInputNode = () => this.input

	render()
	{
		const
		{
			id,
			icon,
			compact,
			scroll,
			scrollMaxItems,
			scrollIntoView,
			alignment,
			saveOnIcons,
			required,
			placeholder,
			value,
			onChange,
			indicateInvalid,
			error,
			closeButtonIcon,
			closeLabel,
			style,
			className
		}
		= this.props

		const
		{
			options,
			isFetchingOptions,
			isFetchingInitiallySelectedOption,
			isExpanded,
			inputValue
		}
		= this.state

		const containerStyle = { textAlign: alignment }

		return (
			<div
				style={ style ? { ...containerStyle, ...style } : containerStyle }
				className={ classNames
				(
					'rrui__autocomplete',
					{
						'rrui__autocomplete--expanded' : isExpanded,
						'rrui__autocomplete--compact'  : compact || icon
					},
					className
				) }>

				<div
					ref={ this.storeInputComponentNode }
					className="rrui__input">

					{ (isFetchingOptions || isFetchingInitiallySelectedOption) && <Ellipsis/> }

					{/* Text input */}
					{ this.renderTextInput() }

					{/* Label */}
					{/* (this label is placed after the "selected" button
					     to utilize the CSS `+` selector) */}
					{/* If the `placeholder` wasn't specified
					    but `label` was and no option is currently selected
					    then the `label` becomes the `placeholder`
					    until something is selected */}
					{ this.getLabel() &&
						<Label
							id={ id }
							value={ value }
							required={ required }
							invalid={ indicateInvalid && error }>
							{ this.getLabel() }
						</Label>
					}

					{/* The list of selectable options */}
					<ExpandableList
						ref={this.storeListRef}
						items={options}
						focusFirstItemWhenItemsChange={inputValue !== ''}
						alignment={alignment}
						scrollIntoView={scrollIntoView}
						preload={this.refreshOptions}
						onPreloadStateChange={this.onPreloadStateChange}
						scrollMaxItems={scroll === false ? 0 : scrollMaxItems}
						shouldFocus={false}
						selectedItemValue={options.length === 0 ? undefined : (inputValue.trim() === '' ? undefined : value)}
						onSelectItem={this.setValue}
						onCollapse={this.onCollapse}
						onExpand={this.onExpand}
						focusOnExpand={false}
						getTogglerNode={this.getInputNode}
						onFocusOut={this.onFocusOut}
						closeButtonIcon={closeButtonIcon}
						closeLabel={closeLabel}
						className={classNames('rrui__shadow', 'rrui__options-list',
						{
							'rrui__options-list--left-aligned'  : alignment === 'left',
							'rrui__options-list--right-aligned' : alignment === 'right'
						})}>

						{options.map((option, i) => (
							<List.Item
								key={i}
								value={option.value}
								icon={saveOnIcons ? undefined : option.icon}>
								{option.content ? option.content(option) : option.label}
							</List.Item>
						))}
					</ExpandableList>
				</div>

				{/* Error message */}
				{ indicateInvalid && error &&
					<div className="rrui__input-error">
						{ error }
					</div>
				}
			</div>
		)
	}

	renderTextInput()
	{
		const
		{
			value,
			placeholder,
			disabled,
			required,
			tabIndex,
			inputClassName
		}
		= this.props

		const
		{
			isExpanded,
			inputValue,
			matches,
			isFetchingInitiallySelectedOption
		}
		= this.state

		return (
			<TextInput
				inputRef={ this.storeInput }
				value={ inputValue }
				onChange={ this.onInputValueChange }
				onKeyDown={ this.onKeyDown }
				onFocus={ this.expandOnFocus }
				onBlur={ this.onBlur }
				onClick={ this.expandOnFocus }
				tabIndex={ tabIndex }
				disabled={ isFetchingInitiallySelectedOption || disabled }
				className={ classNames
				(
					'rrui__autocomplete__input',
					inputClassName,
					// CSS selector performance optimization
					// (should it even be optimized).
					{
						'rrui__input-field--invalid' : matches === false
					}
				) }/>
		)
	}

	expandOnFocus = () =>
	{
		if (this.dontExpandOnFocus) {
			return
		}

		const { isExpanded } = this.state

		if (!isExpanded)
		{
			this.setState({ matches: true }, this.expand)
		}
	}

	onInputValueChange = (value) =>
	{
		const { isExpanded } = this.state

		if (!value && isExpanded)
		{
			this.list.focusItem(undefined)
		}

		this.setState
		({
			inputValue : value
		},
		() =>
		{
			this._expand({ refresh: true })
		})
	}

	onKeyDown = (event) =>
	{
		const { value, required } = this.props
		const { isExpanded, inputValue } = this.state

		if (event.defaultPrevented) {
			return
		}

		if (!isExpanded) {
			if (submitFormOnCtrlEnter(event, this.input)) {
				return
			}
		}

		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}

		switch (event.keyCode)
		{
			// "Up" arrow.
			// Select the previous item (if present).
			case 38:
				if (isExpanded)
				{
					if (this.list.getFocusedItemIndex() === undefined)
					{
						// Don't select any list item.
					}
					else if (this.list.getFocusedItemIndex() === 0)
					{
						this.list.focusItem(undefined)
						event.preventDefault()
					}
					else
					{
						this.list.onKeyDown(event)
					}
				}
				return

			// "Down" arrow.
			// Select the next item (if present).
			case 40:
				if (isExpanded)
				{
					// Navigate the list (if it was already expanded).
					this.list.onKeyDown(event)
				}
				else
				{
					// Expand the list if it's collapsed.
					event.preventDefault()
					this.expand()
				}
				return

			// "Escape".
			// Collapse.
			case 27:
				event.preventDefault()
				this.collapse()
				return

			// "Enter".
			case 13:
				if (!inputValue)
				{
					if (isExpanded && this.list.getFocusedItemIndex() === undefined)
					{
						event.preventDefault()
						this.setValue(undefined)

						this.collapsedDueToEmptyValueOnEnter = true
						this.collapse()
						this.collapsedDueToEmptyValueOnEnter = undefined

						return
					}

					if (!isExpanded)
					{
						if (isEmptyValue(value))
						{
							// Submit containing `<form/>`.
							// If the value is required then expand instead.
							if (required)
							{
								event.preventDefault()
								this.expand()
							}
							return
						}

						event.preventDefault()
						this.setValue(undefined)
						return
					}
				}

				// Select the currently focused item (if expanded).
				if (isExpanded)
				{
					this.list.onKeyDown(event)
					return
				}

				return
		}
	}

	getLabel()
	{
		const { label, placeholder } = this.props
		return label || placeholder
	}

	throttleFetchOptionsCall(resolve)
	{
		const
		{
			throttle,
			minCharactersToStartThrottling
		}
		= this.props

		const { inputValue } = this.state

		const wait = throttle - (Date.now() - this.latestFetchOptionsCallTimestamp)

		if (inputValue.length >= minCharactersToStartThrottling && wait > 0)
		{
			if (!this.nextFetchOptionsCallTimeout)
			{
				this.nextFetchOptionsCallTimeout = setTimeout(() =>
				{
					this.nextFetchOptionsCallTimeout = undefined
					this.latestFetchOptionsCall()
				},
				wait)
			}

			this.latestFetchOptionsCall = () => this.refreshOptions().then(resolve)
			return true
		}
	}

	refreshOptions = () =>
	{
		const
		{
			getOptions,
			filterOptions
		}
		= this.props

		const { inputValue } = this.state

		return new Promise((resolve) =>
		{
			// If throttled then schedule a future invocation.
			if (getOptions)
			{
				if (this.throttleFetchOptionsCall(resolve)) {
					return
				}

				this.latestFetchOptionsCallTimestamp = Date.now()

				const counter = this.counter.getNextCounter()

				return this.setState
				({
					isFetchingOptions : true,
					fetchingOptionsCounter : counter
				},
				() =>
				{
					getOptions(inputValue).then((options) =>
					{
						this.receiveNewOptions(options, counter, resolve)
					},
					(error) =>
					{
						console.error(error)
						this.receiveNewOptions([], counter, resolve)
					})
				})
			}

			const newOptions = filterOptions(this.props.options, inputValue)

			return this.setState
			({
				matches : newOptions.length > 0,
				options : newOptions.length > 0 ? newOptions : this.state.options
			},
			resolve)
		})
	}

	receiveNewOptions(options, counter, callback)
	{
		const
		{
			matchesCounter,
			optionsCounter,
			fetchingOptionsCounter
		}
		= this.state

		const newState = {}

		// Can only override "older" matching state.
		if (isCounterAfter(counter, matchesCounter))
		{
			newState.matches = options.length > 0
			newState.matchesCounter = counter
		}

		// Update options.
		// Can only override "older" options.
		// (not "newer" ones)
		if (isCounterAfter(counter, optionsCounter))
		{
			// Autocomplete should always display some options.
			if (options.length > 0)
			{
				newState.options = options
				newState.optionsCounter = counter
			}
		}

		if (counter === fetchingOptionsCounter)
		{
			newState.isFetchingOptions = false
			newState.fetchingOptionsCounter = undefined
		}

		this.setState(newState, callback)
	}

	setValue = (newValue) =>
	{
		const { value, onChange } = this.props
		const { options } = this.state

		const selectedOption = options.filter(_ => _.value === newValue)[0]

		this.setState
		({
			selectedOption,
			inputValue : selectedOption ? selectedOption.label : ''
		})

		// Call `onChange` only if the `value` did change.
		if (newValue !== value) {
			onChange(newValue)
		}
	}

	onBlur = (event) => this.list && this.list.onBlur(event)

	onFocusOut = () =>
	{
		let { onBlur, value } = this.props
		const { inputValue } = this.state

		this.collapse()

		if (!inputValue)
		{
			value = undefined
			this.setValue(value)
		}

		if (onBlur) {
			onBlurForReduxForm(onBlur, event, value)
		}
	}
}

// There can be an `undefined` value,
// so just `{ value }` won't do here.
function getOptionKey(value)
{
	return isEmptyValue(value) ? '@@rrui/empty' : value
}

function isEmptyValue(value)
{
	return value === null || value === undefined
}

// Filters options by substring inclusion (case-insensitive).
function filterOptions(options, value)
{
	// If the input value is `undefined` or empty.
	if (!value) {
		return options
	}

	value = value.toLowerCase()

	return options.filter(({ label }) => label.toLowerCase().indexOf(value) >= 0)
}

class Counter
{
	counter = 0

	getNextCounter()
	{
		if (this.counter < MAX_SAFE_INTEGER) {
			this.counter++
		} else {
			this.counter = 1
		}
		return this.counter
	}
}

// `MAX_SAFE_INTEGER` is not supported by older browsers
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1

// Can only override "older" options.
// (not "newer" ones)
function isCounterAfter(counter, currentStateCounter)
{
	const diff = counter - currentStateCounter

	// If the new options are "newer" than the current ones,
	// then they can override them.
	// (also accounts for counter overflow)
	return diff > 0 || (diff < 0 && Math.abs(diff) > MAX_SAFE_INTEGER / 2)
}