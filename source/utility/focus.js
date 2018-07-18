import { isInternetExplorer } from './dom'

export function onBlur(event, onFocusOut, getComponentNode, getComponentNode2, preventBlur)
{
	function _onBlur(focusedNode)
	{
		if (preventBlur)
		{
			if (preventBlur() === true)
			{
				return
			}
		}

		// If the currently focused element is inside the expandable
		// then don't collapse it.
		if (focusedNode && (
			getComponentNode().contains(focusedNode)
			|| (getComponentNode2 && getComponentNode2().contains(focusedNode))
		))
		{
			return
		}

		// Collapse the expandable.
		// (clicked/tapped outside or tabbed-out)
		onFocusOut()
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
	if (isInternetExplorer())
	{
		return setTimeout(() => getComponentNode() && _onBlur(document.activeElement), 30)
	}

	_onBlur(event.relatedTarget)
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
		return component.focus()
	}
}