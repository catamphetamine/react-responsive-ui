import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// For some weird reason, in Chrome, `setTimeout()` would lag up to a second (or more) behind.
// Turns out, Chrome developers have deprecated `setTimeout()` API entirely without asking anyone.
// Replacing `setTimeout()` with `requestAnimationFrame()` can work around that Chrome bug.
// https://github.com/bvaughn/react-virtualized/issues/722
import { setTimeout, clearTimeout } from 'request-animation-frame-timeout'

const DownArrow = (props) => (
	<svg viewBox="0 0 12 7" {...props}>
		<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
			<path fill="currentColor" d="M0.776785714,0 C0.995536808,0 1.17633857,0.0761808302 1.31919643,0.228544776 L6,4.93003731 L10.6808036,0.228544776 C10.8236614,0.0805340858 11.0044632,0.00652985075 11.2232143,0.00652985075 C11.4419654,0.00652985075 11.6227671,0.0805340858 11.765625,0.228544776 C11.9218758,0.380908722 12,0.568095905 12,0.79011194 C12,1.01648123 11.9218758,1.20584501 11.765625,1.35820896 L6.26116071,6.88899254 C6.18973179,6.96299788 6.10267908,7 6,7 C5.89732092,7 5.81026821,6.96299788 5.73883929,6.88899254 L0.234375,1.35820896 C0.0781242187,1.20149175 0,1.01321627 0,0.793376866 C0,0.573537458 0.0781242187,0.385261978 0.234375,0.228544776 C0.381697165,0.0761808302 0.562498929,0 0.776785714,0 Z"/>
		</g>
	</svg>
)

// The delay prevents Chrome from optimizing two immediate
// CSS style changes to a single one: first one setting
// <ExpansionPanel/>'s content `height` to `auto`,
// and the second one setting content `height` to `0`,
// so that the minimize animation is displayed.
const MINIMIZE_TIMER_DELAY = 20

function ExpansionPanel({
	isExpandedInitially,
	isExpanded: isExpandedExternallyControlled,
	onToggle,
	title,
	'aria-label': ariaLabel,
	disabled,
	toggleIcon: ToggleIcon,
	toggleIconPlacement,
	animationDuration,
	style,
	className,
	children
}, ref) {
	const _isExpandedInitially = (isExpandedInitially === undefined ? isExpandedExternallyControlled : isExpandedInitially) || false

	const [isExpanded, setExpanded] = useState(_isExpandedInitially)
	const [height, setHeight] = useState(_isExpandedInitially ? undefined : 0)
	const [expandedHeight, setExpandedHeight] = useState()

	const content = useRef()
	const resetHeightTimer = useRef()

	const toggle = useCallback((expand) => {
		if (expand === isExpanded) {
			// The expansion panel is already in the requested state. Do nothing.
			return
		}
		if (expand === undefined) {
			expand = !isExpanded
		}
		if (onToggle) {
			onToggle(expand)
		}
		clearTimeout(resetHeightTimer.current)
		setExpanded(expand)
		setHeight(expand ? null : undefined)
		setExpandedHeight(expand ? null : content.current.scrollHeight)
	}, [
		isExpanded,
		onToggle
	])

	const onToggleClick = useCallback((event) => toggle(), [toggle])

	const isFirstUseEffect = useRef(true)
	const isFirstUseLayoutEffect = useRef(true)

	useEffect(() => {
		if (isFirstUseEffect.current) {
			return
		}
		toggle(isExpanded)
	}, [isExpandedExternallyControlled])

	useLayoutEffect(() => {
		if (isFirstUseLayoutEffect.current) {
			return
		}
		if (isExpanded) {
			// If `<ExpansionPanel/>` is being expanded
			// then measure its content height.
			if (height === null) {
				setHeight(content.current.scrollHeight)
			}
			resetHeightTimer.current = setTimeout(() => {
				setHeight(undefined)
			}, animationDuration)
		} else {
			// Added a timeout here so that the browser doesn't
			// optimize two `setState()`s into a single one.
			resetHeightTimer.current = setTimeout(() => {
				setHeight(0)
			}, MINIMIZE_TIMER_DELAY)
		}
	}, [isExpanded])

	useEffect(() => {
		isFirstUseEffect.current = false
	}, [])

	useLayoutEffect(() => {
		isFirstUseLayoutEffect.current = false
		return () => {
			clearTimeout(resetHeightTimer.current)
		}
	}, [])

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
			<header style={HEADING_STYLE}>
				<button
					ref={ref}
					type="button"
					onClick={onToggleClick}
					aria-expanded={isExpanded ? true : false}
					aria-label={ariaLabel}
					disabled={disabled}
					className={classNames('rrui__button-reset', 'rrui__outline', 'rrui__expansion-panel__header')}>
					{ToggleIcon && toggleIconPlacement === 'start' &&
						<ToggleIcon
							aria-hidden
							className={classNames('rrui__expansion-panel__toggle-icon', 'rrui__expansion-panel__toggle-icon--start')}/>
					}
					<span className="rrui__expansion-panel__heading">
						{title}
					</span>
					{ToggleIcon && toggleIconPlacement === 'end' &&
						<ToggleIcon
							aria-hidden
							className={classNames('rrui__expansion-panel__toggle-icon', 'rrui__expansion-panel__toggle-icon--end')}/>
					}
				</button>
			</header>
			<div
				ref={content}
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

const HEADING_STYLE = {
	margin: 0
}

ExpansionPanel = React.forwardRef(ExpansionPanel)

ExpansionPanel.propTypes = {
	title: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
	// `isExpanded` can be used for manual control.
	// For example, when there's a group of expansion panels
	// and only one of them should be expanded at any given time.
	isExpanded: PropTypes.bool,
	isExpandedInitially: PropTypes.bool,
	onToggle: PropTypes.func,
	toggleIcon: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.bool
	]).isRequired,
	toggleIconPlacement: PropTypes.oneOf(['start', 'end']).isRequired,
	animationDuration: PropTypes.number.isRequired,
	style: PropTypes.object,
	className: PropTypes.string
}

ExpansionPanel.defaultProps = {
	toggleIcon: DownArrow,
	toggleIconPlacement: 'start',
	animationDuration: 300
}

export default ExpansionPanel