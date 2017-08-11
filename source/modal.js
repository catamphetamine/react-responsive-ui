import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import React_modal from 'react-modal'

import Button from './button'
import Form from './form'

// Make sure to add `.rrui__fixed-full-width` CSS class
// to all full-width `position: fixed` elements.
// Such elements must not be `width: 100%`
// but rather `width: auto` or `left: 0; right: 0;`.
export default class Modal extends PureComponent
{
	state =
	{
		// Using a counter instead of a boolean here
		// because a new form may be mounted before the old one is unmounted.
		// (React reconciliation algorythm implementation details)
		form : 0
	}

	static propTypes =
	{
		// If `true` then the modal is shown
		isOpen           : PropTypes.bool.isRequired,

		// Closes the modal (must set the `isOpen` flag to `false`)
		close            : PropTypes.func.isRequired,

		// Hide vs close if true hide the model rather than close it
		hide       			 : PropTypes.bool,

		// A time required for CSS hiding animation to complete
		// (150 milliseconds by default)
		closeTimeout     : PropTypes.number.isRequired,

		// Is called after the modal is shown
		afterOpen        : PropTypes.func,

		// Is called after the modal is closed
		afterClose       : PropTypes.func,

		// Enters fullscreen mode
		fullscreen       : PropTypes.bool,

		// Modal content
		children         : PropTypes.node,

		// Resets the modal on close
		// (e.g. could reset edited form fields)
		reset            : PropTypes.func,

		// "Cancel" button label.
		// If set, the modal will have a "Cancel" button.
		// (only if `<Form.Actions/>` is found in content)
		closeLabel       : PropTypes.string,

		// The default `overflow-x` of the <body/>.
		// Is `auto` by default.
		bodyOverflowX    : PropTypes.string.isRequired,

		// The default `overflow-x` of the <body/>.
		// Is `scroll` by default
		// (which is better than `auto`
		//  because the document width won't be jumpy
		//  while navigating the website —
		//  it will be consistent across all pages)
		bodyOverflowY    : PropTypes.string.isRequired,

		// `aria-label` for the modal.
		// (is "Popup" by default)
		contentLabel     : PropTypes.string.isRequired,

		// An optional close button (like a cross).
		// This is not actually a "button"
		// but instead "button contents",
		// i.e. `closeButton` will be wrapped with a `<button/>`.
		closeButton      : PropTypes.node,

		// Internal property
		could_not_close_because_busy_animation_duration : PropTypes.number.isRequired,

		// CSS class for overlay (e.g. for fullscreen modal background color)
		overlayClassName : PropTypes.string,

		// CSS class
		className        : PropTypes.string,

		// CSS style object
		style            : PropTypes.object
	}

	static defaultProps =
	{
		isOpen : false,

		hide : false,

		bodyOverflowX : 'auto',
		// Prevents document width from jumping due to the
		// vertical scrollbar appearance/disappearance
		bodyOverflowY : 'scroll',

		// when changing this also change
		// your .ReactModal__Overlay and .ReactModal__Content
		// css transition times accordingly
		closeTimeout : 150, // ms

		contentLabel : 'Popup',

		// When changing this also change
		// `.rrui__modal--could-not-close-because-busy`
		// css transition time accordingly
		could_not_close_because_busy_animation_duration: 600 // ms
	}

	static childContextTypes =
	{
		rrui__modal : PropTypes.object
	}

	getChildContext()
	{
		const
		{
			closeLabel
		}
		= this.props

		const context =
		{
			rrui__modal:
			{
				closeLabel,
				close_if_not_busy : this.close_if_not_busy,
				register_form     : this.register_form,
				unregister_form   : this.unregister_form
			}
		}

		return context
	}

	// A modal itself umounts only when the user leaves a page,
	// so in a "Single Page Application", for example,
	// if this was a regular popup and a user could still navigate
	// away via a hyperlink then this code becomes neccessary.
	componentWillUnmount()
	{
		const { isOpen } = this.props

		this.unmounted = true

		// If the modal is still open
		// while a user navigates away
		// then "close" it properly
		// (restore the document scrollbars, etc).
		if (isOpen)
		{
			this.on_after_close()
		}

		if (this.could_not_close_because_busy_animation_timeout)
		{
			clearTimeout(this.could_not_close_because_busy_animation_timeout)
			this.could_not_close_because_busy_animation_timeout = undefined
		}
	}

