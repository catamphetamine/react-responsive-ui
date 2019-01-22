import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { DropFiles, supportsMultipleFileUploadOnInputElement } from './DragAndDrop'

import { submitFormOnCtrlEnter } from './utility/dom'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

export default class FileUpload extends PureComponent
{
	static propTypes =
	{
		// On file(s) chosen.
		onChange  : PropTypes.func,

		// (deprecated, use `onChange` instead).
		// On file(s) chosen.
		action    : PropTypes.func,

		// Allows choosing multiple files if `true`.
		multiple  : PropTypes.bool,

		// Disables the file input.
		disabled  : PropTypes.bool,

		// `onClick` handler.
		onClick   : PropTypes.func,

		// Whether choosing a file is required.
		required : PropTypes.bool,

		// Renders an error message below the `<input/>`.
		error     : PropTypes.string,

		tabIndex  : PropTypes.number.isRequired,

		// The clickable area, like "Click here to choose a file".
		children  : PropTypes.node,

		// CSS class
		className : PropTypes.string,

		// CSS style object
		style     : PropTypes.object
	}

	static defaultProps =
	{
		tabIndex : 0
	}

	state =
	{
		draggedOver : false
	}

	onFileSelect = (event) =>
	{
		let { onChange, multiple } = this.props

		// Internet Explorer triggers `onChange` when setting
		// `event.target.value` manually, so ignore such events.
		if (this.ieTimer) {
			return
		}

		// `action` property is deprecated.
		onChange = onChange || this.props.action

		// This check will be replaced with `onChange : PropTypes.func.isRequired`
		// when `action` property is removed in some next breaking release.
		if (!onChange) {
			throw new Error(`"onChange" handler not passed.`)
		}

		// Convert from `FileList` to an `Array`.
		const value = Array.prototype.slice.call(event.target.files)
		// `<input multiple/>` attribute is not supported in all browsers.
		onChange(multiple ? value : value[0])

		// Internet Explorer triggers `onChange` when setting
		// `event.target.value` manually, hence the cooldown timer.
		this.ieTimer = setTimeout(() => this.ieTimer = undefined, 0)
		// Reset the selected file
		// so that `onChange` is triggered again next time
		// even if the user selects the same file.
		event.target.value = null
	}

	onClick = (event) =>
	{
		const { disabled, onClick } = this.props

		if (disabled && event) {
			return event.preventDefault()
		}

		if (onClick) {
			onClick()
		}

		// This is why `onClick` is set on the `<input/>`.
		this.fileInput.click()
	}

	onKeyDown = (event) => {
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}
		switch (event.keyCode) {
			// "Enter".
			case 13:
			// Spacebar.
			case 32:
				event.preventDefault()
				// Emulate `:active` on key press.
				// setTimeout(() => {
				// 	if (this._isMounted) {
				// 		this.setState({
				// 			isActive: true
				// 		})
				// 	}
				// })
				return this.onClick()
		}
	}

	setDraggedOver = (draggedOver) => this.setState({ draggedOver })

	storeFileInputNode = (node) => this.fileInput = node

	render()
	{
		const
		{
			required,
			error,
			disabled,
			tabIndex,
			onChange,
			multiple,
			style,
			className,
			children
		}
		= this.props

		const { draggedOver } = this.state

		return (
			<div
				style={ style }
				className={ classNames('rrui__file-upload', className) }>

				{/* Hidden. */}
				<input
					type="file"
					multiple={ supportsMultipleFileUploadOnInputElement ? multiple : undefined }
					ref={ this.storeFileInputNode }
					onClick={ this.onClick }
					onChange={ this.onFileSelect }
					disabled={ disabled }
					aria-label={ this.props['aria-label'] }
					aria-required={ required ? true : undefined }
					aria-invalid={ error ? true : undefined }
					style={ HIDDEN }/>

				<DropFiles
					role="button"
					tabIndex={ tabIndex }
					aria-label={ this.props['aria-label'] }
					multiple={ multiple }
					onDrop={ onChange }
					onClick={ this.onClick }
					onKeyDown={ this.onKeyDown }
					setDraggedOver={ this.setDraggedOver }
					className={ classNames(
						/* Developers should define `:focus` styles for `<FileUpload/>`s. */
						'rrui__outline',
						'rrui__file-upload__area',
						{
							'rrui__file-upload__area--disabled' : disabled,
							'rrui__file-upload__area--invalid' : error,
							'rrui__file-upload__area--dragged-over' : draggedOver
						}
					) }>
					{ children }
				</DropFiles>

				{/* Error message (e.g. "Required"). */}
				{ error &&
					<div className="rrui__input-error">
						{ error }
					</div>
				}
			</div>
		)
	}
}

const HIDDEN =
{
	display: 'none'
}