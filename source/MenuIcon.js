import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default function MenuIcon({ expanded, className })
{
	return (
		<div className={classNames('rrui__menu-button-icon-x', className, {
			// 'rrui__menu-button-icon-x--expanded': expanded
		})}>
			<div className={classNames('rrui__menu-button-icon-x__icon', {
				'rrui__menu-button-icon-x__icon--collapsed': !expanded,
				'rrui__menu-button-icon-x__icon--expanded': expanded
			})}/>
		</div>
	)
}

MenuIcon.propTypes = {
	expanded : PropTypes.bool,
	className : PropTypes.string
}