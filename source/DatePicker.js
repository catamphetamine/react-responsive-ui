import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import DayPicker, { ModifiersUtils, LocaleUtils } from 'react-day-picker'
import classNames from 'classnames'

import TextInput from './TextInputComponent'
import Expandable from './Expandable'
import YearMonthSelect from './YearMonthSelect'
import WithError from './WithError'

import { onBlurForReduxForm } from './utility/redux-form'
import { onBlur as handleBlurEvent } from './utility/focus'
import { isInternetExplorer } from './utility/dom'

import getFirstDayOfWeek from './utility/getFirstDayOfWeek'
import getDateForDayOfWeek from './utility/getDateForDayOfWeek'
import getDateForMonth from './utility/getDateForMonth'
import formatDate from './utility/formatDate'
import ignoreInvalidDateObjects from './utility/ignoreInvalidDateObjects'
import transformDateInputAccordingToTemplate from './utility/transformDateInputAccordingToTemplate'
import parseDate, { getSameDateAndTimeInUtc0TimeZone } from './utility/parseDate'

let DatePicker = function({
	id,
	format,
	// noon,
	utc,
	value,
	error,
	indicateInvalid,
	disabledDays,
	selectYearsIntoPast,
	selectYearsIntoFuture,
	initialCalendarDate,
	locale,
	disabled,
	required,
	label,
	placeholder,
	['aria-label']: ariaLabel,
	['aria-labelledby']: ariaLabelledBy,
	['aria-describedby']: ariaDescribedBy,
	alignment,
	tabIndex,
	autoFocus,
	waitForKeyboardSlideIn,
	keyboardSlideInAnimationDuration,
	buttonAriaLabel,
	closeLabel,
	closeButtonIcon : CloseButtonIcon,
	icon,
	className,
	style,
	onChange,
	onBlur,
	onToggle,
	onFocus,
	onKeyDown
}, ref)
{
	const [isExpanded_, setExpanded] = useState()
	const [month, setMonth] = useState()
	const [textValue, setTextValue] = useState()

	const userHasJustChangedYearOrMonthTimer = useRef()
	const _userHasJustChangedYearOrMonth = useRef()
	const hasDayJustBeenSelected = useRef()
	const isFocusingOut = useRef()
	const blurTimer = useRef()

	const container = useRef()
	const expandable = useRef()
	const input = useRef()
	const inputOverlay = useRef()
	const calendar = useRef()

	const hasMounted = useRef()

	// `format` should be in lower case.
	format = format.toLowerCase()

	useEffect(() => {
		if (hasMounted.current) {
			if (value) {
				if (calendar.current) {
					calendar.current.showMonth(value)
				}
			}
		}
	}, [value])

	useEffect(() => {
		hasMounted.current = true
		return () => {
			clearTimeout(userHasJustChangedYearOrMonthTimer.current)
			clearTimeout(blurTimer.current)
		}
	}, [])

	const expand     = useCallback(() => expandable.current.expand(), [])
	const collapse   = useCallback(() => expandable.current.collapse(), [])
	const toggle     = useCallback(() => expandable.current.toggle(), [])
	const isExpanded = useCallback(() => expandable.current.isExpanded(), [])

	const focus = useCallback(() => {
		input.current.focus()
	}, [])

	const focusCalendar = useCallback(() => {
		if (calendar.current) {
			if (calendar.current.dayPicker) {
				calendar.current.dayPicker.firstChild.focus()
			}
		}
	}, [])

	const userHasJustChangedYearOrMonth = useCallback(() => {
		_userHasJustChangedYearOrMonth.current = true
		clearTimeout(userHasJustChangedYearOrMonthTimer.current)
		userHasJustChangedYearOrMonthTimer.current = setTimeout(() => {
			_userHasJustChangedYearOrMonth.current = false
		}, 50)
	}, [])

	const onInputFocus = useCallback((event) => {
		if (onFocus) {
			onFocus(event)
		}
		// if (!focusAfterDaySelected) {
		// 	expand()
		// }
	}, [
		onFocus
	])

	const onExpand = useCallback(() => {
		// Reset the month previously selected via the month `<select/>`.
		// `month` could previously be set to some value via the month `<select/>`,
		// and, since that value wasn't been cleared, it would be "stuck"
		// and the calendar would open at that previously selected month again,
		// even though `value` or `initialCalendarDate` are defined and correspond to
		// a different month.
		setMonth()

		// Must re-calculate `textValue` on each "expand"
		// because it's being reset on each "collapse".
		setTextValue(formatDate(value, format, { utc }))

		// For `aria-expanded`.
		setExpanded(true)
	}, [
		value,
		format,
		utc
	])

	const onExpanded = useCallback(() => {
		// Set "previous" and "next" buttons untabbable
		// so that a Tab out of the `<input/>` field
		// moves cursor not inside to these buttons
		// but rather to the first day of the month. // next form input.
		//
		// (rewritten)
		// Requires ES6 Symbol.Iterator polyfill.
		// for (const button of calendar.querySelectorAll('.DayPicker-NavButton'))
		//
		// The user can still navigate via Up/Down arrow keys
		// when the focus is on a calendar date.
		// Or the user can enter the date in the `<input/>` text field.
		//
		// https://github.com/gpbl/react-day-picker/issues/848
		//
		for (const button of [].slice.call(container.current.querySelectorAll('.DayPicker-NavButton'))) {
			button.setAttribute('tabindex', '-1')
		}

		// A workaround for a bug where `tabIndex` of the "wrapper" div is `0`
		// and at the same time there's no `aria-label`.
		// https://github.com/gpbl/react-day-picker/issues/848
		container.current.querySelector('.DayPicker-wrapper').setAttribute('tabindex', -1)
		// Could also potentially update `aria-label` attribute to (month + year)
		// on expand and on month/year change in the expanded calendar.
		// But that would be too much hassle.

		// Toggling the calendar in a timeout
		// in order for iOS scroll not to get "janky"
		// when `<DatePicker/>` gets focused.
		// (for some unknown reason)
		setTimeout(() => {
			setMonth(value ? ignoreInvalidDateObjects(value) : (initialCalendarDate || new Date()))
		}, 0)
	}, [
		value,
		initialCalendarDate
	])

	// Cancels textual date editing.
	const onCollapse = useCallback(({ focusOut }) =>
	{
		if (!focusOut && !isFocusingOut.current && !hasDayJustBeenSelected.current) {
			focus()
		}

		setTextValue()
		// For `aria-expanded`.
		setExpanded(false)

		// `onChange` fires on calendar day `click`
		// but the `value` hasn't neccessarily been updated yet,
		// therefore, say, if `value` was not set
		// and a user selects a day in the calendar
		// then the `value` is technically still `undefined`
		// so can't just set `state.textValue = formatDate(value, ...)` here.
		//
		// Analogous, `setState({ textValue })` has been called
		// in calendar day `onClick` handler but `state.textValue`
		// hasn't neccessarily been updated yet.
		//
		// Still must validate (recompute) `textValue`
		// upon expanding the `<DatePicker/>`, for example, on `<input/>` blur
		// in cases when a user manually typed in an incomplete date and then tabbed away.
	}, [
		focus
	])

	const onContainerKeyDown = useCallback((event) =>
	{
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}

		switch (event.keyCode)
		{
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
				// Collapse the list if it's expanded.
				return collapse()

			// On "Up" arrow.
			case 38:
			// On "Down" arrow.
			case 40:
				return event.preventDefault()
		}
	}, [
		collapse
	])

	const onToggleButtonClick = useCallback((event) => {
		toggle().then(() => {
			if (isExpanded_) {
				focusCalendar()
			}
		})
	}, [
		isExpanded_,
		toggle,
		focusCalendar
	])

	const onInputKeyDown = useCallback((event) =>
	{
		if (onKeyDown) {
			onKeyDown(event)
		}

		if (event.defaultPrevented) {
			return
		}

		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}

		switch (event.keyCode)
		{
			// On "Enter".
			case 13:
				if (isExpanded())
				{
					// Don't "prevent default" here
					// in order for a user to be able
					// to submit an enclosing form on "Enter".
					collapse()
				}
				return

			// On Spacebar.
			case 32:
				event.preventDefault()
				return onToggleButtonClick()

			// On "Up" arrow.
			case 38:
				// Collapse the calendar (if expanded).
				if (isExpanded())
				{
					event.preventDefault()
					collapse()
				}
				return

			// On "Down" arrow.
			case 40:
				event.preventDefault()
				// Expand the calendar (if collapsed).
				if (isExpanded()) {
					focusCalendar()
				} else {
					expand().then(focusCalendar)
				}
				return
		}
	}, [
		onKeyDown,
		isExpanded,
		collapse,
		expand,
		focusCalendar,
		onToggleButtonClick
	])

	const onInputChange = useCallback((event) =>
	{
		// Extract `value` from the argument
		// of this `onChange` listener
		// (for convenience)

		let newTextValue = event
		if (event.target !== undefined) {
			newTextValue = event.target.value
		}

		newTextValue = newTextValue.trim()

		// When the date is erased, reset it.
		if (!newTextValue) {
			// Call `onChange` only if `value` did actually change from non-`undefined` to `undefined`.
			if (value) {
				onChange(undefined)
			}
			// `textValue` is set to an empty string instead of just `undefined` here
			// because there's a `textValue !== undefined` condition when passing
			// `value` property to `<TextInput/>`.
			// So an empty string has a different behavior than just `undefined`.
			return setTextValue('')
		}

		newTextValue = transformDateInputAccordingToTemplate(newTextValue, format)

		// const selectedDate = parseDate(newTextValue, format, noon, utc)
		const selectedDate = parseDate(newTextValue, format, utc)

		// If the date input is unparseable,
		// then don't change the selected date.
		if (selectedDate) {
			// If the date being input is one of the disabled days,
			// then don't change the selected date.
			if (!ModifiersUtils.dayMatchesModifier(selectedDate, disabledDays)) {
				// Call `onChange` only if `value` did actually change
				if (!value || value.getTime() !== selectedDate.getTime()) {
					onChange(selectedDate)
				}
			}
		}

		setTextValue(newTextValue)
	}, [
		value,
		onChange,
		format,
		// noon,
		utc,
		disabledDays
	])

	const onDayClick = useCallback((selectedDay, { disabled }) =>
	{
		// If the day clicked is disabled then do nothing.
		if (disabled) {
			return
		}

		// Fixes the time being `12:00` on the selected day.
		// https://github.com/gpbl/react-day-picker/issues/473
		// Sets it to be proper time `00:00`.
		//
		// They set the time of `selectedDay` to `12:00` in the current time zone.
		// They intended those extra 12 hours to make things less weird with timezone conversions.
		// But it doesn't work in all cases and is a really lame workaround.
		//
		// Maybe they'll change it in `react-day-picker@8`.

		// if (!noon) {
			// Here I strip those 12 hours from the `selectedDay`
			// so the time becomes `00:00` in the user's time zone.
			//
			// (`selectedDay` is the date in the user's time zone)
			// (`selectedDay.getDate()` returns the day in the user's time zone)
			// (`new Date(year, month, day)` creates a date in the user's time zone)
			//
			selectedDay = new Date(
				selectedDay.getFullYear(),
				selectedDay.getMonth(),
				selectedDay.getDate()
			)
		// }

		if (utc) {
			// Converts timezone to UTC while preserving the same time
			selectedDay = getSameDateAndTimeInUtc0TimeZone(selectedDay)
		}

		// `onChange` fires but the `value`
		// hasn't neccessarily been updated yet.
		//
		// Call `onChange` only if `value` did actually change.
		//
		if (!value || value.getTime() !== selectedDay.getTime()) {
			onChange(selectedDay)
		}

		// Hide the calendar
		hasDayJustBeenSelected.current = true
		collapse()
		hasDayJustBeenSelected.current = false

		// Focus the `<input/>`.
		// (if not in "input overlay" mode for mobile devices).
		if (getComputedStyle(inputOverlay.current).display === 'none')
		{
			// `this.focusAfterDaySelected` flag was used to find out the reason
			// why the text input was being focused: if it was being focused
			// after a calendar day was selected, then it didn't expand the calendar.
			// Previously, this component used to expand the calendar on focus.
			// Now it doesn't, so `this.focusAfterDaySelected` flag is no longer used.
			// this.focusAfterDaySelected = true
			input.current.focus()

			// // For some reason in IE 11 `onFocus` on `<input/>` is not called immediately.
			// if (isInternetExplorer()) {
			// 	setTimeout(() => this.focusAfterDaySelected = false, 0)
			// } else {
			// 	this.focusAfterDaySelected = false
			// }
		}
	}, [
		format,
		onChange,
		value,
		// noon,
		utc,
		collapse
	])

	// const onCalendarKeyDown = (event) =>
	// {
	// 	switch (event)
	// 	{
	// 		// The next year is selected on "Up" arrow,
	// 		// so `.preventDefault()` it to prevent page scrolling.
	// 		// https://github.com/gpbl/react-day-picker/issues/273
	// 		case 38:
	// 			event.preventDefault()
	// 			return
	//
	// 		// The previous year is selected on "Down" arrow,
	// 		// so `.preventDefault()` it to prevent page scrolling.
	// 		// https://github.com/gpbl/react-day-picker/issues/273
	// 		case 40:
	// 			event.preventDefault()
	// 			return
	// 	}
	// }

	const onMonthChange = useCallback((month) => {
		setMonth(month)
	}, [])

	const preventBlur = useCallback(() =>
	{
		// A hack for iOS when it collapses
		// the calendar after selecting a year/month.
		// When selecting a year/month and pressing "Done" button
		// iOS triggers `blur` event on the corresponding `<select/>`
		// which in turn causes the calendar to collapse.
		// This workaround prevents that by re-focusing the calendar.
		if (_userHasJustChangedYearOrMonth.current) {
			focusCalendar()
			return true
		}
	}, [
		focusCalendar
	])

	const onBlur_ = useCallback((event) =>
	{
		clearTimeout(blurTimer.current)
		const result = handleBlurEvent(
			event,
			onFocusOut,
			() => container.current,
			() => input.current,
			preventBlur
		)
		if (typeof result !== 'boolean') {
			blurTimer.current = result
		}
	}, [
		onFocusOut,
		preventBlur
	])

	const onFocusOut = useCallback((event) =>
	{
		// `window.rruiCollapseOnFocusOut` can be used
		// for debugging expandable contents.
		if (window.rruiCollapseOnFocusOut !== false) {
			isFocusingOut.current = true
			collapse()
			isFocusingOut.current = undefined
		}

		if (onBlur) {
			onBlurForReduxForm(onBlur, event, value)
		}
	}, [
		collapse,
		onBlur,
		value
	])

	const getContainerNode = useCallback(() => container.current, [])
	const setContainerNode = useCallback((node) => container.current = node, [])

	const setInputRef = useCallback((inputRef) => {
		if (ref) {
			ref.current = inputRef
		}
		input.current = inputRef
	}, [])

	const dayFormatter = useMemo(() => {
		if (typeof Intl !== 'undefined') {
			return new Intl.DateTimeFormat(locale, {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})
		}
	}, [
		locale
	])

	const monthFormatter = useMemo(() => {
		if (typeof Intl !== 'undefined') {
			return new Intl.DateTimeFormat(locale, {
				month: 'long'
			})
		}
	}, [
		locale
	])

	const weekdayFormatter = useMemo(() => {
		if (typeof Intl !== 'undefined') {
			return new Intl.DateTimeFormat(locale, {
				weekday: 'long'
			})
		}
	}, [
		locale
	])

	const weekdayShortFormatter = useMemo(() => {
		if (typeof Intl !== 'undefined') {
			return new Intl.DateTimeFormat(locale, {
				weekday: 'short'
			})
		}
	}, [
		locale
	])

	const firstDayOfWeek = useMemo(() => {
		// Default: country — US, first day of week — Sunday (0).
		return locale && getFirstDayOfWeek(locale) || 0
	}, [
		locale
	])

	const localeUtils = useMemo(() => ({
		// Fixes calendar day `aria-label` to be a proper one instead of
		// a weird one (`Mon Jan 03 2022`).
		formatDay(date) {
			if (dayFormatter) {
				return dayFormatter.format(date)
			}
			// A generic non-localized date formatter.
			// https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/toDateString
			// Same as `date.toString()` but without time.
			return date.toDateString()
		},
		formatMonthTitle(date) {
			if (monthFormatter) {
				return monthFormatter.format(date)
			}
			// Returns month and year (in English).
			return LocaleUtils.formatMonthTitle(date)
		},
		formatWeekdayShort(i) {
			if (weekdayShortFormatter) {
				return weekdayShortFormatter.format(getDateForDayOfWeek(i))
			}
			// Returns short weekday (in English).
			return LocaleUtils.formatWeekdayShort(i)
		},
		formatWeekdayLong(i) {
			if (weekdayFormatter) {
				return weekdayFormatter.format(getDateForDayOfWeek(i))
			}
			// Returns long weekday (in English).
			return LocaleUtils.formatWeekdayLong(i)
		},
		getFirstDayOfWeek() {
			return firstDayOfWeek
		},
		getMonths() {
			const months = []
			let i = 0
			while (i < 12) {
				months.push(monthFormatter.format(getDateForMonth(i)))
				i++
			}
			return months
		}
	}), [
		locale,
		dayFormatter,
		monthFormatter,
		weekdayFormatter,
		weekdayShortFormatter,
		firstDayOfWeek
	])

	// `<input type="date"/>` renders a browser-specific date picker
	// which can not be turned off using a simple HTML attribute
	// and also date format is not customizable,
	// therefore just using `<input type="text"/>` here

	let captionElement
	if (selectYearsIntoPast || selectYearsIntoFuture) {
		captionElement = (
			<YearMonthSelect
				focus={focusCalendar}
				userHasJustChangedYearOrMonth={userHasJustChangedYearOrMonth}
				selectedDay={value}
				onChange={onMonthChange}
				selectYearsIntoPast={selectYearsIntoPast}
				selectYearsIntoFuture={selectYearsIntoFuture}
			/>
		)
	}

	return (
		<WithError
			setRef={setContainerNode}
			error={error}
			indicateInvalid={indicateInvalid}
			onKeyDown={onContainerKeyDown}
			onBlur={onBlur_}
			style={style}
			className={classNames(className, 'rrui__date-picker', {
				'rrui__date-picker--disabled': disabled
			})}>

			{/* Date input */}
			<TextInput
				id={ id }
				ref={ setInputRef }
				required={ required }
				error={ error }
				indicateInvalid={ indicateInvalid }
				label={ label }
				placeholder={ placeholder }
				aria-label={ ariaLabel }
				aria-labelledby={ ariaLabelledBy }
				aria-describedby={ ariaDescribedBy }
				tabIndex={ tabIndex }
				disabled={ disabled }
				autoFocus={ autoFocus }
				value={ textValue !== undefined ? textValue : formatDate(value, format, { utc }) }
				onKeyDown={ onInputKeyDown }
				onChange={ onInputChange }
				onFocus={ onInputFocus }
				onClick={ expand }>

				{/* This layer can intercept taps on mobile devices
				    to prevent the keyboard from showing
				    when the date picker is in fullscreen mode.
				    `tabIndex={-1}` is to prevent focus-out/focus-in jitter on click. */}
				<div
					ref={ inputOverlay }
					onClick={ onToggleButtonClick }
					tabIndex={ -1 }
					className="rrui__date-picker__input-overlay"/>

				{/* Calendar icon which toggles the calendar. */}
				{/* `aria-haspopup`: https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup */}
				{/* WAI-ARIA 1.1 is not yet supported, so not using `aria-haspopup="grid"`. */}
				<button
					type="button"
					onClick={onToggleButtonClick}
					tabIndex={buttonAriaLabel ? undefined : -1}
					aria-haspopup={undefined && 'grid'}
					aria-expanded={isExpanded_ ? true : false}
					aria-label={buttonAriaLabel}
					className={classNames(
						'rrui__button-reset',
						'rrui__outline',
						'rrui__date-picker__icon', {
							'rrui__date-picker__icon--hidden': !buttonAriaLabel && !icon
						}
					)}>
					{typeof icon === 'function' ? icon() : DEFAULT_CALENDAR_ICON()}
				</button>

				{/* <DayPicker/> doesn't support `style` property */}
				<Expandable
					ref={expandable}
					alignment={alignment}
					onExpand={onExpand}
					onExpanded={onExpanded}
					onCollapse={onCollapse}
					onFocusOut={onBlur_}
					getTogglerNode={getContainerNode}
					scrollIntoViewDelay={waitForKeyboardSlideIn ? keyboardSlideInAnimationDuration : undefined}>

					<DayPicker
						ref={calendar}
						month={month}
						onMonthChange={onMonthChange}
						locale={locale}
						localeUtils={localeUtils}
						firstDayOfWeek={firstDayOfWeek}
						onDayClick={onDayClick}
						selectedDays={ignoreInvalidDateObjects(value)}
						disabledDays={disabledDays}
						captionElement={captionElement}
						className="rrui__date-picker__calendar"
					/>
				</Expandable>
			</TextInput>
		</WithError>
	)
}

