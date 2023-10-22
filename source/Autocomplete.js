import React from 'react'
import PropTypes from 'prop-types'
import { polyfill as reactLifecyclesCompat } from 'react-lifecycles-compat'
import classNames from 'classnames'

import ExpandableList from './ExpandableList'
import List from './List'
import Label from './TextInputLabel'
import TextInputInput from './TextInputInput'
import Ellipsis from './Ellipsis'
import WithError from './WithError'

import { onBlurForReduxForm } from './utility/redux-form'
import { submitFormOnCtrlEnter, submitContainingForm } from './utility/dom'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

class Autocomplete extends PureComponent
{
	static propTypes =
	{
		// A list of selectable options
		options : PropTypes.arrayOf
		(
			PropTypes.shape
			({
				// Option value (can also be `null` or `undefined`)
				value : PropTypes.any,
				// Could restrict it to stringifiable types
				// but I guess this is not required
				// and one could even use `object`s as `value`s.
				// // Option value (can also be `null` or `undefined`)
				// value : PropTypes.oneOfType([
				// 	PropTypes.string,
				// 	PropTypes.number,
				// 	PropTypes.bool
				// ]),
				// Option label (can be `undefined`)
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
		),

		// An alternative way of getting `options`.
		// If it's an `autocomplete` then this function
		// receives the `query : string` argument.
		// Is only for `autocomplete` mode.
		// Must return a `Promise`.
		getOptions : PropTypes.func,

		// Can be supplied when supplying `options` prop.
		// By default filters by substring inclusion (case-insensitive).
		filterOptions : PropTypes.func,

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
		// * `{ ...option }` — All properties of an `option` such as `value`, `label`, etc. Each `option` must have a `value` and a `label` (`value` can also be `null` or `undefined`).
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

		// HTML form input `type` attribute
		type : PropTypes.string,

		// Placeholder (like "Choose")
		placeholder : PropTypes.string,

		// Show icon only for selected item,
		// and only if `icon` is `true`.
		saveOnIcons : PropTypes.bool,

		// Disables this control
		disabled   : PropTypes.bool,

		// HTML `readOnly` attribute
		readOnly   : PropTypes.bool,

		// Set to `true` to mark the field as required
		required   : PropTypes.bool.isRequired,

		// Indicates that the input is invalid.
		error : PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.bool
		]),

		showErrorMessage : PropTypes.bool,

		// When `acceptsAnyValue` is `true`, the user is not required to select any of the options.
		// That could be used when the list of options is not a full one.
		// * `<input/>` value won't be reset when focusing out of the `<input/>`
		//   after not having selected any option.
		// * `onChange()` will be called for every change of the `<input/>` value,
		//   not just when the user has selected some option.
		acceptsAnyValue : PropTypes.bool,

		// Pass `true` to submit the form when selecting an option.
		submitOnSelectOption : PropTypes.bool,

		// When `findOptions()` property function is not provided,
		// the default one will match options by `<input/>` value
		// case-insensitive by default.
		caseSensitive : PropTypes.bool,

		// Selected option value
		value : PropTypes.any,

		// `value` for cases when the input gets cleared.
		emptyValue : PropTypes.any,

		// Is called when an option is selected
		onChange : PropTypes.func,
		onInputValueChange : PropTypes.func,

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
		// then it's passed to `<TextInputInput/>` as its `icon`.
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

		// `onKeyDown()` doesn't get called in all cases.
		// Currently it's only called in cases:
		// * Pressed `Esc` when the options list is not expanded.
		// * Pressed `Enter` when the input is empty.
		onKeyDown : PropTypes.func,

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
		// Hence, this property allows a developer customize this type of behavior.
		//
		// When set to `true`, it automatically highlights the top-most option.
		// UX for non-disabled users is better this way.
		// Disabled users still can use this component.
		//
		// Can be explicitly set to `false` for WAI-ARIA compliancy.
		//
		highlightFirstOption : PropTypes.bool,

		ScrollableContainer : PropTypes.elementType,
		getScrollableContainerHeight : PropTypes.func,
		getScrollableContainerScrollY : PropTypes.func,
		setScrollableContainerScrollY : PropTypes.func
	}