	render()
	{
		const
		{
			busy,
			fullscreen,
			isOpen,
			hide,
			closeTimeout,
			contentLabel,
			title,
			closeLabel,
			closeButton,
			actions,
			style,
			className,
			overlayClassName,
			children
		}
		= this.props

		const
		{
			could_not_close_because_busy,
			form
		}
		= this.state

		const hideStyle = {
			hide: !isOpen
		};

		const markup =
		(
			<React_modal
				isOpen={ !hide ? isOpen : true }
				onAfterOpen={ this.on_after_open }
				onRequestClose={ this.on_request_close }
				closeTimeoutMS={ closeTimeout }
				contentLabel={ contentLabel }
				style={ react_modal_style }
				overlayClassName={ classNames('rrui__modal__overlay',
				{
					'rrui__modal__overlay--busy'       : busy,
					'rrui__modal__overlay--fullscreen' : fullscreen,
				},
				hide ? hideStyle : null,
				overlayClassName) }
				className={ classNames('rrui__modal__container',
				{
					'rrui__modal__container--fullscreen' : fullscreen
				}) }>

				{/* Top margin, grows less than bottom margin */}
				<div
					className={ classNames('rrui__modal__vertical-margin', 'rrui__modal__vertical-margin--top',
					{
						// CSS selector performance optimization
						'rrui__modal__vertical-margin--fullscreen' : fullscreen
					}) }
					onClick={ this.on_request_close }/>

				{/* Modal window content */}

				<Modal_content
					ref={ ref => this.content = ref }
					closeLabel={ closeLabel }
					closeButton={ closeButton }
					close={ this.close_if_not_busy }
					style={ style }
					className={ className }
					fullscreen={ fullscreen }
					could_not_close_because_busy={ could_not_close_because_busy }
					form={ form }
					busy={ busy }
					reset={ this.on_after_close }>
					{ children }
				</Modal_content>

				{/* Bottom margin, grows more than top margin */}
				<div
					className={ classNames('rrui__modal__vertical-margin', 'rrui__modal__vertical-margin--bottom',
					{
						// CSS selector performance optimization
						'rrui__modal__vertical-margin--fullscreen' : fullscreen
					}) }
					onClick={ this.on_request_close }/>
			</React_modal>
		)

		return markup
	}

	register_form = () =>
	{
		// Using a counter instead of a boolean here
		// because a new form may be mounted before the old one is unmounted.
		// (React reconciliation algorythm implementation details)
		this.setState(({ form }) => ({ form: form + 1 }))
	}

	unregister_form = () =>
	{
		if (this.unmounted)
		{
			return
		}

		// Using a counter instead of a boolean here
		// because a new form may be mounted before the old one is unmounted.
		// (React reconciliation algorythm implementation details)
		this.setState(({ form }) => ({ form: form - 1 }))
	}

	// Play "cannot close" animation on the modal
	indicate_cannot_close()
	{
		const { could_not_close_because_busy_animation_duration } = this.props
		const { could_not_close_because_busy } = this.state

		if (!could_not_close_because_busy)
		{
			this.could_not_close_because_busy_animation_timeout = setTimeout(() =>
			{
				this.could_not_close_because_busy_animation_timeout = undefined
				this.setState({ could_not_close_because_busy: false })
			},
			// Give it a bit of extra time to finish the CSS animation
			could_not_close_because_busy_animation_duration * 1.1)

			this.setState({ could_not_close_because_busy: true })
		}
	}

	on_request_close = (event) =>
	{
		const { closeLabel } = this.props
		const { form } = this.state

		// If the modal has an explicit "Cancel" button,
		// then allow closing it by hitting "Escape" key,
		// but don't close it on a click outside.
		// (because a user wouldn't want to loose form data due to a misclick)
		if (closeLabel && form && event && event.type !== 'keydown')
		{
			this.indicate_cannot_close()
			return ReactDOM.findDOMNode(this.content).parentNode.focus()
		}

		this.close_if_not_busy()
	}

	close_if_not_busy = () =>
	{
		const { busy, close, closeTimeout } = this.props

		// For weird messed development mode cases
		if (this.unmounted)
		{
			return
		}

		// Don't close the modal if it's busy
		if (busy)
		{
			return this.indicate_cannot_close()
		}

		// Abruptly end "couldn't close" animation to make room for closing animation
		this.setState({ could_not_close_because_busy: false })

		// Close the modal
		if (close)
		{
			close()
		}
	}

