import convertUtcDateToLocalDateWithSameTime from './convertUtcDateToLocalDateWithSameTime'

// Formats a `Date` into a text value provided a `format`
export default function formatDate(date, format, { utc } = {})
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
		date = convertUtcDateToLocalDateWithSameTime(date)
	}

	const day = date.getDate()
	const month = date.getMonth() + 1
	const year = date.getFullYear()

	let text = format
		.replace('dd', padWithZeroes(String(day), 2))
		.replace('mm', padWithZeroes(String(month), 2))

	if (text.indexOf('yyyy') >= 0) {
		return text.replace('yyyy', padWithZeroes(String(year), 4))
	}

	if (text.indexOf('yy') >= 0) {
		return text.replace('yy', padWithZeroes(String(year % 100), 2))
	}
}

function padWithZeroes(string, targetLength)
{
	while (string.length < targetLength) {
		string = '0' + string
	}
	return string
}