	static defaultProps =
	{
		// Set to `true` to mark the field as required
		required : false,

		// Show `error` (if passed).
		showErrorMessage : true,

		// Set to `true` to display the loading indicator
		loading : false,

		// Will show scrollbar on overflow.
		scroll : true,

		alignment : 'left',

		// `async getOptions()` throttle period.
		throttle : 200,

		// `async getOptions()` throttle threshold (in characters).
		minCharactersToStartThrottling : 4,

		// The maximum number of options to be rendered
		// in the options list when it's expanded.
		// The rationale is that otherwise the UI could
		// stagger when initially expanding a huge list.
		// `0` means "unlimited".
		maxOptions : 500
	}

	state =
	{
		// The sequential counter for `async getOptions()`:
		// the `options` with the highest counter are shown
		// to prevent "race condition" inconsistency.
		// Older options can only be overwritten with newer ones.
		optionsCounter : 0,
		hasAnyMatchingOptionsCounter : 0,

		// Update `state.inputValue` and `state.selectedOption`
		// according to the initial `props.value`.
		...this.getInputValueAndSelectedOptionForInitialState(this.props),
		options: []
	}

	// Latest `async getOptions()` invocation timestamp (for throttling).
	latestFetchOptionsCallTimestamp = 0

	// Older options can only be overwritten with newer ones.
	// (in case of `async getOptions()`).
	counter = new Counter()

	componentDidMount()
	{
		// Generate unique ID.
		let id = `rrui-autocomplete`
		while (document.getElementById(`${id}__input`)) {
			id = `rrui-autocomplete-${generateRandomString()}`
		}
		this.input.id = `${id}__input`
		this.setState({ id })

		// Update `state.inputValue` according to the initial `props.value`
		// when using custom `getOptions`/`getOption` functions.
		const { getOptions, value } = this.props
		if (getOptions && !isEmptyValue(value)) {
			this.updateInputValueAndSelectedOptionForValue()
		}
	}

	componentDidUpdate(prevProps)
	{
		// If the `value` property has changed, it could be for one of the two reasons:
		// * A developer has passed a new `value` property in order to update it from outside.
		// * This component called `onChange()` with a new `value` as an argument.
		if (prevProps.value !== this.props.value) {
			const { emptyValue, value, acceptsAnyValue } = this.props
			const { selectedOption, inputValue } = this.state
			if (acceptsAnyValue) {
				// In case of `acceptsAnyValue`, it's not obvious
				// whether the `value` was updated externally or as a result
				// of calling `onChange(inputValue)`.
				if (inputValue !== value) {
					// There's no need to set `state.selectedOption` in case of
					// `acceptsAnyValue: true` because for an external observer —
					// the application code — the end result would be the same
					// with or without `state.selectedOption` being set:
					// `value` would be the same regardless.
					// So it only updates the `inputValue` here.
					this.setState({
						inputValue: value,
						// It's not necessary that there's an option that has a value of `value`,
						// so the currently-set `inputValue` doesn't necessarily correspond to any option.
						// Therefore, set this property to `undefine` rather than to `inputValue`.
						inputValueForLastSelectedOption: undefined
					})
				}
			} else {
				// Filter out the cases when this component called `onChange()` with a new `value`
				// as an argument, leaving only the cases when a developer has passed a new `value`
				// property in order to update it from outside.
				if (selectedOption) {
					if (value !== selectedOption.value) {
						// Update `state.inputValue` according to the new `props.value`.
						this.updateInputValueAndSelectedOptionForValue()
					}
				} else {
					if (!isEmptyValue(value)) {
						// Update `state.inputValue` according to the new `props.value`.
						this.updateInputValueAndSelectedOptionForValue()
					}
				}
			}
		}
	}

	componentWillUnmount()
	{
		clearTimeout(this.nextFetchOptionsCallTimeout)
	}

	updateInputValueAndSelectedOptionForValue()
	{
		const { value, options, getOptions, getOption, acceptsAnyValue } = this.props

		const updateStateWithSelectedOption = (option) => {
			const inputValue = this.getInputValueForOption(option, { value, acceptsAnyValue })
			this.setState({
				selectedOption: option,
				inputValue,
				inputValueForLastSelectedOption: option ? inputValue : undefined,
				isFetchingInitiallySelectedOption: false
			})
		}

		this.setState({
			isFetchingInitiallySelectedOption: true
		})

		if (isEmptyValue(value)) {
			updateStateWithSelectedOption(undefined)
			return
		}

		if (getOptions) {
			// Validate that `getOption` property was passed along with `getOptions` property.
			if (getOptions && !getOption) {
				throw new Error("An initial `value` was passed to `<Autocomplete/>` which has `getOptions` but doesn't have `getOption` to get the label for that initial `value`.")
			}

			getOption(value).then(
				(option) => {
					updateStateWithSelectedOption(option)
				},
				(error) => {
					console.error(error)
					updateStateWithSelectedOption(undefined)
				}
			)
		} else {
			const option = getOptionByValue(value, options)
			updateStateWithSelectedOption(option)
		}
	}

