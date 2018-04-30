import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { polyfill as reactLifecyclesCompat } from 'react-lifecycles-compat'
import classNames from 'classnames'

import Label from './TextInputLabel'
import TextInput from './TextInputInput'
import Ellipsis from './Ellipsis'
import Close, { CloseIcon } from './Close'

import
{
	submitFormOnCtrlEnter,
	submitContainingForm,
	getScrollbarWidth,
	isInternetExplorer,
	scrollIntoViewIfNeeded
}
from './utility/dom'

import { onBlurForReduxForm } from './utility/redux-form'

// Possible enhancements:
//
//  * If the menu is close to a screen edge,
//    automatically reposition it so that it fits on the screen
//  * Maybe show menu immediately above the toggler
//    (like in Material design), not below it.
//
// https://material.google.com/components/menus.html

// This component could use `onBlur={...}` event handler
// for collapsing the options list when a user clicks outside
// using the `if (container.contains(event.relatedTarget))` technique,
// but it doesn't work in Internet Explorer in React.
// https://github.com/gpbl/react-day-picker/issues/668
// https://github.com/facebook/react/issues/3751
//
// Therefore, using a 30ms timeout hack in `onBlur` handler
// to get the new currently focused page element
// and check if that element is inside the `<Select/>`.
// https://github.com/mui-org/material-ui/blob/v1-beta/packages/material-ui/src/Menu/MenuList.js
// Until Internet Explorer is no longer a supported browser.

const Empty_value_option_value = ''

const value_prop_type = PropTypes.oneOfType
([
	PropTypes.string,
	PropTypes.number,
	PropTypes.bool
])

@reactLifecyclesCompat
export default class Select extends Component
{
	static propTypes =
	{
		// A list of selectable options
		options : PropTypes.arrayOf
		(
			PropTypes.shape
			({
				// Option value (may be `undefined`)
				value : value_prop_type,
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
		),

		// An alternative way of getting `options`.
		// If it's an `autocomplete` then this function
		// receives the `query : string` argument.
		// Is only for `autocomplete` mode.
		// Can return a `Promise`.
		getOptions : PropTypes.func,

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

		// Whether to use native `<select/>`
		native      : PropTypes.bool.isRequired,

		// Show icon only for selected item,
		// and only if `concise` is `true`.
		saveOnIcons : PropTypes.bool,

		// Disables this control
		disabled   : PropTypes.bool,

		// Set to `true` to mark the field as required
		required   : PropTypes.bool.isRequired,

		// Set to `true` to display the loading indicator
		loading    : PropTypes.bool.isRequired,

		// Selected option value
		value      : value_prop_type,

		// Is called when an option is selected
		onChange   : PropTypes.func,

		// Is called when the select is blurred.
		// This `onBlur` interceptor is a workaround for `redux-form`,
		// so that it gets the parsed `value` in its `onBlur` handler,
		// not the formatted text.
		onBlur     : PropTypes.func,

		// (exotic use case)
		// Falls back to a plain HTML input
		// when javascript is disabled (e.g. Tor)
		fallback   : PropTypes.bool.isRequired,

		// Component CSS class
		className  : PropTypes.string,

		// Autocomplete `<input/>` CSS class
		inputClassName : PropTypes.string,

		// `<button/>` toggler CSS class
		toggleClassName : PropTypes.string,

		// CSS style object
		style      : PropTypes.object,

		// If this flag is set to `true`,
		// and `icon` is specified for a selected option,
		// then the selected option will be displayed
		// as icon only, without the label.
		concise    : PropTypes.bool,

		// If this flag is set to `true`,
		// then it makes `<Select/>` not stretch itself
		// to 100% width by making it `inline-block`.
		// Is set to `true` when `concise` is `true`
		// because it makes sense.
		compact    : PropTypes.bool,

		// HTML `tabindex` attribute
		tabIndex   : PropTypes.number,

		// If set to `true`, autocompletion is available
		// upon expanding the options list.
		autocomplete : PropTypes.bool,

		// If set to `true`, autocomple will show all
		// matching options instead of just `maxItems`.
		autocompleteShowAll : PropTypes.bool,

		// Options list alignment ("left", "right")
		alignment  : PropTypes.oneOf(['left', 'right']),

		// If `menu` flag is set to `true`
		// then it's gonna be a dropdown menu
		// with `children` elements inside
		// and therefore `onChange` won't be called
		// on menu item click.
		menu       : PropTypes.bool,

		// If `menu` flag is set to `true`
		// then `toggler` is the dropdown menu button.
		// Can be either a React element or a React component.
		// If `toggler` is a React component then it must
		// accept `onClick` and `onKeyDown` properties.
		// E.g.: `(props) => <button type="button" {...props}> Menu </button>`.
		toggler    : PropTypes.oneOfType
		([
			PropTypes.element,
			PropTypes.func
		]),

		// If `scroll` is `false`, then options list
		// is not limited in height.
		// Is `true` by default (scrollable).
		scroll     : PropTypes.bool.isRequired,

		// If this flag is set to `true`,
		// then the dropdown expands itself upward.
		// (as opposed to the default downward)
		upward     : PropTypes.bool,

		// Maximum items fitting the options list height (scrollable).
		// In case of `autocomplete` that's the maximum number of matched items shown.
		// Is `6` by default.
		maxItems   : PropTypes.number.isRequired,

		// Is `true` by default (only when the list of options is scrollable)
		scrollbarPadding : PropTypes.bool,

		// When the `<Select/>` is expanded
		// the options list may not fit on the screen.
		// If `scrollIntoView` is `true` (which is the default)
		// then the browser will automatically scroll
		// so that the expanded options list fits on the screen.
		scrollIntoView : PropTypes.bool.isRequired,

		// If `scrollIntoView` is `true` (which is the default)
		// then these two are gonna define the delay after which it scrolls into view.
		expandAnimationDuration : PropTypes.number.isRequired,
		keyboardSlideAnimationDuration : PropTypes.number.isRequired,

		onTabOut : PropTypes.func,

		onToggle : PropTypes.func,

		// The initial label for an asynchronous autocomplete.
		selectedOptionLabel : PropTypes.string,

		// `aria-label` for the `<Select/>`'s `<button/>`
		ariaLabel : PropTypes.string.isRequired,

		// `aria-label` for the "Close" button
		// (which is an "x" visible in fullscreen mode).
		closeLabel : PropTypes.string,

		// The "x" button icon that closes the `<Select/>`
		// in fullscreen mode on mobile devices.
		closeButtonIcon : PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf([false])]).isRequired

		// transition_item_count_min : PropTypes.number,
		// transition_duration_min : PropTypes.number,
		// transition_duration_max : PropTypes.number
	}

