import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import FileUploadInput, { getAcceptFromExt } from './FileUploadInput'

export default class FileUploadButton extends React.Component {
	static propTypes = {
		component: PropTypes.elementType,

		// On file(s) chosen.
		onChange: PropTypes.func.isRequired,

		// Allows choosing multiple files if `true`.
		multiple: PropTypes.bool,

		// Disables the file input.
		disabled: PropTypes.bool,

		// Indicates that the input is invalid.
		error: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.bool
		]),

		// Whether choosing a file (or files) is required.
		// Sets `aria-required` on the file `<input/>`.
		required: PropTypes.bool,

		// Can be used to restrict the file MIME-types or extensions available for selection.
		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#attr-accept
		accept: PropTypes.string,

		// Will be transformed to `accept`.
		ext: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.string),
			PropTypes.string
		])
	}

	onClick = () => {
		this.fileInput.click()
	}

	storeFileInputRef = (ref) => this.fileInput = ref

	render() {
		const {
			component: Component,
			onChange,
			multiple,
			disabled,
			error,
			required,
			accept,
			ext,
			...rest
		} = this.props

		return (
			<React.Fragment>
				<FileUploadInput
					ref={this.storeFileInputRef}
					onChange={onChange}
					multiple={multiple}
					disabled={disabled}
					error={error}
					required={required}
					accept={accept || (ext && getAcceptFromExt(ext))}/>
				<Component
					{...rest}
					disabled={disabled}
					onClick={this.onClick}/>
			</React.Fragment>
		)
	}
}