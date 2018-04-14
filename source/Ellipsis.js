import React from 'react'
import classNames from 'classnames'

// https://martinwolf.org/blog/2015/01/pure-css-savingloading-dots-animation
export default function Ellipsis({ className })
{
	return (
		<div className={ classNames('rrui__ellipsis', className) }>
			<div className="rrui__ellipsis__dot rrui__ellipsis__dot--1" />
			<div className="rrui__ellipsis__dot rrui__ellipsis__dot--2" />
			<div className="rrui__ellipsis__dot rrui__ellipsis__dot--3" />
		</div>
	)
}