window.ExampleFileUploadButton = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	onChange = (file) => this.setState({ file })

	render()
	{
		const { file } = this.state

		return (
			<Example name="file-upload-button" title="File Upload Button">
				<FileUploadButton
					component="button"
					type="button"
					onChange={ this.onChange }>
					{file && file.name}
					{!file && 'Click here to choose a file'}
				</FileUploadButton>

				<br/>

				<Highlight lang="jsx">{`
					<FileUploadButton
						component="button"
						type="button"
						onChange={file => this.setState({ file })}>
						{ this.state.file && this.state.file.name}
						{!this.state.file && 'Click here to choose a file'}
					</FileUploadButton>
				`}</Highlight>

				Properties:

				<ul className="list">
					<li><code className="colored">onChange(file/files)</code> — "On file(s) chosen" handler.</li>
					<li><code className="colored">multiple</code> — (optional) Pass <code className="colored">true</code> for multi-file upload. Is <code className="colored">false</code> by default.</li>
				</ul>
			</Example>
		)
	}
}