// // Moment.js takes 161 KB of space (minified) which is too much
// import moment from 'moment'

// // `date-fns` would be a better alternative to moment
// // but it doesn't support templated date parsing
// // until version `2.0.0` of it is released.
// // https://github.com/date-fns/date-fns/issues/347
// import parse_date_date_fns from 'date-fns/parse'
// import format_date_date_fns from 'date-fns/format'

// Parses a text value into a `Date` provided a `format`.
// The date returned is in the user's time zone and the time is `12:00`.
export function parseDate(text_value, format, noon, utc)
{
	if (!text_value) {
		return
	}

	// Custom
	return parseDateCustom(text_value, format, noon, utc)

	// // Using `date-fns`
	// const date = parse_date_date_fns(text_value)

	// if (isNaN(date.getTime()))
	// {
	// 	return
	// }

	// return date

	// // Using `Moment.js`
	// const moment_day = moment(text_value, format, true)

	// if (!moment_day.isValid())
	// {
	// 	return
	// }

	// return moment_day.toDate()
}

// (Moment.js)
// Formats a `Date` into a text value provided a `format`
export function formatDate(date, format, { utc } = {})
{
	// Custom
	return formatDateCustom(date, format, { utc })

	// // Using `date-fns`
	// return format_date_date_fns(date, format)

	// // Using `Moment.js`
	// return moment(date).format(format)
}

// Parses a text value into a `Date` provided a `format`.
// The date returned is in the user's time zone and the time is `00:00`.
// (only `DD`, `MM`, `YY` and `YYYY` literals are supported).
export function parseDateCustom(string, format, noon, utc)
{
	if (!string) {
		return
	}

	let year = extract(string, format, 'YYYY')

	if (year === undefined)
	{
		year = extract(string, format, 'YY')

		if (year !== undefined)
		{
			// Current year in the user's time zone.
			const current_year_and_century = new Date().getFullYear()
			const current_year = current_year_and_century % 100
			let century = (current_year_and_century - current_year) / 100

			if (year >= current_year)
			{
				if (year - current_year > 100 * 1/5)
				{
					century--
				}
			}
			else
			{
				if (current_year - year > 100 * 4/5)
				{
					century++
				}
			}

			year += century * 100
		}
	}

	const month = extract(string, format, 'MM')
	const day   = extract(string, format, 'DD')

	if (year === undefined || month === undefined || day === undefined) {
		return
	}

	// The date created is in the user's time zone and the time is `00:00`.
	let date = new Date
	(
		year,
		month - 1,
		day,
		noon ? 12 : 0
	)

	if (utc)
	{
		// Converts timezone to UTC while preserving the same time
		date = getSameDateAndTimeInUtc0TimeZone(date)
	}

	// If `new Date()` returns "Invalid Date"
	// (sometimes it does)
	if (isNaN(date.getTime())) {
		return
	}

	return date
}

function extract(string, template, piece)
{
	const starts_at = template.indexOf(piece)

	if (starts_at < 0) {
		return
	}

	// Check overall sanity
	if (!correspondsToTemplate(string, template)) {
		return
	}

	const number = parseInt(string.slice(starts_at, starts_at + piece.length))

	if (!isNaN(number)) {
		return number
	}
}

export function correspondsToTemplate(string, template)
{
	if (string.length !== template.length) {
		return false
	}

	let i = 0
	while (i < string.length)
	{
		const is_a_digit = string[i] >= '0' && string[i] <= '9'

		if (!is_a_digit)
		{
			if (string[i] !== template[i])
			{
				return false
			}
		}
		else
		{
			if (template[i] !== 'D' && template[i] !== 'M' && template[i] !== 'Y')
			{
				return false
			}
		}

		i++
	}

	return true
}

export function formatDateCustom(date, format, { utc } = {})
{
	// Someone may accidentally pass a timestamp, or a string.
	// Or `date` could be `undefined`.
	if (!(date instanceof Date)) {
		return ''
	}

	// Check if `date` is "Invalid Date".
	if (isNaN(date.getTime())) {
		return ''
	}

	if (utc) {
		date = getSameDateAndTimeFromUtc0TimeZone(date)
	}

	const day   = date.getDate()
	const month = date.getMonth() + 1
	const year  = date.getFullYear()

	let text = format
		.replace('DD', padWithZeroes(String(day),   2))
		.replace('MM', padWithZeroes(String(month), 2))

	if (text.indexOf('YYYY') >= 0) {
		return text.replace('YYYY', padWithZeroes(String(year), 4))
	}

	if (text.indexOf('YY') >= 0) {
		return text.replace('YY', padWithZeroes(String(year % 100), 2))
	}
}

function padWithZeroes(string, target_length)
{
	while (string.length < target_length) {
		string = '0' + string
	}

	return string
}

// // Intl date formatting
//
// const dateFormatters = {}
//
// function format_dateIntl(date, locale) {
//   if (typeof Intl === 'undefined') {
//     return date.toISOString()
//   }
//
//   const key = typeof locale === 'string' ? locale : locale.join(',')
//
//   if (!dateFormatters[key]) {
//     dateFormatters[key] = new Intl.DateTimeFormat(locale, {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     })
//   }
//
//   return dateFormatters[key]
// }

// Converts `null` to `undefined`
// (specially for `knex.js`)
export function normalizeDate(value)
{
	if (value === null) {
		return
	}

	// Check if `value` is "Invalid Date".
	if (value instanceof Date && isNaN(value.getTime())) {
		return
	}

	return value
}

export function trimInvalidPart(value, format)
{
	let i = 0
	while (i < value.length && i < format.length)
	{
		if (format[i] === 'D' || format[i] === 'M' || format[i] === 'Y')
		{
			if (!(value[i] >= '0' && value[i] <= '9'))
			{
				break
			}
		}
		else if (format[i] !== value[i])
		{
			break
		}
		i++
	}

	return value.slice(0, i)
}

// Converts timezone to UTC+0 while preserving the same time.
export function getSameDateAndTimeInUtc0TimeZone(date) {
  // Doesn't account for leap seconds but I guess that's ok
  // given that javascript's own `Date()` does not either.
  // https://www.timeanddate.com/time/leap-seconds-background.html
  //
  // https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
  //
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)
}

// Converts timezone from UTC+0 while preserving the same time.
export function getSameDateAndTimeFromUtc0TimeZone(date) {
  // Doesn't account for leap seconds but I guess that's ok
  // given that javascript's own `Date()` does not either.
  // https://www.timeanddate.com/time/leap-seconds-background.html
  //
  // https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
  //
  return new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000)
}
