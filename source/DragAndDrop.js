// `react-dnd` is no longer supported and is buggy.
// It can be replaced with simple native HTML file drag-n-drop.
// https://medium.com/@650egor/simple-drag-and-drop-file-upload-in-react-2cb409d88929
//
// Maybe not required:
// // Convert from DataTransferItemsList to the native Array:
// return Array.prototype.slice.call(dataTransferItemsList)

import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend'
import { DragDropContext, DragLayer, DropTarget } from 'react-dnd'

// Usage:
//
// import { DragAndDrop, CanDrop, FILE, FILES } from 'react-responsive-ui'
//
// @DragAndDrop()
// class Application extends Component {
// 	render() {
// 		const { isDragging, children } = this.props
// 		return <div>{ children }</div>
// 	}
// }
//
// @CanDrop(FILE, (props, dropped, component) => alert('Uploading file'))
// class FileDropArea extends Component {
// 	render() {
// 		const { dropTarget, draggedOver, canDrop } = this.props
// 		return dropTarget(<div>Drop files here</div>)
// 	}
// }

// Decorate the droppable area component with this decorator
export function CanDrop(type, drop)
{
	if (!type)
	{
		throw new Error('Provide a `type` for `@CanDrop()` decorator')
	}

	return DropTarget(getReactDnDType(type),
	{
		drop: (props, monitor, component) => drop(props, getDroppedObject(monitor, type), component),

		// canDrop(props, monitor)
		// {
		// 	switch (type)
		// 	{
		// 		// // Browser doesn't allow reading "files" until the drop event.
		// 		// case File:
		// 		// 	return monitor.getItem().files.length === 1
		// 		default:
		// 			return true
		// 	}
		// }
	},
	(connect, monitor) =>
	({
		dropTarget  : connect.dropTarget(),
		draggedOver : monitor.isOver(),
		canDrop     : monitor.canDrop()
	}))
}

// Decorate the root React application component with this decorator
export function DragAndDrop()
{
	const context = DragDropContext(HTML5Backend)

	const layer = DragLayer((monitor) =>
	({
		isDragging : monitor.isDragging(),
		// item           : monitor.getItem(),
		// item_type      : monitor.getItemType(),
		// current_offset : monitor.getSourceClientOffset()
	}))

	// Doesn't work, breaks `ReactDOM.hydrate()`.
	// ("Did not expect server HTML to contain ...").
	//
	// A workaround to prevent `react-dnd` from breaking server-side rendering.
	// https://github.com/react-dnd/react-dnd/issues/1192
	if (typeof window === 'undefined') {
		return component => component
	}

	return (component) => context(layer(component))
}

// Native file drag'n'drop (single file)
export const File = 'File'

// Native file drag'n'drop (multiple files)
export const Files = 'Files'

// Native file drag'n'drop (single file)
export const FILE = File

// Native file drag'n'drop (multiple files)
export const FILES = Files

// Gets the corresponding `react-dnd` type
// for a given droppable object type
function getReactDnDType(type)
{
	switch (type)
	{
		case File:
		case Files:
			return NativeTypes.FILE
		default:
			return type
	}
}

// Gets the dropped object from `monitor`
function getDroppedObject(monitor, type)
{
	const dropped = monitor.getItem()

	switch (type)
	{
		case File:
			return dropped.files[0]
		case Files:
			return dropped.files
		default:
			return dropped
	}
}