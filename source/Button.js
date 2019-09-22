import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import ActivityIndicator from './ActivityIndicator'
import FadeInOut from './FadeInOut'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

class Button_ extends PureComponent {
	state = {}

	componentDidMount() {
		this._isMounted = true
	}

	componentWillUnmount() {
		this._isMounted = false
	}

	render() {
		const {
			buttonRef,
			component,
			link,
			wait,
			busy,
			disabled,
			action,
			onClick,
			submit,
			stretch,
			style,
			className,
			children,
			...rest
		} = this.props

		const properties = {
			...rest,
			ref: buttonRef,
			style,
			className: classNames(className, 'rrui__input', 'rrui__button-reset', 'rrui__outline', 'rrui__button', {
				'rrui__button--busy'       : wait || busy || this.state.wait,
				'rrui__button--disabled'   : disabled,
				'rrui__button--stretch'    : stretch,
				'rrui__button-reset--link' : link
			})
		}

		if (link) {
			const LinkComponent = component || 'a'
			return (
				<LinkComponent
					href={ component ? undefined : link }
					onClick={ this.linkOnClick }
					{ ...properties }>
					{ children }
				</LinkComponent>
			)
		}

		return (
			<button
				type={ submit ? 'submit' : 'button' }
				disabled={ wait || busy || this.state.wait || disabled }
				onClick={ this.buttonOnClick }
				{ ...properties }>
				<FadeInOut
					show={ wait || busy || this.state.wait }
					fadeOutDuration={300}
					fadeInClassName="rrui__button__busy--after-show">
					<span className="rrui__button__busy"/>
				</FadeInOut>
				{ children }
			</button>
		)
	}

	linkOnClick = (event) => {
		const {
			wait,
			busy,
			disabled,
			action,
			onClick
		} = this.props

		// Only handle left mouse button clicks
		// ignoring those ones with a modifier key pressed.
		if (event.button !== 0
			|| event.shiftKey
			|| event.altKey
			|| event.ctrlKey
			|| event.metaKey) {
			return
		}

		if (wait || busy || this.state.wait || disabled) {
			return
		}

		// Could be just a "submit" button without having any `action`.
		// Could also be just a `link` button.
		// Therefore "preventing default" only if `action` is set:
		// for example, if `link` is set and no `action`
		// then it should proceed with navigating to the `link`.
		// And if `link` is set and `action` is specified too
		// then it will prevent it from navigating to the `link`.
		if (action || onClick) {
			event.preventDefault()
		}

		this.buttonOnClick()
	}

	buttonOnClick = (event) => {
		const { action, onClick } = this.props

		let result
		// Could be just a `<button type="submit"/>`
		// without any `action` supplied.
		if (action) {
			result = action()
		} else if (onClick) {
			result = onClick()
		}

		if (result && typeof result.then === 'function') {
			this.setState({ wait: true })
			result.then(
				() => this._isMounted && this.setState({ wait: false }),
				() => this._isMounted && this.setState({ wait: false })
			)
		}
	}
}

const Button = React.forwardRef((props, ref) => (
	<Button_ {...props} buttonRef={ref}/>
))

Button.propTypes = {
	// onClick handler.
	// Doesn't receive `event` by default.
	// Can be `async`/`await` or return a `Promise`
	// in which case it will show "wait" animation.
	onClick: PropTypes.func,

	// onClick handler.
	// (deprecated, use `onClick(event)` instead)
	action: PropTypes.func,

	// If `wait` is `true` then the button
	// will be disabled and a spinner will be shown.
	wait: PropTypes.bool,

	// (deprecated)
	// (use `wait` instead)
	// If `busy` is `true` then the button
	// will be disabled and a spinner will be shown.
	busy: PropTypes.bool,

	// Disables the button
	disabled: PropTypes.bool,

	// When `true`, the button will submit an enclosing form.
	submit: PropTypes.bool,

	// If `link` is set, then the button is gonna be an <a/> tag.
	link: PropTypes.oneOfType([ PropTypes.string, PropTypes.bool ]),

	// Custom React component for the button.
	component: PropTypes.func,

	// Set to `true` to stretch the button to full width.
	stretch: PropTypes.bool,

	// CSS style object for the button container
	style: PropTypes.object,

	// CSS class name
	className: PropTypes.string
}

export default Button