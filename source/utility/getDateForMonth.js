export default function getDateForMonth(i) {
	// Dec 01 2000
	const date = new Date(2000, i, 1)
	date.setHours(0, 0, 0, 0)
	return date
}