import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { submitFormOnCtrlEnter } from './utility/dom'

export default class FileUpload extends PureComponent
{
	static propTypes =
	{
		// On file chosen handler
		action    : PropTypes.func.isRequired,

		// Allows choosing multiple files if `true`
		multiple  : PropTypes.bool,

		// Disables the file input
		disabled  : PropTypes.bool,

		// `onClick` handler
		onClick   : PropTypes.func,

		// The clickable area, like "Click here to choose a file"
		children  : PropTypes.node,

		// CSS class
		className : PropTypes.string,

		// CSS style object
		style     : PropTypes.object
	}

	on_input_click = (event) =>
	{
		event.stopPropagation()
	}

	on_input_change = (event) =>
	{
		this.on_file_selected(event)
	}

	on_file_selected = (event) =>
	{
		const { action, multiple } = this.props

		let data = event.target.files

		if (!multiple)
		{
			data = data[0]
		}

		action(data)

		// reset the selected file
		// so that onChange would trigger again
		// even with the same file
		event.target.value = null
	}

	on_click = (event) =>
	{
		const { disabled, onClick } = this.props

		if (disabled)
		{
			return event.preventDefault()
		}

		if (onClick)
		{
			onClick()
		}

		this.file_upload.click()
	}

	// Not working for some reason.
	// (doesn't get called)
	onKeyDown = (event) =>
	{
		const { onKeyDown } = this.props

		if (onKeyDown)
		{
			onKeyDown(event)
		}

		if (submitFormOnCtrlEnter(event, this.file_upload))
		{
			return
		}
	}

	storeInputComponent = _ => this.file_upload = _

	render()
	{
		const
		{
			disabled,
			style,
			className,
			children
		}
		= this.props

		return (
			<div
				style={ style }
				className={ classNames('rrui__file-upload', className,
				{
					'rrui__file-upload--disabled' : disabled
				}) }
				onKeyDown={ this.onKeyDown }
				onClick={ this.on_click }>

				<input
					type="file"
					ref={ this.storeInputComponent }
					key="file_input"
					style={ input_style }
					onClick={ this.on_click }
					onChange={ this.on_input_change }/>

				{ children }
			</div>
		)
	}
}

const input_style =
{
	display: 'none'
}