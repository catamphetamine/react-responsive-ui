let FileUploadArea = React.createClass
({
	render: function()
	{
		const
		{
			file,
			dropTarget,
			draggedOver,
			onUpload,
			className
		}
		= this.props

		return dropTarget(
			<div style={ { display: 'inline-block' } }>
				<FileUpload
					action={(file) => onUpload(file, 'chosen')}
					className={`file-upload ${draggedOver ? 'rrui__file-upload--dragged-over' : ''}`}>
					{file && file.name}
					{!file && <span>Click here to choose a file <br/> or drop a file here</span>}
				</FileUpload>
			</div>
		)
	}
})

FileUploadArea = CanDrop(File, (props, file) => props.onUpload(file, 'dropped'))(FileUploadArea)

window.ExampleFileUpload = React.createClass
({
	getInitialState() { return {} },

	onUpload(file, action)
	{
		this.setState({ file })
		alert(`File ${action}: ${file.name}`)
	},

	render()
	{
		return (
			<Example name="file-upload" title="File Upload">

				<FileUploadArea
					file={this.state.file}
					onUpload={ this.onUpload }/>

				<br/>
				<br/>

				See the <a href="https://github.com/catamphetamine/react-responsive-ui#dragndrop" target="_blank">code sample</a>.
			</Example>
		)
	}
})