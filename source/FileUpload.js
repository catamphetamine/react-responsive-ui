import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

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

		// `react-dnd` `dropTarget()`.
		dropTarget : PropTypes.func.isRequired,

		// `react-dnd` `draggedOver`.
		draggedOver : PropTypes.bool.isRequired,

		// `react-dnd` `canDrop()`.
		// canDrop : PropTypes.bool.isRequired,

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
		dropTarget  : element => element,
		draggedOver : false,
		tabIndex : 0
	}

	onFileSelect = (event) =>
	{
		let { onChange, multiple } = this.props

		// `action` property is deprecated.
		onChange = onChange || this.props.action

		// This check will be replaced with `onChange : PropTypes.func.isRequired`
		// when `action` property is removed in some next breaking release.
		if (!onChange) {
			throw new Error(`"onChange" handler not passed.`)
		}

		const value = event.target.files
		onChange(multiple ? value : value[0])

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

	storeFileInputNode = (node) => this.fileInput = node

	render()
	{
		const
		{
			required,
			error,
			disabled,
			dropTarget,
			draggedOver,
			// canDrop,
			tabIndex,
			style,
			className,
			children
		}
		= this.props

		return (
			<div
				style={ style }
				className={ classNames('rrui__file-upload', className) }>

				{/* Hidden. */}
				<input
					type="file"
					ref={ this.storeFileInputNode }
					onClick={ this.onClick }
					onChange={ this.onFileSelect }
					aria-label={ this.props['aria-label'] }
					aria-required={ required ? true : undefined }
					aria-invalid={ error ? true : undefined }
					style={ HIDDEN }/>

				{/* The actual clickable area. */}
				{ dropTarget(
					<div
						tabIndex={ tabIndex }
						role="button"
						onClick={ this.onClick }
						onKeyDown={ this.onKeyDown }
						className={ classNames(
							/* Developers should define `:focus` styles for `<FileUpload/>`s. */
							'rrui__outline',
							'rrui__file-upload__area',
							{
								'rrui__file-upload__area--disabled' : disabled,
								'rrui__file-upload__area--invalid' : error,
								'rrui__file-upload__area--dragged-over' : draggedOver,
								// 'rrui__file-upload__area--can-not-drop' : !canDrop
							}
						) }>

						{/* Could be an "UPLOAD" button or something. */}
						{ children }
					</div>
				) }

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