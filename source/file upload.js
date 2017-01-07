import React, { PureComponent, PropTypes } from 'react'

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

	constructor(props, context)
	{
		super(props, context)

		this.on_file_selected = this.on_file_selected.bind(this)
		this.on_click         = this.on_click.bind(this)
	}

	render()
	{
		const { style, className, children } = this.props

		const markup =
		(
			<div
				style={style}
				className={className}
				onClick={this.on_click}>

				<input
					type="file"
					ref={ref => this.file_upload = ref}
					key="file_input"
					style={{ display: 'none' }}
					onClick={event => event.stopPropagation()}
					onChange={event => this.on_file_selected(event)}/>

				{children}
			</div>
		)

		return markup
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
}