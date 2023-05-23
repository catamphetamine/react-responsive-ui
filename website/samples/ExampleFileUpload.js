window.ExampleFileUpload = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	onChange = (file, secondArgument) => {
		this.setState({ file })
		// `secondArgument` is only present when dropping files
		// and is either `{ acceptedFiles, rejectedFiles }`
		// or `{ isAccepted }`.
		if (secondArgument) {
			console.log(secondArgument)
		}
	}

	render()
	{
		const { file } = this.state

		return (
			<Example name="file-upload" title="File Upload">
				<DropFileUpload onChange={ this.onChange }>
					{file && file.name}
					{!file && 'Click here to choose a file or drop a file here'}
				</DropFileUpload>

				<br/>

				<Highlight lang="jsx">{`
					<DropFileUpload onChange={file => this.setState({ file })}>
						{ this.state.file && this.state.file.name}
						{!this.state.file && 'Click here to choose a file or drop a file here'}
					</DropFileUpload>
				`}</Highlight>

				<Highlight lang="css">{`
					.rrui__file-upload__area {
						display          : inline-block;
						padding          : 20px;
						border           : 1px dashed #afafaf;
						border-radius    : 5px;
						background-color : #fbfbfb;
						cursor           : pointer;
						text-align       : center;
					}

					.rrui__file-upload__area--dragged-over {
						background-color : #3678D1;
						color            : white;
					}
				`}</Highlight>

				<br/>

				<div className="section">
					The example is for <code className="colored">{'<DropFileUpload/>'}</code>. There's also <code className="colored">{'<MultiDropFileUpload/>'}</code> for multiple file upload.
				</div>

				<br/>

				Properties:

				<ul className="list">
					<li><code className="colored">onChange(file/files)</code> — "On file(s) chosen" handler.</li>
					<li><code className="colored">clickable</code> — (optional) The file drop area is clickable by default. Pass <code className="colored">false</code> to make it ignore click/keydown/focus events. Is <code className="colored">true</code> by default.</li>
					<li><code className="colored">multiple</code> — (optional) Pass <code className="colored">true</code> for multi-file upload. Is <code className="colored">false</code> by default.</li>
					<li><code className="colored">accept</code> — (optional) Can be used to <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#attr-accept" target="_blank">restrict the file MIME-types or extensions</a> available for selection. If <code className="colored">accept</code> is set then file selection dialog will only allow selecting certain types of files. To validate files selected via drag'n'drop, inspect the second argument of <code className="colored">onChange()</code>: it has shape <code className="colored">{'{ isAccepted: boolean }'}</code> in case of <code className="colored">multiple=false</code> (default) and <code className="colored">{'{ acceptedFiles: File[], rejectedFiles: File[] }'}</code> in case of <code className="colored">multiple=true</code>. This second argument of <code className="colored">onChange()</code> is always present, whether it has been called as a result of selecting file(s) via file selection dialog or drag'n'drop.</li>
					<li><code className="colored">ext</code> — (optional) If specified, will be transformed into <code className="colored">accept</code> property value. Can be a string or an array of strings. Examples: <code className="colored">"pdf"</code>, <code className="colored">["pdf", "doc", "docx"]</code>.</li>
				</ul>
			</Example>
		)
	}
}