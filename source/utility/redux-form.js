// This `onBlur` interceptor is a workaround for `redux-form`,
// so that it gets the right (parsed, not the formatted one)
// `event.target.value` in its `onBlur` handler.
export function onBlurForReduxForm(onBlur, event, value)
{
	const _event =
	{
		...event,
		target:
		{
			...event.target,
			value
		}
	}

	// For `redux-form` event detection.
	// https://github.com/erikras/redux-form/blob/v5/src/events/isEvent.js
	_event.stopPropagation = event.stopPropagation
	_event.preventDefault  = event.preventDefault

	onBlur(_event)
}