window.ExampleFileUpload = class ExampleComponent extends React.Component
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
			<Example name="file-upload" title="File Upload">
				<DropFileUpload onChange={ this.onChange }>
					{file && file.name}
					{!file && 'Click here to choose a file or drop a file here'}
				</DropFileUpload>

				<br/>

				<Highlight lang="jsx">{`
					import { DragAndDrop, DropFileUpload } from 'react-responsive-ui'

					@DragAndDrop()
					export default class App extends React.Component {
						state = {}
						onChange = (file) => this.setState({ file })

						render() {
							const { file } = this.state
							return (
								<DropFileUpload onChange={ this.onChange }>
									{file && file.name}
									{!file && 'Click here to choose a file or drop a file here'}
								</DropFileUpload>
							)
						}
					}
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

				<div className="section">
					Drag'n'drop is implemented internally using <a href="https://github.com/gaearon/react-dnd" target="_blank"><code>react-dnd</code></a>. Use <a href="https://babeljs.io/docs/plugins/transform-decorators/" target="_blank"><code>babel-plugin-transform-decorators-legacy</code></a> for decorators syntax support.
				</div>

				<br/>

				<div className="section">
					The example is for <code className="colored">{'<DropFileUpload/>'}</code>. There's also <code className="colored">{'<MultiDropFileUpload/>'}</code> for multiple file upload.
				</div>
			</Example>
		)
	}
}