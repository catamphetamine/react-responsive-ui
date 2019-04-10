import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default function MenuIcon({ expanded, className }) {
	// This is to prevent the `transform` animations
	// of menu icon bars from being played on page load.
	// (when styles are included on a page via javascript)
	const activated = expanded !== undefined
	return (
		<div className={classNames(className, 'rrui__menu-icon', {
			'rrui__menu-icon--collapsed': !expanded,
			'rrui__menu-icon--expanded': expanded
		})}>
			<div className="rrui__menu-icon__bar"/>
			<div className="rrui__menu-icon__bar"/>
			<div className="rrui__menu-icon__bar"/>
		</div>
	)
}

MenuIcon.propTypes = {
	expanded : PropTypes.bool,
	className : PropTypes.string
}