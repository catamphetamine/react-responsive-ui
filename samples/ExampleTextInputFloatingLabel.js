window.ExampleTextInputFloatingLabel = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	render()
	{
		return (
			<Example name="text-input-floating-label" title="Text input field (floating label)">

				<TextInput
					style={input_style}
					className="column-width"
					name="text_input"
					value={this.state.value}
					onChange={value => this.setState({ value })}
					label="Text"/>

				Value:  {this.state.value}

<Highlight lang="jsx">{`
<TextInput
  label="Text"
  value={...}
  onChange={...} />
`}</Highlight>

			</Example>
		)
	}
}