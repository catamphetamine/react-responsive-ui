import React from 'react'
import PropTypes from 'prop-types'
import { polyfill as reactLifecyclesCompat } from 'react-lifecycles-compat'
import classNames from 'classnames'

import ExpandableList from './ExpandableList'
import List from './List'
import Label from './TextInputLabel'
import Ellipsis from './Ellipsis'
import Divider from './Divider'
import WithError from './WithError'

import { onBlurForReduxForm } from './utility/redux-form'
import { submitFormOnCtrlEnter, submitContainingForm } from './utility/dom'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

const empty_value_option_value = ''

@reactLifecyclesCompat
export default class Select extends PureComponent
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

		// HTML form input `name` attribute
		name       : PropTypes.string,

		// Label which is placed above the select
		label      : PropTypes.string,

		// Placeholder (like "Choose")
		placeholder : PropTypes.string,

		// Whether to use native `<select/>`
		native      : PropTypes.bool.isRequired,

		// Whether to use native `<select/>` when expanded
		nativeExpanded : PropTypes.bool.isRequired,

		// Show icon only for selected item,
		// and only if `icon` is `true`.
		saveOnIcons : PropTypes.bool.isRequired,

		// Disables this control
		disabled   : PropTypes.bool,

		// Set to `true` to mark the field as required
		required   : PropTypes.bool.isRequired,

		// Set to `true` to display the loading indicator
		wait       : PropTypes.bool.isRequired,

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

		// `<button/>` toggler CSS class
		toggleClassName : PropTypes.string,

		// CSS style object
		style      : PropTypes.object,

		// If this flag is set to `true`,
		// and `icon` is specified for a selected option,
		// then the selected option will be displayed
		// as icon only, without the label.
		icon       : PropTypes.bool,

		// If this flag is set to `true`,
		// then it makes `<Select/>` not stretch itself
		// to 100% width by making it `inline-block`.
		// Is set to `true` when `icon` is `true`
		// because it makes sense.
		compact    : PropTypes.bool,

		// HTML `tabindex` attribute
		tabIndex   : PropTypes.number,

		// `aria-label` for the `<Select/>`'s `<button/>`.
		// Deprecated, use `aria-label` instead.
		ariaLabel : PropTypes.string
	}

	static defaultProps =
	{
		native : false,
		nativeExpanded : false,

		saveOnIcons : false,

		// Set to `true` to mark the field as required
		required : false,

		// Show `error` (if passed).
		indicateInvalid : true,

		// Set to `true` to display the loading indicator
		wait : false,

		// Will show scrollbar on overflow.
		scroll : true,

		alignment : 'left'
	}

	state = {}

	focus = () => this.select.focus()

	// On mobile devices the <button/> is focused instead of <select/>
	// because when <select/> is focused then native mobile <select/> is expanded.
	focusToggler = () => this.selectButton.focus()

	onCollapse = ({ focusOut }) =>
	{
		this.setState({ isExpanded: false })

		if (!focusOut) {
			if (this.isUsingKeyboard) {
				this.focus()
			} else {
				this.focusToggler()
			}
		}
	}

	onExpand = () => this.setState({ isExpanded: true })

	expand     = () => this.list.expand()
	collapse   = () => this.list.collapse()
	toggle     = () => this.list.toggle()

	storeListRef = (ref) => this.list = ref
	storeSelectNode = (node) => this.select = node
	storeSelectButton = (node) => this.selectButton = node
	storeInputComponentNode = (node) => this.inputComponentNode = node

	getSelectButton = () => this.selectButton

	render()
	{
		const
		{
			upward,
			icon,
			compact,
			scroll,
			scrollMaxItems,
			scrollIntoView,
			alignment,
			saveOnIcons,
			native,
			disabled,
			required,
			placeholder,
			options,
			value,
			onChange,
			indicateInvalid,
			error,
			closeButtonIcon,
			closeLabel,
			wait,
			style,
			className
		}
		= this.props

		const {
			isExpanded,
			isFocused
		} = this.state

		const containerStyle = { textAlign: alignment }

		const label = this.getLabel()

		return (
			<WithError
				error={error}
				indicateInvalid={indicateInvalid}
				style={style ? { ...containerStyle, ...style } : containerStyle}
				className={classNames(className, 'rrui__select', {
					'rrui__select--compact' : compact || icon,
					'rrui__select--focus'   : isFocused
				})}>

				<div
					ref={ this.storeInputComponentNode }
					className="rrui__input">

					{ wait && <Ellipsis/> }

					{/* Could use a wrapping `<label/>` here
					    but except the native `<select/>` there's
					    also a `<button/>` so they can't both
					    be wrapped in a `<label/>`.
					    In some future major version, when `--focus`
					    classes are added, the `<button/>` can be
					    moved out of the wrapping `<label/>`. */}
					{/* https://www.w3.org/TR/html50/forms.html#category-label */}

					{/* A transparent native `<select/>` on top
					    in case of `nativeExpanded={true}`.
					    (for better UX on mobile devices).
					    In case of `nativeExpanded={false}`
					    the native `<select/>` can be used for
					    javascriptless `<form/>` submission.
					    In case of `native={true}` it's just a
					    native `<select/>`. */}
					{ this.renderNativeSelect() }

					{/* The currently selected option */}
					{ !native && this.renderSelectButton() }

					{/* Label */}
					{/* (this label is placed after the "selected" button
					     to utilize the CSS `+` selector) */}
					{/* If the `placeholder` wasn't specified
					    but `label` was and no option is currently selected
					    then the `label` becomes the `placeholder`
					    until something is selected */}
					{ label &&
						<Label
							aria-hidden
							value={ value }
							required={ required }
							invalid={ indicateInvalid && error }
							floats={ false }>
							{ label }
						</Label>
					}

					{/* The list of selectable options */}
					{ this.shouldShowOptionsList() &&
						<ExpandableList
							ref={this.storeListRef}
							aria-label={this.getAriaLabel()}
							aria-required={required && isEmptyValue(value) ? true : undefined}
							aria-invalid={error && indicateInvalid ? true : undefined}
							upward={upward}
							alignment={alignment}
							scrollIntoView={scrollIntoView}
							scrollMaxItems={scroll === false ? 0 : scrollMaxItems}
							tabbable={false}
							value={value}
							onChange={this.setValue}
							onCollapse={this.onCollapse}
							onExpand={this.onExpand}
							getTogglerNode={this.getSelectButton}
							onFocusIn={this.onFocusIn}
							onFocusOut={this.onFocusOut}
							onTapOutside={this._onFocusOut}
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
									icon={option.divider || saveOnIcons ? undefined : option.icon}>
									{option.divider ? <Divider/> : (option.content ? option.content(option) : option.label)}
								</List.Item>
							))}
						</ExpandableList>
					}
				</div>
			</WithError>
		)
	}

	renderSelectButton()
	{
		const
		{
			wait,
			value,
			disabled,
			required,
			icon,
			title,
			native,
			nativeExpanded,
			toggleClassName,
			indicateInvalid,
			error
		}
		= this.props

		const { isExpanded } = this.state

		const selected = this.getSelectedOption()

		const selectedOptionLabel = selected && selected.label || this.getPlaceholder()
		const showIconOnly = icon && selected && selected.icon

		// ARIA (accessibility) roles info:
		// https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html
		//
		// `aria-haspopup`:
		// https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup
		// WAI-ARIA 1.1 is not yet supported, so not using `aria-haspopup="listbox"`.

		// This button could be focusable in case of !native && !nativeExpanded.
		// In case of nativeExpanded if this button was focusable then the user would
		// tab to the button and press Spacebar key and there would be no way to
		// expand the native select so the keyboard user would be stuck.
		// Because of this, this button is never tabbable and native select always is.

		return (
			<button
				ref={ this.storeSelectButton }
				type="button"
				disabled={ disabled }
				onClick={ this.onClick }
				onKeyDown={ this.onKeyDown }
				onFocus={ this.onFocusIn }
				onBlur={ this.onTogglerBlur }
				tabIndex={ -1 }
				title={ title }
				aria-label={ this.getAriaLabel() || (showIconOnly ? selectedOptionLabel : undefined) }
				aria-expanded={ isExpanded ? true : false }
				className={ classNames
				(
					'rrui__input-element',
					'rrui__button-reset',
					'rrui__outline',
					'rrui__select__button',
					toggleClassName,
					{
						'rrui__select__button--empty'    : isEmptyValue(value) && !this.hasEmptyOption(),
						'rrui__select__button--invalid'  : indicateInvalid && error,
						'rrui__select__button--disabled' : disabled
					}
				) }>

				{/* http://stackoverflow.com/questions/35464067/flexbox-not-working-on-button-element-in-some-browsers */}
				<span className="rrui__select__selected-content">

					{/* Selected option label (or icon) */}
					<span
						className={ classNames('rrui__select__selected-label',
						{
							'rrui__select__selected-label--required' : !this.getLabel() && required && isEmptyValue(value)
						}) }>
						{ showIconOnly ? React.createElement(selected.icon, { value, label: selectedOptionLabel }) : selectedOptionLabel }
					</span>

					{/* An arrow */}
					{ !wait && <span className="rrui__select__arrow"/> }
				</span>
			</button>
		)
	}

	renderNativeSelect()
	{
		const
		{
			name,
			value,
			label,
			disabled,
			required,
			native,
			nativeExpanded,
			error,
			indicateInvalid,
			tabIndex
		}
		= this.props

		return (
			<select
				ref={ this.storeSelectNode }
				name={ name }
				value={ isEmptyValue(value) ? empty_value_option_value : value }
				disabled={ disabled }
				onKeyDown={ this.nativeSelectOnKeyDown }
				onMouseDown={ this.nativeSelectOnMouseDown }
				onChange={ this.nativeSelectOnChange }
				onFocus={ this.onFocusIn }
				onBlur={ this.__onFocusOut }
				tabIndex={ tabIndex }
				aria-label={ this.getAriaLabel() }
				aria-required={ required && isEmptyValue(value) ? true : undefined }
				aria-invalid={ error && indicateInvalid ? true : undefined }
				className={ classNames(
					// `:focus` style is implemented via border color
					// so outline can be muted safely here.
					'rrui__outline',
					'rrui__select__native', {
						'rrui__select__native--overlay' : !native,
						'rrui__select__native--invalid' : indicateInvalid && error
					}
				) }>
				{this.renderNativeSelectOptions()}
			</select>
		)
	}

	renderNativeSelectOptions()
	{
		const
		{
			options,
			value,
			placeholder
		}
		= this.props

		let empty_option_present = false

		const rendered_options = options.map((option) =>
		{
			let { value, label, divider } = option

			if (!divider && isEmptyValue(value))
			{
				empty_option_present = true
				value = empty_value_option_value
			}

			return this.renderNativeSelectOption(value, label, divider === true, divider)
		})

		if (isEmptyValue(value) && !empty_option_present)
		{
			rendered_options.unshift(this.renderNativeSelectOption(undefined, placeholder, true))
		}

		return rendered_options
	}

	renderNativeSelectOption(value, label, nonSelectable, isDivider)
	{
		return (
			<option
				key={ getOptionKey(value) }
				value={ isEmptyValue(value) ? '' : value }
				hidden={ nonSelectable && !isDivider ? true : undefined }
				disabled={ nonSelectable ? true : undefined }
				className={ classNames('rrui__select__native-option', {
					'rrui__select__native-option--divider': isDivider
				})}>
				{ label }
			</option>
		)
	}

	nativeSelectOnKeyDown = (event) =>
	{
		this.isUsingKeyboard = true

		if (this.shouldShowOptionsList())
		{
			// Native select is the main focusable element now
			// even when the custom select is rendered.
			// this.focusToggler()
			this.onKeyDownFromNativeSelect = true
			this.onKeyDown(event)
		}
	}

	nativeSelectOnMouseDown = (event) =>
	{
		if (this.shouldShowOptionsList())
		{
			event.preventDefault()
			// Native select is the main focusable element now
			// even when the custom select is rendered.
			// this.focusToggler()
			this.toggle()
		}
	}

	nativeSelectOnChange = (event) =>
	{
		const { native, nativeExpanded } = this.props

		let value = event.target.value

		// Convert back from an empty string to `undefined`
		if (value === empty_value_option_value)
		{
			// `null` is not accounted for, use `undefined` instead.
			value = undefined
		}

		this.setValue(value)

		// Firefox has a bug:
		// Spacebar key on native `<select/>` is not being "preventDefault"ed.
		// https://bugzilla.mozilla.org/show_bug.cgi?id=1428992
		// https://bugzilla.mozilla.org/show_bug.cgi?id=1019630
		// https://stackoverflow.com/questions/15141398/cannot-preventdefault-via-firefox-on-a-select
		// This workaround hides the custom `<Select/>`
		// when a user selects something in the native `<select/>`
		// which expands over the custom one in Firefox due to the bug.
		if (navigator.userAgent.toLowerCase().indexOf('firefox') >= 0) {
			if (!native && !nativeExpanded) {
				this.collapse()
			}
		}
	}

	onClick = (event) =>
	{
		const { disabled, nativeExpanded } = this.props

		if (!disabled) {
			this.toggle()
		}
	}

	onKeyDown = (event) =>
	{
		const { disabled, value, required } = this.props
		const { isExpanded } = this.state

		// Reset "event came from native select" flag.
		const fromNativeSelect = this.onKeyDownFromNativeSelect
		this.onKeyDownFromNativeSelect = false

		if (disabled) {
			return
		}

		if (event.defaultPrevented) {
			return
		}

		if (!isExpanded) {
			if (submitFormOnCtrlEnter(event, this.selectButton)) {
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
			// "Down" arrow.
			// Select the next item (if present).
			case 40:
				// Firefox has a bug:
				// Up/Down arrow keys on native `<select/>` are not being "preventDefault"ed.
				// https://bugzilla.mozilla.org/show_bug.cgi?id=1428992
				// https://bugzilla.mozilla.org/show_bug.cgi?id=1019630
				// https://stackoverflow.com/questions/15141398/cannot-preventdefault-via-firefox-on-a-select
				// This workaround doesn't expand the custom `<Select/>`
				// when a user presses an Up/Down arrow key on the native `<select/>`.
				if (navigator.userAgent.toLowerCase().indexOf('firefox') >= 0) {
					return
				}
				return this.list.onKeyDown(event)

			// "Enter".
			case 13:
				// Submit containing `<form/>`.
				// Expand otherwise.
				if ((required && isEmptyValue(value)) || !submitContainingForm(this.selectButton)) {
					this.expand()
				}
				return event.preventDefault()

			// "Spacebar".
			case 32:
				if (fromNativeSelect)
				{
					// Firefox has a bug:
					// Spacebar key on native `<select/>` is not being "preventDefault"ed.
					// https://bugzilla.mozilla.org/show_bug.cgi?id=1428992
					// https://bugzilla.mozilla.org/show_bug.cgi?id=1019630
					// https://stackoverflow.com/questions/15141398/cannot-preventdefault-via-firefox-on-a-select
					event.preventDefault()

					this.expand()
				}
				return
		}
	}

	hasEmptyOption()
	{
		const { options } = this.props

		for (const option of options) {
			if (!option.divider && isEmptyValue(option.value)) {
				return true
			}
		}

		return false
	}

	getSelectedOption()
	{
		const { options, value } = this.props

		for (const option of options)
		{
			if (!option.divider && option.value === value)
			{
				return option
			}
		}
	}

	getAriaLabel()
	{
		const {
			// Deprecated, use `aria-label` instead.
			ariaLabel,
			label
		} = this.props

		return this.props['aria-label'] || ariaLabel || label
	}

	getLabel()
	{
		const { label, placeholder, value } = this.props

		if (isEmptyValue(value) && !placeholder) {
			// Label will be shown in placeholder's place
			// so don't show it as a label to prevent duplication.
			return
		}

		return label
	}

	getPlaceholder()
	{
		const { label, placeholder, value } = this.props

		if (isEmptyValue(value)) {
			return placeholder || label
		}
	}

	shouldShowOptionsList()
	{
		const { native, nativeExpanded } = this.props
		return !native && !nativeExpanded
	}

	setValue = (newValue) =>
	{
		const { value, onChange } = this.props

		// Call `onChange` only if the `value` did change.
		if (newValue !== value) {
			onChange(newValue)
		}
	}

	onTogglerBlur = (event) =>
	{
		const { onBlur, value } = this.props

		if (this.list) {
			this.list.onBlur(event)
		}

		this.__onFocusOut()

		// When the `<button/>` was focused out
		// while there was no list being shown.
		if (onBlur && this.list && this.list.expandable && !this.list.expandable.container) {
			onBlurForReduxForm(onBlur, event, value)
		}
	}

	onFocusIn    = () => this.setState({ isFocused: true })
	__onFocusOut = () => this.setState({ isFocused: false })

	_onFocusOut = () =>
	{
		const { native, nativeExpanded } = this.props

		if (!native && !nativeExpanded) {
			// `window.rruiCollapseOnFocusOut` can be used
			// for debugging expandable contents.
			if (window.rruiCollapseOnFocusOut !== false) {
				this.collapse()
			}
		}

		this.__onFocusOut()
	}

	onFocusOut = (event) =>
	{
		const { onBlur, value } = this.props

		this._onFocusOut()

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