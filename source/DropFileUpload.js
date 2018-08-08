import { CanDrop, FILE } from './DragAndDrop'
import FileUpload from './FileUpload'

// `FILE` is for single-file upload.
// `FILES` is for multiple files upload.
const DropFileUpload = CanDrop(FILE, (props, file) => { props.onChange(file); return; })(FileUpload)

export default DropFileUpload