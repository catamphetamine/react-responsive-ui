import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'

export default class File_upload extends PureComponent
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

	constructor()
	{
		super()

		this.on_file_selected = this.on_file_selected.bind(this)
		this.on_click         = this.on_click.bind(this)
		this.on_input_click   = this.on_input_click.bind(this)
		this.on_input_change  = this.on_input_change.bind(this)
	}

	on_input_click(event)
	{
		event.stopPropagation()
	}

	on_input_change(event)
	{
		this.on_file_selected(event)
	}

	on_file_selected(event)
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

	on_click(event)
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

		const markup =
		(
			<div
				style={ style }
				className={ classNames('rrui__file-upload', className,
				{
					'rrui__file-upload--disabled' : disabled
				}) }
				onClick={ this.on_click }>

				<input
					type="file"
					ref={ ref => this.file_upload = ref }
					key="file_input"
					style={ input_style }
					onClick={ this.on_click }
					onChange={ this.on_input_change }/>

				{ children }
			</div>
		)

		return markup
	}
}

const input_style =
{
	display: 'none'
}