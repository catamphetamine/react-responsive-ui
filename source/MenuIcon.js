import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

export default class MenuIcon extends PureComponent
{
	state = {}

	// This is to prevent the `transform` animations
	// of menu icon bars from being played on page load.
	// (when styles are included on a page via javascript)
	onClick = () => this.setState({ clicked: true })

	render()
	{
		const { expanded, className } = this.props
		const { clicked } = this.state

		return (
			<div
				onClick={this.onClick}
				className={classNames('rrui__menu-icon', className)}>

				<div className={classNames('rrui__menu-icon__bar', {
					// 'rrui__menu-icon__bar--collapsed': !expanded,
					'rrui__menu-icon__bar--transition': clicked,
					'rrui__menu-icon__bar--expanded': clicked && expanded
				})}/>

				<div className={classNames('rrui__menu-icon__bar', {
					// 'rrui__menu-icon__bar--collapsed': !expanded,
					'rrui__menu-icon__bar--transition': clicked,
					'rrui__menu-icon__bar--expanded': clicked && expanded
				})}/>

				<div className={classNames('rrui__menu-icon__bar', {
					// 'rrui__menu-icon__bar--collapsed': !expanded,
					'rrui__menu-icon__bar--transition': clicked,
					'rrui__menu-icon__bar--expanded': clicked && expanded
				})}/>
			</div>
		)
	}
}

MenuIcon.propTypes = {
	expanded : PropTypes.bool,
	className : PropTypes.string
}