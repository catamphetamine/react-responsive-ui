import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { flat as style } from 'react-styling'
import React_modal from 'react-modal'

import Button from './button'
import { get_scrollbar_width } from './misc/dom'

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

		// The modal title
		title            : PropTypes.string,

		// Modal content
		children         : PropTypes.node,

		// Resets the modal on close
		// (e.g. could reset edited form fields)
		reset            : PropTypes.func,

		// If set, the modal will have a "Cancel" button.
		cancel           : PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),

		// "Cancel" button label (if `cancel` is set)
		cancelLabel      : PropTypes.string.isRequired,

		// If set, the modal will have action buttons
		actions          : PropTypes.arrayOf
		(
			PropTypes.shape
			({
				// Action button `onClick` handler
				action : PropTypes.func,
				// Action button title
				text   : PropTypes.string
			})
		),

		// If set, the modal contents will be scrollable
		scroll           : PropTypes.bool,

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

		cancelLabel : 'Cancel',

		contentLabel : 'Popup',

		// When changing this also change
		// `.rrui__modal--could-not-close-because-busy`
		// css transition time accordingly
		could_not_close_because_busy_animation_duration: 1500 // ms
	}

	constructor()
	{
		super()

		this.on_request_close = this.on_request_close.bind(this)
		this.on_after_open    = this.on_after_open.bind(this)

		this.on_window_resize = this.on_window_resize.bind(this)
		this.closing          = this.closing.bind(this)

		this.close             = this.close.bind(this)
		this.close_if_not_busy = this.close_if_not_busy.bind(this)
	}

	// // https://github.com/reactjs/react-modal/issues/133
	// componentWillMount()
	// {
	// 	React_modal.setAppElement('body')
	// }

	componentDidMount()
	{
		window.addEventListener('resize', this.on_window_resize)
		this.on_window_resize()
	}

	// A modal umounts only when the user leaves a page
	componentWillUnmount()
	{
		window.removeEventListener('resize', this.on_window_resize)

		const { isOpen } = this.props

		if (isOpen)
		{
			this.closing()
		}
	}

	// Restore document scroll after modal is hidden
	componentWillUpdate(next_props)
	{
		const { isOpen } = this.props

		if (next_props.isOpen === false && isOpen === true)
		{
			this.closing()
		}
	}

	componentWillReceiveProps(next_props)
	{
		const { isOpen } = this.props

		if (isOpen && !next_props.isOpen)
		{
			const { reset, closeTimeout } = this.props

			// Reset modal after its closing animation finishes
			// (to avoid weird content jumping)
			// https://github.com/reactjs/react-modal/issues/214
			if (reset)
			{
				setTimeout(reset, closeTimeout)
			}
		}
	}

	render()
	{
		const
		{
			fullscreen,
			busy,
			isOpen,
			closeTimeout,
			contentLabel,
			title,
			cancel,
			actions,
			scroll,
			cancelLabel,
			children,
			style,
			className
		}
		= this.props

		const { could_not_close_because_busy } = this.state

		const markup =
		(
			<React_modal
				isOpen={ isOpen }
				onAfterOpen={ this.on_after_open }
				onRequestClose={ this.on_request_close }
				closeTimeoutMS={ closeTimeout }
				contentLabel={ contentLabel }
				style={ react_modal_style }
				overlayClassName={ classNames('rrui__modal__overlay',
				{
					'rrui__modal__overlay--busy'       : busy,
					'rrui__modal__overlay--fullscreen' : fullscreen
				}) }
				className={ classNames('rrui__modal__container', className,
				{
					'rrui__modal__container--fullscreen' : fullscreen
				}) }>

				<div
					style={ styles.vertical_container }
					className={ classNames('rrui__modal__vertical-container',
					{
						'rrui__modal__vertical-container--fullscreen' : fullscreen,

						// Strictly speaking it's not `.rrui__modal` but this CSS class name will do
						'rrui__modal--could-not-close-because-busy': could_not_close_because_busy
					}) }
					onClick={ this.on_request_close }>

					{/* Top padding, grows less than bottom padding */}
					<div
						style={ styles.vertical_padding }
						className={ classNames('rrui__modal__top-padding',
						{
							// CSS selector performance optimization
							'rrui__modal__top-padding--fullscreen' : fullscreen
						}) }
						onClick={ this.on_request_close }/>

					{/* Modal window title (with an optional close button) */}
					{ title &&
						<h1
							onClick={ this.block_event }
							className={ classNames('rrui__modal__header',
							{
								'rrui__modal__header--separated' : scroll
							}) }
							style={ styles.header }>

							{ title }

							{ this.render_close_button() }
						</h1>
					}

					{/* Modal window content */}
					<div
						className={ classNames('rrui__modal__content',
						{
							'rrui__modal__content--no-title'   : !title,
							'rrui__modal__content--no-actions' : !actions,
							'rrui__modal__content--fullscreen' : fullscreen
						}) }
						onClick={ this.block_event }
						style={ style ? { ...styles.content, ...style } : styles.content }>

						{ !title && this.render_close_button() }

						{ children }
					</div>

					{/* Modal window actions */}
					{ actions &&
						<div
							className={ classNames('rrui__modal__actions',
							{
								'rrui__modal__actions--separated' : scroll
							}) }
							onClick={ this.block_event }
							style={ styles.actions }>

							{/* Cancel button */}
							{ cancel &&
								<Button
									key="-1"
									disabled={ busy }
									action={ cancel === true ? this.close_if_not_busy : cancel }>
									{ cancelLabel }
								</Button>
							}

							{/* Other buttons ("Next", "OK", ...) */}
							{ actions.map((action, i) => (
								<Button
									key={ i }
									disabled={ busy }
									{ ...action }>
									{ action.text }
								</Button>
							)) }
						</div>
					}

					{/* Bottom padding, grows more than top padding */}
					<div
						style={ styles.vertical_padding }
						className={ classNames('rrui__modal__bottom-padding',
						{
							// CSS selector performance optimization
							'rrui__modal__bottom-padding--fullscreen' : fullscreen
						}) }
						onClick={ this.on_request_close }/>
				</div>
			</React_modal>
		)

		return markup
	}

	render_close_button()
	{
		const { closeButton, busy } = this.props

		if (!closeButton)
		{
			return
		}

		const markup =
		(
			<button
				onClick={ this.close }
				className={ classNames('rrui__modal__close',
				{
					'rrui__modal__close--busy' : busy
				}) }>
				{ closeButton }
			</button>
		)

		return markup
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
		const { cancel } = this.props

		// If the modal has an explicit "Cancel" button,
		// then allow closing it by hitting "Escape" key,
		// but don't close it on a click outside.
		if (cancel && event && event.type !== 'keydown')
		{
			return this.indicate_cannot_close()
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

		this.closing()

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
	closing()
	{
		const { closeTimeout, bodyOverflowX, bodyOverflowY, afterClose } = this.props

		setTimeout(() =>
		{
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
			const full_width_elements = Array.from(document.querySelectorAll('.rrui__fixed-full-width'))
			full_width_elements.push(document.body)

			// Adjust the width of all "full-width" elements back to their original value
			// now that the main (body) scrollbar is being restored.
			for (const element of full_width_elements)
			{
				element.style.marginRight = 0
			}

			// Restore the main (body) scrollbar
			document.body.style.overflowX = bodyOverflowX
			document.body.style.overflowY = bodyOverflowY
		},
		closeTimeout)
	}

	on_window_resize()
	{
		// Scrollbar is hidden when the modal is shown
		// in order to prevent the page behind the modal
		// from scrolling when the mouse wheel is scrolled.
		this.scrollbar_width = get_scrollbar_width()
	}

	block_event(event)
	{
		event.stopPropagation()
	}
}

const styles = style
`
	vertical_padding
		// Perhaps "width : 100%" was needed for it to work properly
		width       : 100%

		// Vertical padding won't ever shrink below the minimum size
		flex-shrink : 0

	content
		// Modal content will contract vertically showing a scrollbar
		flex-shrink : 1
		flex-basis  : auto
		overflow    : auto

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

	actions
		text-align : right
		// fixes display inline-block whitespaces causing scrollbar
		line-height : 0

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
	`
}