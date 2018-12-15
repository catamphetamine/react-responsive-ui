import React from 'react'
import PropTypes from 'prop-types'
import createRef from 'react-create-ref'
import classNames from 'classnames'

const DownArrow = (props) => (
	<svg viewBox="0 0 12 7" {...props}>
		<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
			<path fill="currentColor" d="M0.776785714,0 C0.995536808,0 1.17633857,0.0761808302 1.31919643,0.228544776 L6,4.93003731 L10.6808036,0.228544776 C10.8236614,0.0805340858 11.0044632,0.00652985075 11.2232143,0.00652985075 C11.4419654,0.00652985075 11.6227671,0.0805340858 11.765625,0.228544776 C11.9218758,0.380908722 12,0.568095905 12,0.79011194 C12,1.01648123 11.9218758,1.20584501 11.765625,1.35820896 L6.26116071,6.88899254 C6.18973179,6.96299788 6.10267908,7 6,7 C5.89732092,7 5.81026821,6.96299788 5.73883929,6.88899254 L0.234375,1.35820896 C0.0781242187,1.20149175 0,1.01321627 0,0.793376866 C0,0.573537458 0.0781242187,0.385261978 0.234375,0.228544776 C0.381697165,0.0761808302 0.562498929,0 0.776785714,0 Z"/>
		</g>
	</svg>
)

export default class ExpansionPanel extends React.Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
		disabled: PropTypes.bool,
		headingLevel: PropTypes.number.isRequired,
		// `isExpanded` can be used for manual control.
		// For example, when there's a group of expansion panels
		// and only one of them should be expanded at any given time.
		isExpanded: PropTypes.bool,
		onToggle: PropTypes.func,
		toggleIcon: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.bool
		]).isRequired,
		toggleIconPlacement: PropTypes.oneOf(['start', 'end']).isRequired,
		expandContentAnimationDuration: PropTypes.number.isRequired,
		style: PropTypes.object,
		className: PropTypes.string
	}

	static defaultProps = {
		headingLevel: 3,
		toggleIcon: DownArrow,
		toggleIconPlacement: 'end',
		expandContentAnimationDuration: 300
	}

	state = {
		height: this.props.isExpanded ? undefined : 0,
		isExpanded: this.props.isExpanded
	}

	content = createRef()

	toggle = (expand = !this.state.isExpanded) => {
		const { onToggle } = this.props
		if (onToggle) {
			onToggle(expand)
		}
		clearTimeout(this.resetHeightTimer)
		this.setState((state) => {
			const isExpanded = expand
			return {
				isExpanded,
				height: isExpanded ? null : undefined,
				// Verify `expandedHeight` is defined.
				expandedHeight: isExpanded ? null : (state.expandedHeight === undefined ? this.content.current.scrollHeight : state.expandedHeight)
			}
		})
	}

	onToggle = () => this.toggle()

	componentDidUpdate(prevProps, prevState) {
		const { expandContentAnimationDuration } = this.props
		if (this.props.isExpanded !== prevProps.isExpanded) {
			this.toggle(this.props.isExpanded)
		}
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
				}, 20)
			}
		}
	}

	componentWillUnmount() {
		clearTimeout(this.resetHeightTimer)
	}

	render() {
		const {
			title,
			disabled,
			headingLevel,
			toggleIcon: ToggleIcon,
			toggleIconPlacement,
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

		// There was a possibility of using `<details/>`/`<summary/>` elements here
		// but `<summary/>` can only contain any valid paragraph content
		// which means it can't contain lists, divs, paragraphs, etc.

		return (
			<section
				style={style}
				className={classNames(className, 'rrui__expansion-panel', {
					'rrui__expansion-panel--expanded': isExpanded,
					'rrui__expansion-panel--toggle-icon-start': ToggleIcon && toggleIconPlacement === 'start',
					'rrui__expansion-panel--toggle-icon-end': ToggleIcon && toggleIconPlacement === 'end'
				})}>
				<Heading style={HEADING_STYLE}>
					<button
						type="button"
						onClick={this.onToggle}
						aria-expanded={isExpanded}
						aria-label={this.props['aria-label'] || title}
						disabled={disabled}
						className="rrui__button-reset rrui__outline rrui__expansion-panel__header">
						{ToggleIcon && toggleIconPlacement === 'start' &&
							<ToggleIcon
								aria-hidden
								className="rrui__expansion-panel__icon rrui__expansion-panel__icon--start"/>
						}
						<span className="rrui__expansion-panel__heading">
							{title}
						</span>
						{ToggleIcon && toggleIconPlacement === 'end' &&
							<ToggleIcon
								aria-hidden
								className="rrui__expansion-panel__icon rrui__expansion-panel__icon--end"/>
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