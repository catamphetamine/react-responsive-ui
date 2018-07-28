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

		// Renders an error message below the `<input/>`.
		error     : PropTypes.string,

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
		draggedOver : false
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

		if (disabled) {
			return event.preventDefault()
		}

		if (onClick) {
			onClick()
		}

		// This is why `onClick` is set on the `<input/>`.
		this.fileInput.click()
	}

	storeFileInputNode = (node) => this.fileInput = node

	render()
	{
		const
		{
			error,
			disabled,
			dropTarget,
			draggedOver,
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
					style={ HIDDEN }/>

				{/* The actual clickable area. */}
				{ dropTarget(
					<div
						className={ classNames('rrui__file-upload__area',
						{
							'rrui__file-upload__area--disabled' : disabled,
							'rrui__file-upload__area--invalid' : error,
							'rrui__file-upload__area--dragged-over' : draggedOver
						}) }
						onClick={ this.onClick }>

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