window.ExampleFileUpload = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	onChange = (file, secondArgument) => {
		this.setState({ file })
		console.log(secondArgument)
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
					<li><code className="colored">multiple</code> — (optional) Pass <code className="colored">true</code> for multi-file upload. Is <code className="colored">false</code> by default.</li>
					<li><code className="colored">accept</code> — (optional) Can be used to <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#attr-accept" target="_blank">restrict the file MIME-types or extensions</a> available for selection. If <code className="colored">accept</code> is set then <code className="colored">onChange()</code> will receive the second argument having shape <code className="colored">{'{ isAccepted: boolean }'}</code> in case of <code className="colored">multiple=false</code> and <code className="colored">{'{ acceptedFiles: File[], rejectedFiles: File[] }'}</code> in case of <code className="colored">multiple=true</code>.</li>
				</ul>
			</Example>
		)
	}
}