	getInputValueForOption(option, { value, acceptsAnyValue })
	{
		return (option ? getLabelForOption(option, { acceptsAnyValue }) : (acceptsAnyValue ? value : undefined)) || ''
	}

	getInputValueAndSelectedOptionForInitialState({ value, acceptsAnyValue, options })
	{
		if (options) {
			const option = getOptionByValue(value, options)
			const inputValue = this.getInputValueForOption(option, { value, acceptsAnyValue })
			return {
				inputValue,
				inputValueForLastSelectedOption: option ? inputValue : undefined,
				selectedOption: option
			}
		} else {
			return {
				inputValue: '',
				inputValueForLastSelectedOption: undefined,
				selectedOption: undefined
			}
		}
	}

	onPreloadStateChange = (isPreloading) =>
	{
		this.setState({ isFetchingOptions : isPreloading })
	}

	focus = () =>
	{
		this.input.focus()
	}

	onCollapse = ({ collapsedDueToItemBeingSelected, focusOut }) =>
	{
		const { acceptsAnyValue, emptyValue } = this.props
		const { inputValue, options, selectedOption } = this.state

		this.setState
		({
			isExpanded : false,
			hasAnyMatchingOptions : undefined
		})

		if (!collapsedDueToItemBeingSelected && !this.collapsedDueToEmptyValueOnEnter)
		{
			if (!acceptsAnyValue)
			{
				if (inputValue) {
					// Reset `inputValue` to the last selected option's label.
					this.setState({
						inputValue : getLabelForOption(selectedOption, { acceptsAnyValue }) || ''
					})
				} else {
					// If the user has erased the text input value,
					// clear the `value` property on focus out:
					// on click away / focus away / "Esc" key press.
					this.setValue(emptyValue)
				}
			}
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

	onFocusItem = (i, options) =>
	{
		if (options.interaction) {
			this.setState({ focusedOptionIndex: i })
		} else {
			this.setState({ focusedOptionIndex: undefined })
		}
	}

	expand = () =>
	{
		const { acceptsAnyValue } = this.props
		const { inputValue } = this.state

		// Reset `hasAnyMatchingOptions` state property before expanding.
		//
		// `hasAnyMatchingOptions` should be `true` when no value has been input or selected.
		// The reason is because when `hasAnyMatchingOptions` is `false`, the input is considered invalid,
		// and logically it can't be classified as invalid when there's no input yet.
		//
		// When `acceptsAnyValue` is `false` and there's some `inputValue`
		// then it means that the `inputValue` corresponds to one of the selected options
		// so `hasAnyMatchingOptions` is `true` in that case.
		//
		const hasAnyMatchingOptions = inputValue === '' ? true : (
			acceptsAnyValue ? undefined : true
		)
		this.setState({ hasAnyMatchingOptions }, this._expand)
	}

	_expand = (parameters) =>
	{
		this.list.expand(parameters)
	}

	// Returns a `Promise`.
	collapse = () => this.list.collapse()

	// Returns a `Promise`.
	toggle = () => this.list.toggle()

	storeListRef = (ref) => {
		this.list = ref
	}

	storeInput = (node) => {
		this.input = node
	}

	storeInputComponentNode = (node) => {
		this.inputComponentNode = node
	}

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
			optionComponent,
			required,
			label,
			placeholder,
			value,
			onChange,
			acceptsAnyValue,
			showErrorMessage,
			error,
			closeButtonIcon,
			closeLabel,
			ScrollableContainer,
			getScrollableContainerHeight,
			getScrollableContainerScrollY,
			setScrollableContainerScrollY,
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

		// value={options.length === 0 ? undefined : (inputValue.trim() === '' ? emptyValue : value)}

		return (
			<WithError
				id={id}
				error={showErrorMessage ? error : undefined}
				style={style ? { ...containerStyle, ...style } : containerStyle}
				className={classNames(className, 'rrui__autocomplete', {
					'rrui__autocomplete--expanded' : isExpanded,
					'rrui__autocomplete--compact'  : compact || (icon === true)
				})}>

				<div
					ref={ this.storeInputComponentNode }
					className="rrui__input">

					{(isFetchingOptions || isFetchingInitiallySelectedOption) &&
						<Ellipsis/>
					}

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
							invalid={ error }>
							{ label }
						</Label>
					}

					{/* The list of selectable options */}
					<ExpandableList
						ref={this.storeListRef}
						id={id ? `${id}__list` : undefined}
						items={options}
						value={options.length === 0 ? undefined : value}
						highlightFirstItem={this.shouldHighlightFirstOption() && inputValue.trim() !== ''}
						alignment={alignment}
						scrollIntoView={scrollIntoView}
						preload={this.refreshOptions}
						onPreloadStateChange={this.onPreloadStateChange}
						onFocusItem={this.onFocusItem}
						scrollMaxItems={scroll === false ? 0 : scrollMaxItems}
						shouldFocus={false}
						onChange={this.setValueOnChooseOption}
						onCollapse={this.onCollapse}
						onExpand={this.onExpand}
						focusOnExpand={false}
						highlightSelectedItem={false}
						tabbable={false}
						getTogglerNode={this.getInputNode}
						onFocusOut={this.onFocusOut}
						ScrollableContainer={ScrollableContainer}
						getScrollableContainerHeight={getScrollableContainerHeight}
						getScrollableContainerScrollY={getScrollableContainerScrollY}
						setScrollableContainerScrollY={setScrollableContainerScrollY}
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
								{optionComponent ? undefined : (option.content ? option.content(option) : getLabelForOption(option, { acceptsAnyValue }))}
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
			type,
			icon,
			placeholder,
			disabled,
			readOnly,
			required,
			error,
			tabIndex,
			autoFocus,
			autoComplete,
			acceptsAnyValue,
			inputClassName
		}
		= this.props

		const
		{
			id,
			isExpanded,
			inputValue,
			hasAnyMatchingOptions,
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
				<TextInputInput
					id={ id ? `${id}__input` : undefined }
					ref={ this.storeInput }
					value={ inputValue }
					label={ label }
					placeholder={ placeholder }
					onChange={ this.onInputValueChange }
					onKeyDown={ this.onKeyDown }
					onBlur={ this.onBlur }
					type={ type }
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
					disabled={ disabled }
					readOnly={ isFetchingInitiallySelectedOption || readOnly }
					error={ error || (acceptsAnyValue ? undefined : (hasAnyMatchingOptions === false ? 'no-match' : undefined)) }
					className={ classNames('rrui__autocomplete__input', inputClassName, {
						'rrui__input-field--with-icon': Icon
					}) }
				/>
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
			this.expand()
		}
	}

