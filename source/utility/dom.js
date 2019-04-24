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

/**
 * Returns the DOM element's `top` and `left` offset relative to the document.
 * @param  {object} element
 * @return {object} `{ top: number, left: number, width: number, height: number }`
 */
export function getOffset(element) {
	// Copied from:
	// http://stackoverflow.com/questions/5598743/finding-elements-position-relative-to-the-document

	const onScreenCoordinates = element.getBoundingClientRect()

	const documentLeftBorderWidth = document.clientLeft || document.body.clientLeft || 0
	const documentTopBorderWidth  = document.clientTop || document.body.clientTop || 0

	// `window.scrollY` and `window.scrollX` aren't supported in Internet Explorer.
	const scrollY = window.pageYOffset
	const scrollX = window.pageXOffset

	const top  = onScreenCoordinates.top + scrollY - documentTopBorderWidth
	const left = onScreenCoordinates.left + scrollX - documentLeftBorderWidth

	return {
		top,
		left,
		width: onScreenCoordinates.width,
		height: onScreenCoordinates.height
	}
}