	static defaultProps =
	{
		alignment          : 'left',
		scroll             : true,
		maxItems           : 6,
		scrollbarPadding   : true,
		fallback           : false,
		native             : false,
		scrollIntoView     : true,

		// If `scrollIntoView` is `true` (which is the default)
		// then these two are gonna define the delay after which it scrolls into view.
		expandAnimationDuration : 150,
		keyboardSlideAnimationDuration : 300,

		// Set to `true` to mark the field as required
		required : false,

		// Set to `true` to display the loading indicator
		loading : false,

		// `async getOptions()` throttle period.
		throttle : 200,

		// `async getOptions()` throttle threshold (in characters).
		minCharactersToStartThrottling : 4,

		// `aria-label` for the `<Select/>`'s `<button/>`
		ariaLabel : 'Select country',

		// The "x" button icon that closes the `<Select/>`
		// in fullscreen mode on mobile devices.
		closeButtonIcon : CloseIcon

		// transition_item_count_min : 1,
		// transition_duration_min : 60, // milliseconds
		// transition_duration_max : 100 // milliseconds
	}

	state =
	{
		// Is initialized during the first `componentDidUpdate()` call
		vertical_padding : 0,

		// `getOptions()` must receive a `string`.
		autocompleteInputValue : '',

		// The currently displayed `options` counter.
		// (in case of `autocomplete` and `async getOptions()`).
		optionsCounter : 0,
		matchesCounter : 0,

		selectedOptionLabel : this.props.selectedOptionLabel,

		// Will be re-fetched in `componentDidMount()`.
		options : this.props.options || [],

		// `prevProps` for `getDerivedStateFromProps()`.
		props:
		{
			value   : this.props.value,
			options : this.props.options
		}
	}

	// Latest async `getOptions()` invocation timestamp (for throttling).
	latestFetchOptionsCallTimestamp = 0

	// Older options can only be overwritten with newer ones.
	// (in case of `autocomplete` and `async getOptions()`).
	counter = new Counter()

	// `ref`s of all `options` currently rendered.
	options_refs = {}

	constructor(props)
	{
		super(props)

		const
		{
			value,
			label,
			placeholder,
			autocomplete,
			options,
			getOptions,
			children,
			menu,
			toggler,
			onChange
		}
		= this.props

		if (autocomplete)
		{
			if (!options && !getOptions)
			{
				throw new Error(`Either "options" property or "getOptions" property are required for an "autocomplete" select`)
			}
		}

		if (getOptions && !autocomplete)
		{
			throw new Error(`"getOptions" property is only available for an "autocomplete" select`)
		}

		if (children && !menu)
		{
			React.Children.forEach(children, (element) =>
			{
				if (!element.props.value)
				{
					throw new Error(`You must specify "value" prop on each child of <Select/>`)
				}

				if (!element.props.label)
				{
					throw new Error(`You must specify "label" prop on each child of <Select/>`)
				}
			})
		}

		if (menu && !toggler)
		{
			throw new Error(`Supply a "toggler" component when enabling "menu" in <Select/>`)
		}

		if (!menu && !onChange)
		{
			throw new Error(`"onChange" property must be specified for a non-menu <Select/>`)
		}

		if (label && placeholder)
		{
			throw new Error('`<Select/>` no longer accepts both `label` and `placeholder`.')
		}
	}

	static getDerivedStateFromProps({ autocomplete, value, options }, state)
	{
		const newState =
		{
			// `prevProps`.
			props:
			{
				value,
				options
			}
		}

		// Not re-fetching async options here.
		if (Array.isArray(options))
		{
			const _options = _getOptions(options, null, state.autocompleteInputValue)

			// `<Select autocomplete/>`'s selected option label
			// is stored in a special `selectedOptionLabel` variable in `this.state`.
			if (autocomplete)
			{
				if (newState.props.options !== state.props.options
					|| newState.props.value !== state.props.value)
				{
					newState.selectedOptionLabel = getSelectedOptionLabel(value, _options)
				}
			}
			// Regular `<Select/>`'s selected option label
			// is calculated in `.render()` from `this.state.options`.
			else
			{
				newState.options = _options
			}
		}

		return newState
	}

	// Client side rendering, javascript is enabled
	componentDidMount()
	{
		const { autocomplete, options, selectedOptionLabel, fallback } = this.props

		if (fallback)
		{
			this.setState({ javascript: true })
		}

		if (autocomplete && options && selectedOptionLabel === undefined)
		{
			this.setState({ selectedOptionLabel: this.get_selected_option_label() })
		}
	}

	componentDidUpdate(previous_props, previous_state)
	{
		const { value } = this.props
		const { expanded, height } = this.state

		if (expanded !== previous_state.expanded)
		{
			if (expanded && this.should_animate())
			{
				if (height === undefined)
				{
					this.calculate_height()
				}
			}
		}
	}

	componentWillUnmount()
	{
		clearTimeout(this.scroll_into_view_timeout)
		clearTimeout(this.nextFetchOptionsCallTimeout)
		clearTimeout(this.blurTimer)
	}

	storeSelectInput = (node) => this.selectInput = node
	storeListNode = (node) => this.list = node
	storeSelectedOption = (ref) => this.selected = ref
	storeAutocompleteInput = (node) => this.autocomplete = node