DatePicker = React.forwardRef(DatePicker)

DatePicker.propTypes =
{
	// (optional) HTML `id` attribute.
	id : PropTypes.string,

	// An optional label placed on top of the input field
	label : PropTypes.string,

	// `<input/>` placeholder
	placeholder : PropTypes.string,

	// Expandable calendar alignment.
	// Is "left" by default.
	alignment : PropTypes.string,

	// A "BCP47" "language tag".
	// Example: "en-US".
	locale : PropTypes.string,

	// Date format. Only supports `dd`, `mm`, `yy` and `yyyy` for now.
	// Can support custom localized formats, perhaps, when `date-fns@2` is released.
	// (is US `mm/dd/yyyy` by default)
	format : PropTypes.string.isRequired,
	// format : PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,

	// Internationalization
	// locale : PropTypes.string,

	// The Date `value`
	value : PropTypes.instanceOf(Date),

	// Writes new `value`.
	// The `value` is in the user's time zone and the time is `00:00`.
	onChange : PropTypes.func.isRequired,

	// Is called when the date picker is either collapsed or expanded
	onToggle : PropTypes.func,

	// Is called when the input is focused
	onFocus : PropTypes.func,

	// Is called when the input is blurred.
	// This `onBlur` interceptor is a workaround for `redux-form`,
	// so that it gets the parsed `value` in its `onBlur` handler,
	// not the formatted text.
	onBlur : PropTypes.func,

	// Disables the input
	disabled : PropTypes.bool,

	// Set to `true` to mark the field as required
	required : PropTypes.bool.isRequired,

	// Indicates that the input is invalid.
	error : PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.bool
	]),

	// HTML `autoFocus` attribute
	autoFocus : PropTypes.bool,

	// HTML `tabIndex` attribute
	tabIndex : PropTypes.number,

	// HTML `<input/>` `name` attribute
	name : PropTypes.string,

	// `react-day-picker`'s `disabledDays`.
	// http://react-day-picker.js.org/examples/disabled
	disabledDays : PropTypes.oneOfType
	([
		PropTypes.object,
		PropTypes.func,
		PropTypes.array
	]),

	// How much years back can a user navigate using the year `<select/>`
	selectYearsIntoPast : PropTypes.number.isRequired,

	// How much years forward can a user navigate using the year `<select/>`
	selectYearsIntoFuture : PropTypes.number.isRequired,

	// A `date`` from which the initially shown month of the calendar will be derived
	// when no `value` is selected. Is the current month by default.
	initialCalendarDate : PropTypes.instanceOf(Date),

	// Whether dates being selected should be in UTC+0 timezone.
	// (is `false` by default)
	utc : PropTypes.bool.isRequired,

	// // Whether to set time to 12:00 for dates being selected.
	// // (is `true` by default)
	// noon : PropTypes.bool.isRequired,

	// The calendar icon.
	icon : PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.bool
	]),

	// `aria-label` attribute for the toggle calendar button.
	buttonAriaLabel : PropTypes.string,

	waitForKeyboardSlideIn : PropTypes.bool.isRequired,
	keyboardSlideInAnimationDuration : PropTypes.number.isRequired,

	// CSS class
	className : PropTypes.string,

	// CSS style object
	style : PropTypes.object
}

