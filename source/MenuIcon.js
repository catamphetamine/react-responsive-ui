import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default function MenuIcon({ expanded, className })
{
	return (
		<div className={classNames('rrui__menu-icon', className)}>
			<div className={classNames('rrui__menu-icon__bar', {
				// 'rrui__menu-icon__bar--collapsed': !expanded,
				'rrui__menu-icon__bar--expanded': expanded
			})}/>
			<div className={classNames('rrui__menu-icon__bar', {
				// 'rrui__menu-icon__bar--collapsed': !expanded,
				'rrui__menu-icon__bar--expanded': expanded
			})}/>
			<div className={classNames('rrui__menu-icon__bar', {
				// 'rrui__menu-icon__bar--collapsed': !expanded,
				'rrui__menu-icon__bar--expanded': expanded
			})}/>
		</div>
	)
}

MenuIcon.propTypes = {
	expanded : PropTypes.bool,
	className : PropTypes.string
}