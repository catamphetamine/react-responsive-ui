import React from 'react'
import PropTypes from 'prop-types'
import { polyfill as reactLifecyclesCompat } from 'react-lifecycles-compat'
import createRef from 'react-create-ref'
import classNames from 'classnames'

const DownArrow = (props) => (
	<svg viewBox="0 0 12 7" {...props}>
		<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
			<path fill="currentColor" d="M0.776785714,0 C0.995536808,0 1.17633857,0.0761808302 1.31919643,0.228544776 L6,4.93003731 L10.6808036,0.228544776 C10.8236614,0.0805340858 11.0044632,0.00652985075 11.2232143,0.00652985075 C11.4419654,0.00652985075 11.6227671,0.0805340858 11.765625,0.228544776 C11.9218758,0.380908722 12,0.568095905 12,0.79011194 C12,1.01648123 11.9218758,1.20584501 11.765625,1.35820896 L6.26116071,6.88899254 C6.18973179,6.96299788 6.10267908,7 6,7 C5.89732092,7 5.81026821,6.96299788 5.73883929,6.88899254 L0.234375,1.35820896 C0.0781242187,1.20149175 0,1.01321627 0,0.793376866 C0,0.573537458 0.0781242187,0.385261978 0.234375,0.228544776 C0.381697165,0.0761808302 0.562498929,0 0.776785714,0 Z"/>
		</g>
	</svg>
)

@reactLifecyclesCompat
export default class ExpansionPanel extends React.Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
		disabled: PropTypes.bool,
		headingLevel: PropTypes.number.isRequired,
		// `toggle` and `isExpanded` can be used for manual control.
		// For example, when there's a group of expansion panels
		// and only one of them should be expanded at any given time.
		toggle: PropTypes.func,
		isExpanded: PropTypes.bool,
		statusIcon: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.bool
		]).isRequired,
		expandContentAnimationDuration: PropTypes.number.isRequired,
		style: PropTypes.object,
		className: PropTypes.string
	}

	static defaultProps = {
		headingLevel: 3,
		statusIcon: DownArrow,
		expandContentAnimationDuration: 300
	}

	static getDerivedStateFromProps(props, state) {
		if (props.toggle) {
			// On external toggle.
			state = {
				...state,
				isExpanded: props.isExpanded
			}
			if (props.isExpanded !== state.isExpanded) {
				clearTimeout(this.resetHeightTimer)
				// If `<ExpansionPanel/>` is being expanded then measure its height.
				if (props.isExpanded) {
					state.height = null
					state.expandedHeight = null
				} else {
					state.height = undefined
					// Verify `expandedHeight` is defined.
					state.expandedHeight = state.expandedHeight === undefined ? 'auto' : state.expandedHeight
				}
			}
			return state
		}
		return state
	}

	state = {
		height: 0
	}

	content = createRef()

	toggle = () => {
		clearTimeout(this.resetHeightTimer)
		this.setState((state) => {
			const isExpanded = !state.isExpanded
			return {
				isExpanded,
				height: isExpanded ? null : undefined,
				// Verify `expandedHeight` is defined.
				expandedHeight: isExpanded ? null : (state.expandedHeight === undefined ? this.content.current.scrollHeight : state.expandedHeight)
			}
		})
	}

	componentDidUpdate(prevProps, prevState) {
		const { expandContentAnimationDuration } = this.props
		if (this.state.isExpanded !== prevState.isExpanded) {
			// If `<ExpansionPanel/>` is being expanded then measure its content height.
			if (this.state.height === null) {
				const height = this.content.current.scrollHeight
				this.setState({
					height,
					expandedHeight: height
				})
				this.resetHeightTimer = setTimeout(() => {
					this.setState((state) => ({
						height: undefined
					}))
				}, expandContentAnimationDuration)
			} else {
				// Added a timeout here so that React doesn't
				// optimize two `setState()`s into a single one.
				// Added a `10` timeout here so that the browser doesn't
				// optimize two `setState()`s into a single one.
				this.resetHeightTimer = setTimeout(() => {
					this.setState({
						height: 0
					})
				}, 10)
			}
		}
	}

	componentWillUnmount() {
		clearTimeout(this.resetHeightTimer)
	}

	onToggle = () => {
		const { toggle } = this.props
		if (toggle) {
			toggle()
		} else {
			this.toggle()
		}
	}

	render() {
		const {
			title,
			disabled,
			headingLevel,
			statusIcon: StatusIcon,
			toggle,
			style,
			className,
			children
		} = this.props

		const {
			isExpanded,
			height,
			expandedHeight
		} = this.state

		const Heading = `h${headingLevel}`

		return (
			<section
				style={style}
				className={classNames(className, 'rrui__expansion-panel', {
					'rrui__expansion-panel--expanded': isExpanded
				})}>
				<Heading style={HEADING_STYLE}>
					<button
						type="button"
						onClick={this.onToggle}
						aria-expanded={isExpanded}
						disabled={disabled}
						className="rrui__button-reset rrui__outline rrui__expansion-panel__heading">
						{title}
						{StatusIcon &&
							<StatusIcon
								aria-hidden
								className="rrui__expansion-panel__icon"/>
						}
					</button>
				</Heading>
				<div
					ref={this.content}
					aria-hidden={!isExpanded}
					style={{ height: isExpanded ? (height === null ? 0 : (height === undefined ? 'auto' : `${height}px`)) : (height === undefined ? expandedHeight : 0) }}
					className="rrui__expansion-panel__content-wrapper">
					<div className="rrui__expansion-panel__content">
						{children}
					</div>
				</div>
			</section>
		)
	}
}

const HEADING_STYLE = {
	margin: 0
}