DatePicker.defaultProps =
{
	alignment : 'left',

	// Default US format
	format : 'mm/dd/yyyy',

	// Set to `true` to mark the field as required
	required : false,

	// Show `error` (if passed).
	indicateInvalid : true,

	// Whether dates being selected should be in UTC+0 timezone
	utc : true,

	// // Whether to set time to 12:00 for dates being selected
	// noon : false,

	// A sensible default.
	selectYearsIntoPast : 100,
	selectYearsIntoFuture : 100,

	waitForKeyboardSlideIn : true,
	keyboardSlideInAnimationDuration : 300
}

export default DatePicker

const iconStyle = {
	width  : '100%',
	height : '100%',
	fill   : 'currentColor'
}

// Doesn't work.
// https://github.com/gpbl/react-day-picker/issues/841
//
// classNames={ REACT_DAY_PICKER_CLASS_NAMES }
//
// // Default `react-day-picker` CSS class names.
// // Should have been exported from `react-day-picker`.
// // https://github.com/gpbl/react-day-picker/blob/master/src/classNames.js
// // Can change in future versions of `react-day-picker`.
// const REACT_DAY_PICKER_DEFAULT_CLASS_NAMES = {
// 	container: 'DayPicker',
// 	wrapper: 'DayPicker-wrapper',
// 	interactionDisabled: 'DayPicker--interactionDisabled',
// 	months: 'DayPicker-Months',
// 	month: 'DayPicker-Month',
// 	navBar: 'DayPicker-NavBar',
// 	navButtonPrev: 'DayPicker-NavButton DayPicker-NavButton--prev',
// 	navButtonNext: 'DayPicker-NavButton DayPicker-NavButton--next',
// 	navButtonInteractionDisabled: 'DayPicker-NavButton--interactionDisabled',
// 	caption: 'DayPicker-Caption',
// 	weekdays: 'DayPicker-Weekdays',
// 	weekdaysRow: 'DayPicker-WeekdaysRow',
// 	weekday: 'DayPicker-Weekday',
// 	body: 'DayPicker-Body',
// 	week: 'DayPicker-Week',
// 	weekNumber: 'DayPicker-WeekNumber',
// 	day: 'DayPicker-Day',
// 	footer: 'DayPicker-Footer',
// 	todayButton: 'DayPicker-TodayButton',
// 	// default modifiers
// 	today: 'today',
// 	selected: 'selected',
// 	disabled: 'disabled',
// 	outside: 'outside',
// }
//
// const REACT_DAY_PICKER_CLASS_NAMES = {
// 	...REACT_DAY_PICKER_DEFAULT_CLASS_NAMES,
// 	/* `.DayPicker-wrapper` is a `<div/>` wrapping the calendar.
// 	   It gets focused upon expanding which causes an outline.
// 	   That outline can be safely removed because it doesn't aid accesiblity. */
// 	wrapper: REACT_DAY_PICKER_DEFAULT_CLASS_NAMES.wrapper + ' rrui__outline',
// 	/* Calendar days have `background-color` on `:focus`.
// 	   Therefore their `outline` can be safely removed. */
// 	day: REACT_DAY_PICKER_DEFAULT_CLASS_NAMES.day + ' rrui__outline',
// 	/* Previous/Next month buttons have `background-color` on `:focus`.
// 	   Therefore their `outline` can be safely removed. */
// 	navButtonPrev: REACT_DAY_PICKER_DEFAULT_CLASS_NAMES.navButtonPrev + ' rrui__outline',
// 	navButtonNext: REACT_DAY_PICKER_DEFAULT_CLASS_NAMES.navButtonNext + ' rrui__outline'
// }

// Default calendar icon
const DEFAULT_CALENDAR_ICON = () => (
	<svg style={iconStyle} viewBox="0 0 32 32">
		<path d=" M2 2 L10 2 L10 10 L2 10z M12 2 L20 2 L20 10 L12 10z M22 2 L30 2 L30 10 L22 10z M2 12 L10 12 L10 20 L2 20z M12 12 L20 12 L20 20 L12 20z M22 12 L30 12 L30 20 L22 20z M2 22 L10 22 L10 30 L2 30z M12 22 L20 22 L20 30 L12 30z M22 22 L30 22 L30 30 L22 30z "/>
	</svg>
)