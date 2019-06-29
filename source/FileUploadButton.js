import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import FileUploadInput from './FileUploadInput'

export default class FileUploadButton extends React.Component {
	static propTypes = {
		component: PropTypes.elementType,
		onChange: PropTypes.func.isRequired,
		multiple: PropTypes.bool,
		disabled: PropTypes.bool,
		error: PropTypes.string,
		required: PropTypes.bool,
		accept: PropTypes.string
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
					accept={accept}/>
				<Component
					{...rest}
					disabled={disabled}
					onClick={this.onClick}/>
			</React.Fragment>
		)
	}
}