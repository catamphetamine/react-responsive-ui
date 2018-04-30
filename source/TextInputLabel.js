import React from 'react'
import classNames from 'classnames'

export default function TextInputLabel({ id, value, required, invalid, floats, children })
{
	return (
		<label
			htmlFor={ id }
			className={ classNames('rrui__input-label',
			{
				'rrui__input-label--required'          : required && isEmpty(value),
				'rrui__input-label--invalid'           : invalid,
				'rrui__input-label--floating'          : floats,
				'rrui__text-input__label--placeholder' : floats && isEmpty(value)
			}) }>
			{ children }
		</label>
	)
}

// Whether the input is empty
function isEmpty(value)
{
	// `0` is not an empty value
	if (typeof value === 'number' && value === 0)
	{
		return false
	}

	// An empty string, `undefined`, `null` –
	// all those are an empty value.
	if (!value)
	{
		return true
	}

	// Whitespace string is also considered empty
	if (typeof value === 'string' && !value.trim())
	{
		return true
	}

	// Not empty
	return false
}