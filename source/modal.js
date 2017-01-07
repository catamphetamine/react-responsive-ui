import React, { PureComponent, PropTypes } from 'react'
import styler from 'react-styling'
import classNames from 'classnames'
// `react-modal` takes styles as an object of style objects,
// therefore not using `/flat` styler here.

import React_modal from 'react-modal'

import Button from './button'
import { get_scrollbar_width } from './misc/dom'

// when changing this also change
// your .rrui__modal--could-not-close-because-busy
// css transition times accordingly
const could_not_close_because_busy_animation_duration = 1500 // ms

export default class Modal extends PureComponent
{
	state = {}

	static propTypes =
	{
		// If `true` then the modal is shown
		shown            : PropTypes.bool.isRequired,

		// Closes the modal (must set the `shown` flag to `false`)
		close            : PropTypes.func.isRequired,

		// A time required for CSS hiding animation to complete
		// (150 milliseconds by default)
		closeTimeout     : PropTypes.number.isRequired,

		// Is called after the modal is shown
		afterOpen        : PropTypes.func,

		// Is called after the modal is closed
		afterClose       : PropTypes.func,

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

		// CSS class
		className        : PropTypes.string,

		// CSS style object
		style            : PropTypes.object
	}

	static defaultProps =
	{
		shown : false,

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
	}

	constructor(props, context)
	{
		super(props, context)

		this.on_request_close = this.on_request_close.bind(this)
		this.on_after_open    = this.on_after_open.bind(this)

		this.on_window_resize = this.on_window_resize.bind(this)
		this.closing          = this.closing.bind(this)

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

		if (this.props.shown)
		{
			this.closing()
		}
	}

	// Restore document scroll after modal is hidden
	componentWillUpdate(next_props)
	{
		if (next_props.shown === false && this.props.shown === true)
		{
			this.closing()
		}
	}

	componentWillReceiveProps(next_props)
	{
		if (this.props.shown && !next_props.shown)
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
			busy,
			shown,
			closeTimeout,
			contentLabel,
			title,
			cancel,
			actions,
			scroll,
			cancelLabel,
			children
		}
		= this.props

		const { could_not_close_because_busy } = this.state

		const markup =
		(
			<React_modal
				isOpen={shown}
				onAfterOpen={this.on_after_open}
				onRequestClose={this.on_request_close}
				closeTimeoutMS={closeTimeout}
				contentLabel={contentLabel}
				className={classNames('rrui__modal',
				{
					'rrui__modal--could-not-close-because-busy': could_not_close_because_busy
				})}
				style={busy ? style.modal_busy : style.modal}>

				<div style={style.content_wrapper} onClick={this.on_request_close}>
					{/* top padding, grows less than bottom padding */}
					<div
						style={style.vertical_padding}
						className="rrui__modal__padding--top"
						onClick={this.on_request_close}/>

					{/* dialog window title */}
					{title &&
						<h1
							onClick={this.block_event}
							className={classNames('rrui__modal__header',
							{
								'rrui__modal__header--separated': scroll
							})}
							style={style.header}>
							{title}
						</h1>
					}

					{/* dialog window content */}
					<div
						className={classNames('rrui__modal__content',
						{
							'rrui__modal__content--no-bars': !title
						})}
						onClick={this.block_event}
						style={ this.props.style ? { ...style.content, ...this.props.style } : style.content }>

						{this.content()}
					</div>

					{/* dialog window actions */}
					{actions &&
						<div
							className={classNames('rrui__modal__actions',
							{
								'rrui__modal__actions--separated': scroll
							})}
							onClick={this.block_event}
							style={style.actions}>

							{/* Cancel button */}
							{cancel &&
								<Button
									key="-1"
									disabled={busy}
									action={cancel === true ? this.close_if_not_busy : cancel}>
									{cancelLabel}
								</Button>
							}

							{/* Other buttons ("Next", "OK", ...) */}
							{actions.map((action, i) => <Button key={i} disabled={busy} {...action}>{action.text}</Button>)}
						</div>
					}

					{/* bottom padding, grows more than top padding */}
					<div
						style={style.vertical_padding}
						className="rrui__modal__padding--bottom"
						onClick={this.on_request_close}/>
				</div>
			</React_modal>
		)

		return markup
	}

	content()
	{
		const { children } = this.props

		// if (React.Children.count(children) === 1)
		// {
		// 	return React.cloneElement(React.Children.only(children),
		// 	{
		// 	})
		// }

		return children
	}

	// Play "cannot close" animation on the modal
	indicate_cannot_close()
	{
		if (!this.state.could_not_close_because_busy)
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
		// allow closing it by hitting "Escape" key,
		// then don't close it on a click outside.
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

	// This solution may break a bit when a user resizes the browser window
	on_after_open()
	{
		const { afterOpen } = this.props

		document.body.style.marginRight = this.scrollbar_width + 'px'
		document.body.style.overflow    = 'hidden'

		// If the user scrolled on a previously shown react-modal,
		// then reset that previously scrolled position.
		document.querySelector('.ReactModal__Overlay').scrollTop = 0

		if (afterOpen)
		{
			afterOpen({ scrollbarWidth: this.scrollbar_width })
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

			document.body.style.marginRight = 0
			document.body.style.overflowX   = bodyOverflowX
			document.body.style.overflowY   = bodyOverflowY
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

// https://material.google.com/components/dialogs.html
const style = styler
`
	vertical_padding
		width : 100%
		flex-shrink : 0
		flex-grow   : 1

	content
		display : inline-block

		flex-grow   : 0
		flex-shrink : 1
		flex-basis  : auto
		overflow    : auto

	header, actions
		flex-grow   : 0
		flex-shrink : 0
		flex-basis  : auto

		margin : 0
		width  : 100%

		box-sizing: border-box

	actions
		text-align : right
		// fixes display inline-block whitespaces causing scrollbar
		line-height : 0

	// вместо использования этого content_wrapper'а
	// можно было бы использовать то же самое на modal.content,
	// но тогда этот слой займёт весь экран, а в react-modal
	// на него вешается onClick со stopPropagation,
	// поэтому клики слева и справа не будут закрывать окошко.
	content_wrapper
		display        : flex
		flex-direction : column
		align-items    : center
		height         : 100%

	// react-modal takes styles as an object of style objects
	modal
		overlay
			height     : 1px
			min-height : 100%

			text-align : center
			// fixes display inline-block whitespaces causing scrollbar
			line-height : 0

			background-color: rgba(0, 0, 0, 0.2)

		content
			// position : static
			height : 100%

			// top    : auto
			// left   : auto
			// right  : auto
			// bottom : auto

			text-align : left

			// margin-left  : auto
			// margin-right : auto

			padding : 0
			border : none
			background-color: transparent

			// вместо обойтись этим и не использовать content_wrapper,
			// но тогда этот слой займёт весь экран, а в react-modal
			// на него вешается onClick со stopPropagation,
			// поэтому клики на нём не будут закрывать окошко.
			//
			// display        : flex
			// flex-direction : column
			// align-items    : center

			// alternative centering (not using flexbox)
			// top                   : 50%
			// left                  : 50%
			// right                 : auto
			// bottom                : auto
			// margin-right          : -50%
			// transform             : translate(-50%, -50%)

			// // centering
			// display      : table
			// margin-left  : auto
			// margin-right : auto

			display: inline-block
			line-height: normal

			// content_cell
			// 	// // centering
			// 	// display : table-cell
			// 	height  : 100%
`

style.modal_busy =
{
	overlay: { ...style.modal.overlay, cursor: 'wait' },
	content: style.modal.content
}
