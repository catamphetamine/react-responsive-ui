import isDigit from './isDigit'
import { isDateFormatUnitCharacter } from './parseDate'

export default function transformDateInputAccordingToTemplate(value, format)
{
	let i = 0
	while (i < value.length && i < format.length)
	{
		if (isDateFormatUnitCharacter(format[i])) {
			if (!isDigit(value[i])) {
				break
			}
		} else if (format[i] !== value[i]) {
			if (isDigit(value[i])) {
				break
			}
			// Fix the punctuation character.
			value = value.slice(0, i) + format[i] + value.slice(i + 1)
		}
		i++
	}

	return value.slice(0, i)
}