	render()
	{
		const
		{
			id,
			upward,
			concise,
			compact,
			scroll,
			children,
			menu,
			toggler,
			alignment,
			autocomplete,
			saveOnIcons,
			maxItems,
			fallback,
			native,
			disabled,
			required,
			placeholder,
			value,
			error,
			closeButtonIcon : CloseButtonIcon,
			closeLabel,
			loading,
			style,
			className
		}
		= this.props

		const
		{
			options,
			isFetchingOptions,
			expanded,
			list_height
		}
		= this.state

		let list_style

		// Makes the options list scrollable.
		// (only when not in `autocomplete` mode)
		if (this.is_scrollable() && list_height !== undefined)
		{
			list_style = { maxHeight: `${list_height}px` }
		}

		let list_items

		// If a list of options is supplied as a set of child React elements,
		// then render those elements.
		if (children)
		{
			list_items = React.Children.map(children, (element, index) =>
			{
				if (!element)
				{
					return
				}

				return this.render_list_item({ index, element })
			})
		}
		// If a list of options is supplied as an array of `{ value, label }`,
		// then transform those elements to <buttons/>
		else
		{
			const overflow = scroll && this.overflown()

			list_items = this.getCurrentlyDisplayedOptions().map(({ value, label, icon, content }, index) =>
			{
				return this.render_list_item
				({
					index,
					value,
					label,
					icon: !saveOnIcons && icon,
					content,
					overflow
				})
			})
		}

		const wrapper_style = { textAlign: alignment }

		const show_options_list = this.shouldShowOptionsList() && list_items.length > 0
		const label = this.getLabel()

		return (
			<div
				onBlur={ this.onBlur }
				style={ style ? { ...wrapper_style, ...style } : wrapper_style }
				className={ classNames
				(
					'rrui__select',
					{
						'rrui__rich'                 : fallback,
						'rrui__select--autocomplete' : autocomplete,
						'rrui__select--menu'         : menu,
						'rrui__select--upward'       : upward,
						'rrui__select--expanded'     : expanded,
						'rrui__select--collapsed'    : !expanded,
						'rrui__select--disabled'     : disabled,
						'rrui__select--compact'      : compact || (concise && !autocomplete)
					},
					className
				) }>

				<div
					ref={ this.storeSelectInput }
					className={ classNames
					({
						'rrui__input': !toggler
					}) }>

					{ (loading || isFetchingOptions) && <Ellipsis/> }

					{/* In case of a custom `toggler`. */}
					{ !menu && !native &&  toggler && this.render_toggler() }
					{/* A transparent native `<select/>` above (for better UX on mobile devices). */}
					{ !menu && !native && !toggler && !autocomplete && this.render_static() }
					{/* The currently selected option */}
					{ !menu && !native && !toggler && !autocomplete && this.render_selected_item() }
					{/* Autocomplete input */}
					{ !menu && !native && !toggler &&  autocomplete && this.render_autocomplete() }

					{/* Label */}
					{/* (this label is placed after the "selected" button
					     to utilize the CSS `+` selector) */}
					{/* If the `placeholder` wasn't specified
					    but `label` was and no option is currently selected
					    then the `label` becomes the `placeholder`
					    until something is selected */}
					{ label &&
						<Label
							id={ id }
							value={ value }
							required={ required }
							invalid={ this.should_indicate_invalid() }
							floats={ autocomplete }>
							{ label }
						</Label>
					}

					{/* Menu toggler */}
					{ menu && this.render_toggler() }

					{/* The list of selectable options */}
					{ show_options_list &&
						<ul
							ref={ this.storeListNode }
							style={ list_style }
							className={ classNames
							(
								'rrui__expandable',
								'rrui__expandable--overlay',
								'rrui__select__options',
								'rrui__shadow',
								{
									'rrui__select__options--autocomplete'  : autocomplete,
									'rrui__select__options--menu'          : menu,
									'rrui__expandable--expanded'           : expanded,
									'rrui__select__options--expanded'      : expanded,
									'rrui__expandable--left-aligned'       : alignment === 'left',
									'rrui__expandable--right-aligned'      : alignment === 'right',
									'rrui__select__options--left-aligned'  : !children && alignment === 'left',
									'rrui__select__options--right-aligned' : !children && alignment === 'right',
									// CSS selector performance optimization
									'rrui__select__options--upward'        : upward,
									'rrui__select__options--downward'      : !upward
								}
							) }>
							{ list_items }
						</ul>
					}

					{/* The "x" button to hide the list of options
					    for fullscreen `<Select/>` on mobile devices */}
					{ show_options_list && expanded && CloseButtonIcon &&
						<Close
							onClick={ this.onToggle }
							closeLabel={ closeLabel }
							className={ classNames('rrui__close--bottom-right', 'rrui__select__close',
							{
								'rrui__select__close--autocomplete' : autocomplete
							}) }>
							<CloseButtonIcon/>
						</Close>
					}

					{/* Fallback in case javascript is disabled */}
					{ (native || (fallback && !this.state.javascript)) && this.render_static() }
				</div>

				{/* Error message */}
				{ this.should_indicate_invalid() &&
					<div className="rrui__input-error">{ error }</div>
				}
			</div>
		)
	}

