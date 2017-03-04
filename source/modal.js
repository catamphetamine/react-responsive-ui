import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { flat as style } from 'react-styling'

import React_modal from './react-modal'
import Button from './button'
import Form from './form'

export default class Modal extends PureComponent
{
	state = {}

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

		// When changing this also change
		// `.rrui__modal--could-not-close-because-busy`
		// css transition time accordingly
		could_not_close_because_busy_animation_duration: 1500 // ms
	}

	static childContextTypes =
	{
		rrui__modal : PropTypes.object
	}

	constructor()
	{
		super()

		this.on_request_close  = this.on_request_close.bind(this)
		this.on_after_open     = this.on_after_open.bind(this)
		this.closed            = this.closed.bind(this)
		this.close             = this.close.bind(this)
		this.close_if_not_busy = this.close_if_not_busy.bind(this)
		this.register_form     = this.register_form.bind(this)
		this.unregister_form   = this.unregister_form.bind(this)
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

	// A modal umounts only when the user leaves a page
	componentWillUnmount()
	{
		const { isOpen } = this.props

		if (isOpen)
		{
			this.closed()
		}
	}

	render()
	{
		const
		{
			busy,
			fullscreen,
			isOpen,
			closeTimeout,
			contentLabel,
			title,
			actions,
			className
		}
		= this.props

		const markup =
		(
			<React_modal
				isOpen={ isOpen }
				onAfterOpen={ this.on_after_open }
				onRequestClose={ this.on_request_close }
				onAfterClose={ this.closed }
				closeTimeoutMS={ closeTimeout }
				contentLabel={ contentLabel }
				style={ react_modal_style }
				overlayClassName={ classNames('rrui__modal__overlay',
				{
					'rrui__modal__overlay--busy'       : busy,
					'rrui__modal__overlay--fullscreen' : fullscreen
				}) }
				className={ classNames('rrui__modal__container',
				{
					'rrui__modal__container--fullscreen' : fullscreen
				}) }>

				{/* Top margin, grows less than bottom margin */}
				<div
					style={ styles.vertical_margin }
					className={ classNames('rrui__modal__vertical-margin', 'rrui__modal__vertical-margin--top',
					{
						// CSS selector performance optimization
						'rrui__modal__vertical-margin--fullscreen' : fullscreen
					}) }
					onClick={ this.on_request_close }/>

				{/* Modal window content */}

				{ this.render_content() }

				{/* Bottom margin, grows more than top margin */}
				<div
					style={ styles.vertical_margin }
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

	render_content()
	{
		const
		{
			closeLabel,
			busy,
			fullscreen,
			children,
			className,
			style
		}
		= this.props

		const
		{
			could_not_close_because_busy,
			form
		}
		= this.state

		return (
			<div
				ref={ ref => this.content = ref }
				className={ classNames('rrui__modal__content',
				{
					// CSS selector performance optimization
					'rrui__modal__content--fullscreen' : fullscreen,

					// Strictly speaking it's not `.rrui__modal` but this CSS class name will do
					'rrui__modal--could-not-close-because-busy': could_not_close_because_busy
				}) }
				style={ styles.content }>

				<div
					className={ classNames('rrui__modal__content-body', className) }
					style={ style }>

					{ this.render_close_button() }

					{ children }

					{ closeLabel && !form &&
						<div className="rrui__form__actions">
							<Button
								className={ classNames('rrui__modal__close', 'rrui__modal__close--bottom') }
								action={ this.close_if_not_busy }>
								{ closeLabel }
							</Button>
						</div>
					}
				</div>
			</div>
		)
	}

	render_close_button()
	{
		const { closeButton, busy, cancel } = this.props

		if (!closeButton)
		{
			return
		}

		const markup =
		(
			<button
				onClick={ this.close }
				className={ classNames('rrui__modal__close', 'rrui__modal__close--top',
				{
					'rrui__modal__close--busy' : busy
				}) }>
				{ closeButton }
			</button>
		)

		return markup
	}

	register_form()
	{
		this.setState({ form: true })
	}

	unregister_form()
	{
		this.setState({ form: false })
	}

	// Play "cannot close" animation on the modal
	indicate_cannot_close()
	{
		const { could_not_close_because_busy_animation_duration } = this.props
		const { could_not_close_because_busy } = this.state

		if (!could_not_close_because_busy)
		{
			setTimeout(() =>
			{
				this.setState({ could_not_close_because_busy: false })
			},
			// Give it a bit of extra time to finish the CSS animation
			could_not_close_because_busy_animation_duration * 1.1)

			this.setState({ could_not_close_because_busy: true })
		}
	}

	// Public API method
	close()
	{
		this.close_if_not_busy()
	}

	on_request_close(event)
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
			return false
		}

		this.close_if_not_busy()
	}

	close_if_not_busy()
	{
		const { busy, close, closeTimeout, reset } = this.props

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
	on_after_open()
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
		const full_width_elements = Array.from(document.querySelectorAll('.rrui__fixed-full-width'))
		full_width_elements.push(document.body)

		// Adjust the width of all "full-width" elements
		// so that they don't expand by the width of the (now absent) scrollbar
		for (const element of full_width_elements)
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
	closed()
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
		const full_width_elements = Array.from(document.querySelectorAll('.rrui__fixed-full-width'))
		full_width_elements.push(document.body)

		// Adjust the width of all "full-width" elements back to their original value
		// now that the main (body) scrollbar is being restored.
		for (const element of full_width_elements)
		{
			element.style.marginRight = 0
		}

		// Restore the main (body) scrollbar.
		document.body.style.overflowX = bodyOverflowX
		document.body.style.overflowY = bodyOverflowY
	}
}

const styles = style
`
	vertical_margin
		// Perhaps "width : 100%" was needed for it to work properly
		width       : 100%

		// Vertical padding won't ever shrink below the minimum size
		flex-shrink : 0

	content
		// Modal content will contract vertically
		flex-shrink : 1
		flex-basis  : auto
		// Will show a scrollbar not inside conent but rather on the overlay
		// overflow    : auto
		// box-sizing  : border-box

	header, actions
		// No vertical growing or shrinking for header and actions
		flex-grow   : 0
		flex-shrink : 0
		flex-basis  : auto

		margin : 0
		// Stretch header and actions to the full width of the modal content
		width  : 100%

		// Padding will be included in "width : 100%"
		box-sizing : border-box

	// actions
	// 	text-align : right
	// 	// fixes display inline-block whitespaces causing scrollbar
	// 	line-height : 0

	// Вместо использования этого vertical_container'а
	// можно было бы использовать то же самое на modal.content,
	// но тогда этот слой займёт весь экран, а в react-modal
	// на него вешается onClick со stopPropagation,
	// поэтому клики слева и справа не будут закрывать окошко.
	vertical_container
		display        : flex
		flex-direction : column
		height         : 100%
`

const react_modal_style =
{
	overlay : style
	`
		position : fixed
		left     : 0
		top      : 0
		right    : 0
		bottom   : 0
		// Will show a scrollbar in case of modal content overflowing viewport height
		overflow : auto
	`
}