export default function isDigit(character) {
	if (character >= '0' && character <= '9') {
		return true
	}
	// "Fullwidth digit".
	if (character >= '\uFF10' && character <= '\uFF19') {
		return true
	}
	// Arabic-indic digit.
	if (character >= '\u0660' && character <= '\u0669') {
		return true
	}
	// Eastern-Arabic digit.
	if (character >= '\u06F0' && character <= '\u06F9') {
		return true
	}
}