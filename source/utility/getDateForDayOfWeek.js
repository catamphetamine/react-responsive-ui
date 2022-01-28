export default function getDateForWeekday(i) {
	// Jan 07 2000
	const date = new Date(2000, 0, 7)
	date.setDate(date.getDate() - date.getDay() + i)
	date.setHours(0, 0, 0, 0)
	return date
}