	render_list_item({ index, element, value, label, icon, content, overflow }) // , first, last
	{
		const { disabled, menu, scrollbarPadding } = this.props
		const { focusedOptionValue, expanded } = this.state

		// If a list of options is supplied as a set of child React elements,
		// then extract values from their props.
		if (element)
		{
			value = element.props.value
		}

		const is_focused = menu ? false : value === focusedOptionValue

		let item_style

		// on overflow the vertical scrollbar will take up space
		// reducing padding-right and the only way to fix that
		// is to add additional padding-right
		//
		// a hack to restore padding-right taken up by a vertical scrollbar
		if (overflow && scrollbarPadding)
		{
			item_style = { marginRight: getScrollbarWidth() + 'px' }
		}

		let button

		// If a list of options is supplied as a set of child React elements,
		// then enhance those elements with extra props.
		if (element)
		{
			if (element.type === Select.Separator)
			{
				button = element
			}
			else
			{
				const { onClick, className } = element.props

				const _onClick = (event) =>
				{
					if (menu)
					{
						// Collapse the `<Select/>`.
						this.onToggle(event)
					}
					else
					{
						this.item_clicked(value, event)
					}

					if (onClick)
					{
						onClick(event)
					}
				}

				button = (
					<button
						type="button"
						onClick={ _onClick }
						disabled={ disabled }
						tabIndex="-1"
						aria-label={ element.props.label }
						style={ item_style ? { ...item_style, ...element.props.style } : element.props.style }
						className={ classNames
						(
							'rrui__button-reset',
							'rrui__select__option',
							{
								'rrui__select__option--focused' : is_focused,
								'rrui__select__option--disabled' : disabled
							},
							className
						) }>
						{ React.cloneElement(element, { onClick: undefined }) }
					</button>
				)
			}
		}
		// Else, if a list of options is supplied as an array of `{ value, label }`,
		// then transform those options to <buttons/>
		else
		{
			if (icon) {
				icon = render_icon(icon)
			}

			button = (
				<button
					type="button"
					onClick={ event => this.item_clicked(value, event) }
					disabled={ disabled }
					tabIndex="-1"
					aria-label={ label }
					className={ classNames
					(
						'rrui__button-reset',
						'rrui__select__option',
						{
							'rrui__select__option--focused' : is_focused,
							'rrui__select__option--disabled' : disabled
						}
					) }
					style={ item_style }>
					{ icon &&
						React.cloneElement(icon,
						{
							className: classNames(icon.props.className, 'rrui__select__option-icon')
						})
					}
					<span className="rrui__select__option-label">
						{ content && content({ value, label }) || label }
					</span>
				</button>
			)
		}

		return (
			<li
				key={ get_option_key(value) }
				ref={ ref => this.options_refs[get_option_key(value)] = ref }
				className={ classNames
				(
					'rrui__expandable__content',
					'rrui__select__options-list-item',
					{
						'rrui__select__separator-option' : element && element.type === Select.Separator,
						'rrui__expandable__content--expanded' : expanded,
						// CSS selector performance optimization
						'rrui__select__options-list-item--expanded' : expanded
					}
				) }>
				{ button }
			</li>
		)
	}

	// Returns either just a button or a button and an input in case of autocomplete.
	// Always returns an array so that when `[input, button]` (collapsed)
	// becomes `[input]` (expanded) React doesn't re-mount the input element.
	// (won't focus the input upon expansion otherwise)
	render_selected_item()
	{
		const
		{
			value,
			disabled,
			required,
			concise,
			tabIndex,
			title,
			ariaLabel,
			toggleClassName
		}
		= this.props

		const
		{
			expanded,
			isFetchingOptions
		}
		= this.state

		const selected_label = this.get_selected_option_label() || this.getLabel() || this.getPlaceholder()

		const selected = this.get_selected_option()
		const show_selected_as_an_icon = concise && selected && selected.icon

		return (
			<button
				ref={ this.storeSelectedOption }
				type="button"
				disabled={ disabled }
				onClick={ this.onToggle }
				onKeyDown={ this.onKeyDown }
				tabIndex={ -1 }
				title={ title }
				aria-label={ ariaLabel }
				className={ classNames
				(
					'rrui__input-element',
					'rrui__button-reset',
					'rrui__select__button',
					toggleClassName,
					{
						'rrui__select__button--empty'   : value_is_empty(value),
						'rrui__select__button--invalid' : this.should_indicate_invalid(),
						'rrui__input-element--invalid'  : this.should_indicate_invalid(),
						// CSS selector performance optimization
						// (should it even be optimized).
						'rrui__select__button--disabled' : disabled
					}
				) }>

				{/* http://stackoverflow.com/questions/35464067/flexbox-not-working-on-button-element-in-some-browsers */}
				<div className="rrui__select__selected-content">

					{/* Selected option label (or icon) */}
					<div
						className={ classNames('rrui__select__selected-label',
						{
							'rrui__select__selected-label--required' : !this.getLabel() && required && value_is_empty(value)
						}) }>
						{ show_selected_as_an_icon ? React.cloneElement(render_icon(selected.icon), { title: selected_label }) : selected_label }
					</div>

					{/* An arrow */}
					{ !isFetchingOptions &&
						<div
							className={ classNames('rrui__select__arrow',
							{
								// CSS selector performance optimization
								'rrui__select__arrow--expanded' : expanded,
								'rrui__select__arrow--disabled' : disabled
							}) }/>
					}
				</div>
			</button>
		)
	}

	render_autocomplete()
	{
		const
		{
			value,
			placeholder,
			label,
			disabled,
			required,
			tabIndex,
			inputClassName
		}
		= this.props

		const
		{
			expanded,
			autocomplete_width,
			autocompleteInputValue,
			isFetchingOptions,
			matches,
			// selectedOptionLabel
		}
		= this.state

		// const selected_text = selectedOptionLabel ||
		// 	// If an autocomplete has not been expanded yet
		// 	// then show the placeholder.
		// 	// (if no `value` is selected or until options are loaded).
		// 	// After that, either show the selected option label
		// 	// or show nothing.
		// 	(isFetchingOptions && expanded !== undefined && autocompleteInputValue)

		return (
			<TextInput
				inputRef={ this.storeAutocompleteInput }
				value={ autocompleteInputValue }
				onChange={ this.on_autocomplete_input_change }
				onKeyDown={ this.onKeyDown }
				onFocus={ this.expandAutocompleteOnFocus }
				onClick={ this.expandAutocompleteOnFocus }
				tabIndex={ tabIndex }
				disabled={ disabled }
				className={ classNames
				(
					'rrui__select__autocomplete',
					inputClassName,
					// CSS selector performance optimization
					// (should it even be optimized).
					{
						'rrui__input-field--invalid' : matches === false,
						'rrui__select__autocomplete--loading' : isFetchingOptions
					}
				) }/>
		)
	}

	render_toggler()
	{
		const { toggler } = this.props

		const properties =
		{
			ref       : this.storeSelectedOption,
			onClick   : this.onToggle,
			onKeyDown : this.onKeyDown
		}

		return (
			<div className="rrui__select__toggler">
				{ typeof toggler === 'function' ? React.createElement(toggler, properties) : React.cloneElement(toggler, properties) }
			</div>
		)
	}

