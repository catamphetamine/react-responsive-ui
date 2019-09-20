import React from 'react'
import PropTypes from 'prop-types'
import { polyfill as reactLifecyclesCompat } from 'react-lifecycles-compat'
import classNames from 'classnames'

import ExpandableList from './ExpandableList'
import List from './List'
import Label from './TextInputLabel'
import TextInput from './TextInputInput'
import Ellipsis from './Ellipsis'
import WithError from './WithError'

import { onBlurForReduxForm } from './utility/redux-form'
import { submitFormOnCtrlEnter } from './utility/dom'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

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
				// Could restrict it to stringifiable types
				// but I guess this is not required
				// and one could even use `object`s as `value`s.
				// // Option value (may be `undefined`)
				// value : PropTypes.oneOfType([
				// 	PropTypes.string,
				// 	PropTypes.number,
				// 	PropTypes.bool
				// ]),
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
		filterOptions : PropTypes.func.isRequired,

		// The maximum number of options to be rendered
		// in the options list when it's expanded.
		// `0` means "unlimited".
		maxOptions : PropTypes.number,

		// Throttle `async getOptions()` invocations.
		throttle : PropTypes.number.isRequired,

		// Throttle `async getOptions()` invocations.
		minCharactersToStartThrottling : PropTypes.number.isRequired,

		// Option component.
		// (when `<Autocomplete/>` is expanded).
		// Receives properties:
		// * `{ ...option }` — All properties of an `option` such as `value`, `label`, etc. Each `option` must have a `value` and a `label` (`value` may be `undefined`).
		// * `selected: boolean` — If this option is selected.
		// * `focused: boolean` — If this option is focused.
		// * `disabled: boolean` — If this option is disabled. Seems to be not used for now.
		// Can only contain "inline" elements like `<span/>`,
		// not `<div/>`s, `<section/`>s, `<h1/>`s or `<p/>`s,
		// because `<button/>`s can't contain "block" elements.
		// `display: block` can still be set on `<span/>`s and other "inline" elements.
		optionComponent : PropTypes.elementType,

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

		// If the `icon` flag is set to `true`,
		// and `icon` is specified for a selected option,
		// then the selected option will be displayed
		// as icon only, without the label
		// (was used in early versions of `react-phone-number-input`).
		// Otherwise, if it's a React component
		// then it's passed to `<TextInput/>` as its `icon`.
		icon: PropTypes.oneOfType([
			PropTypes.elementType,
			PropTypes.bool
		]),

		// If this flag is set to `true`,
		// then it makes `<Autocomplete/>` not stretch itself
		// to 100% width by making it `inline-block`.
		// Is set to `true` when `icon` is `true`
		// because it makes sense.
		compact    : PropTypes.bool,

		// HTML `tabindex` attribute
		tabIndex   : PropTypes.number,

		// HTML `autoFocus` attribute
		autoFocus  : PropTypes.bool,

		// HTML `autocomplete` attribute.
		// Set to "off" to disable any autocompletion in a web browser.
		// https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion
		autoComplete : PropTypes.string,

		// `<Autocomplete/>` loads `async getOptions()` after it has been mounted.
		// Until then `<Autocomplete/>` doesn't display any selected option.
		// One may supply an already pre-loaded currently selected option
		// to display the currently selected option sooner (e.g. Server-Side Rendering).
		selectedOption : PropTypes.object,

		// WAI-ARIA requires any option be focused only on-demand
		// when the user explicitly presses the Down arrow key.
		// https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.0pattern/combobox-autocomplete-list.html
		// Still, it's not be the best user experience for non-disabled users:
		// it would be more convenient for them if the first option was automatically focused.
		// Hence this property.
		// (is `false` by default for WAI-ARIA compliancy)
		highlightFirstOption : PropTypes.bool.isRequired
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
		filterOptions,

		// The maximum number of options to be rendered
		// in the options list when it's expanded.
		// The rationale is that otherwise the UI could
		// stagger when initially expanding a huge list.
		// `0` means "unlimited".
		maxOptions : 500,

		// UX for non-disabled users is better this way.
		// Disabled users still can use this component.
		highlightFirstOption : true
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
			// is stored in a special `selectedOption.label` variable in `state`.
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
		const { value, getOptions, getOption } = this.props

		// Generate unique ID.
		let id = `rrui-autocomplete`
		while (document.getElementById(`${id}__input`)) {
			id = `rrui-autocomplete-${generateRandomString()}`
		}
		this.input.id = `${id}__input`
		this.setState({ id })

		if (!isEmptyValue(value) && !getOption && getOptions)
		{
			throw new Error("An initial `value` was passed to `<Autocomplete/>` which has `getOptions` but doesn't have `getOption` to get the label for that initial `value`.")
		}

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

	onFocusItem = (i, options) => {
		if (options.interaction) {
			this.setState({ focusedOptionIndex: i })
		} else {
			this.setState({ focusedOptionIndex: undefined })
		}
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
			icon,
			compact,
			scroll,
			scrollMaxItems,
			scrollIntoView,
			alignment,
			saveOnIcons,
			highlightFirstOption,
			optionComponent,
			required,
			label,
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
			id,
			options,
			isFetchingOptions,
			isFetchingInitiallySelectedOption,
			isExpanded,
			inputValue
		}
		= this.state

		const containerStyle = { textAlign: alignment }

		// ARIA 1.1 (accessibility) docs:
		// https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html
		// (not yet supported)
		//
		// ARIA 1.0 (accessibility) docs:
		// https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.0pattern/combobox-autocomplete-list.html
		// (is supported)

		// value={options.length === 0 ? undefined : (inputValue.trim() === '' ? undefined : value)}

		return (
			<WithError
				id={id}
				error={error}
				indicateInvalid={indicateInvalid}
				style={style ? { ...containerStyle, ...style } : containerStyle}
				className={classNames(className, 'rrui__autocomplete', {
					'rrui__autocomplete--expanded' : isExpanded,
					'rrui__autocomplete--compact'  : compact || (icon === true)
				})}>

				<div
					ref={ this.storeInputComponentNode }
					className="rrui__input">

					{ (isFetchingOptions || isFetchingInitiallySelectedOption) && <Ellipsis/> }

					{/* Text input */}
					{ this.renderTextInput() }

					{/* Label */}
					{/* (this label is placed after the "selected" button
					     to utilize the CSS `+` selector) */}
					{ label &&
						<Label
							aria-hidden
							inputId={ id ? `${id}__input` : undefined }
							value={ value }
							required={ required }
							invalid={ indicateInvalid && error }>
							{ label }
						</Label>
					}

					{/* The list of selectable options */}
					<ExpandableList
						ref={this.storeListRef}
						id={id ? `${id}__list` : undefined}
						items={options}
						value={options.length === 0 ? undefined : value}
						highlightFirstItem={highlightFirstOption && inputValue.trim() !== ''}
						alignment={alignment}
						scrollIntoView={scrollIntoView}
						preload={this.refreshOptions}
						onPreloadStateChange={this.onPreloadStateChange}
						onFocusItem={this.onFocusItem}
						scrollMaxItems={scroll === false ? 0 : scrollMaxItems}
						shouldFocus={false}
						onChange={this.setValue}
						onCollapse={this.onCollapse}
						onExpand={this.onExpand}
						focusOnExpand={false}
						highlightSelectedItem={false}
						tabbable={false}
						getTogglerNode={this.getInputNode}
						onFocusOut={this.onFocusOut}
						closeButtonIcon={closeButtonIcon}
						closeLabel={closeLabel}
						aria-label={this.props['aria-label'] || label}
						className={classNames('rrui__shadow', 'rrui__options-list',
						{
							'rrui__options-list--left-aligned'  : alignment === 'left',
							'rrui__options-list--right-aligned' : alignment === 'right'
						})}>

						{this.getOptionsForRendering().map((option, i) => (
							<List.Item
								key={i}
								id={id ? `${id}__list-item-${i}` : undefined}
								value={option.value}
								item={optionComponent ? option : undefined}
								component={optionComponent}
								icon={saveOnIcons ? undefined : option.icon}>
								{optionComponent ? undefined : (option.content ? option.content(option) : option.label)}
							</List.Item>
						))}
					</ExpandableList>
				</div>
			</WithError>
		)
	}

	renderTextInput()
	{
		const
		{
			value,
			label,
			icon,
			placeholder,
			disabled,
			required,
			indicateInvalid,
			error,
			tabIndex,
			autoFocus,
			autoComplete,
			inputClassName
		}
		= this.props

		const
		{
			id,
			isExpanded,
			inputValue,
			matches,
			isFetchingInitiallySelectedOption,
			focusedOptionIndex
		}
		= this.state

		// To expand on click/focus:
		// onFocus={ this.expandOnFocus }
		// onClick={ this.onClick }

		// WAI-ARIA 1.0 impelmentation info (accessibility):
		// https://www.w3.org/TR/wai-aria-practices/#combobox
		// https://www.levelaccess.com/differences-aria-1-0-1-1-changes-rolecombobox/

		const Icon = typeof icon === 'boolean' ? undefined : icon

		return (
			<React.Fragment>
				{Icon &&
					<Icon className="rrui__input-field__icon"/>
				}
				<TextInput
					id={ id ? `${id}__input` : undefined }
					inputRef={ this.storeInput }
					value={ inputValue }
					label={ label }
					placeholder={ placeholder }
					onChange={ this.onInputValueChange }
					onKeyDown={ this.onKeyDown }
					onBlur={ this.onBlur }
					role="combobox"
					aria-autocomplete="list"
					aria-expanded={ isExpanded ? true : false }
					aria-haspopup={ true }
					aria-owns={ id && isExpanded ? `${id}__list` : undefined }
					aria-activedescendant={ id && (focusedOptionIndex !== undefined) ? `${id}__list-item-${focusedOptionIndex}` : undefined }
					required={ required }
					tabIndex={ tabIndex }
					autoFocus={ autoFocus }
					autoComplete={ autoComplete }
					disabled={ isFetchingInitiallySelectedOption || disabled }
					indicateInvalid={ indicateInvalid || (matches === false) }
					error={ error || (matches === false ? 'no-match' : undefined) }
					className={ classNames('rrui__autocomplete__input', inputClassName, {
						'rrui__input-field--with-icon': Icon
					}) }/>
			</React.Fragment>
		)
	}

	getOptionsForRendering()
	{
		const { maxOptions } = this.props
		const { options } = this.state

		if (maxOptions > 0 && options.length > maxOptions) {
			return options.slice(0, maxOptions)
		}

		return options
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

		// Rewrite this somehow.
		//
		// When `highlightFirstOption` is `true`
		// this is a special case when the first option is not highlighted.
		if (!value && isExpanded) {
			this.list.focusItem(undefined)
		}

		this.setState({
			inputValue : value
		}, () => {
			this._expand({ refresh: true })
		})
	}

	onKeyDown = (event) =>
	{
		const { disabled, value, required, highlightFirstOption } = this.props
		const { options, isExpanded, inputValue, focusedOptionIndex } = this.state

		if (disabled) {
			return
		}

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
					// If no item was selected then do nothing.
					if (this.list.getFocusedItemIndex() === undefined)
					{
						// Don't select any list item.
					}
					// If the first item was selected.
					else if (this.list.getFocusedItemIndex() === 0)
					{
						// then unselect it.
						if (!highlightFirstOption) {
							this.list.clearFocus()
						}
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
				if (isExpanded) {
					// An edge case for `highlightFirstOption`
					// when there's only one option available
					// so pressing "Down" arrow key won't result in
					// `onFocusItem` call which won't set `focusedOptionIndex`
					// in order for screen reader to announce it.
					if (highlightFirstOption &&
						focusedOptionIndex === undefined &&
						options.length === 1) {
						this.setState({ focusedOptionIndex: 0 })
					} else {
						// Navigate the list (if it was already expanded).
						this.list.onKeyDown(event)
					}
				} else {
					// Expand the list if it's collapsed.
					event.preventDefault()
					this.expand()
				}
				return

			// "Left" arrow.
			case 37:
			// "Right" arrow.
			case 39:
				// Exit "focus options" mode.
				if (isExpanded) {
					this.list.clearFocus()
					if (highlightFirstOption) {
						this.list.focusItem(0)
					}
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
					// If no option is selected and the input value is empty
					// then set `value` to `undefined`.
					if (isExpanded && this.list.getFocusedItemIndex() === undefined)
					{
						// Don't submit the form.
						event.preventDefault()
						this.setValue(undefined)

						this.collapsedDueToEmptyValueOnEnter = true
						this.collapse()
						this.collapsedDueToEmptyValueOnEnter = undefined

						return
					}

					if (!isExpanded)
					{
						// If `value` is `undefined` and input value is empty
						// then by default it submits the form.
						if (isEmptyValue(value))
						{
							// If the value is required then expand the options list.
							if (required)
							{
								// Don't submit the form
								event.preventDefault()
								this.expand()
							}
							return
						}

						// If the input value has been cleared
						// and the options list is collapsed
						// (for example, via Escape key)
						// then set `value` to `undefined`
						// and don't submit the form.
						event.preventDefault()
						this.setValue(undefined)
						return
					}
				}

				// Select the currently focused item (if expanded).
				if (isExpanded)
				{
					// Don't submit the form.
					event.preventDefault()
					// Choose the focused option.
					this.list.chooseFocusedItem()
				}

				return
		}
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

	fetchDefaultOptions = () =>
	{
		const
		{
			getOptions,
			filterOptions
		}
		= this.props

		return Promise.resolve().then(() =>
		{
			return getOptions ? getOptions('') : filterOptions(this.props.options, '')
		})
		.then((options) =>
		{
			return new Promise(resolve => this.setState({ options }, resolve))
		})
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
						this.handleNewOptions(options, counter, resolve)
					})
				})
			}

			const newOptions = filterOptions(this.props.options, inputValue)
			this.handleNewOptions(newOptions, null, resolve)
		})
	}

	handleNewOptions = (options, counter, resolve) =>
	{
		Promise.resolve(options).then((options) =>
		{
			// Autocomplete should always display some options.
			if (options.length === 0 && this.state.options.length === 0)
			{
				return this.fetchDefaultOptions().then(() => options)
			}
			return options
		})
		.then((options) =>
		{
			this.receiveNewOptions(options, counter, resolve)
		})
		.catch((error) =>
		{
			console.error(error)
			this.receiveNewOptions([], counter, resolve)
		})
	}

	receiveNewOptions(options, counter, callback)
	{
		const {
			getOptions,
			highlightFirstOption
		} = this.props

		const {
			isExpanded,
			matchesCounter,
			optionsCounter,
			fetchingOptionsCounter
		} = this.state

		const newState = {}

		if (getOptions)
		{
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
		}
		else
		{
			newState.matches = options.length > 0

			// Autocomplete should always display some options.
			if (options.length > 0)
			{
				newState.options = options
			}
		}

		if (newState.matches === false && !highlightFirstOption) {
			if (isExpanded) {
				this.list.clearFocus()
			}
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

	onBlur = (event) => {
		const { onBlur, value } = this.props
		if (onBlur) {
			onBlurForReduxForm(onBlur, event, value)
		}
		this.list && this.list.onBlur(event)
	}

	onClick = (event) =>
	{
		const { disabled } = this.props

		if (!disabled) {
			this.expandOnFocus()
		}
	}

	onFocusOut = (event) =>
	{
		let { onBlur, value } = this.props
		const { inputValue } = this.state

		// `window.rruiCollapseOnFocusOut` can be used
		// for debugging expandable contents.
		if (window.rruiCollapseOnFocusOut !== false) {
			this.collapse()
		}

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
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || (Math.pow(2, 53) - 1)

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

function generateRandomString() {
	return Math.random().toString().replace(/\D/g , '')
}