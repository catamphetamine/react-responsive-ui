import React from 'react'
import FileUpload from './FileUpload'

export default React.forwardRef((props, ref) => (
	<FileUpload ref={ref} {...props} multiple/>
))