	// supports disabled javascript
	render_static()
	{
		const
		{
			id,
			name,
			value,
			label,
			disabled,
			menu,
			toggler,
			fallback,
			native,
			tabIndex,
			children
		}
		= this.props

		const { options } = this.state

		if (menu)
		{
			return (
				<div
					className={ classNames
					({
						'rrui__rich__fallback' : fallback
					}) }>
					{toggler}
				</div>
			)
		}

		return (
			<select
				ref={ ref => this.native = ref }
				id={ id }
				name={ name }
				value={ value_is_empty(value) ? Empty_value_option_value : value }
				disabled={ disabled }
				onKeyDown={ this.nativeSelectOnKeyDown }
				onMouseDown={ this.nativeSelectOnMouseDown }
				onChange={ this.native_select_on_change }
				tabIndex={ tabIndex }
				className={ classNames('rrui__input', 'rrui__select__native',
				{
					'rrui__rich__fallback' : fallback
				}) }>
				{
					options
					?
					this.render_native_select_options(options, value_is_empty(value))
					:
					React.Children.map(children, (child) =>
					{
						if (!child)
						{
							return
						}

						return (
							<option
								className="rrui__select__native-option"
								key={ child.props.value }
								value={ child.props.value }>
								{ child.props.label }
							</option>
						)
					})
				}
			</select>
		)
	}

	render_native_select_options(options, empty_option_is_selected)
	{
		const { placeholder } = this.props

		let empty_option_present = false

		const rendered_options = options.map((option) =>
		{
			let { value, label } = option

			if (value_is_empty(value))
			{
				empty_option_present = true
				value = Empty_value_option_value
			}

			return (
				<option
					className="rrui__select__native-option"
					key={ get_option_key(value) }
					value={ value }>
					{ label }
				</option>
			)
		})

		if (empty_option_is_selected && !empty_option_present)
		{
			rendered_options.unshift
			(
				<option
					className="rrui__select__native-option"
					key={ get_option_key(undefined) }
					value="">
					{ placeholder }
				</option>
			)
		}

		return rendered_options
	}

	nativeSelectOnKeyDown = (event) =>
	{
		if (this.shouldShowOptionsList())
		{
			this.selected.focus()
			this.onKeyDown(event)
			event.preventDefault()
		}
	}

	nativeSelectOnMouseDown = (event) =>
	{
		if (this.shouldShowOptionsList())
		{
			event.preventDefault()
			this.selected.focus()
			this.toggle()
		}
	}

	getLabel()
	{
		const { label, placeholder, value, autocomplete } = this.props

		if (autocomplete) {
			return label || placeholder
		}

		if (value_is_empty(value)) {
			if (placeholder) {
				return label
			}
		} else {
			return label
		}
	}

	// Not for autocomplete (it only has the floating label).
	getPlaceholder()
	{
		const { label, placeholder, value } = this.props

		if (value_is_empty(value)) {
			return placeholder || label
		}
	}

	// Whether should indicate that the input value is invalid
	should_indicate_invalid()
	{
		const { indicateInvalid, error } = this.props

		return indicateInvalid && error
	}

	native_select_on_change = (event) =>
	{
		let value = event.target.value

		// Convert back from an empty string to `undefined`
		if (value === Empty_value_option_value)
		{
			// `null` is not accounted for, use `undefined` instead.
			value = undefined
		}

		this.setValue(value)
	}

	refreshSelectedOptionLabel(value = this.props.value, options = this.state.options)
	{
		const label = getSelectedOptionLabel(value, options)
		if (label)
		{
			this.setState({
				selectedOptionLabel : label
			})
		}
	}

	get_selected_option()
	{
		const { value } = this.props

		return this.get_option(value)
	}

	get_option(value)
	{
		const { children } = this.props
		const { options } = this.state

		if (!children)
		{
			return options.filter(x => x.value === value)[0]
		}

		let option

		React.Children.forEach(children, function(child)
		{
			if (child.props.value === value)
			{
				option = child
			}
		})

		return option
	}

	get_option_index(option)
	{
		const { children } = this.props
		const { options } = this.state

		if (!children)
		{
			return options.indexOf(option)
		}

		let option_index

		React.Children.forEach(children, function(child, index)
		{
			if (child.props.value === option.value)
			{
				option_index = index
			}
		})

		return option_index
	}

	get_selected_option_label()
	{
		const { children } = this.props
		const { options } = this.state

		const selected = this.get_selected_option()

		if (!selected)
		{
			return
		}

		if (!children)
		{
			return selected.label
		}

		return selected.props.label
	}

	overflown()
	{
		const { maxItems } = this.props
		const { options } = this.state

		return options.length > maxItems
	}

	getCurrentlyDisplayedOptions()
	{
		const { maxItems } = this.props
		let { options, expanded } = this.state

		options = this.trimOptions(options)

		if (!expanded)
		{
			options = options.slice(0, maxItems)
		}

		return options
	}

	scrollable_list_height(height, vertical_padding)
	{
		const { maxItems } = this.props

		// (Adding vertical padding so that it shows these `maxItems` options fully)
		return (height - 2 * vertical_padding) * (maxItems / this.getCurrentlyDisplayedOptions().length) + vertical_padding
	}

	should_animate()
	{
		return true

		// return this.props.options.length >= this.props.transition_item_count_min
	}

	focus()
	{
		if (this.autocomplete)
		{
			focus(this.autocomplete)
		}
		else
		{
			focus(this.selected)
		}
	}

	isNativeExpanded()
	{
		return false
		// throw new Error('check touchstart for this')
	}

	shouldShowOptionsList()
	{
		const { menu, native, autocomplete } = this.props

		if (menu) {
			return true
		}

		if (native) {
			return false
		}

		if (autocomplete) {
			return true
		}

		return !this.isNativeExpanded()
	}

	onToggle = (event) =>
	{
		// Don't navigate away when clicking links.
		// (e.g. `<Select menu/>` with hyperlinks as items).
		event.preventDefault()

		// Discarding this event seems to be unneeded.
		// event.stopPropagation() // doesn't work
		// event.nativeEvent.stopImmediatePropagation()

		return this.toggle()
	}

	expandAutocompleteOnFocus = () =>
	{
		if (this.dontExpandAutocompleteOnFocus !== true)
		{
			this.expand()
		}
	}

	expand   = (options) => this.toggle(true, options)
	collapse = (options) => this.toggle(false, options)

