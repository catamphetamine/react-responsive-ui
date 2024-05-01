import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

// http://react-day-picker.js.org/examples/?yearNavigation
// Component will receive date, locale and localeUtils props
export default class YearMonthSelect extends PureComponent
{
	static propTypes =
	{
		date : PropTypes.instanceOf(Date),
		onChange : PropTypes.func.isRequired,
		localeUtils : PropTypes.object,
		tabbable : PropTypes.bool
	}

	static defaultProps =
	{
		// For some weird reason in Chrome 70
		// the focus is trapped and jumps from
		// the month `<select/>` back to the `<input/>`
		// if `tabbable` is `true`.
		// Works as intended in Firefox though.
		tabbable : false
	}

	constructor(props)
	{
		super(props)

		const
		{
			selectYearsIntoPast,
			selectYearsIntoFuture,
			selectedDay,
			localeUtils
		}
		= this.props

		// The current year in the user's time zone.
		const current_year = new Date().getFullYear()

		const from_year = selectYearsIntoPast   ? current_year - selectYearsIntoPast   : current_year
		const   to_year = selectYearsIntoFuture ? current_year + selectYearsIntoFuture : current_year

		const years = new Array(to_year - from_year + 1)

		let i = 0
		while (from_year + i <= to_year)
		{
			years[i] = from_year + i
			i++
		}

		// Makes sure the currently selected year is in the list
		// to not confuse the user.
		if (selectedDay)
		{
			const selected_year = selectedDay.getFullYear()

			if (selected_year < from_year)
			{
				years.unshift(selected_year)
			}
			else if (selected_year > to_year)
			{
				years.push(selected_year)
			}
		}

		const months = localeUtils.getMonths()

		this.months = months
		this.years = years
	}

	onChangeMonth = (event) =>
	{
		const { date, onChange } = this.props

		const month = event.target.value

		if (month !== date.getMonth())
		{
			// The date created is in the user's time zone and the time is `00:00`.
			// The `day` is `undefined` which means the first one of the `month`.
			onChange(new Date(date.getFullYear(), month))
		}

		// restoreFocus()
	}

	onChangeYear = (event) =>
	{
		const { date, onChange } = this.props

		const year = event.target.value

		if (year !== date.getFullYear())
		{
			// The date created is in the user's time zone and the time is `00:00`.
			// The `day` is `undefined` which means the first one of the `month`.
			onChange(new Date(year, date.getMonth()))
		}

		// restoreFocus()
	}

	restoreFocus = () =>
	{
		const { userHasJustChangedYearOrMonth } = this.props

		// Doesn't work on iOS.
		// Or maybe it does with the new `focus()` being
		// `focusCalendar()` vs the old `.focus()`.
		// focus()

		// A hack for iOS when it collapses
		// the calendar after selecting a year/month.
		// Known bug: it won't work when a user
		// focuses one `<select/>` and then focuses another one
		// because in that case `onBlur` won't be triggered for the second `<select/>`.
		userHasJustChangedYearOrMonth()
	}

	render()
	{
		const { date, tabbable } = this.props

		return (
			<div className="DayPicker-Caption">
				<div className="DayPicker-CaptionSelects">
					<div className="DayPicker-MonthSelect">
						{/* Month `<select/>` */}
						<select
							onChange={ this.onChangeMonth }
							onBlur={ this.restoreFocus }
							value={ date.getMonth() }
							aria-label="Month"
							tabIndex={ tabbable ? 0 : -1 }
							className={ classNames(
								// `:focus` style is implemented via border color
								// so outline can be muted safely here.
								'rrui__outline',
								'rrui__select__native',
								'rrui__select__native--overlay'
							) }>

							{ this.months.map((month, i) => (
								<option key={ i } value={ i }>
									{ month }
								</option>
							)) }
						</select>

						{/* Month `<select/>` button */}
						<button
							type="button"
							tabIndex={-1}
							className={classNames(
								'rrui__button-reset',
								'rrui__outline',
								'rrui__date-picker__month-select-toggler'
							)}>
							<div className="rrui__select__selected-content">
								<div className="rrui__select__selected-label">
									{this.months[date.getMonth()]}
								</div>
								<div className="rrui__select__arrow"/>
							</div>
						</button>
					</div>

					<div className="DayPicker-YearSelect">
						{/* Year `<select/>` */}
						<select
							onChange={ this.onChangeYear }
							onBlur={ this.restoreFocus }
							value={ date.getFullYear() }
							aria-label="Year"
							tabIndex={ tabbable ? 0 : -1 }
							className={ classNames(
								// `:focus` style is implemented via border color
								// so outline can be muted safely here.
								'rrui__outline',
								'rrui__select__native',
								'rrui__select__native--overlay'
							) }>

							{ this.years.map((year, i) => (
								<option key={ i } value={ year }>
									{ year }
								</option>
							)) }
						</select>

						{/* Year `<select/>` button */}
						<button
							type="button"
							tabIndex={-1}
							className={classNames(
								'rrui__button-reset',
								'rrui__outline',
								'rrui__date-picker__year-select-toggler'
							)}>
							<div className="rrui__select__selected-content">
								<div className="rrui__select__selected-label">
									{date.getFullYear()}
								</div>
								<div className="rrui__select__arrow"/>
							</div>
						</button>
					</div>
				</div>
			</div>
		)
	}
}