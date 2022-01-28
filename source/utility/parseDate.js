import isDigit from './isDigit'

// // `date-fns` would be a better alternative to moment
// // but it doesn't support templated date parsing
// // until version `2.0.0` of it is released.
// // https://github.com/date-fns/date-fns/issues/347
// import parse_date_date_fns from 'date-fns/parse'
// import format_date_date_fns from 'date-fns/format'

// Parses a text value into a `Date` provided a `format`.
// The date returned is in the user's time zone and the time is `00:00`.
// (only `dd`, `mm`, `yy` and `yyyy` literals are supported).
export default function parseDate(string, format, utc)
{
	if (!string) {
		return
	}

	let year = extract(string, format, 'yyyy')

	if (year === undefined)
	{
		year = extract(string, format, 'yy')

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

	const month = extract(string, format, 'mm')
	const day   = extract(string, format, 'dd')

	if (year === undefined || month === undefined || day === undefined) {
		return
	}

	// The date created is in the user's time zone and the time is `00:00`.
	let date = new Date
	(
		year,
		month - 1,
		day,
		0 // noon ? 12 : 0
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
	const startsAt = template.indexOf(piece)

	if (startsAt < 0) {
		return
	}

	// Check overall sanity
	if (!correspondsToTemplate(string, template)) {
		return
	}

	const number = parseInt(string.slice(startsAt, startsAt + piece.length))

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
		if (isDigit(string[i])) {
			if (!isDateFormatUnitCharacter(template[i])) {
				return false
			}
		} else {
			if (string[i] !== template[i]) {
				return false
			}
		}

		i++
	}

	return true
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

export function isDateFormatUnitCharacter(character) {
	return character === 'd' ||
		character === 'm' ||
		character === 'y';
}