	toggle = (expand, options = {}) =>
	{
		const
		{
			menu,
			autocomplete,
			disabled,
			onToggle
		}
		= this.props

		const { expanded, isFetchingOptions } = this.state

		// Manual toogle to a certain state (expanded/collapsed).
		if (expand === undefined)
		{
			expand = !expanded
		}
		// Don't expand if already expanded
		// (or collapse if already collapsed)
		// until in editing mode.
		else if (!options.editing && (expand === expanded))
		{
			return Promise.resolve()
		}

		// Won't expand/collapse in `native` and `nativeExpanded` cases.
		// Won't expand/collapse a disabled `<Select/>`.
		// If clicked on the toggler the second time
		// while options are already being fetched
		// then wait for the fetch to finish first.
		if (!this.shouldShowOptionsList()
			|| disabled
			|| expand && isFetchingOptions && !options.editing)
		{
			return Promise.resolve()
		}

		clearTimeout(this.scroll_into_view_timeout)

		if (onToggle && expand !== expanded) {
			onToggle(expand)
		}

		// Collapse.
		if (!expand)
		{
			return this._toggle(false, options)
		}

		// Expand.
		return this.fetchOptions().then(() =>
		{
			// Toggling the options list in a timeout
			// in order for iOS scroll not to get "janky"
			// when `<Select autocomplete/>` gets focused.
			// (for some unknown reason)
			// `100` ms is an imperical value.
			//
			// Asynchronous `getOptions()` introduce a delay already
			// so only adding a delay for synchronous autocomplete.
			//
			if (autocomplete && this.props.options && !options.editing)
			{
				return timeout(100).then(() => this._toggle(true, options))
			}

			// Asynchronous `getOptions()` introduces a delay already.
			return this._toggle(true, options)
		})
	}

	_toggle(expand, { refocus, editing, toggle })
	{
		return new Promise((resolve) =>
		{
			// Focus the toggler after the select is collapsed.
			// Can be a DOM Element or a custom React Component.
			if (!expand && refocus !== false)
			{
				this.dontExpandAutocompleteOnFocus = true
				focus(this.autocomplete || this.selected)
				this.dontExpandAutocompleteOnFocus = false
			}

			const state = {}

			if (toggle !== false)
			{
				state.expanded = expand
			}

			if (expand && !editing)
			{
				state.autocompleteInputValue = this.state.selectedOptionLabel || ''
				state.matches = true
			}

			this.setState(state, () =>
			{
				if (expand)
				{
					// Highlight either the option for the currently
					// selected `value` or the first option available.
					this.focusAnOption()
					// Scroll the options list into view if needed.
					this.scrollIntoView()
				}

				resolve()
			})
		})
	}

	scrollIntoView()
	{
		const
		{
			scrollIntoView,
			expandAnimationDuration,
			keyboardSlideAnimationDuration
		}
		= this.props

		// For some reason in IE 11 "scroll into view" scrolls
		// to the top of the page, therefore turn it off for IE.
		if (!isInternetExplorer() && scrollIntoView)
		{
			this.scroll_into_view_timeout = setTimeout(() =>
			{
				// If still expanded and there are any options
				// then scroll into view.
				if (this.state.expanded && this.list) {
					scrollIntoViewIfNeeded(this.list)
				}
			},
			Math.max(expandAnimationDuration, keyboardSlideAnimationDuration) * 1.1)
		}
	}

	focusAnOption = () =>
	{
		const { autocomplete } = this.props
		const { options } = this.state

		if (options.length > 0)
		{
			// Focus either the selected option
			// or the first option in the list.

			const selected_option = !autocomplete && this.get_selected_option()

			const focusedOptionValue = selected_option ? selected_option.value : options[0].value

			this.setState({ focusedOptionValue })

			// Scroll down to the focused option
			this.scroll_to(focusedOptionValue)
		}
	}

	setValue(value)
	{
		const { autocomplete, onChange } = this.props
		const { options } = this.state

		if (autocomplete)
		{
			const selectedOptionLabel = getSelectedOptionLabel(value, options)

			this.setState
			({
				selectedOptionLabel,
				autocompleteInputValue : selectedOptionLabel || '',
				matches : true
			})
		}

		// Call `onChange` only if the `value` did change.
		if (value !== this.props.value) {
			onChange(value)
		}
	}

	item_clicked = (value, event) =>
	{
		// Collapse the `<Select/>`.
		// Doing `setValue` in a callback
		// because otherwise `setValue()` would result in
		// updating props and calling `getDerivedStateFromProps()`
		// which reads `autocomplete_value` which is being reset inside `.toggle()`.
		this.onToggle(event).then(() => this.setValue(value))
	}

	onKeyDown = (event) =>
	{
		const { onKeyDown, menu, value, autocomplete } = this.props
		const { options, expanded, focusedOptionValue, autocompleteInputValue } = this.state

		if (onKeyDown) {
			onKeyDown(event)
		}

		if (event.defaultPrevented) {
			return
		}

		if (submitFormOnCtrlEnter(event, this.input)) {
			return
		}

		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey)
		{
			return
		}

