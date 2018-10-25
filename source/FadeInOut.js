import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class FadeInOut extends React.Component {
	static propTypes = {
		show: PropTypes.bool.isRequired,
		fadeInInitially: PropTypes.bool.isRequired,
		fadeInDuration: PropTypes.number,
		fadeOutDuration: PropTypes.number,
		fadeInClassName: PropTypes.string,
		children: PropTypes.element.isRequired
	}

	static defaultProps = {
		show: false,
		fadeInInitially: false,
		fadeInDuration: 0,
		fadeOutDuration: 0
	}

	state = {
		show: this.props.show
	}

	constructor(props)
	{
		super(props)

		if (typeof props.children === 'string' || React.Children.count(props.children) !== 1) {
			throw new Error('`<FadeInOut/>` expect an element as a child.')
		}
	}

	componentDidUpdate(prevProps)
	{
		if (!prevProps.show && this.props.show) {
			this.show()
		} else if (prevProps.show && !this.props.show) {
			this.hide()
		}
	}

	componentDidMount()
	{
		const { show, fadeInInitially } = this.props

		this._isMounted = true

		if (show && fadeInInitially) {
			this.show()
		}
	}

	componentWillUnmount()
	{
		this._isMounted = false

		clearTimeout(this.showTimer)
		clearTimeout(this.hideTimer)
	}

	show()
	{
		clearTimeout(this.showTimer)
		clearTimeout(this.hideTimer)

		this.setState
		({
			show : true,
			fadeIn : false,
			fadeOut : false
		})

		this.showTimer = setTimeout(() =>
		{
			if (this._isMounted) {
				this.setState({
					fadeIn: true
				})
			}
		},
		// Adding a non-null delay in order to
		// prevent web browser from optimizing
		// adding CSS classes and doing it simultaneously
		// rather than sequentially (required for CSS transition).
		30)
	}

	hide = () =>
	{
		const { fadeOutDuration } = this.props

		clearTimeout(this.showTimer)

		if (!this._isMounted) {
			return
		}

		this.setState
		({
			show : false,
			fadeIn : false,
			fadeOut : true
		})

		// Gives some time to CSS opacity transition to finish.
		this.hideTimer = setTimeout(() =>
		{
			if (this._isMounted) {
				this.setState({
					fadeOut : false
				})
			}
		},
		fadeOutDuration)
	}

	getFadeInStyle() {
		const { fadeInDuration } = this.props
		return {
			opacity: 1,
			transition: `opacity ${fadeInDuration}ms ease-out`
		}
	}

	getFadeOutStyle() {
		const { fadeOutDuration } = this.props
		return {
			opacity: 0,
			transition: `opacity ${fadeOutDuration}ms ease-out`
		}
	}

	getStyle() {
		const {
			show,
			fadeInInitially
		} = this.props

		const {
			fadeIn,
			fadeOut
		} = this.state

		if (fadeIn) {
			return this.getFadeInStyle()
		}

		if (fadeOut) {
			return this.getFadeOutStyle()
		}

		// If `show={true}` and hasn't faded in/out yet, then just show.
		if (show && fadeIn === undefined && !fadeInInitially) {
			return SHOWN_STYLE
		}

		return HIDDEN_STYLE
	}

	render() {
		const {
			fadeInClassName,
			style,
			children
		} = this.props

		const {
			show,
			fadeIn,
			fadeOut
		} = this.state

		if (show || fadeOut) {
			if (fadeInClassName) {
				return React.cloneElement(children, {
					className: classNames(children.props.className, {
						[fadeInClassName]: fadeIn
					})
				})
			} else {
				return React.cloneElement(children, {
					style: children.props.style ? { ...children.props.style, ...this.getStyle() } : this.getStyle()
				})
			}
			// return children
		}

		return null
	}
}

const SHOWN_STYLE = {
	opacity: 1
}

const HIDDEN_STYLE = {
	opacity: 0
}