export default function getTerritoryFromLocale(locale) {
	const match = locale.match(/-([A-Z]{2})(?:-.+)?$/)
	if (match) {
		return match[1]
	}
}