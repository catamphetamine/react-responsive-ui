import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// For some weird reason, in Chrome, `setTimeout()` would lag up to a second (or more) behind.
// Turns out, Chrome developers have deprecated `setTimeout()` API entirely without asking anyone.
// Replacing `setTimeout()` with `requestAnimationFrame()` can work around that Chrome bug.
// https://github.com/bvaughn/react-virtualized/issues/722
import { setTimeout, clearTimeout } from 'request-animation-frame-timeout'

export default class FileUploadInput extends React.Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired,
		multiple: PropTypes.bool,
		// Indicates that the input is invalid.
		error: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.bool
		]),
		required: PropTypes.bool
	}

	componentWillUnmount() {
		clearTimeout(this.ieTimer)
	}

	onFileSelect = (event) => {
		const { onChange, multiple } = this.props

		// Internet Explorer triggers `onChange` when setting
		// `event.target.value` manually, so ignore such events.
		if (this.ieTimer) {
			return
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

	click = () => {
		const { disabled } = this.props
		if (disabled) {
			return
		}
		this.input.click()
	}

	storeInputRef = (ref) => this.input = ref

	render() {
		const {
			error,
			required,
			onChange,
			multiple,
			...rest
		} = this.props
		return (
			<input
				{...rest}
				ref={this.storeInputRef}
				type="file"
				multiple={ supportsMultipleFileUploadOnInputElement ? multiple : undefined }
				onChange={ this.onFileSelect }
				aria-required={ required ? true : undefined }
				aria-invalid={ error ? true : undefined }
				style={ HIDDEN_STYLE }/>
		)
	}
}

const HIDDEN_STYLE = {
	display: 'none'
}

// Copied from:
// https://github.com/react-dropzone/react-dropzone/blob/master/src/utils/index.js
export const supportsMultipleFileUploadOnInputElement =
	typeof document !== 'undefined' && document && document.createElement
		? 'multiple' in document.createElement('input')
		: true

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#attr-accept
 * @param  {(string|string[])} [ext]
 * @return {string} [accept]
 */
export function getAcceptFromExt(ext) {
	if (typeof ext === 'string') {
		return '.' + ext
	}
	if (Array.isArray(ext)) {
		return ext.map(ext => '.' + ext).join(',')
	}
}