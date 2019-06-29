import React from 'react'
import PropTypes from 'prop-types'
import isFileAccepted from './utility/isFileAccepted'

export class DropFiles extends React.Component {
	static propTypes = {
		// Will be called with `true` when the drop zone is dragged over.
		// (and with `false` when it's no longer dragged over)
		setDraggedOver: PropTypes.func,
		// Will be called on file(s) drop.
		// The argument will be the single file when `multiple` is `false` (default)
		// or the array of files when `multiple` is `true`.
		onDrop: PropTypes.func.isRequired,
		// Set to `true` for multi-file drop.
		multiple: PropTypes.bool,
		// Can be used to restrict the file MIME-types or extensions available for selection.
		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#attr-accept
		accept: PropTypes.string
	}

	// state = {
	// 	isDragging: false
	// }

	node = React.createRef()

	// Copied from:
	// https://github.com/react-dropzone/react-dropzone/blob/master/src/index.js
	dragTargets = []

	setDraggedOver = (draggedOver) => {
		const { setDraggedOver } = this.props
		if (setDraggedOver) {
			setDraggedOver(draggedOver)
		}
	}

	// Must be `preventDefault`-ed for some weird reasons.
	onDragOver = (event) => {
		event.preventDefault()
		event.stopPropagation()
	}

	// `event` is always triggered when gragging from another window to the browser window.
	onDragEnter = (event) => {
		event.preventDefault()
		event.stopPropagation()

		// Copied from:
		// https://github.com/react-dropzone/react-dropzone/blob/master/src/index.js
		// Count the dropzone and any children that are entered.
		if (this.dragTargets.indexOf(event.target) === -1) {
			this.dragTargets.push(event.target)
		}

		// `event.dataTransfer.files` are only accessible on "drop" event.
		// `event.dataTransfer.items` are only accessible in Chrome and FireFox while dragging.
		// https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/items
		if (isDraggingFiles(event)) {
			// Filtering dragged files by `isFileAccepted`.
			// Only MIME-types are available during the "drag" stage,
			// not file extensions. And won't work in IE11.
			// // IE11 does not support dataTransfer.items
			// if (event.dataTransfer.items) {
			// 	// Only MIME-types are available for `isFileAccepted`
			// 	// filtering during the "drag" stage, not file extensions.
			// 	// `.some` is supported starting from IE 9.
			// 	const areAnyFilesAccepted = Array.prototype.some.call(
			// 		event.dataTransfer.items,
			// 		this.isFileAccepted
			// 	)
			// 	if (!areAnyFilesAccepted) {
			// 		return
			// 	}
			// }
			this.setDraggedOver(true)
		}
	}

	onDragLeave = (event) => {
		event.preventDefault()
		event.stopPropagation()

		// Copied from:
		// https://github.com/react-dropzone/react-dropzone/blob/master/src/index.js
		// Only deactivate once the dropzone and all children have been left.
		this.dragTargets = this.dragTargets.filter(_ => _ !== event.target && this.node.current.contains(_))
		if (this.dragTargets.length > 0) {
			return
		}

		this.setDraggedOver(false)
	}

	onDrop = (event) => {
		const {
			onDrop,
			multiple,
			accept
		} = this.props

		event.preventDefault()
		event.stopPropagation()

		// Reset.
		this.dragTargets = []

		this.setDraggedOver(false)

		const files = getFilesFromEvent(event) //.filter(this.isFileAccepted)
		if (files.length > 0) {
			if (multiple) {
				onDrop(files, {
					acceptedFiles: accept ? files.filter(this.isFileAccepted) : files,
					rejectedFiles: accept ? files.filter(_ => !this.isFileAccepted(_)) : []
				})
			} else {
				// If multiple files have been dropped to a non-multiple drop zone
				// then reduce the files list to just the first file.
				onDrop(files[0], {
					isAccepted: this.isFileAccepted(files[0])
				})
			}
			// Not clear why would it be called.
			// MDN says it's a "no-op".
			// https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItemList/clear
			// event.dataTransfer.clearData()
		}
	}

