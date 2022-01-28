// Converts `null` to `undefined`.
// Converts "Invalid Date" to `undefined`.
// (specially for `sequelize`)
export default function ignoreInvalidDateObjects(value)
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