	// Hides the main (body) scrollbar upon showing a modal
	// and also adjusts the width of all "full-width" elements
	// so that they don't expand no that the scrollbar is absent.
	//
	// This doesn't account for window resizes
	// but since my body is always `overflow: visible` (a good practice)
	// there's no difference and it should work in any scenario.
	//
	on_after_open = () =>
	{
		const { afterOpen } = this.props

		// A dummy `<div/>` to measure
		// the difference in width
		// needed for the "full-width" elements
		// after the main (body) scrollbar is deliberately hidden.
		const div = document.createElement('div')
		div.style.position = 'fixed'
		div.style.left     = 0
		div.style.right    = 0
		document.body.appendChild(div)

		// Calculate the width of the dummy `<div/>`
		// before the main (body) scrollbar is deliberately hidden.
		const width_before = div.clientWidth

		// Hide the main (body) scrollbar
		// so that when a user scrolls in an open modal
		// this `scroll` event doesn't go through
		// and scroll the main page.
		document.body.style.overflow = 'hidden'

		// All "full-width" elements will need their
		// width to be adjusted by this amount
		// because of the now-hidden main (body) scrollbar

		// Calculate the width of the dummy `<div/>`
		// after the main (body) scrollbar is deliberately hidden.
		const width_adjustment = div.clientWidth - width_before

		// "full-width" elements include `document.body`
		// and all `position: fixed` elements
		// which should be marked with this special CSS class.
		//
		// Make sure to add `.rrui__fixed-full-width` CSS class
		// to all full-width `position: fixed` elements.
		// Such elements must not be `width: 100%`
		// but rather `width: auto` or `left: 0; right: 0;`.
		//
		// Adjusts the width of all "full-width" elements
		// so that they don't expand by the width of the (now absent) scrollbar
		//
		for (const element of get_full_width_elements())
		{
			element.style.marginRight = width_adjustment + 'px'
		}

		// If the user scrolled on a previously shown react-modal,
		// then reset that previously scrolled position.
		document.querySelector('.ReactModal__Overlay').scrollTop = 0

		if (afterOpen)
		{
			afterOpen()
		}
	}

	// Restore original `document` scrollbar
	// and reset the modal content (e.g. a form)
	on_after_close = () =>
	{
		const
		{
			bodyOverflowX,
			bodyOverflowY,
			afterClose,
			reset
		}
		= this.props

		if (reset)
		{
			reset()
		}

		if (afterClose)
		{
			afterClose()
		}

		// All "full-width" elements will need their
		// width to be restored back to the original value
		// now that the main (body) scrollbar is being restored.

		// "full-width" elements include `document.body`
		// and all `position: fixed` elements
		// which should be marked with this special CSS class.
		// (`Array.from` is transpiled by Babel)
		//
		// Make sure to add `.rrui__fixed-full-width` CSS class
		// to all full-width `position: fixed` elements.
		// Such elements must not be `width: 100%`
		// but rather `width: auto` or `left: 0; right: 0;`.
		//
		// Adjusts the width of all "full-width" elements back to their original value
		// now that the main (body) scrollbar is being restored.
		//
		for (const element of get_full_width_elements())
		{
			element.style.marginRight = 0
		}

		// Restore the main (body) scrollbar.
		document.body.style.overflowX = bodyOverflowX
		document.body.style.overflowY = bodyOverflowY
	}
}

class Modal_content extends PureComponent
{
	componentWillUnmount()
	{
		const { reset } = this.props

		if (reset)
		{
			reset()
		}
	}

	render()
	{
		const
		{
			closeLabel,
			close,
			fullscreen,
			children,
			className,
			style,
			form,
			could_not_close_because_busy
		}
		= this.props

		const markup =
		(
			<div
				className={ classNames('rrui__modal__content',
				{
					// CSS selector performance optimization
					'rrui__modal__content--fullscreen' : fullscreen,

					// Strictly speaking it's not `.rrui__modal` but this CSS class name will do
					'rrui__modal--could-not-close-because-busy': could_not_close_because_busy
				},
				className) }
				style={ style }>

				<div className="rrui__modal__content-body">

					{ this.render_close_button() }

					{ children }

					{ closeLabel && !form &&
						<div className="rrui__form__actions">
							<Button
								className={ classNames('rrui__modal__close', 'rrui__modal__close--bottom') }
								action={ close }>
								{ closeLabel }
							</Button>
						</div>
					}
				</div>
			</div>
		)

		return markup
	}

	render_close_button()
	{
		const { closeButton, close, busy } = this.props

		if (!closeButton)
		{
			return
		}

		const markup =
		(
			<button
				onClick={ close }
				className={ classNames('rrui__modal__close', 'rrui__modal__close--top',
				{
					'rrui__modal__close--busy' : busy
				}) }>
				{ closeButton }
			</button>
		)

		return markup
	}
}

const react_modal_style =
{
	overlay:
	{
		position : 'fixed',
		left     : 0,
		top      : 0,
		right    : 0,
		bottom   : 0,
		// Will show a scrollbar in case of modal content overflowing viewport height
		overflow : 'auto'
	}
}

// "full-width" elements include `document.body`
// and all `position: fixed` elements
// which should be marked with this special CSS class.
//
// Make sure to add `.rrui__fixed-full-width` CSS class
// to all full-width `position: fixed` elements.
// Such elements must not be `width: 100%`
// but rather `width: auto` or `left: 0; right: 0;`.
//
function get_full_width_elements()
{
	// (`Array.from` is transpiled by Babel)
	const full_width_elements = Array.from(document.querySelectorAll('.rrui__fixed-full-width'))
	full_width_elements.push(document.body)
	return full_width_elements
}