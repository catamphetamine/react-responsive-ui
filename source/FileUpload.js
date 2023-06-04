import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { DropFiles } from './DragAndDrop'
import FileUploadInput, { getAcceptFromExt } from './FileUploadInput'
import WithError from './WithError'

import { submitFormOnCtrlEnter } from './utility/dom'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

class FileUpload extends PureComponent
{
	static propTypes =
	{
		// On file(s) chosen.
		onChange  : PropTypes.func,

		// Whether the area should be focusable/clickable.
		clickable : PropTypes.bool,

		// Allows choosing multiple files if `true`.
		multiple  : PropTypes.bool,

		// Can be used to restrict the file MIME-types or extensions available for selection.
		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#attr-accept
		accept: PropTypes.string,

		// Will be transformed to `accept`.
		ext: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.string),
			PropTypes.string
		]),

		// Disables the file input.
		disabled  : PropTypes.bool,

		// `onClick` handler.
		onClick   : PropTypes.func,

		// Whether choosing a file (or files) is required.
		required : PropTypes.bool,

		// Indicates that the input is invalid.
		error : PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.bool
		]),

		showErrorMessage : PropTypes.bool,

		tabIndex  : PropTypes.number,

		// The contents of the file drop area.
		// Example: "Click here to choose a file".
		children  : PropTypes.node,

		// CSS class when dragged over.
		draggedOverClassName : PropTypes.string,

		// CSS class
		className : PropTypes.string,

		// CSS style object
		style     : PropTypes.object,

		// Deprecated.
		// Rewrite this component in hooks instead.
		// A hack for `React.forwardRef()`.
		// Could be rewritten in "hooks" instead.
		// A hack for providing `.focus()` method on `<DropFileUpload/>`.
		ref_: PropTypes.object
	}

	static defaultProps =
	{
		clickable : true,
		showErrorMessage : true
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

	onFileInputChange = (value) => {
		const { multiple, onChange } = this.props
		if (multiple) {
			onChange(value, {
				acceptedFiles: value,
				rejectedFiles: []
			})
		} else {
			onChange(value, {
				isAccepted: true
			})
		}
	}

	render() {
		const {
			ref_,
			required,
			error,
			showErrorMessage,
			disabled,
			tabIndex,
			onChange,
			clickable,
			multiple,
			accept,
			ext,
			style,
			draggedOverClassName,
			className,
			children
		} = this.props

		const { draggedOver } = this.state

		const _accept = accept || (ext && getAcceptFromExt(ext))

		let dropFilesElementProps
		if (clickable) {
			dropFilesElementProps = {
				role: 'button',
				tabIndex: tabIndex === undefined ? 0 : tabIndex,
				onClick: this.onClick,
				onKeyDown: this.onKeyDown
			}
		}

		return (
			<WithError
				error={showErrorMessage ? error : undefined}
				style={style}
				className={classNames('rrui__file-upload', className)}>

				{/* Hidden. */}
				<FileUploadInput
					ref={ this.storeFileInputRef }
					multiple={ multiple }
					onChange={ this.onFileInputChange }
					error={ error }
					required={ required }
					disabled={ disabled }
					accept={ _accept }
					aria-label={ this.props['aria-label'] }/>

				<DropFiles
					ref={ref_}
					{...dropFilesElementProps}
					aria-label={ this.props['aria-label'] }
					accept={ _accept }
					multiple={ multiple }
					onDrop={ onChange }
					setDraggedOver={ this.setDraggedOver }
					className={ classNames(
						/* Developers should define `:focus` styles for `<FileUpload/>`s. */
						'rrui__outline',
						'rrui__file-upload__area',
						{
							'rrui__file-upload__area--clickable' : clickable,
							'rrui__file-upload__area--disabled' : disabled,
							'rrui__file-upload__area--invalid' : error,
							'rrui__file-upload__area--dragged-over' : draggedOver
						},
						draggedOver && draggedOverClassName
					) }>
					{ children }
				</DropFiles>
			</WithError>
		)
	}
}

// A hack for providing `.focus()` method on `<DropFileUpload/>`.
export default React.forwardRef((props, ref) => (
	<FileUpload ref_={ref} {...props}/>
))