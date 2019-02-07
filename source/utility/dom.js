// Submits the form on `Ctrl` + `Enter` (or `Cmd` + `Enter`).
export function submitFormOnCtrlEnter(event, component)
{
	if ((event.ctrlKey || event.metaKey) && event.keyCode === 13)
	{
		if (submitContainingForm(component))
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

// export function getScrollbarWidth()
// {
// 	// // `window.innerWidth` has a bug:
// 	// // it's decreases as the page scale is increased.
// 	// // Therefore not using it.
// 	// // (Full width) - (Width minus scrollbar)
// 	// return document.body.clientWidth - window.innerWidth
//
// 	return 17
// }

// Detects Internet Explorer.
// https://stackoverflow.com/questions/19999388/check-if-user-is-using-ie-with-jquery
export function isInternetExplorer()
{
	return window.navigator.userAgent.indexOf('MSIE ') > 0 ||
		window.navigator.userAgent.indexOf('Trident/') > 0
}

// https://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
export function isElement(element) {
	return element instanceof Element || element instanceof HTMLDocument
}

// http://stackoverflow.com/questions/5598743/finding-elements-position-relative-to-the-document
export function getOffset(element) {
	const rect = element.getBoundingClientRect()

	const client_left = document.clientLeft || document.body.clientLeft || 0
	const client_top  = document.clientTop || document.body.clientTop || 0

	const top  = rect.top + window.pageYOffset - client_top
	const left = rect.left + window.pageXOffset - client_left

	return { top, left }
}