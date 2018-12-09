import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default function MenuIcon({ expanded, className }) {
	// This is to prevent the `transform` animations
	// of menu icon bars from being played on page load.
	// (when styles are included on a page via javascript)
	const activated = expanded !== undefined
	return (
		<div className={classNames('rrui__menu-icon', className)}>

			<div className={classNames('rrui__menu-icon__bar', {
				// 'rrui__menu-icon__bar--collapsed': !expanded,
				'rrui__menu-icon__bar--transition': activated,
				'rrui__menu-icon__bar--expanded': activated && expanded
			})}/>

			<div className={classNames('rrui__menu-icon__bar', {
				// 'rrui__menu-icon__bar--collapsed': !expanded,
				'rrui__menu-icon__bar--transition': activated,
				'rrui__menu-icon__bar--expanded': activated && expanded
			})}/>

			<div className={classNames('rrui__menu-icon__bar', {
				// 'rrui__menu-icon__bar--collapsed': !expanded,
				'rrui__menu-icon__bar--transition': activated,
				'rrui__menu-icon__bar--expanded': activated && expanded
			})}/>
		</div>
	)
}

MenuIcon.propTypes = {
	expanded : PropTypes.bool,
	className : PropTypes.string
}