		// Maybe add support for `children` arrow navigation in future
		if (menu || options.length > 0)
		{
			switch (event.keyCode)
			{
				// "Up" arrow.
				// Select the previous option (if present).
				case 38:
					event.preventDefault()

					if (!expanded) {
						return this.expand()
					}

					if (menu)
					{
						// Menu up.
					}
					else
					{
						const previous = this.previous_focusable_option()

						if (previous)
						{
							this.show_option(previous.value, 'top')
							return this.setState({ focusedOptionValue: previous.value })
						}
					}

					return

				// "Down" arrow.
				// Select the next option (if present).
				case 40:
					event.preventDefault()

					if (!expanded) {
						return this.expand()
					}

					if (menu)
					{
						// Menu down.
					}
					else
					{
						const next = this.next_focusable_option()

						if (next)
						{
							this.show_option(next.value, 'bottom')
							return this.setState({ focusedOptionValue: next.value })
						}
					}

					return

				// "Escape".
				//
				// Collapse.
				//
				// Maybe add this kind of support for "Escape" key in some future:
				//  hiding the item list, cancelling current item selection process
				//  and restoring the selection present before the item list was toggled.
				//
				case 27:
					event.preventDefault()

					// Collapse the list if it's expanded
					return this.collapse()

				// "Enter".
				case 13:
					// Choose the focused item on Enter
					if (expanded)
					{
						event.preventDefault()

						// If no autocomplete value entered
						// and the focused option is the first one
						// then set value to `undefined`.
						if (autocomplete && !autocompleteInputValue
							&& (options.length === 0 || focusedOptionValue === options[0].value))
						{
							this.setValue()
							this.collapse()
						}
						// If an item is focused
						// (which may not be the case
						//  when autocomplete is matching no items)
						// (still for non-autocomplete select
						//  it is valid to have a default option)
						else if (options.length > 0)
						{
							// Choose the focused item
							this.item_clicked(focusedOptionValue, event)
						}
						else // if (menu)
						{
							// Menu

							// Choose the focused menu item.
						}
					}
					// Else it should have just submitted the form on Enter,
					// but it wouldn't because the select element activator is a <button/>
					// therefore hitting Enter while being focused on it just pushes that button.
					// So submit the enclosing form manually.
					else
					{
						if (submitContainingForm(this.selectInput))
						{
							event.preventDefault()
						}
					}

					return

				// "Spacebar".
				case 32:
					// Choose the focused item on Enter
					if (expanded)
					{
						if (menu)
						{
							event.preventDefault()

							// Choose the focused menu item.
						}
						// only if it it's an `options` select
						// and also if it's not an autocomplete
						else if (!autocomplete)
						{
							event.preventDefault()

							// `focusedOptionValue` could be non-existent
							// in case of `autocomplete`, but since
							// we're explicitly not handling autocomplete here
							// it is valid to select any options including the default ones.
							this.item_clicked(focusedOptionValue, event)
						}
					}
					else
					{
						event.preventDefault()
						// Expand.
						this.toggle()
					}

					return
			}
		}
	}

	onBlur = (event) =>
	{
		// `<Select/>` options currently all have `tabIndex={-1}` so they're non-focusable.
		// // If clicked on a select option then don't trigger "blur" event
		// if (event.relatedTarget && event.currentTarget.contains(event.relatedTarget))
		// {
		// 	return
		// }

		clearTimeout(this.blurTimer)
		this.blurTimer = setTimeout(() =>
		{
			// If the component is still mounted.
			if (this.selectInput)
			{
				// If the currently focused element is not inside the `<Select/>`.
				// Or if no element is currently focused.
				if (!document.activeElement || !this.selectInput.contains(document.activeElement))
				{
					// Then collapse the `<Select/>`.
					// (clicked/tapped outside or tabbed-out)
					this.onFocusOut()
				}
			}
		},
		30)
	}

	onFocusOut()
	{
		const { onBlur, value, autocomplete } = this.props
		const { options, autocompleteInputValue, selectedOptionLabel } = this.state

		if (autocomplete)
		{
			// If user's input equals to an option
			// then it's logical (from user's perspective)
			// to select that option on focus out (e.g. on tab out).
			//
			// Analogous, if user has erased the input
			// then it means the user wants to "select nothing".
			//
			let newValue = value
			if (!autocompleteInputValue) {
				newValue = undefined
			} else {
				const option = options.filter(({ label }) => autocompleteInputValue.toLowerCase() === label.toLowerCase())[0]
				if (option) {
					newValue = option.value
				}
			}

			this.setValue(newValue)
		}

		this.collapse({ refocus: false })

		if (onBlur) {
			onBlurForReduxForm(onBlur, event, value)
		}
	}

	trimOptions(options)
	{
		const
		{
			autocomplete,
			autocompleteShowAll,
			maxItems
		}
		= this.props

		if (!autocomplete)
		{
			return options
		}

		if (autocompleteShowAll)
		{
			return options
		}

		return options.slice(0, maxItems)
	}

	throttleFetchOptionsCall(resolve)
	{
		let
		{
			throttle,
			minCharactersToStartThrottling
		}
		= this.props

		const { autocompleteInputValue } = this.state

		const wait = throttle - (Date.now() - this.latestFetchOptionsCallTimestamp)

		if (autocompleteInputValue.length >= minCharactersToStartThrottling && wait > 0)
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

			this.latestFetchOptionsCall = () => this.fetchOptions().then(resolve)
			return true
		}
	}

	fetchOptions()
	{
		let
		{
			menu,
			autocomplete,
			options,
			getOptions
		}
		= this.props

		const
		{
			async,
			autocompleteInputValue
		}
		= this.state

		return new Promise((resolve) =>
		{
			if (menu) {
				return resolve()
			}

			// If throttled then schedule a future invocation.
			// `this.async` flag is set on the first options fetch
			// by examining the return type of `getOptions()`.
			if (async && this.throttleFetchOptionsCall(resolve)) {
				return
			}

			this.latestFetchOptionsCallTimestamp = Date.now()

			options = _getOptions(options, getOptions, autocompleteInputValue)

			if (Array.isArray(options))
			{
				if (!autocomplete) {
					return this.setState({ options }, resolve)
				}

				if (options.length === 0) {
					return this.setState({ matches: false }, resolve)
				}

				return this.setState
				({
					matches : true,
					options // : this.trimOptions(options)
				},
				() =>
				{
					if (autocomplete) {
						this.refreshSelectedOptionLabel()
					}
					resolve()
				})
			}

			if (typeof options.then === 'function')
			{
				const counter = this.counter.getNextCounter()

				this.setState
				({
					async : true,
					isFetchingOptions : true,
					fetchingOptionsCounter : counter
				},
				() =>
				{
					options.then((options) =>
					{
						this.receiveOptions(options, counter, resolve)
					},
					(error) =>
					{
						console.error(error)
						this.receiveOptions([], counter, resolve)
					})
				})
			}
		})
	}

	receiveOptions(options, counter, callback)
	{
		const { autocomplete } = this.props

		const newState = {}

		// Update matching state.
		if (autocomplete)
		{
			// Can only override "older" matching state.
			if (isCounterAfter(counter, this.state.matchesCounter))
			{
				newState.matches = options.length > 0
				newState.matchesCounter = counter
			}
		}

		// Update options.
		// Can only override "older" options.
		// (not "newer" ones)
		if (isCounterAfter(counter, this.state.optionsCounter))
		{
			if (autocomplete)
			{
				// Autocomplete should always display some options.
				if (options.length > 0)
				{
					newState.options = options // this.trimOptions(options)
					newState.optionsCounter = counter
				}
			}
			else
			{
				newState.options = options
			}
		}

		if (counter === this.state.fetchingOptionsCounter)
		{
			newState.isFetchingOptions = false
			newState.fetchingOptionsCounter = undefined
		}

		this.setState(newState, () =>
		{
			if (autocomplete) {
				this.refreshSelectedOptionLabel()
			}
			callback()
		})
	}

	// Get the previous option (relative to the currently focused option)
	previous_focusable_option()
	{
		const { options } = this.state
		const { focusedOptionValue } = this.state

		let i = 0
		while (i < options.length)
		{
			if (options[i].value === focusedOptionValue)
			{
				if (i - 1 >= 0)
				{
					return options[i - 1]
				}
			}
			i++
		}
	}

	// Get the next option (relative to the currently focused option)
	next_focusable_option()
	{
		let { options } = this.state
		const { focusedOptionValue } = this.state

		options = this.trimOptions(options)

		let i = 0
		while (i < options.length)
		{
			if (options[i].value === focusedOptionValue)
			{
				if (i + 1 < options.length)
				{
					return options[i + 1]
				}
			}
			i++
		}
	}

	// Scrolls to an option having the value.
	scroll_to(value)
	{
		const { vertical_padding } = this.state

		const option_element = this.options_refs[get_option_key(value)]

		// If this option isn't even shown
		// (e.g. autocomplete)
		// then don't scroll to it because there's nothing to scroll to.
		if (!option_element)
		{
			return
		}

		let offset_top = option_element.offsetTop

		const is_first_option = this.list.firstChild === option_element

		// If it's the first one - then scroll to list top
		if (is_first_option)
		{
			offset_top -= vertical_padding
		}

		this.list.scrollTop = offset_top
	}

	// Fully shows an option having the `value` (scrolls to it if neccessary)
	show_option(value, gravity)
	{
		const { vertical_padding } = this.state

		const option_element = this.options_refs[get_option_key(value)]

		const is_first_option = this.list.firstChild === option_element
		const is_last_option  = this.list.lastChild === option_element

		switch (gravity)
		{
			case 'top':
				let top_line = option_element.offsetTop

				if (is_first_option)
				{
					top_line -= vertical_padding
				}

				if (top_line < this.list.scrollTop)
				{
					this.list.scrollTop = top_line
				}

				return

			case 'bottom':
				let bottom_line = option_element.offsetTop + option_element.offsetHeight

				if (is_last_option)
				{
					bottom_line += vertical_padding
				}

				if (bottom_line > this.list.scrollTop + this.list.offsetHeight)
				{
					this.list.scrollTop = bottom_line - this.list.offsetHeight
				}

				return
		}
	}

	// Calculates height of the expanded item list
	calculate_height()
	{
		const { options } = this.state

		// const border = parseInt(window.getComputedStyle(this.list).borderTopWidth)
		const height = this.list.scrollHeight
		const vertical_padding = parseInt(window.getComputedStyle(this.list).paddingTop)

		// For things like "accordeon".
		//
		// const images = this.list.querySelectorAll('img')
		//
		// if (images.length > 0)
		// {
		// 	return this.preload_images(this.list, images)
		// }

		const state = { height, vertical_padding }

		// If it's a regular `<select/>` with `<option/>`s
		// then calculate its height.
		if (this.is_scrollable() && options.length > 0 && this.overflown())
		{
			state.list_height = this.scrollable_list_height(height, vertical_padding)
		}

		this.setState(state)
	}

	is_scrollable()
	{
		const
		{
			menu,
			autocomplete,
			autocompleteShowAll,
			scroll
		}
		= this.props

		return !menu && (autocomplete && autocompleteShowAll || !autocomplete) && scroll
	}

	// This turned out not to work for `autocomplete`
	// because not all options are ever shown.
	// get_widest_label_width()
	// {
	// 	// <ul/> -> <li/> -> <button/>
	// 	const label = this.list.firstChild.firstChild
	//
	// 	const style = getComputedStyle(label)
	//
	// 	const width = parseFloat(style.width)
	// 	const side_padding = parseFloat(style.paddingLeft)
	//
	// 	return width - 2 * side_padding
	// }

	on_autocomplete_input_change = (event) =>
	{
		let value = event

		if (event.target)
		{
			value = event.target.value
		}

		this.setState
		({
			autocompleteInputValue : value
		},
		() =>
		{
			this.expand({ editing : true, toggle : !this.state.expanded })
		})
	}
}

