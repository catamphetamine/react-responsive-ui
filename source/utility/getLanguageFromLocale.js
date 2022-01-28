// Returns a language from a BCP 47 "language tag".
// Example: `"ru-RU"` -> `"ru"`.
// https://en.wikipedia.org/wiki/IETF_language_tag
export default function getLanguageFromLocale(locale) {
	const dashIndex = locale.indexOf('-')
	if (dashIndex >= 0) {
		return locale.slice(0, dashIndex)
	}
	return locale
}