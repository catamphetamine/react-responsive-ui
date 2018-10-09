import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import ReactModal from 'react-modal'
import createContext from 'create-react-context'
import { polyfill as reactLifecyclesCompat } from 'react-lifecycles-compat'

import Form from './Form'
import Button from './Button'
import Close, { CloseIcon } from './Close'

export const ModalContext = createContext()

// Make sure to add `.rrui__fixed-full-width` CSS class
// to all full-width `position: fixed` elements.
// Such elements must not be `width: 100%`
// but rather `width: auto` or `left: 0; right: 0;`.
class Modal extends Component
{
	static propTypes =
	{
		// If `true` then the modal is shown
		isOpen           : PropTypes.bool.isRequired,

		// Closes the modal (must set the `isOpen` flag to `false`)
		close            : PropTypes.func.isRequired,

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

		// If `wait` is `true` then the modal
		// won't close on click-out or Escape
		// and will show spinner on the overlay.
		wait            : PropTypes.bool,

		// (deprecated)
		// (use `wait` instead)
		// If `busy` is `true` then the modal
		// won't close on click-out or Escape
		// and will show spinner on the overlay.
		busy            : PropTypes.bool,

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

		// An optional close button icon (like a cross).
		// Set to `true` to show the default "cross" icon.
		closeButtonIcon  : PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf([true])]),

		// If set to `false` will prevent modal contents
		// from being unmounted when the modal is closed.
		unmount          : PropTypes.bool.isRequired,

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

		bodyOverflowX : 'auto',
		// Prevents document width from jumping due to the
		// vertical scrollbar appearance/disappearance
		bodyOverflowY : 'scroll',

		// when changing this also change
		// your .ReactModal__Overlay and .ReactModal__Content
		// css transition times accordingly
		closeTimeout : 150, // ms

		contentLabel : 'Popup',

		// Modal contents are unmounted when the modal is closed by default
		unmount : true,

		// When changing this also change
		// `.rrui__modal--could-not-close-because-busy`
		// css transition time accordingly
		could_not_close_because_busy_animation_duration: 600 // ms
	}

	constructor(props)
	{
		super(props)

		this.state =
		{
			// Using a counter instead of a boolean here
			// because a new form may be mounted before the old one is unmounted.
			// (React reconciliation algorythm implementation details)
			form : 0,

			context:
			{
				closeLabel     : this.props.closeLabel,
				closeIfNotBusy : this.closeIfNotBusy,
				registerForm   : this.registerForm,
				unregisterForm : this.unregisterForm
			}
		}
	}

	componentDidUpdate(prevProps, prevState)
	{
		const { unmount, isOpen } = this.props

		// If prevent `<Modal/>` contents
		// from being unmounted upon close.
		if (!unmount)
		{
			// If has been opened.
			if (!prevProps.isOpen && isOpen)
			{
				this.on_after_open()
			}
			// If has been closed.
			else if (prevProps.isOpen && !isOpen)
			{
				this.on_after_close()
				this.reset_content_scroll()
			}
		}
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

		clearTimeout(this.could_not_close_because_busy_animation_timeout)
		this.could_not_close_because_busy_animation_timeout = undefined
	}

	storeContentInstance = (ref) => this.content = ref

	render()
	{
		const
		{
			wait,
			busy,
			fullscreen,
			isOpen,
			closeTimeout,
			contentLabel,
			title,
			closeLabel,
			closeButtonIcon,
			actions,
			unmount,
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

		return (
			<ReactModal
				isOpen={ unmount ? isOpen : true }
				onAfterOpen={ unmount ? this.on_after_open : undefined }
				onRequestClose={ this.on_request_close }
				closeTimeoutMS={ closeTimeout }
				contentLabel={ contentLabel }
				ariaHideApp={ false }
				style={ react_modal_style }
				overlayClassName={ classNames('rrui__modal__overlay',
				{
					'rrui__modal__overlay--busy'       : wait || busy,
					'rrui__modal__overlay--fullscreen' : fullscreen,
					'rrui__modal__overlay--hidden'     : !unmount && !isOpen
				},
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

				<ModalContext.Provider value={ this.state.context }>
					<ModalContent
						ref={ this.storeContentInstance }
						closeLabel={ closeLabel }
						closeButtonIcon={ closeButtonIcon }
						close={ this.closeIfNotBusy }
						style={ style }
						className={ className }
						fullscreen={ fullscreen }
						could_not_close_because_busy={ could_not_close_because_busy }
						containsForm={ form > 0 }
						wait={ wait || busy }
						reset={ this.on_after_close }>
						{ children }
					</ModalContent>
				</ModalContext.Provider>

				{/* Bottom margin, grows more than top margin */}
				<div
					className={ classNames('rrui__modal__vertical-margin', 'rrui__modal__vertical-margin--bottom',
					{
						// CSS selector performance optimization
						'rrui__modal__vertical-margin--fullscreen' : fullscreen
					}) }
					onClick={ this.on_request_close }/>
			</ReactModal>
		)
	}

	registerForm = () =>
	{
		// Using a counter instead of a boolean here
		// because a new form may be mounted before the old one is unmounted.
		// (React reconciliation algorythm implementation details)
		this.setState(({ form }) => ({ form: form + 1 }))
	}

	unregisterForm = () =>
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
			// Focus on `<ReactModal/>` element.
			return this.content.focus()
		}

		this.closeIfNotBusy()
	}

	closeIfNotBusy = () =>
	{
		const { wait, busy, close, closeTimeout } = this.props

		// For weird messed development mode cases
		if (this.unmounted)
		{
			return
		}

		// Don't close the modal if it's busy
		if (wait || busy)
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

	// If the user scrolled on a previously shown react-modal,
	// then reset that previously scrolled position.
	reset_content_scroll()
	{
		document.querySelector('.ReactModal__Overlay').scrollTop = 0
	}

	// Hides the main (body) scrollbar upon showing a modal
	// and also adjusts the width of all "full-width" elements
	// so that they don't expand no that the scrollbar is absent.
	//
	// This doesn't account for window resizes
	// but since my body is always `overflow: visible` (a good practice)
	// there's no difference and it should work in any scenario.
	//
	adjust_scrollbar_after_open()
	{
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

		document.body.removeChild(div)

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

		this.reset_content_scroll()
	}

	on_after_open = () =>
	{
		const { afterOpen } = this.props

		this.adjust_scrollbar_after_open()

		if (afterOpen)
		{
			afterOpen()
		}
	}

	// Restores original `document` scrollbar.
	adjust_scrollbar_after_close()
	{
		const
		{
			bodyOverflowX,
			bodyOverflowY
		}
		= this.props

		// All "full-width" elements will need their
		// width to be restored back to the original value
		// now that the main (body) scrollbar is being restored.

		// "full-width" elements include `document.body`
		// and all `position: fixed` elements
		// which should be marked with this special CSS class.
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

	// Restores original `document` scrollbar
	// and resets the modal content (e.g. a form)
	on_after_close = () =>
	{
		const
		{
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

		this.adjust_scrollbar_after_close()
	}

	static getDerivedStateFromProps(props, state)
	{
		if (props.closeLabel !== state.context.closeLabel)
		{
			return {
				...state,
				context:
				{
					...state.context,
					closeLabel : props.closeLabel
				}
			}
		}

		return null
	}
}

class ModalContent extends Component
{
	focus()
	{
		this.node.focus()
	}

	componentWillUnmount()
	{
		const { reset } = this.props

		if (reset) {
			reset()
		}
	}

	transformChildren()
	{
		const
		{
			closeLabel,
			closeButtonIcon,
			close,
			containsForm,
			children
		}
		= this.props

		let closeButtonAdded = false
		return React.Children.map(children, (element) =>
		{
			if (closeButtonIcon && !closeButtonAdded)
			{
				if (element.type === ModalTitleType || element.type === ModalContentType)
				{
					closeButtonAdded = true
					return React.cloneElement(element,
					{
						closeButton : this.render_close_button()
					})
				}
			}

			if (!closeButtonIcon && closeLabel && !containsForm && element.type === Modal.Actions)
			{
				return React.cloneElement(element,
				{
					closeButton: (
						<Button
							className={ classNames('rrui__modal__close', 'rrui__modal__close--bottom') }
							action={ close }>
							{ closeLabel }
						</Button>
					)
				})
			}

			return element
		})
	}

	storeNode = (ref) => this.node = ref

	render()
	{
		const
		{
			fullscreen,
			className,
			style,
			could_not_close_because_busy
		}
		= this.props

		return (
			<div
				ref={ this.storeNode }
				className={ classNames('rrui__modal__contents',
				{
					// CSS selector performance optimization
					'rrui__modal__contents--fullscreen' : fullscreen,

					// Strictly speaking it's not `.rrui__modal` but this CSS class name will do
					'rrui__modal--could-not-close-because-busy': could_not_close_because_busy
				},
				className) }
				style={ style }>

				{ this.transformChildren() }
			</div>
		)
	}

	render_close_button()
	{
		const
		{
			closeLabel,
			closeButtonIcon,
			close,
			wait
		}
		= this.props

		const CloseButtonIcon = closeButtonIcon === true ? CloseIcon : closeButtonIcon;

		if (!CloseButtonIcon)
		{
			return null
		}

		return (
			<Close
				onClick={ close }
				closeLabel={ closeLabel }
				className={ classNames('rrui__modal__close', 'rrui__modal__close--top',
				{
					'rrui__modal__close--busy' : wait
				}) }>
				<CloseButtonIcon/>
			</Close>
		)
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
	// `Array.from` requires ES6 polyfill.
	// const full_width_elements = Array.from(document.querySelectorAll('.rrui__fixed-full-width'))
	const full_width_elements = [].slice.call(document.querySelectorAll('.rrui__fixed-full-width'))
	full_width_elements.push(document.body)
	return full_width_elements
}

const Title = ({ closeButton, className, children, ...rest }) => (
	<h2
		className={classNames('rrui__modal__title', className, {
			'rrui__modal__title--close-button' : closeButton
		})}
		{...rest}>
		{closeButton && <span className="rrui__modal__title-itself">{children}</span>}
		{!closeButton && children}
		{closeButton}
	</h2>
)

const Content = ({ closeButton, className, children, ...rest }) => (
	<div
		className={classNames('rrui__modal__content', className, {
			'rrui__modal__content--close-button' : closeButton
		})}
		{...rest}>
		{closeButton && <div className="rrui__modal__content-itself">{children}</div>}
		{!closeButton && children}
		{closeButton}
	</div>
)

const Actions = ({ closeButton, children }) => (
	<div className="rrui__modal__actions">
		{closeButton}
		{children}
	</div>
)

// Workaround for `react-hot-loader`.
// https://github.com/gaearon/react-hot-loader#checking-element-types
const ModalTitleType = <Title/>.type
const ModalContentType = <Content/>.type

Modal = reactLifecyclesCompat(Modal)

Modal.Title = Title
Modal.Content = Content
Modal.Actions = Actions

export default Modal