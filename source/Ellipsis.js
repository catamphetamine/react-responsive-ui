import React from 'react'
import classNames from 'classnames'

// https://martinwolf.org/blog/2015/01/pure-css-savingloading-dots-animation
export default function Ellipsis({ className, style })
{
	return (
		<div className={ classNames('rrui__ellipsis', className) } style={ style }>
			<div className="rrui__ellipsis__size">
				<div className="rrui__ellipsis__dots">
					<div className="rrui__ellipsis__dot rrui__ellipsis__dot--1" />
					<div className="rrui__ellipsis__dot rrui__ellipsis__dot--2" />
					<div className="rrui__ellipsis__dot rrui__ellipsis__dot--3" />
				</div>
			</div>
		</div>
	)
}