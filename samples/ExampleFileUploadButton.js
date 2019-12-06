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
					<li><code className="colored">accept</code> — (optional) Can be used to <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#attr-accept" target="_blank">restrict the file MIME-types or extensions</a> available for selection.</li>
					<li><code className="colored">ext</code> — (optional) If specified, will be transformed into <code className="colored">accept</code> property value. Can be a string or an array of strings. Examples: <code className="colored">"pdf"</code>, <code className="colored">["pdf", "doc", "docx"]</code>.</li>
				</ul>
			</Example>
		)
	}
}