	onInputValueChange = (value) =>
	{
		const { acceptsAnyValue, onChange, onInputValueChange } = this.props
		const { isExpanded } = this.state

		// Rewrite this somehow.
		//
		// When `this.shouldHighlightFirstOption()` is `true`
		// this is a special case when the first option is not highlighted.
		//
		if (!value && isExpanded) {
			this.list.focusItem(undefined)
		}

		if (acceptsAnyValue) {
			onChange(value)
		}

		if (onInputValueChange) {
			onInputValueChange(value)
		}

		this.setState({
			inputValue : value
		}, () => {
			this._expand({ refresh: true })
		})
	}

	onKeyDown = (event) =>
	{
		const { disabled, readOnly, value, emptyValue, required, onKeyDown, submitOnSelectOption } = this.props
		const { options, isExpanded, inputValue, focusedOptionIndex } = this.state

		if (disabled || readOnly) {
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
						if (!this.shouldHighlightFirstOption()) {
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
					// An edge case for `this.shouldHighlightFirstOption() === true`
					// when there's only one option available
					// so pressing "Down" arrow key won't result in
					// `onFocusItem` call which won't set `focusedOptionIndex`
					// in order for screen reader to announce it.
					if (
						this.shouldHighlightFirstOption() &&
						focusedOptionIndex === undefined &&
						options.length === 1
					) {
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
					if (this.shouldHighlightFirstOption()) {
						this.list.focusItem(0)
					}
				}
				return

			// "Escape".
			// Collapse.
			case 27:
				if (isExpanded) {
					event.preventDefault()
					this.collapse()
				} else {
					if (onKeyDown) {
						onKeyDown(event)
					}
				}
				return

			// "Enter".
			case 13:
				if (!inputValue)
				{
					if (onKeyDown) {
						onKeyDown(event)
					}

					// If no option is selected and the input value is empty
					// then set `value` to `undefined`.
					if (isExpanded && this.list.getFocusedItemIndex() === undefined)
					{
						// Don't submit the form.
						event.preventDefault()
						this.setValue(emptyValue)

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
						this.setValue(emptyValue)
						return
					}
				}

				// Select the currently focused item (if expanded).
				if (isExpanded)
				{
					if (this.list.getFocusedItemIndex() === undefined)  {
						// If the list is expanded and no option is focused
						// then it means that `acceptsAnyValue` is `true`.
						// In that case, it will automatically submit the form.
						this.collapse()
					} else {
						if (!submitOnSelectOption) {
							// Don't submit the form.
							event.preventDefault()
						}
						// Choose the focused option.
						// The `.chooseFocusedItem()` function imitates a `click` event
						// on an option's element, which would cause the form to be submitted
						// if `submitOnSelectOption` flag is `true`. But if that flag is `true`,
						// the form is already being submitted due to the `Enter` key,
						// so set a utility flag to temporarily ignore `submitOnSelectOption` flag
						// in the `click` event handler.
						this.dontSubmitFormOnOptionSelect = true
						this.list.chooseFocusedItem()
						this.dontSubmitFormOnOptionSelect = false
					}
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

	filterOptions = (options, inputValue) => {
		const { filterOptions, caseSensitive, acceptsAnyValue } = this.props
		if (filterOptions) {
			return filterOptions(options, inputValue)
		}
		return getOptionsByInputValue(options, inputValue, { caseSensitive, acceptsAnyValue })
	}

	fetchDefaultOptions = () =>
	{
		const { getOptions } = this.props

		return Promise.resolve().then(() =>
		{
			return getOptions ? getOptions('') : this.filterOptions(this.props.options, '')
		})
	}

	refreshOptions = () =>
	{
		const { getOptions } = this.props
		const { inputValue } = this.state

		return new Promise((resolve) => {
			// If throttled then schedule a future invocation.
			if (getOptions) {
				if (this.throttleFetchOptionsCall(resolve)) {
					return
				}

				this.latestFetchOptionsCallTimestamp = Date.now()

				const counter = this.counter.getNextCounter()

				this.setState({
					isFetchingOptions : true,
					fetchingOptionsCounter : counter
				}, () => {
					this.fetchOptionsByInputValue(inputValue).then((options) => {
						this.handleNewOptions(options, counter, resolve)
					})
				})
			} else {
				this.fetchOptionsByInputValue(inputValue).then((options) => {
					this.handleNewOptions(options, null, resolve)
				})
			}
		})
	}

	fetchOptionsByInputValue(inputValue) {
		const { getOptions } = this.props
		if (getOptions) {
			return getOptions(inputValue)
		} else {
			return Promise.resolve(this.filterOptions(this.props.options, inputValue))
		}
	}

	handleNewOptions = (options, counter, resolve) =>
	{
		Promise.resolve(options).then((options) =>
		{
			// Autocomplete should always display some options,
			// even when none match. The rationale is that otherwise
			// the user could end up entering a non-matching text value
			// and then being stuck with it not knowing how to proceed and why does
			// the text input show an "invalid input" error: without an expanded list of
			// some options it would look like a generic text input field, and to the user
			// it would look like a generic text input field rather than an "autocomplete" component.
			//
			if (options.length === 0 && this.state.options.length === 0)
			{
				const fetchFallbackOptions = () => {
					// The only case when `state.options` is an empty array is the initial state.
					const { inputValueForLastSelectedOption } = this.state
					if (inputValueForLastSelectedOption !== undefined) {
						return this.fetchOptionsByInputValue(inputValueForLastSelectedOption).then((options) => {
							if (options.length > 0) {
								return options
							}
							return this.fetchDefaultOptions()
						})
					}
					return this.fetchDefaultOptions()
				}

				return fetchFallbackOptions().then((options) => {
					// Update `options` in `state`.
					return new Promise(resolve => this.setState({ options }, resolve))
				}).then(() => {
					// Return empty result.
					return []
				})
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
			getOptions
		} = this.props

		const {
			isExpanded,
			hasAnyMatchingOptionsCounter,
			optionsCounter,
			fetchingOptionsCounter
		} = this.state

		const newState = {}

		if (getOptions)
		{
			// Can only override "older" matching state.
			if (isCounterAfter(counter, hasAnyMatchingOptionsCounter))
			{
				newState.hasAnyMatchingOptions = options.length > 0
				newState.hasAnyMatchingOptionsCounter = counter
			}

			// Update options.
			// Can only override "older" options.
			// (not "newer" ones)
			if (isCounterAfter(counter, optionsCounter))
			{
				// Autocomplete should always display some options.
				// The only case when `state.options` is an empty array is the initial state.
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
			newState.hasAnyMatchingOptions = options.length > 0

			// Autocomplete should always display some options.
			if (options.length > 0)
			{
				newState.options = options
			}
		}

		if (newState.hasAnyMatchingOptions === false && !this.shouldHighlightFirstOption()) {
			if (isExpanded) {
				this.list.clearFocus()
			}
		}

		this.setState(newState, callback)
	}

	setValueOnChooseOption = (newValue) => {
		this.setValue(newValue)

		// Submit the form if `submitOnSelectOption: true` property was passed.
		const { submitOnSelectOption } = this.props
		if (submitOnSelectOption) {
			if (!this.dontSubmitFormOnOptionSelect) {
				submitContainingForm(this.input)
			}
		}
	}

	setValue = (newValue) =>
	{
		const { value, onChange, acceptsAnyValue } = this.props
		const { options } = this.state

		const selectedOption = options.filter(_ => _.value === newValue)[0]
		const inputValue = getLabelForOption(selectedOption, { acceptsAnyValue }) || ''

		const newState = {
			selectedOption,
			inputValue,
			inputValueForLastSelectedOption: selectedOption ? inputValue : undefined
		}

		if (selectedOption) {
			newState.options = [selectedOption]
		}

		this.setState(newState)

		// Call `onChange` only if the `value` did change.
		if (newValue !== value) {
			onChange(newValue)
		}
	}

	shouldHighlightFirstOption()
	{
		const { acceptsAnyValue, highlightFirstOption } = this.props

		// Return a default value for the `highlightFirstOption` property.
		if (highlightFirstOption === undefined) {
			if (acceptsAnyValue) {
				return false
			}
			return true
		}

		return highlightFirstOption
	}

	onBlur = (event) =>
	{
		const { onBlur, value } = this.props
		if (onBlur) {
			onBlurForReduxForm(onBlur, event, value)
		}
		if (this.list) {
			this.list.onBlur(event)
		}
	}

	onClick = (event) =>
	{
		const { disabled, readOnly } = this.props

		if (disabled || readOnly) {
			return
		}

		this.expandOnFocus()
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

		if (onBlur) {
			onBlurForReduxForm(onBlur, event, value)
		}
	}
}

export default reactLifecyclesCompat(Autocomplete)

function isEmptyValue(value)
{
	return value === null || value === undefined
}

// Filters options by substring inclusion (case-insensitive).
function getOptionsByInputValue(options, inputValue, { caseSensitive, acceptsAnyValue })
{
	// If the input value is empty.
	if (!inputValue) {
		return options
	}

	if (!caseSensitive) {
		inputValue = inputValue.toLowerCase()
	}

	return options.filter((option) => {
		let label = getLabelForOption(option, { acceptsAnyValue })
		if (typeof label === 'string') {
			if (!caseSensitive) {
				label = label.toLowerCase()
			}
			return label.indexOf(inputValue) >= 0
		} else {
			return false
		}
	})
}

function getOptionByValue(value, options) {
	return options.filter(option => option.value === value)[0]
}

function getLabelForOption(option, { acceptsAnyValue }) {
	if (!option) {
		return undefined
	}
	// When passing `acceptsAnyValue={true}` property, the `options` can't contain `label`s.
	// Otherwise, the users would observe a weird behavior when, for example, there's an
	// `option` having value `"a"` and label `"Apple"` and they start inputting letter `"a"`
	// in the text input: it would immediately select `"Apple"` because `inputValue === option.value`,
	// which would be considered "weird" by the users because users don't see `option.value`s.
	// To make the behavior of the autocomplete logical in cases like that, the component
	// will show `option.value`s in place of `option.label`s.
	if (acceptsAnyValue) {
		return option.value
	}
	return option.label
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