import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { DropFiles } from './DragAndDrop'
import FileUploadInput from './FileUploadInput'

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

		// Can be used to restrict the file MIME-types or extensions available for selection.
		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#attr-accept
		accept: PropTypes.string,

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

	onClick = (event) => {
		const {
			disabled,
			onClick
		} = this.props
		if (disabled) {
			if (event) {
				event.preventDefault()
			}
			return
		}
		if (onClick) {
			onClick()
		}
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

	storeFileInputRef = (ref) => this.fileInput = ref

	render() {
		const {
			required,
			error,
			disabled,
			tabIndex,
			onChange,
			multiple,
			accept,
			style,
			className,
			children
		} = this.props

		const { draggedOver } = this.state

		return (
			<div
				style={ style }
				className={ classNames('rrui__file-upload', className) }>

				{/* Hidden. */}
				{/* "action" property is deprecated. */}
				<FileUploadInput
					ref={ this.storeFileInputRef }
					multiple={ multiple }
					onChange={ onChange || this.props.action }
					error={ error }
					required={ required }
					disabled={ disabled }
					accept={ accept }
					aria-label={ this.props['aria-label'] }/>

				<DropFiles
					role="button"
					tabIndex={ tabIndex }
					aria-label={ this.props['aria-label'] }
					accept={ accept }
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