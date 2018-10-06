window.ExampleTextInput = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	render()
	{
		return (
			<Example name="text-input-placeholder" title="Text input field (placeholder)">

				<form>
					<TextInput
						focus={false}
						autoComplete="tel"
						style={input_style}
						className="column-width"
						name="text_input"
						value={this.state.value}
						onChange={value => this.setState({ value })}
						placeholder="Enter some text"/>
				</form>

				Value:  {this.state.value}

<Highlight lang="jsx">{`
<TextInput
  placeholder="Enter some text"
  value={...}
  onChange={...} />
`}</Highlight>

<Highlight lang="css">{`
/* See \`variables.css\` for height customization. */
.rrui__input-field {
  border-bottom : 1px solid blue;
}
.rrui__input-field--invalid {
  border-color : red;
}
`}</Highlight>
			</Example>
		)
	}
}
