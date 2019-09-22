import { isInternetExplorer, isElement } from './dom'

export function onBlur(event, onFocusOut, getComponentNode, getComponentNode2, preventBlur)
{
	function _onBlur(focusedNode)
	{
		if (preventBlur) {
			if (preventBlur() === true) {
				return false
			}
		}

		// If the currently focused element is inside the expandable
		// then don't collapse it.
		if (
			focusedNode &&
			// Fixes "Argument 1 of Node.contains does not implement interface Node.".
			focusedNode instanceof Element &&
			(
				getComponentNode().contains(focusedNode) ||
				(getComponentNode2 && getComponentNode2().contains(focusedNode))
			)
		) {
			return false
		}

		// Collapse the expandable.
		// (clicked/tapped outside or tabbed-out)
		onFocusOut(event)
		return true
	}

	// Blur `event.relatedTarget` doesn't work in Internet Explorer (in React).
	// https://github.com/gpbl/react-day-picker/issues/668
	// https://github.com/facebook/react/issues/3751
	//
	// Therefore, using a 30ms timeout hack in `onBlur` handler
	// to get the new currently focused page element
	// and check if that element is inside the component.
	// https://github.com/mui-org/material-ui/blob/v1-beta/packages/material-ui/src/Menu/MenuList.js
	// Until Internet Explorer is no longer a supported browser.
	//
	if (isInternetExplorer()) {
		return setTimeout(() => getComponentNode() && _onBlur(document.activeElement), 30)
	}

	// // Safari (both macOS and iOS) has a bug: `<button/>`s not getting focus.
	// // https://stackoverflow.com/questions/20359962/jquery-mobile-focusout-event-for-relatedtarget-returns-incorrect-result-in-safar
	// if (!event.relatedTarget) {
	// 	if (getComponentNode2 && getComponentNode2().tagName.toLowerCase() === 'button') {
	// 		// The `<button/>` could be the actual `relatedTarget` in Safari.
	// 		// The Internet Explorer workaround won't work here too
	// 		// because `document.activeElement` is also `undefined`.
	// 		// No workaround here.
	// 	}
	// }

	// There was an error in Firefox 52:
	// "Argument 1 of Node.contains does not implement interface Node".
	// To prevent such errors `event.relatedTarget` is validated manually here.
	return _onBlur(isElement(event.relatedTarget) ? event.relatedTarget : undefined)
}

/**
 * Focuses on a React component (if any).
 * @param  {?object} component
 */
export function focus(component)
{
	// If the component has been already unmounted.
	// (safety)
	if (!component) {
		return
	}

	if (typeof component.focus === 'function') {
		component.focus()
		return true
	}

	// `findDOMNode()` is deprecated in React.
	// https://reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage
	// // For cases when `<List.Item/>` wraps some custom
	// // `<Button/>` component which renders a generic `<button/>`.
	// const node = ReactDOM.findDOMNode(component)
	// if (node && node.focus) {
	// 	node.focus()
	// 	return true
	// }
}