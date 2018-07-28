import { CanDrop, FILES } from './DragAndDrop'
import FileUpload from './FileUpload'

const MultiFileUpload = (props) => <FileUpload {...props} multiple/>

// `FILE` is for single-file upload.
// `FILES` is for multiple files upload.
const DropMultiFileUpload = CanDrop(FILES, (props, files) => props.onChange(files))(MultiFileUpload)

export default DropMultiFileUpload