	isFileAccepted = (file) => {
		const { accept } = this.props
		if (accept) {
			// Firefox versions prior to 53 return a bogus MIME type for every file drag, so dragovers with
			// that MIME type will always be accepted
			if (file.type === 'application/x-moz-file') {
				return true
			}
			return isFileAccepted(file, accept)
		}
		return true
	}

	componentDidMount() {
		const div = this.node.current
		div.addEventListener('dragenter', this.onDragEnter)
		div.addEventListener('dragleave', this.onDragLeave)
		div.addEventListener('dragover', this.onDragOver)
		div.addEventListener('drop', this.onDrop)
	}

	componentWillUnmount() {
		const div = this.node.current
		div.removeEventListener('dragenter', this.onDragEnter)
		div.removeEventListener('dragleave', this.onDragLeave)
		div.removeEventListener('dragover', this.onDragOver)
		div.removeEventListener('drop', this.onDrop)
	}

	render() {
		const {
			onDrop,
			setDraggedOver,
			multiple,
			...rest
		} = this.props

		return React.createElement('div', {
			ref: this.node,
			...rest
		})
	}
}

// Copied from:
// https://github.com/react-dropzone/react-dropzone/blob/master/src/utils/index.js
function isDraggingFiles(event) {
	// If `event.dataTransfer` is not available then `event.target.files` fallback is used.
	if (!event.dataTransfer) {
		return true
	}
	// https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/types
	// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types#file
	// `.some` is supported starting from IE 9.
	return Array.prototype.some.call(
		event.dataTransfer.types,
		type => type === 'Files' || type === 'application/x-moz-file'
	)
}

// Copied from:
// https://github.com/react-dropzone/react-dropzone/blob/master/src/utils/index.js
export function getFilesFromEvent(event) {
	let dataTransferItemsList = []
	if (event.dataTransfer) {
		const dt = event.dataTransfer
		// NOTE: Only the 'drop' event has access to DataTransfer.files,
		// otherwise it will always be empty
		if (dt.files && dt.files.length) {
			dataTransferItemsList = dt.files
		} else if (dt.items && dt.items.length) {
			// During the drag even the dataTransfer.files is null
			// but Chrome implements some drag store, which is accesible via dataTransfer.items
			dataTransferItemsList = dt.items
		}
	} else if (event.target && event.target.files) {
		dataTransferItemsList = event.target.files
	}
	// Convert from DataTransferItemsList to the native Array
	return Array.prototype.slice.call(dataTransferItemsList)
}

// // Copied from:
// // https://github.com/react-dropzone/react-dropzone/blob/master/src/utils/index.js
// // Firefox versions prior to 53 return a bogus MIME type for every file drag, so dragovers with
// // that MIME type will always be accepted
// function isFileAccepted(file, accept) {
// 	return this.props.isFileAccepted(file) || (file.type === 'application/x-moz-file' || this.props.isFileTypeAccepted(file))
// }

// Deprecated.
export function CanDrop(type, drop)
{
	throw new Error('`react-dnd` has been removed from `react-responsive-ui` starting from version `0.14.124` due to being buggy and not supported. `react-dnd` has been replaced with simple native HTML file drag-n-drop. Use `<DropFileUpload/>` and `<DropMultiFileUpload/>` components for file upload instead of `DragAndDrop` and `CanDrop` decorators.')
}

// Deprecated.
export function DragAndDrop()
{
	throw new Error('`react-dnd` has been removed from `react-responsive-ui` starting from version `0.14.124` due to being buggy and not supported. `react-dnd` has been replaced with simple native HTML file drag-n-drop. `DragAndDrop` decorator is no longer needed and should be removed. Use `<DropFileUpload/>` and `<DropMultiFileUpload/>` components for file upload.')
}

// Deprecated.
// Native file drag'n'drop (single file)
export const File = 'File'

// Deprecated.
// Native file drag'n'drop (multiple files)
export const Files = 'Files'

// Deprecated.
// Native file drag'n'drop (single file)
export const FILE = File

// Deprecated.
// Native file drag'n'drop (multiple files)
export const FILES = Files