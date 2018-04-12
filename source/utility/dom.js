import ReactDOM from 'react-dom'

// Submits the form on `Ctrl` + `Enter` (or `Cmd` + `Enter`).
export function submitFormOnCtrlEnter(event, component)
{
	if ((event.ctrlKey || event.metaKey) && event.keyCode === 13)
	{
		if (submitContainingForm(ReactDOM.findDOMNode(component)))
		{
			event.preventDefault()
			return true
		}
	}
}

export function submitContainingForm(node)
{
	while (node.parentElement)
	{
		node = node.parentElement
		if (node instanceof HTMLFormElement)
		{
			// Won't use `node.submit()` because it bypasses `onSubmit`.
			// Will click the submit button instead.
			const submit = node.querySelector('button[type=submit]')
			if (submit)
			{
				submit.click()
				return true
			}
		}
	}
}

export function getScrollbarWidth()
{
	// // `window.innerWidth` has a bug:
	// // it's decreases as the page scale is increased.
	// // Therefore not using it.
	// // (Full width) - (Width minus scrollbar)
	// return document.body.clientWidth - window.innerWidth

	return 17
}