Select.Separator = function()
{
	return <div className="rrui__select__separator"/>
}

const native_expanded_select_container_style =
{
	display : 'inline-block'
}

// There can be an `undefined` value,
// so just `{ value }` won't do here.
function get_option_key(value)
{
	return value_is_empty(value) ? '@@rrui/select/undefined' : value
}

function value_is_empty(value)
{
	return value === null || value === undefined
}

/**
 * Focuses on a React component (if any).
 * @param  {?object} component
 */
function focus(component)
{
	// If the component has been already unmounted.
	// (safety)
	if (!component) {
		return
	}

	if (typeof component.focus === 'function') {
		return component.focus()
	}
}

function render_icon(icon)
{
	return typeof icon === 'function' ? icon() : icon
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

function getSelectedOptionLabel(value, options)
{
	const selected = options.filter(_ => _.value === value)[0]
	if (selected) {
		return selected.label
	}
}

function get_matching_options(options, value)
{
	// If the autocomplete value is `undefined` or empty
	if (!value) {
		return options
	}

	value = value.toLowerCase()

	return options.filter(({ label }) => {
		return label.toLowerCase().indexOf(value) >= 0
	})
}

function _getOptions(options, getOptions, autocompleteInputValue)
{
	if (options)
	{
		return options && get_matching_options(options, autocompleteInputValue)
	}

	if (getOptions)
	{
		return getOptions(autocompleteInputValue)
	}
}

const timeout = (delay) => new Promise(resolve => setTimeout(resolve, delay))